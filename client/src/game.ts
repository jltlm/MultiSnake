import { reactive } from "vue";

enum boardItems {
    empty = 0,
    team1 = 1,
    team2 = 2,
    apple = 3
}

export const gameState = reactive({
    info : [],
    boardSize: 20,
    board: new Array<Array<number>>,
    snakes: [],
    apples: [],
    direction: "right",
    mySnakeID: 0
  });

  export const gameFunctionality = {
    initializeBoard: () => {
        gameState.board = new Array(gameState.boardSize);
        for (let i = 0; i < gameState.boardSize; i++) {
            gameState.board[i] = new Array(gameState.boardSize).fill('0');
        }
    },
    updateWithGameObjects: () => {
        let ss = gameState.snakes;
        let as = gameState.apples;
        for (let i = 0; i < as.length; i++) {
            gameState.board[as[i]["x"]][as[i]["y"]] = boardItems.apple;
        }
        for (let i = 0; i < ss.length; i++) {
            gameState.board[ss[i]["head"]["x"]][ss[i]["head"]["y"]] = ss[i]["id"];
            gameState.board[ss[i]["trail"]["x"]][ss[i]["trail"]["y"]] = 0;
        }
    }
  };
