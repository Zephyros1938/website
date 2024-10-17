const fs = require("node:fs")

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
        if (element == index) {
            c += 1
        }
    });
    //console.log(c)
    return c
}

function generateMetaTags(page) {
    return `
      <title>${page}</title>
      <meta property="og:title" content="${page}">
      <meta property="og:description" content="Description for ${page}">
      <meta property="og:image" content="https://yourwebsite.com/static/favicon-32x32.png">
      <meta property="og:url" content="https://yourwebsite.com${page}">
      <meta property="og:type" content="website">
      
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${page}">
      <meta name="twitter:description" content="Description for ${page}">
      <meta name="twitter:image" content="https://yourwebsite.com/static/favicon-32x32.png">
      <link rel="apple-touch-icon" sizes="180x180" href="./static/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="./static/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="./static/favicon-16x16.png">
      <!-- thank yiouiy https://favicon.io/favicon-generator/ :3 -->
      <link rel="manifest" href="./static/site.webmanifest">
    `;
}

function generateUrlLinks(){
    var dirList = fs.readdirSync("./public")
    dirList = dirList.filter(x => x.includes('.html'))
    dirJoined = ''
    dirList.forEach(x => {
        dirJoined += `<a href="./${x}">${x}</a>\n`
    })
    return dirJoined
}

module.exports = { escapeHtml, itemCounter, generateMetaTags, generateUrlLinks }