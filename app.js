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
    fs.readFile('/index.html', 'utf-8',function (error, data) {
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
