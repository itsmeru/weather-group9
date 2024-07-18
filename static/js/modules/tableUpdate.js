export function tableUpdate() {
    let page_url = window.location.href;
    let county = page_url.split('/').pop(); 
    console.log('county:', county);

    fetch(`/api/week/${county}`,{
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        let locationData = data[0];
        let columnName = document.querySelector(".column-name");
        let columnDay = document.querySelector(".column-day");
        let columnNight = document.querySelector(".column-night");
        let columnRealFeel = document.querySelector(".column-real-feel");
        let columnUVRay = document.querySelector(".column-UV-ray");

        document.querySelector(".city-name").textContent = locationData.city;

        let ObjectLength = Object.keys(locationData.MinT).length;

        for (let i = 0; i < ObjectLength; i++) {
            let originalDate = locationData.MinT[i].date;
            let parts = originalDate.split('-'); 
            let formattedDate = `${parseInt(parts[1])}/${parseInt(parts[2])}`; 
            console.log(formattedDate);
            let container = document.createElement("div");
            container.innerText = formattedDate + '\n' + locationData.MinT[i].week;
            if (locationData.MinT[i].week == "星期六" || locationData.MinT[i].week == "星期日") {
                container.style.backgroundColor = "#c85203";
            }
            else{
                container.style.backgroundColor = "#0f7b8c";
            }
            columnName.appendChild(container);
        };   
        //--------------處理周間白天天氣資訊--------------       
        for(let i = 0; i < ObjectLength; i++){
            let container = document.createElement("div");
            container.style.backgroundColor = "#fff";
            container.style.flexDirection = "column";
            let signal = document.createElement("img");
            signal.src = locationData.Wx[i].day_url;
            signal.className = "signal";
            let temperature = document.createElement("span");
            temperature.className = "weekly-temperature";
            temperature.textContent = locationData.MinT[i].day + '~' + locationData.MaxT[i].day + '°C';
            container.appendChild(signal);
            container.appendChild(temperature);
            columnDay.appendChild(container);
        };

        //--------------處理周間晚上天氣資訊--------------
        for(let i = 0; i < ObjectLength; i++){
            let container = document.createElement("div");
            container.style.backgroundColor = "#fff";
            container.style.flexDirection = "column";
            let signal = document.createElement("img");
            signal.src = locationData.Wx[i].day_url;
            signal.className = "signal";
            let temperature = document.createElement("span");
            temperature.className = "weekly-temperature";
            temperature.textContent = locationData.MinT[i].night + '~' + locationData.MaxT[i].night + '°C';
            container.appendChild(signal);
            container.appendChild(temperature);
            columnNight.appendChild(container);
        };

        //--------------處理周間體感溫度資訊--------------
        for(let i = 0; i < ObjectLength; i++){
            let container = document.createElement("div");
            container.style.backgroundColor = "#fff";
            container.style.flexDirection = "column";
            let day_temperature = document.createElement("span");
            day_temperature.className = "weekly-temperature";
            day_temperature.textContent = locationData.MinAT[i].day + '~' + locationData.MaxAT[i].day + '°C';
            //let night_temperature = document.createElement("span");
            //night_temperature.className = "weekly-temperature";
            //night_temperature.textContent = "晚: " + locationData.MinAT[i].night + '~' + locationData.MaxAT[i].night + '°C';
            container.appendChild(day_temperature);
            //container.appendChild(night_temperature);
            columnRealFeel.appendChild(container);
        };

        //--------------處理周間紫外線資訊--------------
        if (locationData.UVI){
            for(let i = 0; i < 7; i++){
                let container = document.createElement("div");
                container.style.backgroundColor = "#fff";
                container.style.flexDirection = "column";
                let uvValue = document.createElement("uv-value");
                uvValue.className = "uv-value";
                uvValue.textContent = locationData.UVI[i].uv;
                if (locationData.UVI[i].uv < 2){
                    container.classList.add("UV-ray-container", "green");
                }
                else if (locationData.UVI[i].uv < 5){
                    container.classList.add("UV-ray-container", "orange");
                }
                else if (locationData.UVI[i].uv < 7){
                    container.classList.add("UV-ray-container", "yellow");
                }
                else if (locationData.UVI[i].uv < 10){
                    container.classList.add("UV-ray-container", "red");
                }
                else{
                    container.classList.add("UV-ray-container", "purple");
                }
                container.appendChild(uvValue);
                columnUVRay.appendChild(container);
            };
        }
        else{
            document.querySelector(".UV-ray").firstChild.textContent = "天氣預報";
            for(let i = 0; i < 7; i++){
                let container = document.createElement("div");
                container.style.backgroundColor = "#fff";
                container.style.flexDirection = "column";
                let WeatherDescription = document.createElement("span");
                WeatherDescription.className = "weather-description";
                WeatherDescription.textContent = locationData.WeatherDescription[i].uv;
                let expandButton = document.createElement("button");
                expandButton.className = "expand-button";
                expandButton.textContent = "+";
                container.appendChild(WeatherDescription);
                container.appendChild(expandButton);
                expandButton.addEventListener('click', function(event) {
                    //let columnUV = event.target.closest('.column-UV-ray');
                    toggleExpand(document.querySelector('.column-UV-ray'));
                });

                function toggleExpand(container) {
                    let computedStyle = window.getComputedStyle(container);
                    let gridAutoRows = computedStyle.getPropertyValue('grid-auto-rows');
                    
                    if (gridAutoRows === '55px') {
                        container.style.gridAutoRows = 'minmax(55px, auto)';
                        document.querySelectorAll('.expand-button').forEach(btn => btn.textContent = "-");
                    } else {
                        container.style.gridAutoRows = '55px';
                        document.querySelectorAll('.expand-button').forEach(btn => btn.textContent = "+");
                    }
                }
                columnUVRay.appendChild(container);
            };
        }
});
};   
