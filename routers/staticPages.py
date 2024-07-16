from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/", include_in_schema=False)
async def index():
    return FileResponse("./static/index.html", media_type="text/html")

@router.get("/api/county/{locationID}", include_in_schema=False)
async def country(locationID: str):
    return FileResponse("./static/country.html", media_type="text/html")

@router.get("/api/week/{locationID}", include_in_schema=False)
async def weekInfo(locationID:str):
    return FileResponse("./static/week.html", media_type="text/html")

@router.get("/api/mainpage")
async def mainpage(locationID:str):
    return FileResponse("./static/mainpage.html", media_type="text/html")


