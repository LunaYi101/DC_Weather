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
        mongoUrl: 'mongodb+srv://joonha138:RDe9FWPikehIHlQj@cluster0.fvtycdk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        dbName: 'forum'
    })
}))

let db;
const url = 'mongodb+srv://joonha138:RDe9FWPikehIHlQj@cluster0.fvtycdk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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