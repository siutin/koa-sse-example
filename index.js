const Koa = require('koa')
const Router = require('koa-router')
const render = require('koa-ejs')
const path = require('path')

const app = new Koa()
const router = new Router()
const sse = require('./sse')

render(app, {
    root: path.join(__dirname, 'view'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: false
})

router.get('/home', async ctx => {
    await ctx.render('home')
})

sse(router)

app.use(router.routes())

app.listen(3000)