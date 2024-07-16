import { selector } from "./modules/selectorModule.js";
import { update } from "./modules/updatePage.js";
import { tableUpdate } from "./modules/tableUpdate.js";
function initialize() {
    update();
    selector();
    tableUpdate();
}

initialize();

window.submitButton = function(event){
    event.preventDefault();
    let select = selector();
    console.log(`Selected county: ${select.options[select.selectedIndex].text}`);
    window.location.href = `/county/${select.options[select.selectedIndex].text}`;
};