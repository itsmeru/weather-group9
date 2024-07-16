export function update() {
let page_url = window.location.href;
let county = page_url.split('/').pop(); 
console.log('county:', county);

fetch(`/api/county/${county}`,{
    headers: {
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data){
            let locationData = data[0];
            let locationName = locationData.locationName;
            document.querySelector(".main-content1-text").textContent = `縣市預報 - ${locationName}`;
            for(let i = 0; i < 3; i++){
                let container = document.querySelector(`.time-container${i+1}`);
                let elements = [
                    { tag: "div", className: "time", dataProp: "datetime" },
                    { tag: "div", className: "wx", dataProp: "Wx" },
                    { tag: "div", className: "pop", dataProp: "PoP" },
                    { tag: "div", className: "T", dataProp: "MinT" },
                    { tag: "div", className: "ci", dataProp: "CI" },
                ]

                for (let element of elements){
                    let newElement = document.createElement(element.tag);
                    newElement.className = element.className;
                    if (element.dataProp === "PoP") {
                        newElement.textContent = `降雨機率: ${locationData[element.dataProp][i]}`;
                    }
                    else if (element.dataProp === "MinT") {
                        newElement.textContent = `${locationData[element.dataProp][i]}~${locationData["MaxT"][i]}°C`;
                    }
                    else{
                        newElement.textContent = locationData[element.dataProp][i];
                    }
                    container.appendChild(newElement);
                };
            };
        }
    })
    .catch(error => {
        console.error('Error fetching info:', error);
    });
}