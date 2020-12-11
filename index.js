const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {addUser, removeUser, getUser, getUserInROom} = require('./user');
const APP_PORT =process.env.PORT || 5000 ;
const router =require('./router');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
const mysql = require('mysql');

dotenv.config({path: './.env'})




const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   port : '3306',
   password: '',
   database: 'sampledb'
 });

 db.connect((error)=>{
   if(error){
       console.log(error)
   }
   else{
       console.log("My Database is Connected!")
   }
});


app.get('/get', (req, res) =>{

  const sqlSelect = "SELECT * FROM projectdatabase"
  db.query(sqlSelect, (error, result)=>{
    console.log(result)
    res.send(result)
  })
})

app.post('/login', (req, res) =>{
const name = req.body.name
const email = req.body.email 
const card = req.body.card 

const sqlIsert = "INSERT INTO projectdatabase (name , email, card) VALUES (?,?,?)";
  db.query(sqlIsert,[name, email,card], (error, result)=>{
  console.log(error)
  res.send('hello ')
})


})






// app.get('/', (req, res)=>{
//   const sqlIsert = "INSERT INTO projectdb (name , email) VALUES ('dangolden', 'a@gmail')"
//   db.query(sqlIsert, (error, result)=>{
//     res.send('hello dangolden')
//   })
// })



// const db = mysql.createConnection({
//    host: process.env.DB_HOST,
//    user: process.env.DB_USER,
//    port : process.env.DB_PORT,
//    password: process.env.DB_PASSWORD,
//    database: process.env.MYSQL_DATABASE
//  });








// app.use(router);

app.listen(APP_PORT, () => {
   console.log(`server is runing at  ${APP_PORT}`)
})