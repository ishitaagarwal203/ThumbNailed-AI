import asyncio
import logging

from sqlmodel import Session, select
from database import engine
from models import Job, Thumbnail
from services.gemini_service import generate_thumbnail
from services.imagekit_service import upload_file

logger=logging.getLogger(__name__)

STYLES={
    "bold_dramatic":(
        "Create a bold, dramatic YouTube thumbnail with high contrast, "
        "cinematic lighting, dark moody background, and powerful composition."
        "The person's face should be prominant with a dramatic expression."
    ),
    "clean_minimal":(
        "Create a clean, minimal YouTube thumbnail with bright lighting, "
        "simple background, and clear composition. The person's face should be prominant with a friendly expression."
    ),
    "vibrant_energetic":(
        "Create a vibrant, energetic YouTube thumbnail with bright colors, "
        "dynamic composition, and high energy. The person's face should be prominant with an excited expression."
    ),
}
STYLE_ORDER=["bold_dramatic","clean_minimal","vibrant_energetic"]

async def generate_single_thumbnail(thumbnail_id:str,prompt:str,headshot_url:str):
    with Session(engine) as session:
        thumb=session.get(Thumbnail, thumbnail_id)
        thumb.status="generating"
        style_name=thumb.style_name
        session.add(thumb)
        session.commit()

    style_prompt=STYLES.get(style_name)
    try:
        image_byte=await generate_thumbnail(prompt,style_prompt,headshot_url)
        with Session(engine) as session:
            thumb=session.get(Thumbnail, thumbnail_id)
            job_id=thumb.job_id
            job=session.get(Job, job_id)
        #upload image
        url=upload_file(
            file_bytes=image_byte,
            file_name=f"{thumbnail_id}.png",
            folder=f"thumbnails/{job_id}/",
        )
        #DB call save that url+mark upload
        with Session(engine) as session:
            thumb=session.get(Thumbnail, thumbnail_id)
            thumb.imagekit_url=url
            thumb.status="completed"
            session.add(thumb)
            session.commit()
        logger.info(f"Thumbnail {thumbnail_id} generated and uploaded successfully.")   

    except Exception as e:
        logger.error(f"Error generating thumbnail {thumbnail_id}: {str(e)}")
        with Session(engine) as session:
            thumb=session.get(Thumbnail, thumbnail_id)
            thumb.status="error"
            thumb.error_message=str(e)[:500]
            session.add(thumb)
            session.commit()


async def process_job(job_id:str):
    with Session(engine) as session:
        job=session.get(Job, job_id)
        job.status="processing"
        prompt=job.prompt
        headshot_url=job.headshot_url
        session.add(job)
        session.commit()

        thumbnails=session.exec(
            select(Thumbnail).where(Thumbnail.job_id==job_id)
        ).all()
        thumbnails_ids=[t.id for t in thumbnails]

        tasks=[
            generate_single_thumbnail(tid,prompt,headshot_url)
            for tid in thumbnails_ids
        ]
        await asyncio.gather(*tasks,return_exceptions=True)

        with Session(engine) as session:
            thumbnails=session.exec(
            select(Thumbnail).where(Thumbnail.job_id==job_id)
            ).all()
            all_failed=all(t.status=="failed" for t in thumbnails)
            job=session.get(Job, job_id)
            job.status="failed" if all_failed else "completed"
            session.add(job)
            session.commit()