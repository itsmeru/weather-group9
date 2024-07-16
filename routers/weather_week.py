from datetime import datetime
import requests  
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from fastapi import APIRouter, HTTPException

router = APIRouter()
load_dotenv()
CWB_API_KEY = os.getenv("CWB_API_KEY")

WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
NEED_INDEX = [8, 12, 5, 11, 6, 9]  # {8:minT,12:maxT,5:maxAt,11:minAt,6:Wx,9:UVI}

@router.get("/api/week/{locationID}")
def get_week_info(locationID: str):
    url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization={CWB_API_KEY}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch data from CWB API")

    datas = response.json().get("records", {}).get("locations", [])[0].get("location", [])
    result = []

    for data in datas:
        if data.get("locationName") == locationID:
            result.append(process_location(data))

    if not result:
        raise HTTPException(status_code=404, detail="Location not found")

    return JSONResponse(content=result, media_type="application/json")

def process_location(data):
    entry = {"city": data.get("locationName")}
    
    for needI, index in enumerate(NEED_INDEX):
        item = data["weatherElement"][index]
        element_id = item["elementName"]  # MinT
        entry[element_id] = process_weather_element(item, needI == len(NEED_INDEX) - 1)
        
    return entry

def process_weather_element(item, is_uvi):
    result = {}
    if is_uvi:  # UVI
        for i in range(7):
            date_str = item["time"][i]["startTime"].split(" ")[0]
            result[i] = {
                "date": date_str,
                "week": get_weekday(date_str),
                "uv": item["time"][i]["elementValue"][0]["value"]
            }
    else:
        for i in range(0, len(item["time"]), 2):
            if i + 1 < len(item["time"]):
                date_str = item["time"][i]["startTime"].split(" ")[0]
                if item["elementName"] == "Wx":  # Weather
                    result[i // 2] = {
                        "date": date_str,
                        "week": get_weekday(date_str),
                        "day": item["time"][i]["elementValue"][0]["value"],
                        "day_url": get_weather_icon_url(item["time"][i]["elementValue"][1]["value"], True),
                        "night": item["time"][i + 1]["elementValue"][0]["value"],
                        "night_url": get_weather_icon_url(item["time"][i + 1]["elementValue"][1]["value"], False)
                    }
                else:
                    result[i // 2] = {
                        "date": date_str,
                        "week": get_weekday(date_str),
                        "day": item["time"][i]["elementValue"][0]["value"],
                        "night": item["time"][i + 1]["elementValue"][0]["value"]
                    }
    return result

def get_weekday(date_str):
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    weekday_index = date_obj.weekday()
    return WEEKDAYS[weekday_index]

def get_weather_icon_url(icon_id, is_daytime):
    time_of_day = "day" if is_daytime else "night"
    return f"https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/{time_of_day}/{icon_id}.svg"
