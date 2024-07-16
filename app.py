from fastapi import *
from fastapi.staticfiles import StaticFiles
from routers import weather_data,weather_week,weather_mainpage
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(weather_data.router)
app.include_router(weather_week.router)
app.include_router(weather_mainpage.router)



