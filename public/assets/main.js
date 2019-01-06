/*eslint no-unused-vars: ["error", { "args": "none" }]*/

let responseElement = document.querySelector('#response')
    
if (!window.EventSource) {
    throw new Error('This page requires EventSource support')
}
let url = `${window.location.protocol}//${window.location.host}/sse/apple`
let source = window.source = new EventSource(url)
source.addEventListener('whatever-event', function (e) {
    console.log(`whatever-event: ${e.data}`)
    responseElement.textContent = `event: ${e.type}\ndata: ${e.data}`
}, false)

source.addEventListener('open', function (e) {
    console.log('open')
    responseElement.textContent = 'open'
}, false)

source.addEventListener('error', function (e) {
    console.log('error')
    responseElement.textContent = 'error'
    console.log(`closed? ${e.readyState == EventSource.CLOSED}`)
}, false)

function closeEvent () { // eslint-disable-line no-unused-vars 
    console.log('closeEvent')
    source.close()
}