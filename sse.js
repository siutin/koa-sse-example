const PassThrough = require('stream').PassThrough
const randomStrings = () => Math.random().toString(36).substr(2, 5)
const eventStreamFormat = (event, data) => `event: ${ event }\ndata: ${ data }\n\n`
const send = ({ clientId, type, msg }) => clients[clientId].res.write(eventStreamFormat(type, msg))

var clientId = 0
var clients = {}  // <- Keep a map of attached clients

module.exports = function(router) {

    router.get('/sse/:name', async ctx => {

        const stream = new PassThrough()

        ctx.type = 'text/event-stream'
        ctx.body = stream

        ctx.req.socket.setTimeout(Number.MAX_VALUE) // HTTP Keep-Alive
        ctx.res.write('\n');

        (function(clientId) {
            clients[clientId] = ctx; // attach this client
            ['close', 'finish', 'error'].forEach(eventName => {
                ctx.req.on(eventName, () => {
                    console.log(`eventName: ${ eventName } clientId: ${ clientId }`)
                    ctx.res.end()
                    delete clients[clientId]
                })
            }) // remove client when it disconnects
        })(++clientId)

    })

    setInterval(() => {
        console.log('Clients: ' + Object.keys(clients))
        for (clientId in clients) {

            const { name } = clients[clientId].params
            
            let message = {
                clientId,
                name: name,
                body: randomStrings(),
                clientCount: Object.keys(clients).length,
                currentTime: new Date()
            }

            send({ clientId, type: 'whatever-event', msg: JSON.stringify(message) })
        }
    }, 1000)
}