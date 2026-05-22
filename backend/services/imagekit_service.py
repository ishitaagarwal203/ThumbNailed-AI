from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import (
    UploadFileRequestOptions,
)

from config import (
    IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_URL_ENDPOINT,
)

imagekit = ImageKit(
    private_key=IMAGEKIT_PRIVATE_KEY,
    public_key=IMAGEKIT_PUBLIC_KEY,
    url_endpoint=IMAGEKIT_URL_ENDPOINT,
)


def upload_file(
    file_bytes: bytes,
    file_name: str,
    folder: str,
    content_type: str = "image/png",
) -> str:

    options = UploadFileRequestOptions(
        folder=folder,
        use_unique_file_name=True,
        is_private_file=False,
    )

    result = imagekit.upload_file(
        file=file_bytes,
        file_name=file_name,
        options=options,
    )

    return result.response_metadata.raw["url"]


def get_variants(base_url: str) -> dict:

    return {
        "youtube": f"{base_url}?tr=w-1280,h-720,c-maintain_ratio",
        "shorts": f"{base_url}?tr=w-1080,h-1920,c-maintain_ratio",
        "tiktok": f"{base_url}?tr=w-1080,h-1080,c-maintain_ratio",
    }