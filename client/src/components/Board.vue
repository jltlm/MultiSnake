<script setup lang="ts">
import { gameState } from '../game';

function determineSpaceType(cell:number) {
    if (cell == gameState.mySnakeID &&  gameState.mySnakeID != 0) return 'snake-space';
    if (cell == 0) return 'empty-space';
    if (cell == 1) return 'apple-space';
    // if (cell%2 == 0) return 'team1-space'; // 2 and evens above
    // if ((cell-1)%2 == 0) return 'team2-space'; // 3 and odds above

    return 'team2-space';
    // return 'empty-space';
}

</script>

<template>
    <div class="grid-container">
    <div v-for="(cell, index) in gameState.board.flat()" 
        :key="index" 
        :class="['space', determineSpaceType(cell)]">
        <p v-if="cell != 0 && cell != 1"> {{ cell }} </p>
    </div>
    </div>
    <h2>Direction: {{ gameState.direction }}</h2>
</template>

<style scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    grid-template-rows: repeat(20, 1fr);
    gap: 0px;
    border: white solid 5px;
    width: 600px;
    height: 600px;
}

div.space {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #444444c5;
    height: 25px;
    width: 25px;
}
div.apple-space {
    background-color: #ff0000;
    border: 1px solid #ffff00;
}
div.empty-space {
    background-color: #00000000;
}
div.snake-space {
    background-color: #ffffff;
    border: 1px solid #00ffea;
}
div.team1-space {
    background-color: #770202;
    border: 1px solid #62ffb6;
}
div.team2-space {
    background-color: #4e1972;
    border: 1px solid #00ffea;
}

</style>
