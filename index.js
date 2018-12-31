const Koa = require('koa');
const route = require('koa-route');
const render = require('koa-ejs')
const path = require('path')
const websockify = require('koa-websocket')

const app = websockify(new Koa());

render(app, {
  root: path.join(__dirname, 'view'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: false
});

app.use(route.get('/home', async ctx => {
  await ctx.render('home')
}))

// Using routes
app.ws.use(route.all('/', function (ctx) {
  console.log('someone connected the websocket')
  ctx.websocket.send('Hello World');
  ctx.websocket.on('message', function (message) {
    console.log(`received a message: ${message}`);
  });
}))

app.listen(3000);
