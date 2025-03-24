const enum Dir {
    up = 'up',
    down = 'down', 
    left = 'left',
    right = 'right'
}

type Coord = { x:number; y:number; }

const dirCoords = { // these are weird because grids are weird (y then x)
    'up': {x: -1, y: 0},
    'down': {x: 1, y: 0},
    'left': {x: 0, y: -1},
    'right': {x: 0, y: 1},
}

enum boardItems {
    empty = 0, apple = 1,
    team1 = 2, team2 = 3,
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
    private id = 1;
    private team = 2;

    public constructor(head: Coord, direction: Dir, team: TeamID) {
        this.score = 0;
        this.head = head;
        this.direction = direction;
        this.position = new Array();
        let snakeLen = this.starterLen;
        for (let i = snakeLen-1; i >= 0; i--) {
            this.position.push({x: head.x, y: head.y});
        }
        this.trail = head;
        this.team = team;
    }

    public getTeam(): TeamID { return this.team; }
    public getID(): number { return this.id; }
    public setID(id: number) { this.id = id; }
    public getScore():number { return this.score; }
    public getPosition() { return this.position; }
    public getHead() : Coord { return this.head; }
    public getDirection():Dir { return this.direction; }
    public setDirection(d: Dir) {
        if (!(this.direction == Dir.up && d == Dir.down ||
            this.direction == Dir.down && d == Dir.up ||
            this.direction == Dir.left && d == Dir.right ||
            this.direction == Dir.right && d == Dir.left)) this.direction = d;
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

    public die(respawnPoint: Coord) {
        this.score = 0;
        this.head = respawnPoint;
        this.position = new Array();
        for (let i = this.starterLen-1; i >= 0; i--) {
            this.position.push({x: this.head.x, y: this.head.y});
        }
        this.trail = this.head;
    }

    public printPosition() {
        this.position.forEach(e => {
            console.log(`(${e.x}, ${e.y})`)
        });
    }

    public serializeSnake(): {} {
        let sdict = {
            id: this.id,
            head: this.head,
            trail: this.trail,
            score: this.score
        };
        return sdict;
    }
    
}

export class Game {
    private board: Array<Array<number>>;
    private snakeRegistry: Map<string, Snake>;
    private snakes: Array<Snake>;
    private boardSize = 20;
    private numApples = 4;
    private apples: Array<Coord>;
    private redTeam: Team;
    private blueTeam: Team;
    private clearCoords: Array<Coord>; // for fast things, will be added and taken from often

    public constructor() {
        this.board = new Array(this.boardSize);
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = new Array(this.boardSize).fill('0');
        }
        this.snakeRegistry = new Map();
        this.snakes = new Array();
        this.apples = new Array();

        for (let i = 0; i < this.numApples; i++) {
            this.spawnApple();
        }

        // this.redTeam = new Team("red", TeamID.red);
        this.redTeam = new Team("red", boardItems.team1);
        this.blueTeam = new Team("blue", boardItems.team2);
        this.clearCoords = new Array();
    }

    public getBoardItems() { // for serializing stuff to send
        let sarr = new Array();
        for (let i = 0; i < this.snakes.length; i++) {
            let entry = this.snakes[i].serializeSnake();
            sarr.push(entry);
        }
        return {
            clearCoords: this.clearCoords,
            snakes: sarr,
            apples: this.apples
        }
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

    // connecting a user to a snake; if snake doesn't exist, create one
    public getSnake(name: string): Snake {
        if (this.snakeRegistry.has(name)) {
            return this.snakeRegistry.get(name)!;
        }
        return this.addSnake(name);
    }

    public addSnake(name:string):Snake {
        console.log("NEW SNAKE!!")
        let position = new Array<Coord>(3);
        let head : Coord = this.getRandUnoccupiedSpace();
        let direction = Dir.right;
        let team = this.redTeam.getSnakeCount() > this.blueTeam.getSnakeCount() ? TeamID.blue : TeamID.red;
        let s = new Snake(head, direction, team);

        position.forEach(e => {
            this.board[e.x][e.y] = TeamID.red;
        })

        this.snakes.push(s);
        this.snakeRegistry.set(name, s);
        if (this.redTeam.getSnakeCount() > this.blueTeam.getSnakeCount()) {
            this.blueTeam.addSnake(s);
        } else {
            this.redTeam.addSnake(s);
        }
        return s;
    }

    // returns true if coord is oob
    private isOob(coord: Coord) : Boolean {
        return coord.x < 0 || coord.x >= this.boardSize
            || coord.y < 0 || coord.y >= this.boardSize;
    }

    // checks if the head of the snake will hit any bodies on the board
    // or if head will hit a wall (out of bounds)
    // returns score increase or -1 if bad collision (snake death)
    private handleCollisions(s:Snake, nh: Coord): number {
        if (this.isOob(nh)) return -1;

        let spot = this.board[nh.x][nh.y];
        if (spot == boardItems.empty) return 0;
        else if (spot == boardItems.apple) {
            this.eatApple(nh); return 1;
        }
        return -1;
    }

    public updateBoard() {
        this.clearCoords = new Array();

        this.snakes.forEach(s => {
            let nh = s.newHead();
            let collisionResult = this.handleCollisions(s, nh);

            if (collisionResult == -1) {
                // this means a stalled snake
                // NO MORE!!! THIS MEANS DEATH!!!
                for (let i = 0; i < s.getPosition().length; i++) {
                    let pos = s.getPosition()[i];
                    this.clearCoords.push(pos);
                    this.board[pos.x][pos.y] = boardItems.empty;
                }
                s.die(this.getRandUnoccupiedSpace());
            } else {
                let tail = s.update(nh, collisionResult);
                this.board[nh.x][nh.y] = s.getID();
                if (tail) {
                    this.board[tail.x][tail.y] = 0;
                }
            }

        });
    }

}

class FakeSnake {

}


class Team {
    private snakes: Map<number, Snake>;
    private score: number;
    private name: string;
    private idcount: number;

    public constructor(name: string, firstID: number) {
        this.snakes = new Map();
        this.score = 0;
        this.name = name;
        this.idcount = firstID;
    }

    public getScore(): number { return this.score; }
    public getSnakeCount() : number { return this.snakes.size; }

    public addSnake(s: Snake) {
        this.snakes.set(this.idcount, s);
        s.setID(this.idcount)
        this.idcount+=2;
    }

    public updateScore() : number {
        this.score = 0;
        this.snakes.forEach(s => {this.score += s.getScore()})
        return this.score;
    }

}

// can be blocked by a fellow teammate, not killed
// can be killed by an opposing teammate