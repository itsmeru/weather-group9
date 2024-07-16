const titleContainer = document.getElementById("title-container");
const tableContainer = document.getElementById("table-container");

const fetchData = () => {
    fetch("/api/mainpage")
        .then((res) => res.json())
        .then((data) => {
            for (let idx = 0; idx < data.length; idx++) {
                const countyData = data[idx];
                const location = countyData.location;

                const tbody = document.createElement("tbody");
                const trDaytime = document.createElement("tr");
                const trNighttime = document.createElement("tr");

                trDaytime.appendChild(renderLocation(location));
                trDaytime.appendChild(renderTime("白天"));
                trNighttime.appendChild(renderTime("晚上"));

                for (let i = 0; i < 14; i++) {
                    let date = countyData.weatherData[i].date;
                    let trimmedDate = date.substring(5);

                    const weekday = countyData.weatherData[i].weekday;
                    const imgUrl = countyData.weatherData[i].image;
                    const description = countyData.weatherData[i].description;
                    const lowestTemp = countyData.weatherData[i].最低溫;
                    const highestTemp = countyData.weatherData[i].最高溫;

                    if (i % 2 === 0) {
                        trDaytime.appendChild(
                            renderData(
                                imgUrl,
                                description,
                                lowestTemp,
                                highestTemp
                            )
                        );

                        if (idx === 0) {
                            titleContainer.appendChild(
                                renderTitles(trimmedDate, weekday)
                            );
                        }
                    }

                    if (i % 2 === 1) {
                        trNighttime.appendChild(
                            renderData(
                                imgUrl,
                                description,
                                lowestTemp,
                                highestTemp
                            )
                        );
                    }
                }
                tbody.appendChild(trDaytime);
                tbody.appendChild(trNighttime);
                tableContainer.appendChild(tbody);
            }
        })
        .catch((err) => {
            console.error("Error fetching data: ", err);
        });
};

fetchData();

const renderTitles = (date, weekday) => {
    const th = document.createElement("th");
    const pDate = document.createElement("p");
    const pDayOfWeek = document.createElement("p");
    pDate.textContent = date;
    pDayOfWeek.textContent = weekday;
    if (weekday === "星期六" || weekday === "星期日") {
        th.className = "weekend";
    }
    th.appendChild(pDate);
    th.appendChild(pDayOfWeek);
    return th;
};

const renderLocation = (location) => {
    const tdLocation = document.createElement("td");
    const a = document.createElement("a");
    const plusIcon = document.createElement("i");
    plusIcon.className = "fa fa-plus-square";
    tdLocation.className = "data location";
    tdLocation.rowSpan = 2;
    a.href = `/county/${location}`;
    a.textContent = location;
    a.appendChild(plusIcon);
    tdLocation.appendChild(a);
    return tdLocation;
};

const renderTime = (time) => {
    const tdTime = document.createElement("td");
    tdTime.className = "data";
    tdTime.textContent = time;
    return tdTime;
};

const renderData = (imgUrl, description, lowestTemp, highestTemp) => {
    const td = document.createElement("td");
    td.className = "data";
    const pIcon = document.createElement("img");
    pIcon.src = imgUrl;
    pIcon.alt = description;
    pIcon.width = 30;
    pIcon.height = 30;
    const pTemp = document.createElement("p");
    pTemp.textContent = `${lowestTemp} - ${highestTemp} \u00B0C
`;
    td.appendChild(pIcon);
    td.appendChild(pTemp);
    return td;
};
