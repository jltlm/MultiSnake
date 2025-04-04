import { io } from "socket.io-client";
import { reactive } from "vue";
import { gameFunctionality, gameState } from "./game";

export const socketState = reactive({
    connected : false,
})

  const socket = io("http://127.0.0.1:8000/", {
    autoConnect: false
});

// const socket = io("https://ecyyoclhbv66.share.zrok.io/", {
//   autoConnect: false,
//   // transports: ['websockets']
// });

export const socketFunctionality = {
  connect: (a: Boolean) => {
    socket.connect();
    if(a) return;
    if (!sessionStorage.getItem("playerName")) {
      sessionStorage.setItem("playerName", (Math.random()*200).toString());
    }
    socket.emit("getSnake", sessionStorage.getItem("playerName"));
  },
  disconnect: () => {
    socket.disconnect();
  },
  start: () => {
    socket.emit("start", );
  },
  end: () => {
    socket.emit("end", );
    gameFunctionality.initializeBoard();
  }

}

// receiving from socket
socket.on("connect", () => {
  socketState.connected = true;
  console.log('connected!');
  gameFunctionality.initializeBoard();
});

socket.on("disconnect", () => {
  socketState.connected = false;
});

socket.on("snakeID", (id) => {
  gameState.mySnakeID = id;
});

socket.on("game", (gameobjects) => {
  gameFunctionality.clear(gameobjects.clearCoords);
  gameState.snakes = gameobjects.snakes;
  gameState.apples = gameobjects.apples;
  console.log("apples", gameState.apples, gameobjects.apples);

  console.log('getting game info')
  gameFunctionality.updateWithGameObjects()

  socket.emit("direction", gameState.direction); // sending direction

});
