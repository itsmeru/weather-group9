const tableContainerLargeScreen = document.getElementById(
    "table-container-lg-screen"
);
const titleContainer = document.getElementById("title-container");
const tableContainerSmallScreen = document.getElementById(
    "table-container-sm-screen"
);

fetch("/api/mainpage")
    .then((res) => res.json())
    .then((data) => {
        // For Large Screen
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
                        renderData(imgUrl, description, lowestTemp, highestTemp)
                    );

                    if (idx === 0) {
                        titleContainer.appendChild(
                            renderTitles(trimmedDate, weekday)
                        );
                    }
                }

                if (i % 2 === 1) {
                    trNighttime.appendChild(
                        renderData(imgUrl, description, lowestTemp, highestTemp)
                    );
                }
            }
            tbody.appendChild(trDaytime);
            tbody.appendChild(trNighttime);
            tableContainerLargeScreen.appendChild(tbody);
        }

        // For Small Screen
        for (let idx = 0; idx < data.length; idx++) {
            const countyData = data[idx];
            const location = countyData.location;
            tableContainerSmallScreen.appendChild(renderLocationTime(location));

            const tbody = document.createElement("tbody");

            for (let i = 0; i < 14; i += 2) {
                const tr = document.createElement("tr");

                let date = countyData.weatherData[i].date;
                let trimmedDate = date.substring(5);

                const weekday = countyData.weatherData[i].weekday;

                // 1 = Daytime, 2 = Nighttime
                const imgUrl1 = countyData.weatherData[i].image;
                const imgUrl2 = countyData.weatherData[i + 1].image;
                const description1 = countyData.weatherData[i].description;
                const description2 = countyData.weatherData[i + 1].description;
                const lowestTemp1 = countyData.weatherData[i].最低溫;
                const lowestTemp2 = countyData.weatherData[i + 1].最低溫;
                const highestTemp1 = countyData.weatherData[i].最高溫;
                const highestTemp2 = countyData.weatherData[i + 1].最高溫;

                tr.appendChild(renderDateWeekday(trimmedDate, weekday));
                tr.appendChild(
                    renderData(imgUrl1, description1, lowestTemp1, highestTemp1)
                );
                tr.appendChild(
                    renderData(imgUrl2, description2, lowestTemp2, highestTemp2)
                );

                tbody.appendChild(tr);
            }

            tableContainerSmallScreen.appendChild(tbody);
        }
    })
    .catch((err) => {
        console.error("Error fetching data: ", err);
    });

// Large Screen Rendering
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

// Small Screen Rendering
const renderLocationTime = (location) => {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");
    const th3 = document.createElement("th");
    const a = document.createElement("a");
    const plusIcon = document.createElement("i");

    th1.className = "data location";
    plusIcon.className = "fa fa-plus-square";

    a.href = `/county/${location}`;
    a.textContent = location;
    a.appendChild(plusIcon);
    th1.appendChild(a);

    th2.textContent = "白天";
    th3.textContent = "晚上";
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    thead.appendChild(tr);
    return thead;
};

const renderDateWeekday = (date, weekday) => {
    const td = document.createElement("td");
    td.className = "data";
    const pDate = document.createElement("p");
    const pWeekday = document.createElement("p");
    pDate.textContent = date;
    pWeekday.textContent = weekday;
    if (weekday === "星期六" || weekday === "星期日") {
        pDate.className = "weekend-red";
        pWeekday.className = "weekend-red";
    }
    td.appendChild(pDate);
    td.appendChild(pWeekday);
    return td;
};

// Both Large and Small Screen Rendering
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
