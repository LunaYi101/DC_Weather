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

let db;
const url = process.env.DB_URL;
new MongoClient(url).connect().then((client) => {
    console.log('DB연결성공');
    db = client.db('forum');
    app.listen(8082, () => {
        console.log('http://localhost:8082 에서 서버 실행중')
    })
}).catch((err) => {
    console.log(err)
})

// 누가 메인메이지에 들어오면
app.get('/', (request, response) => {
    response.render('main.ejs');
})

app.post('/', (request, response) => {
    // 입력받은 제목
    // console.log(request.body.text)
    console.log(request.body);

    const sentiment_analysis = spawner('python', ['./sentiment.py', JSON.stringify(request.body.text)]);

    sentiment_analysis.stdout.on('data', (data) => {

        console.log(JSON.parse(data.toString()))
    })

    response.redirect('/')
})