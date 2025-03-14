// Load HTTP module
import { createServer } from "http";
import { Server } from "socket.io";
import { Game } from "./GameObjects";

const hostname = "127.0.0.1";
const port = 8000;
const httpServer = createServer(function (req, res) {}); // Create HTTP server

// Prints a log once the server starts listening
httpServer.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173"
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

  let snake = game.addSnake(socket.id)
  console.log(snake.getPosition());



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
    snake = game.addSnake(socket.id)
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


