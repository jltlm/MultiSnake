// Load HTTP module
import { createServer } from "http";
import { Server } from "socket.io";
import { Game } from "./GameObjects";

// import express from "express";
// const app = express();
// import cors from "cors";
// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }

// app.use(cors(corsOptions)) // Use this after the variable declaration

const hostname = "127.0.0.1";
const port = 8000;
// const httpServer = createServer(app); // Create HTTP server
const httpServer = createServer(function (req, res) {
  // res.setHeader("Access-Control-Allow-Origin", "https://jltlm.github.io");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // res.writeHead(200, {
  //   'Access-Control-Allow-Origin': 'https://jltlm.github.io'
  // });

}); // Create HTTP server

// Prints a log once the server starts listening
httpServer.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173",
    // origin: "https://jltlm.github.io",
    methods: ["GET", "POST"]
  }
  // options
});


let rooms = {
  'multi' : 'multiplayer',
  'single': 'singleplayer'
}

let game = new Game();

io.on("connection", (socket) => {
  // welcomes a new player to a new room
  socket.join(rooms['multi']); // only joins player to the multiplayer room so far
  console.log('someone has joined')
  let playerName = "";

  let snake;
  
  socket.on("getSnake", (name) => {
    snake = game.getSnake(name);
    console.log(snake.getPosition());
    playerName = name;
    socket.emit("snakeID", snake.getID());
  })



  socket.on("start", (s) => {
    console.log("game started ===========")
    gameStart();
    
  })

  socket.on("direction", (dir) => {
    console.log("game started ===========")
    snake.setDirection(dir);
  })

  socket.on("end", (s) => {
    console.log("game ended ===========")
    gameEnd();
    game = new Game();
    snake = game.getSnake(playerName)
  })


});

let gameActiveInterval: NodeJS.Timeout;
function gameStart() {
  gameActiveInterval = setInterval(function() {
    io.to(rooms['multi']).emit('game', game.getBoardItems());
    game.updateBoard();
    console.log("updating game");
  }, 500);

}

function gameEnd() {
  clearInterval(gameActiveInterval);
}


