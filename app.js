var session = require('express-session');
var mysqlStore = require('express-mysql-session')(session);

var express = require('express');
var app = express();
var fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql');  // mysql 모듈 로드
var ejs = require("ejs");
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
// const options = {
//     key: fs.readFileSync('/path/to/private.key'),
//     cert: fs.readFileSync('/path/to/certificate.crt'),
// };


app.use((morgan('dev')));

const PORT = process.env.PORT || 3000;

// app.use(cors());

// const corsOptions = {
//     origin: 'http://yn0315.shop'
//   };

// app.use(cors(corsOptions));

app.use(cors({
    origin: '*', // 모든 도메인 허용
    methods: '*', // 모든 메서드 허용
    allowedHeaders: '*' // 모든 헤더 허용
}));
app.listen(PORT, function () {
    console.log('server Start.')

})

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-control-Allow-Headers', 'Origin, X-Requested-With,Content-Type,Accept');
    next();
});

const options = {  // mysql 접속 설정
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'my_db'
};

var sessionStore = new mysqlStore(options);

app.use(session({
    secret: 'secret', //세션을 암호화해줌
    resave: false, //세션을 항상 저장할지 여부
    saveUninitialized : true, //세션아이디를 사용하기 전까지 미발급
    store: sessionStore,//데이터 저장형식
    cookie: {
        maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
      }
    
}));

// req.session. ..... 로 사용 가능

// req.session.destroy();
// res.clearCookie('sid');
// req.session.userid = id;




var connection = mysql.createConnection(options); // DB 커넥션 생성
connection.connect();   // DB 접속



// var router = express.Router();

app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    // fs.readFile(__dirname + '/views/index.ejs', 'utf-8', function (error, data) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         res.writeHead(200, { 'Content-Type': 'text/html' });

    //         res.end(data);
    //     }
    // });
    res.render(__dirname + '/views/index.ejs', {displayname : req.session.displayname});

});


app.get('/join', function (req, res) {
    fs.readFile(__dirname + '/public/join.html', 'utf-8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });

            res.end(data);
        }
    });

});

app.get('/login', function (req, res) {
    fs.readFile(__dirname + '/public/login.html', 'utf-8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });

            res.end(data);
        }
    });

});


app.get('/user/:id', function (req, res) {
    // Post.findById(req.params.title, function (err, post) {
        
        // const title = req.body.title;
        const $id = req.params.id;
        console.log($id);

        let select_query = `select * from my_db.member where user_id = '${$id}'`;
        // let select_query = `select * from my_db.contact`;
        console.log(select_query);
        let commit_query = `commit`;
    
       
        connection.query(select_query, function(err, results, fields){
            if (err) throw err;  // 에러 있으면 띄우고
            console.log(results);
            
            res.render(__dirname + '/views/index.ejs', {users : results}); 
            
        });

});


app.post('/joinAction', function (req, res) {

    const id = req.body.id;
    const pw = req.body.pw;
    const name = req.body.name;
    const email = req.body.email;


    let insert_query = `insert into my_db.member values('${id}','${pw}','${name}','${email}')`;
    // let select_query = `select * from my_db.contact`;
    console.log(insert_query);
    let commit_query = `commit`;

    connection.query(insert_query, function (err, results, fields) {
        if (err) {
            console.log(err);
        }
        else {
            // const data = fs.readFileSync(__dirname +'/views/index.ejs', 'utf-8');
            console.log('ok');
            res.header('Content-Type', 'text/plain');
            res.send('200');
            // res.end(res.redirect('/'));

            //    res.end(data); 

        }



    });




});


app.post('/loginAction', function (req, res) {
    const $id = req.body.id;
    const $pw = req.body.pw;
    const select_query = `select * from my_db.member where user_id ='${$id}'`;
  
    connection.query(select_query, function (err, results, fields) {
      if (err) throw err;
  
      if (results[0] && results[0].user_id === $id && results[0].user_pw === $pw) {

        req.session.displayname = req.body.id;
        // res.redirect(`/user/${results[0].user_id}`); // 로그인이 성공했을 때 로그인 정보를 함께 전달
        // res.header('Content-Type', 'text/plain');
        // res.send('200',res.render(__dirname + '/views/index.ejs', {data : results[0].user_id}));
        res.redirect('/');
      }else {
          res.send('500');
      }
    });
  })

app.post('/submit', function (req, res) {

    const name = req.body.name;
    const telno = req.body.tel;
    const companyName = req.body.companyName;
    const email = req.body.email;
    const budget = req.body.budget;
    const message = req.body.message;


    console.log(req.body.name);
    console.log(req.body.telno);
    console.log(req.body.companyName);
    console.log(req.body.email);
    console.log(req.body.budget);
    console.log(req.body.message);

    // res.redirect('/');

    let insert_query = `insert into my_db.contact values('${name}','${telno}','${companyName}','${email}','${budget}','${message}')`;
    // let select_query = `select * from my_db.contact`;
    console.log(insert_query);
    let commit_query = `commit`;



    connection.query(insert_query, function (err, results, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('ok');

        }

    });

    connection.query(commit_query, function (err, results, fields) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('ok');

            res.header('Content-Type','text/plain');
            res.send('200');
            // res.redirect('/');

        }

    });




});