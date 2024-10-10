function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

function itemCounter(value = Array.prototype, index = String.prototype) {
    var c = 0
    console.log(value, index)
    value.forEach((element) => {
        console.log(element, index)
        if(element==index){
            c+=1
        }
    });
    //console.log(c)
    return c
}

module.exports = { escapeHtml, itemCounter }