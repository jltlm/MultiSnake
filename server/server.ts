// Load HTTP module
import { createServer } from "http";
import { Server } from "socket.io";
import { Game } from "./GameObjects";

const hostname = "127.0.0.1";
const port = 8000;
const httpServer = createServer(function (req, res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*'
  });
}); // Create HTTP server

// Prints a log once the server starts listening
httpServer.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const io = new Server(httpServer, {
  cors: {
    // origin: "http://127.0.0.1:5173"
    origin: "https://7d2b12uladuc.share.zrok.io",
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
    snake = game.getSnake(name)
    console.log(snake.getPosition());
    playerName = name;
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
    io.to(rooms['multi']).emit('game', 'gameinfo', game.getBoardItems());
    game.updateBoard();
    console.log("updating game");
  }, 500);

}

function gameEnd() {
  clearInterval(gameActiveInterval);
}


