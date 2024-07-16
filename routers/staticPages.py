from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/", include_in_schema=False)
async def index():
    return FileResponse("./static/index.html", media_type="text/html")

@router.get("/api/county/{locationID}", include_in_schema=False)
async def attraction(locationID: str):
    return FileResponse("./static/attraction.html", media_type="text/html")

@router.get("/api/week/{locationID}", include_in_schema=False)
async def booking(locationID:str):
    return FileResponse("./static/booking.html", media_type="text/html")


