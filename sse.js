const PassThrough = require('stream').PassThrough

var globalCount = 0

const sse = (event, data) => `event:${ event }\ndata: ${ data }\n\n`
const randomStrings = () => Math.random().toString(36).substr(2, 5)

module.exports = function(router) {

    router.get('/sse/:name', async ctx => {

        let isForever = true
        let localCount = 0
        const stream = new PassThrough()

        const send = ({ type, msg }) => stream.write(sse(type, msg))

        ctx.type = 'text/event-stream'
        ctx.body = stream;

        ['close', 'finish', 'error'].forEach(eventName => {
            ctx.req.on(eventName, () => {
                console.log(eventName)
                isForever = false
                ctx.res.end()
            })
        })

        const { name } = ctx.params

        if (!name) {
            send({ type: 'error-event', msg: JSON.stringify({ reason: 'miss "name" param' }) })
        }

        let timer = null
        timer = setInterval(() => {
            if (isForever) {
                let message = {
                    name: name,
                    current_time: new Date(),
                    body: `hello ${ randomStrings() }`,
                    globalCount: globalCount++,
                    localCount: localCount++
                }
                send({
                    type: 'whatever-event',
                    msg: JSON.stringify(message)
                })
            } else {
                clearInterval(timer)
            }
        }, 1000)
    })
}