const express = require('express')
const app = express()
const { MongoClient, ObjectId } = require('mongodb')
const methodOverride = require('method-override')
const spawner = require('child_process').spawn
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const MongoStore = require('connect-mongo')
const { Client, GatewayIntentBits } = require('discord.js')

require('dotenv').config()

app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(session({
    secret: 'bocchi.developer', // 암호화에 쓸 비번
    resave: false, // 유저가 서버로 요청할 떄마다 세션을 갱신 할 건지
    saveUninitialized: false, // 로그인 안해도 세선 만들 것인지
    cookie: { maxAge: 60 * 60 * 1000 },
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL,
        dbName: 'forum'
    })
}))

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.login(process.env.SERVER_ALERT_TOKEN);

client.once('ready', () => {
    console.log('Discord Server Alert Bot is Ready');
})

let db;
const url = process.env.DB_URL;
new MongoClient(url).connect().then((client) => {
    console.log('DB연결성공');
    db = client.db('forum');
    app.listen(process.env.PORT, () => {
        console.log(`http://localhost:${process.env.PORT} 에서 서버 실행중`)
    })
}).catch((err) => {
    console.log(err)
})

async function send_discord_msg (server, text) {

    var channel_id = '';

    if (server == 'alert'){
        channel_id = process.env.SERVER_ALERT_CHANNEL_ID.toString();
    } else if (server == 'msg') {
        channel_id = process.env.MESSAGE_CHANNEL_ID.toString();
    }

    const channel = client.channels.cache.get(channel_id);
    
    if (channel) {
        channel.send(text)
            .then(message => console.log(`Sent Discord Message: ${message.content}`))
            .catch(console.error);
    } else {
        console.log('Channel not found!');
    };
}

// 누가 메인메이지에 들어오면
app.get('/', (request, response) => {
    response.render('main.ejs');
})

app.post('/', (request, response) => {
    // 입력받은 제목
    // console.log(request.body.text)
    const text = request.body.text;
    console.log(text);

    try {
        const sentiment_analysis = spawner('python', ['./sentiment.py', JSON.stringify(text)]);
        sentiment_analysis.stdout.on('data', (data) => {

            data = JSON.parse(data.toString());
            console.log(data);

            send_discord_msg('alert', text);

            response.render('result.ejs', { text: text, data: data })
        })
    } catch {
        response.redirect('/')
    }
})

app.post('/feedback', (request, response) => {
    const msg = request.body.text;

    console.log(msg);
    send_discord_msg('msg', msg);
    response.redirect('/');
})