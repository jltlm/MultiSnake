// Load HTTP module
import { createServer } from "http";
import { Server } from "socket.io";
import { Game } from "./GameObjects";

const hostname = "127.0.0.1";
const port = 8000;

const httpServer = createServer(function (req, res) {
  console.log("reaching server", req.headers)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No content
    res.end();
    return;
}
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ message: 'CORS enabled' }));
}); // Create HTTP server

// Prints a log once the server starts listening
httpServer.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const io = new Server(httpServer, {
  cors: {
    // origin: "https://share.zrok.io",
    origin: "*",
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
    if (snake) snake.setDirection(dir);
  })

  socket.on("end", (s) => {
    console.log("game ended ===========")
    game.printSnakeInfo();
    gameEnd();
    game = new Game();
    if (snake) snake = game.getSnake(playerName)
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


