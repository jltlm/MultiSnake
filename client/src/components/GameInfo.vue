<script setup lang="ts">
import { gameState } from '../game';

</script>

<template>
    <div>
    <!-- <h3>Your Team Score: {{ scores[0] }}</h3>
    <h3>Other Team Score: {{ scores[1] }}</h3> -->
    <h3>Current Score: {{ gameState.myScore }}</h3>
    <h3>High Score: {{ gameState.myHighScore }}</h3>
    </div>
</template>

<style scoped>
div {
    position: fixed;
    top: 50px;
    right: 50px;
    width: 300px;
    height: 200px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Floating effect */
    padding: 20px;
    border: greenyellow solid 3px;
    color: white;

}
</style>
