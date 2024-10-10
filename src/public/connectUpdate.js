/*
<div class="connected">
<p id="connectionbox"></p>
</div>*/

document.addEventListener('DOMContentLoaded', () => {
    const s = io()
    const d = document.createElement('p')
    d.innerText = "Connected: "
    d.style.position = "absolute";
    d.style.top = '0px'
    d.style.left = '0px'
    document.body.appendChild(d)
    s.on('connection count update', (count) => {
        d.innerText = `Connected: ${count}`
    })
})