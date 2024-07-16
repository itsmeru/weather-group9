from datetime import datetime, timedelta
import requests  
import os
from dotenv import load_dotenv
import json
from fastapi.responses import JSONResponse
from fastapi import APIRouter

router = APIRouter()
load_dotenv()
CWB_API_KEY = os.getenv("CWB_API_KEY")

@router.get("/api/county/{locationID}")
def getInfo(locationID: str):
    url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization={CWB_API_KEY}"
    response = requests.get(url)
            
    if response.status_code == 200:
        data = response.json()
        locations = data["records"]["location"]
        result = []

        for location in locations:
            locationName = location["locationName"]
            weatherElements = location["weatherElement"]
            
            if locationName == locationID:
                entry = {"locationName": locationName}

                for weatherElement in weatherElements:
                    elementName = weatherElement["elementName"]
                    times = weatherElement["time"]
                    time_descriptions = []

                    for time_entry in times:
                        start_time = time_entry["startTime"]
                        end_time = time_entry["endTime"]
                    
                        start_time_dt = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
                        time_entry["date"] = start_time_dt.strftime("%Y-%m-%d")
                        des = get_time_description(start_time, end_time)
                        time_descriptions.append(des)
                    
                    entry["datetime"] = {
                        0: time_descriptions[0],
                        1: time_descriptions[1],
                        2: time_descriptions[2]
                    }
                
                    entry[elementName] = {
                        0: times[0]["parameter"]["parameterName"],
                        1: times[1]["parameter"]["parameterName"],
                        2: times[2]["parameter"]["parameterName"]
                    }

                result.append(entry)
                return JSONResponse(content=result, media_type="application/json")

def get_time_description(start_time, end_time):
    current_time = datetime.now()
    start_time_dt = datetime.strptime(start_time, "%Y-%m-%d %H:%M:%S")
    end_time_dt = datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S")

    if start_time_dt.date() == current_time.date():
        day_descriptor = "今日"
    elif start_time_dt.date() == (current_time.date() + timedelta(days=1)):
        day_descriptor = "明日"
    else:
        day_descriptor = start_time_dt.strftime("%m-%d")

    if start_time_dt.hour < 6:
        time_descriptor = "清晨"
    elif 6 <= start_time_dt.hour < 12:
        time_descriptor = "白天"
    elif 12 <= start_time_dt.hour < 18:
        time_descriptor = "下午"
    else:
        time_descriptor = "晚上"

    return f"{day_descriptor}{time_descriptor}"

