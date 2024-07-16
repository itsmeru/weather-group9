from datetime import datetime, timedelta
import requests  
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from fastapi import APIRouter, HTTPException

router = APIRouter()
load_dotenv()
CWB_API_KEY = os.getenv("CWB_API_KEY")

@router.get("/api/county/{locationID}")
def get_weather_info(locationID: str):
    url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization={CWB_API_KEY}"
    response = requests.get(url)
            
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch data from CWB API")

    data = response.json()
    locations = data.get("records", {}).get("location", [])
    result = []

    for location in locations:
        if location.get("locationName") == locationID:
            entry = build_location_entry(location)
            result.append(entry)
            break

    if not result:
        raise HTTPException(status_code=404, detail="Location not found")

    return JSONResponse(content=result, media_type="application/json")

def build_location_entry(location):
    entry = {"locationName": location.get("locationName")}
    weather_elements = location.get("weatherElement", [])

    for weather_element in weather_elements:
        element_name = weather_element.get("elementName")
        times = weather_element.get("time", [])
        time_descriptions = [get_time_description(t["startTime"], t["endTime"]) for t in times[:3]]
        
        entry["datetime"] = {i: desc for i, desc in enumerate(time_descriptions)}
        entry[element_name] = {i: t["parameter"]["parameterName"] for i, t in enumerate(times[:3])}
    return entry

def get_time_description(start_time, end_time):
    current_time = datetime.now()
    start_time_dt = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
    
    day_descriptor = get_day_descriptor(start_time_dt, current_time)
    time_descriptor = get_time_of_day_descriptor(start_time_dt)

    return f"{day_descriptor}{time_descriptor}"

def get_day_descriptor(start_time_dt, current_time):
    if start_time_dt.date() == current_time.date():
        return "今日"
    elif start_time_dt.date() == (current_time.date() + timedelta(days=1)):
        return "明日"
    else:
        return start_time_dt.strftime("%m-%d")

def get_time_of_day_descriptor(start_time_dt):
    if start_time_dt.hour < 6:
        return "清晨"
    elif 6 <= start_time_dt.hour < 12:
        return "白天"
    elif 12 <= start_time_dt.hour < 18:
        return "下午"
    else:
        return "晚上"
