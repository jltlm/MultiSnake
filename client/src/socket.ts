import { io } from "socket.io-client";
import { reactive } from "vue";

export const socketState = reactive({
    connected : false,
    board : [],
    info : [],
    direction: "right"
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

socket.on("connect", () => {
  socketState.connected = true;
  console.log('connected!');
});

socket.on("disconnect", () => {
  socketState.connected = false;
});

socket.on("game", (info, board) => {
  socketState.info = info;
  socketState.board = board;
  console.log('getting game info')

  socket.emit("direction", socketState.direction); // sending direction

});


// socket.on("foo", (...args) => {
//   state.fooEvents.push(args);
// });

// socket.on("bar", (...args) => {
//   state.barEvents.push(args);
// });