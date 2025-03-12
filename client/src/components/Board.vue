<script setup lang="ts">
import { socketState } from '../socket';

function determineSpaceType(cell:number) {
    switch (cell) {
        case 0:
            return 'empty-space';
        case 1:
            return 'team1-space';
        case 2:
            return 'team1-space';
        case 3:
            return 'apple-space';
        case 3:
            return 'snake-space';
        default:
            return 'empty-space';
    }
}

</script>

<template>
    <div class="grid-container">
    <div v-for="(cell, index) in socketState.board.flat()" 
        :key="index" 
        :class="['space', determineSpaceType(cell)]">
    </div>
    </div>
    <h1>Direction: {{ socketState.direction }}</h1>
</template>

<style scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    grid-template-rows: repeat(20, 1fr);
    gap: 0px;
    border: white solid 5px;
    width: 500px;
    height: 500px;
}

div.space {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ff0000;
    height: 18px;
    width: 18px;
}
div.apple-space {
    background-color: #ff0000;
    border: 1px solid #ffff00;
}
div.empty-space {
    background-color: #00000000;
    /* border: 1px solid #99999942; */
}
div.snake-space {
    background-color: #4e1972;
    border: 1px solid #00ffea;
}

div.team1-space {
    background-color: #770202;
    border: 1px solid #00ff00;
}

</style>
