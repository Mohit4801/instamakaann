from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import Optional, List
from datetime import datetime, timezone
from uuid import uuid4
import os
from core.database import log_audit
from modules.properties.schemas import Property, PropertyCreate, PropertyUpdate
from modules.properties.service import (
    create_property,
    get_properties,
    get_property_by_id,
    update_property,
    delete_property,
)

from core.database import get_db
from core.security import require_role

router = APIRouter(
    prefix="/properties",
    tags=["Properties"]
)

# -----------------------
# EXISTING PROPERTY APIs (UNCHANGED)
# -----------------------

@router.post("/", response_model=Property)
async def create(
    data: PropertyCreate,
    user=Depends(require_role(["admin"]))
):
    return await create_property(data)


@router.get("/", response_model=List[Property])
async def list_all(
    property_type: Optional[str] = None,
    status: Optional[str] = None,
    owner_id: Optional[str] = None,
    limit: int = 100
):
    filters = {}
    if property_type:
        filters["property_type"] = property_type
    if status:
        filters["status"] = status
    if owner_id:
        filters["owner_id"] = owner_id

    return await get_properties(filters, limit)


@router.get("/{property_id}", response_model=Property)
async def get_one(property_id: str):
    return await get_property_by_id(property_id)


@router.put("/{property_id}", response_model=Property)
async def update(
    property_id: str,
    data: PropertyUpdate,
    user=Depends(require_role(["admin"]))
):
    return await update_property(property_id, data)


@router.delete("/{property_id}")
async def delete(
    property_id: str,
    user=Depends(require_role(["admin"]))
):
    await delete_property(property_id)
    return {"message": "Property deleted successfully"}
    await log_audit(
    db,
    user_id=user["id"],
    role=user["role"],
    action="delete_property",
    resource="property",
    resource_id=property_id,
)

@router.post("/{property_id}/images")
async def add_images(
    property_id: str,
    images: List[str],
    user=Depends(require_role(["admin"]))
):
    prop = await get_property_by_id(property_id)
    updated = prop.get("images", []) + images

    db = get_db()

    await db.properties.update_one(
        {"id": property_id},
        {"$set": {
            "images": updated,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )

    return {"message": "Images added", "images": updated}

# -----------------------
# STEP 3 — MEDIA UPLOAD (NEW, SAFE)
# -----------------------

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm"}
MAX_FILE_SIZE_MB = 20

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/media")
async def upload_media(
    file: UploadFile = File(...),
    user=Depends(require_role(["admin"])),
    db=Depends(get_db)
):
    # Validate type
    if file.content_type not in (ALLOWED_IMAGE_TYPES | ALLOWED_VIDEO_TYPES):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)

    # Validate size
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail="File too large")

    media_id = str(uuid4())
    extension = file.filename.split(".")[-1]
    filename = f"{media_id}.{extension}"
    path = f"{UPLOAD_DIR}/{filename}"

    with open(path, "wb") as f:
        f.write(contents)

    media_doc = {
        "id": media_id,
        "filename": filename,
        "path": path,
        "content_type": file.content_type,
        "uploaded_by": user["id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    await db.media.insert_one(media_doc)

    return {
        "media_id": media_id,
        "url": f"/{path}",
        "type": file.content_type
    }


@router.get("/ping")
async def ping():
    return {"message": "Properties working"}
