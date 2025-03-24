<script setup lang="ts">
import Board from './components/Board.vue';
import GameInfo from './components/GameInfo.vue';
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

let secret = "";

</script>

<template>
  <input v-model="secret">
  <!-- <div v-if="secret == 'letmein'"> -->
    <button @click="socketFunctionality.start()">Start</button>
    <button @click="socketFunctionality.end()">End</button>
  <!-- </div> -->
  <button @click="socketFunctionality.connect()">Connect</button>
  <button @click="socketFunctionality.disconnect()">Disconnect</button>
  Connected to server: {{ socketState.connected }}
  <GameInfo/>
  <Board/>

  <a href="https://docs.google.com/forms/d/e/1FAIpQLScNz36d4pBkoHKZfBzO_tcqUkNda3NPTdOiVrAaSVIhbO7MXQ/viewform?usp=header">
    -- google form (rit email only) --
  </a>
  
</template>

<style>
  h1, h2, h3, p {
    font-family: 'Courier New', Courier, monospace;
  }

</style>
