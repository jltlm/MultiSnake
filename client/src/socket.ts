import { io } from "socket.io-client";
import { reactive } from "vue";
import { gameFunctionality, gameState } from "./game";

export const socketState = reactive({
    connected : false,
})

  const socket = io("http://127.0.0.1:8000/", {
    autoConnect: false
});

export const socketFunctionality = {
  connect: () => {
    socket.connect();
    console.log('connected')
  },
  disconnect: () => {
    socket.disconnect();
    console.log('disconnected')
  },
  start: () => {
    socket.emit("start", );
    console.log('start')
  },
  end: () => {
    socket.emit("end", );
    console.log('end')
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

socket.on("game", (info, gameobjects) => {
  gameState.info = info;
  gameState.snakes = gameobjects.snakes;
  gameState.apples = gameobjects.apples;
  console.log("apples", gameState.apples, gameobjects.apples);


  console.log('getting game info')
  gameFunctionality.updateWithGameObjects()

  socket.emit("direction", gameState.direction); // sending direction

});
