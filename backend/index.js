
const Koa = require('koa');
const KoaBody = require('koa-bodyparser');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const path = require('path');
const staticPath = '../front';

const app = new Koa();
app.use(KoaBody())
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE");
    ctx.set("Access-Control-Allow-Headers", "authorization, origin, content-type, accept")
    await next();
})

const router = new Router();



router.get('/', async (ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('../front/index.html');
    console.log('Server is running successfully. By QSC Tech')
    });

 //'Server is running successfully. By QSC Tech'

//  --------------

const decrypt = require('./decrypt.js');
const Base64Decode = require('js-base64').Base64.decode;
const Base64Encode = require('js-base64').Base64.encode;
const CryptoJS = require('crypto-js');
const md5 = require('md5');
const fs = require('fs');

let compareSecret;
fs.readFile('./secret','utf8',function (err,data){
    compareSecret = data;
});

let dataTAT;

fs.readFile('./data','utf8',function (err,data){
    dataTAT = data;
});



router.post('/fetchData', async (ctx, next) => {
    // 请在这里补充你的代码
    let receivedMessage = ctx.request.body;
    let receiveSec = Object.values(receivedMessage)[0];
    let receiveSecret = md5(receiveSec);
    let raw=new Buffer(dataTAT);
    let asUtf = raw.toString('utf8');

    let ParseIt = CryptoJS.enc.Base64.parse(asUtf);
    let HexNeeded = CryptoJS.enc.Utf8.stringify(ParseIt);
    let realData = decrypt(HexNeeded);

    if (receiveSecret === compareSecret){

        ctx.response.status = 200;
        ctx.response.body = realData.toString();



    }else{
        ctx.response.status = 404;
        ctx.response.body = 'Wrong';
    }

    await next();
})

// -----------------

app.use(router.routes())
app.use(router.allowedMethods())
// noinspection JSAnnotator
app.use(koaStatic(
    path.join(__dirname,staticPath)
))

app.listen('3000', () => {
    console.log('Server is listening at http://localhost:3000')
})