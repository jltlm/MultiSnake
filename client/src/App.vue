<script setup lang="ts">
import Board from './components/Board.vue';
import { gameState } from './game';
import { socketFunctionality, socketState } from './socket';

addEventListener("keydown", (e) => {
  switch (e.key) {
    case 'ArrowUp':
      console.log('up');
      gameState.direction = "up"
      break;
    case 'ArrowDown':
      console.log('down');
      gameState.direction = "down";
      break;
    case 'ArrowLeft':
      console.log('left');
      gameState.direction = "left";
      break;
    case 'ArrowRight':
      console.log('right');
      gameState.direction = "right";
      break;
  }
});

</script>

<template>
  <button @click="socketFunctionality.connect()">Connect</button>
  <button @click="socketFunctionality.disconnect()">Disconnect</button>
  <br/>
  <button @click="socketFunctionality.start()">Start</button>
  <button @click="socketFunctionality.end()">End</button>
  {{ socketState.connected }}
  <!-- <GameInfo/> -->
  <Board/>
  
</template>

<style>
  h1, h2, h3, p {
    font-family: 'Courier New', Courier, monospace;
  }

</style>
