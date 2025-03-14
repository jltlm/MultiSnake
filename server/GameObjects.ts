const enum Dir {
    up = 'up',
    down = 'down', 
    left = 'left',
    right = 'right'
}
type Coord = {
    x:number;
    y:number;
}

const dirCoords = { // these are weird because grids are weird (y then x)
    'up': {x: -1, y: 0},
    'down': {x: 1, y: 0},
    'left': {x: 0, y: -1},
    'right': {x: 0, y: 1},
}

enum boardItems {
    empty = 0,
    team1 = 1,
    team2 = 2,
    apple = 3
}

enum TeamID {
    red = 1, blue = 2
}

class Snake {

    private score: number;
    private direction: Dir;

    private position: Array<Coord>; // queue
    private head: Coord;
    private trail: Coord;
    private starterLen = 5;
    private color = 1;

    public constructor(head: Coord, direction: Dir) {
        this.score = 0;
        this.head = head;
        this.direction = direction;
        this.position = new Array();
        let snakeLen = this.starterLen;
        for (let i = snakeLen-1; i >= 0; i--) {
            // this.position.unshift({x: head.x-i*dirCoords[direction].x, y: head.y-i*dirCoords[direction].y});
            this.position.push({x: head.x, y: head.y});
        }
        this.trail = head;
    }

    public getColor(): number {
        return this.color;
    }

    public getScore():number {
        return this.score;
    }

    public getPosition() {
        return this.position;
    }

    public getHead() : Coord {
        return this.head;
    }

    public getDirection():Dir {
        return this.direction;
    }

    public printDirection() {
        console.log(this.direction);
    }

    public setDirection(d: Dir) {
        this.direction = d;
    }

    public newHead(): Coord {
        let newHead = {
            x: this.head.x + dirCoords[this.direction].x,
            y: this.head.y + dirCoords[this.direction].y};
        return newHead;
    }

    // returns the released tail of snake
    public update(newHead: Coord, scoreIncrease=0) : Coord | undefined {
        let out: Coord | undefined = undefined;
        this.position.unshift(newHead);
        this.score += scoreIncrease;
        if (this.score + this.starterLen < this.position.length) {
            out = this.position.pop();
            this.trail = out ? out : this.trail;
        }
        this.head = newHead;
        return out;
    }

    public die() {

    }

    public printPosition() {
        this.position.forEach(e => {
            console.log(`(${e.x}, ${e.y})`)
        });
    }

    public serializeSnake(): {} {
        let sdict = {
            id: this.color,
            head: this.head,
            trail: this.trail
        };
        return sdict;
    }
    
}

export class Game {
    private board: Array<Array<number>>;
    private snakes: Array<Snake>;
    private boardSize = 20;
    private numApples = 4;
    private apples: Array<Coord>;

    public constructor() {
        this.board = new Array(this.boardSize);
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = new Array(this.boardSize).fill('0');
        }
        this.snakes = new Array();
        this.apples = new Array();

        for (let i = 0; i < this.numApples; i++) {
            this.spawnApple();
        }

    }

    public getBoardItems() {
        let sarr = Array();
        for (let i = 0; i < this.snakes.length; i++) {
            let entry = this.snakes[i].serializeSnake();
            sarr.push(entry);
        }
        return {
            snakes: sarr,
            apples: this.apples
        }
    }

    public getBoard() {
        return this.board;
    }

    public getRandUnoccupiedSpace() : Coord {
        let randX = Math.floor(Math.random() * this.boardSize);
        let randY = Math.floor(Math.random() * this.boardSize);

        while (this.board[randX][randY] != 0) {
            randX = Math.floor(Math.random() * this.boardSize);
            randY = Math.floor(Math.random() * this.boardSize);
        }        
        return {x: randX, y: randY};
    }

    // spawns an apple in a random unoccupied space, returns coord of apple
    public spawnApple() : Coord {
        let randCoord = this.getRandUnoccupiedSpace();
        this.apples.push(randCoord)
        this.board[randCoord.x][randCoord.y] = boardItems.apple;
        return randCoord;
    }

    // will spawn a new apple to replace the last one
    public eatApple(coord: Coord) {
        this.apples = this.apples.filter(e => !(coord.x==e.x&&coord.y==e.y));
        this.spawnApple();
    }

    public addSnake(name:string):Snake {
        let position = new Array<Coord>(3);
        let head : Coord = {x: 7, y:5};
        let direction = Dir.right;
        let s = new Snake(head, direction);

        position.forEach(e => {
            this.board[e.x][e.y] = TeamID.red;
        })

        this.snakes.push(s);
        return s;
    }

    private determineSpawn(team: TeamID) {

    }

    // checks if the head of the snake will hit any bodies on the board
    // or if head will hit a wall (out of bounds)
    // returns score increase or -1 if bad collision (snake death)
    private handleCollisions(s:Snake, nh: Coord): number {
        // check oob
        if (nh.x < 0 || nh.x >= this.boardSize || nh.y < 0 || nh.y >= this.boardSize) {
            return -1;
        }

        // checking which square the head lands on
        switch (this.board[nh.x][nh.y]) {
            case boardItems.empty:
                return 0;
            case boardItems.apple: // apple ate, apple respawn!
                console.log("APPLE EATN")
                this.eatApple(nh);
                return 1;
            case boardItems.team1: // (same team, for now)
                return 0;
            case boardItems.team2:
                // and u wanna tell the other snake to score up
                return -1
        }

        return 0;
    }

    public updateBoard() {
        
        this.snakes.forEach(s => {
            let nh = s.newHead();
            let collisionResult = this.handleCollisions(s, nh);

            if (collisionResult == -1) {
                s.die()
            } else {
                let tail = s.update(nh, collisionResult);
                this.board[nh.x][nh.y] = s.getColor();
                if (tail) {
                    this.board[tail.x][tail.y] = 0;                    
                }
            }


        });
    }

}



class Team {
    private snakes: Array<Snake>;
    private score: number;

    public constructor() {
        this.snakes = Array();
        this.score = 0;
    }

    public addSnake(s: Snake) {
        this.snakes.push(s);
    }

    public updateScore():number {
        this.score = 0;
        this.snakes.forEach(s => {this.score += s.getScore()})
        return this.score;
    }

    public getScore():number {
        return this.score;
    }

    public getTeamSize(): number {
        return this.snakes.length;
    }

}
