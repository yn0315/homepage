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

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-control-Allow-Headers', 'Origin, X-Requested-With,Content-Type,Accept');
    next();
});

const conn = {  // mysql 접속 설정
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'my_db'
};

var connection = mysql.createConnection(conn); // DB 커넥션 생성
connection.connect();   // DB 접속

// var router = express.Router();

app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    fs.readFile(__dirname+ '/views/index.ejs', 'utf-8',function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });

           res.end(data); 
        }
    });
    
});


app.get('/join', function (req, res) {
    fs.readFile(__dirname+ '/public/join.html', 'utf-8',function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });

           res.end(data); 
        }
    });
    
});

app.get('/login', function (req, res) {
    fs.readFile(__dirname+ '/public/login.html', 'utf-8',function (error, data) {
        if (error) {
            console.log(error);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });

           res.end(data); 
        }
    });
    
});

app.post('/joinAction', function (req, res) {

    // res.redirect('/index.html');

    // fs.readFile('/index.html',function(error,data){
    //     if (error){
    //         console.log(error);
    //     }else{
    //         res.writeHead(200,{'Content-Type': 'text/html'});

    //         res.end(data);
    //     }
    // });
    
    const id = req.body.id;
    const pw = req.body.pw;
    const name = req.body.name;
    const email = req.body.email;


    let insert_query = `insert into my_db.member values('${id}','${pw}','${name}','${email}')`;
    // let select_query = `select * from my_db.contact`;
    console.log(insert_query);
    let commit_query = `commit`;

    connection.query(insert_query, function (err, results, fields)
    {
        if(err)
        {
            console.log(err);
        }
        else 
        {
            console.log('ok');

        }



    });

    res.redirect('/');


});


app.post('/loginAction', function (req, res) {
    //로그인요청시 해야할 것
    //아이디 정보 가져와서 sql에 있는지 확인
    //있으면 비밀번호랑 확인
    //다 맞으면 로그인 완료, 메인으로 이동
    const $id = req.body.id;
    const $pw = req.body.pw;
    // res.redirect('/');

    let select_query = `select * from my_db.member where user_id ='${$id}'`;

    connection.query(select_query, function(err, results, fields){
        if (err) throw err;  // 에러 있으면 띄우고
        // console.log(results);
        console.log(results[0].user_id);
        console.log($id + "2222222");
        console.log($pw + "2222222");
        console.log(results[0].user_pw);
        
        if (results[0].user_id === $id) {
            console.log("1111111111111111111111");
            if (results[0].user_pw === $pw) {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                res.send('200')
                res.render(__dirname+ '/views/index.ejs', {users : results}); 
                // getlist.ejs 에 render 해줄건데 , users 에 쿼리문 날리고난 results 를 담을거다 
            }
        }

    });

    
});
