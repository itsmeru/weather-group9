import requests
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime

load_dotenv()
CWB_API_KEY = os.getenv("CWB_API_KEY")


router = APIRouter()

@router.get("/api/mainpage")
def get_mainpage_weather():
    week_list = ["星期一","星期二","星期三","星期四","星期五","星期六","星期日"]
    url = f"https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization={CWB_API_KEY}&format=JSON"
    response = requests.get(url)

    data = response.json()
    #data['records']['locations'][0]['location'][0]['weatherElement']包含該縣市所有天氣資料
    filtered_locations = []
    weather_data = data['records']['locations'][0]['location']
    for location in weather_data:
        min_t = next(element for element in location["weatherElement"] if element["elementName"] == "MinT")
        max_t = next(element for element in location['weatherElement'] if element['elementName'] == 'MaxT')
        wx = next(element for element in location['weatherElement'] if element['elementName'] == 'Wx')
        
        combined_weather_data = []
        for i in range(len(wx['time'])):
            min_t_time_data = min_t['time'][i]
            max_t_time_data = max_t['time'][i]
            wx_time_data = wx['time'][i]
            

            start_time_str = wx_time_data['startTime']
            if start_time_str.endswith("00:00:00"):
                continue
            date_str = start_time_str.split(" ")[0]
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            weekday_str = week_list[date_obj.weekday()]
            # https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/01.svg 圖片網址
            time_of_day = "晚上" if start_time_str.endswith("18:00:00") else "白天"
            if time_of_day == "白天":
                new_time_data = {
                    "date": date_str,
                    "weekday": weekday_str,
                    "time": time_of_day,
                    "image": f"https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/{wx_time_data['elementValue'][1]['value']}.svg",
                    "description": wx_time_data['elementValue'][0]['value'],
                    "最低溫": min_t_time_data['elementValue'][0]['value'],
                    "最高溫": max_t_time_data['elementValue'][0]['value']
                }
            else:
                new_time_data = {
                    "date": date_str,
                    "weekday": weekday_str,
                    "time": time_of_day,
                    "image": f"https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/night/{wx_time_data['elementValue'][1]['value']}.svg",
                    "description": wx_time_data['elementValue'][0]['value'],
                    "最低溫": min_t_time_data['elementValue'][0]['value'],
                    "最高溫": max_t_time_data['elementValue'][0]['value']
                }
            combined_weather_data.append(new_time_data)
        date_counts={}
        for entry in combined_weather_data:
            date = entry["date"]
            if date in date_counts:
                date_counts[date] += 1
            else:
                date_counts[date] = 1

        filtered_weather_data = [entry for entry in combined_weather_data if date_counts[entry['date']] > 1]

        filter_data = {
            "location": location['locationName'],
            "weatherData": filtered_weather_data
        }
        filtered_locations.append(filter_data)
    
    return JSONResponse(content=filtered_locations)
