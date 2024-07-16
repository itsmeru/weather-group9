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

@router.get("/api/week/{locationID}")
def getWeekInfo(locationID: str):
    url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization={CWB_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        datas = response.json()["records"]["locations"][0]["location"]
        result = []
        needIndex = [8, 12, 5, 11, 6, 9] # {8:minT,12:maxT,5:maxAt,11:minAt,6:Wx,9:UVI}
        for data in datas:
            if data["locationName"] == locationID:
                
                entry = {"city": data["locationName"]}
                
                for data in datas:
                    if data["locationName"] == "基隆市":
                        entry = {"city": data["locationName"]}
                       
                    for needI,index in enumerate(needIndex):
                        item = data["weatherElement"][index]
                        elementId = item["elementName"]  # MinT
                        elementName = item["description"]  # 最低溫度
                        
                        entry[elementId] = {}
                        weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
                        if needI == len(needIndex) - 1: # UVI
                            for i in range(7):
                                date_str = item["time"][i]["startTime"].split(" ")[0]
                                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                                weekday_index = date_obj.strftime("%w")
                                weekday_chinese = weekdays[int(weekday_index)]
                                
                                entry[elementId][i] = {
                                    "date": date_str,
                                    "week": weekday_chinese,
                                    "uv": item["time"][i]["elementValue"][0]["value"]
                                }
                        else:
                            for i in range(0, len(item["time"]), 2):
                                if i + 1 < len(item["time"]):
                                    date_str = item["time"][i]["startTime"].split(" ")[0]
                                    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                                    weekday_index = date_obj.strftime("%w")
                                    weekday_chinese = weekdays[int(weekday_index)]
                                    if needI == 4: # wx
                                        dayId = item["time"][i]["elementValue"][1]["value"]
                                        nightId = item["time"][i+1]["elementValue"][1]["value"]
                                        dayUrl = f"https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/{dayId}.svg"
                                        nightUrl = f"https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/night/{nightId}.svg"
                                        entry[elementId][i // 2] = {
                                        "date": date_str,
                                        "week": weekday_chinese,
                                        "day": item["time"][i]["elementValue"][0]["value"],
                                        "day_url":dayUrl,
                                        "night": item["time"][i + 1]["elementValue"][0]["value"],
                                        "night_url":nightUrl,
                                        }
                                    else:
                                        entry[elementId][i // 2] = {
                                            "date": date_str,
                                            "week": weekday_chinese,
                                            "day": item["time"][i]["elementValue"][0]["value"],
                                            "night": item["time"][i + 1]["elementValue"][0]["value"]
                                        }
                                    
                    
                    result.append(entry)
                    return JSONResponse(content=result, media_type="application/json")

                

            
   