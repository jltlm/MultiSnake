const enum Dir {
    up = 'up',
    down = 'down', 
    left = 'left',
    right = 'right'
}
interface Coord {
    x:number;
    y:number;
}
const dirCoords = {
    'up': {x: 0, y: -1},
    'down': {x: 0, y: 1},
    'left': {x: -1, y: 0},
    'right': {x: 1, y: 0},
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

// holds the snake body's position in the board
class SnakePosition {
    private head: Coord; // body is a queue, so head is body[last]
    private body : Array<Coord>;
    private direction: Dir;

    public constructor(head:Coord, direction: Dir) {
        this.head = head;
        this.direction = direction;
        switch (direction) {
            case Dir.up:
                break;

        }
    }

    public getHead() :Coord {
        return this.head;
    }
    
}

class SimpleSnake {

    private score: number;
    private direction: Dir;

    private position: Array<Coord>; // queue
    private head: Coord;
    private starterLen = 5;
    private color = 1;

    public constructor(head: Coord, direction: Dir) {
        this.score = 0;
        this.head = head;
        this.direction = direction;
        this.position = new Array();
        let snakeLen = this.starterLen;
        for (let i = snakeLen-1; i >= 0; i--) {
            this.position.unshift({x: head.x-i*dirCoords[direction].x, y: head.y-i*dirCoords[direction].y});
        }

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
    
}

export class SimpleGame {
    private board: Array<Array<number>>;
    private snakes: Array<SimpleSnake>;
    private boardSize = 20;
    private numApples = 4;

    public constructor() {
        this.board = new Array(this.boardSize);
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = new Array(this.boardSize).fill('0');
        }
        this.snakes = Array();

        for (let i = 0; i < this.numApples; i++) {
            this.spawnApple();
        }

    }

    public getBoard() {
        return this.board;
    }

    // spawns an apple in a random unoccupied space
    public spawnApple() {
        let randX = Math.floor(Math.random() * this.boardSize);
        let randY = Math.floor(Math.random() * this.boardSize);

        while (this.board[randX][randY] != 0) {
            randX = Math.floor(Math.random() * this.boardSize);
            randY = Math.floor(Math.random() * this.boardSize);
        }        
        this.board[randX][randY] = boardItems.apple;
    }

    public addSnake(name:string):SimpleSnake {
        let position = new Array<Coord>(3);
        let head : Coord = {x: 7, y:5};
        let direction = Dir.right;
        let s = new SimpleSnake(head, direction);

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
    private handleCollisions(s:SimpleSnake, nh: Coord): number {
        // check oob
        if (nh.x < 0 || nh.x >= this.boardSize || nh.y < 0 || nh.y >= this.boardSize) {
            return -1;
        }

        // checking which square the head lands on
        switch (this.board[nh.x][nh.y]) {
            case boardItems.empty:
                return 0;
            case boardItems.apple: // apple respawn!
                this.spawnApple();
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

export class Game {
    private board: Array<Array<number>>;
    private snakes: Array<Snake>;
    private teamRed: Team;
    private teamBlue: Team;

    public constructor() {
        this.board = Array(400).fill(Array(400).fill(0));
        this.snakes = Array();
        this.teamRed = new Team();
        this.teamBlue = new Team();
    }

    public getBoard() {
        return this.board;
    }

    public addSnake(name:string):Snake {
        let teamid = this.teamRed.getTeamSize() > this.teamBlue.getTeamSize() ? TeamID.red : TeamID.blue;
        let position = new Array<Coord>(3);
        let head : Coord = {x: 3, y:5};
        let direction = Dir.down;
        let s = new Snake(name, teamid, position, head, direction);

        position.forEach(e => {
            this.board[e.x][e.y] = teamid;
        })

        this.snakes.push(s);
        return s;
    }

    private determineSpawn(team: TeamID) {

    }

    public updateBoard() {

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

class Snake {

    private name: string;
    private score: number;
    private team: TeamID;
    private direction: Dir;

    private position: Array<Coord>; // stack
    private head: Coord;

    public constructor(name: string, team: TeamID, position:Array<Coord>, head: Coord, direction:Dir) {
        this.name = name;
        this.score = 0;
        this.team = team;
        this.position = position;
        this.head = head;
        this.direction = direction;

    }

    public getName():string {
        return this.name;
    }

    public getScore():number {
        return this.score;
    }

    public setScore(score: number) {
        this.score = score;
    }

    public getDirection():Dir {
        return this.direction;
    }


    
}