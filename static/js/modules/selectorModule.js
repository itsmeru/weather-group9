export function selector(){  
    let counties = [
        "臺北市", "新北市", "基隆市", "桃園市", "新竹市",
        "苗栗縣", "臺中市", "彰化縣", "雲林縣", "嘉義縣",
        "臺南市", "高雄市", "屏東縣", "南投縣", "嘉義市",
        "宜蘭縣", "花蓮縣", "臺東縣", "連江縣", "澎湖縣",
        "金門縣"
    ];

    let select = document.querySelector(".county-select");
    for (let county in counties) {
        let option = document.createElement("option");
        option.value = counties[county];
        option.text = counties[county];
        select.appendChild(option);
    };
    return select;
};