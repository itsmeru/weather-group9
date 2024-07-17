from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/", include_in_schema=False)
async def index():
    return FileResponse("./static/index.html", media_type="text/html")

@router.get("/county/{locationName}", include_in_schema=False)
async def netpage(locationName:str):
    return FileResponse("./static/county.html", media_type="text/html")
