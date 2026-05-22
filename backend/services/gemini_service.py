import base64
import httpx
from google import genai
from google.genai import types

from config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)


async def generate_thumbnail(
    prompt: str,
    style_prompt: str,
    headshot_url: str
) -> bytes:

    # Download image from URL
    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(headshot_url)
        image_bytes = response.content

    full_prompt = (
        f"{style_prompt}\n\n"
        f"User request: {prompt}\n\n"
        "IMPORTANT: The generated thumbnail MUST prominently feature "
        "the person shown in the provided reference headshot photo. "
        "Keep their likeness accurate."
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash-exp",
        contents=[
            full_prompt,
            types.Part.from_bytes(
                data=image_bytes,
                mime_type="image/jpeg"
            )
        ],
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"]
        )
    )

    # Extract generated image
    for part in response.candidates[0].content.parts:
        if part.inline_data:
            return part.inline_data.data

    raise RuntimeError("No image generated")