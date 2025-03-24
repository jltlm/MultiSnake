import { reactive } from "vue";

enum boardItems {
    empty = 0,
    apple = 1,
    team1 = 2,
    team2 = 3,
}

export const gameState = reactive({
    myHighScore: 0,
    myScore: 0,
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
            gameState.board[ss[i]["trail"]["x"]][ss[i]["trail"]["y"]] = boardItems.empty;

            if (ss[i]["id"] == gameState.mySnakeID) {
                gameState.myScore = ss[i]["score"];
                if (gameState.myScore > gameState.myHighScore) {
                    gameState.myHighScore = gameState.myScore;
                }
            }
        }
    },
    clear: (c: any) => {
        for (let i = 0; i < c.length; i++) {
            gameState.board[c[i]["x"]][c[i]["y"]] = boardItems.empty;
        }
    }
  };
