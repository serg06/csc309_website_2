/*******************************************
 *************** BEGIN STAGE ***************
 *******************************************/


// game status
const STOPPED = 0;
const RUNNING = 1;

function Stage(width, height, stageElementID) {
    // NOTE: Not designed for tiny width/height!

    this.actors = []; // all actors on this stage (monsters, player, boxes, ...)
    this.deadActors = []; // dead actors to remove from this.actors when possible
    this.player = null; // a special actor, the player

    // the logical width and height of the stage
    this.width = width;
    this.height = height;

    // the element containing the visual representation of the stage
    this.stageElementID = stageElementID;

    // take a look at the value of these to understand why we capture them this way
    // an alternative would be to use 'new Image()'
    this.blankImageSrc = document.getElementById('blankImage').src;
    this.monsterImageSrc = document.getElementById('monsterImage').src;
    this.blueMonsterImageSrc = document.getElementById('blueMonsterImage').src;
    this.playerImageSrc = document.getElementById('playerImage').src;
    this.boxImageSrc = document.getElementById('boxImage').src;
    this.wallImageSrc = document.getElementById('wallImage').src;

    // by default, 1 step per second
    this.speed = 1;

    // handle own interval
    this.interval = null;

    // handle timing
    this.timer = null;

    // store free spots
    this.freeSpots = [];

    this.state = STOPPED;
}

// initialize an instance of the game
Stage.prototype.initialize = function () {
    // populate free spots
    for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
            this.freeSpots.push([x, y]);
        }
    }

    // Create a table of blank images, give each image an ID so we can reference it later
    let s = '<table style="table-layout:fixed;">';

    for (let y = 0; y < this.height; y++) {
        s += '<tr>';
        for (let x = 0; x < this.width; x++) {
            s += `<td><img src="${this.blankImageSrc}" id="${this.getStageId(x, y)}" /></td>`;
        }
        s += '</tr>';
    }

    s += "</table>";

    // Put it in the stageElementID (innerHTML)
    $("#stage").html(s);

    // Add the player to the center of the stage
    let playerX = Math.floor((this.width - 1) / 2);
    let playerY = Math.floor((this.height - 1) / 2);
    this.player = new Player(this, playerX, playerY);
    this.addActor(this.player);

    // Add walls around the outside of the stage, so actors can't leave the stage
    for (let y = 0; y < this.height; y++) {
        this.addActor(new Wall(this, 0, y));
        this.addActor(new Wall(this, this.width - 1, y));
    }

    for (let x = 1; x < this.width - 1; x++) {
        this.addActor(new Wall(this, x, 0));
        this.addActor(new Wall(this, x, this.height - 1));
    }

    // Add some Boxes to the stage
    for (let num = this.height * this.width / 3.5; num >= 1; num--) {
        let coords = this.freeSpots[rand(0, this.freeSpots.length - 1)];
        this.addActor(new Box(this, ...coords));
    }

    // Add in some monsters
    for (let num = this.height * this.width / 96; num >= 1; num--) {
        let coords = this.freeSpots[rand(0, this.freeSpots.length - 1)];
        this.addActor(new Monster(this, ...coords));
    }

    // Add in some special monsters!
    for (let num = this.height * this.width / 256; num >= 1; num--) {
        let coords = this.freeSpots[rand(0, this.freeSpots.length - 1)];
        this.addActor(new BlueMonster(this, ...coords));
    }

    // Reset timer
    $("#time_elapsed").text(0);

    // Draw stage
    this.draw();
};

// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId = function (x, y) {
    return `${x}-${y}`;
};

// Add actor to stage
Stage.prototype.addActor = function (actor) {
    let idx = this.freeSpots.findIndex(coords => vertSub(coords, actor.getCoords()).every(coord => coord === 0));
    if (idx === -1) {
        console.log("can't add actor to spot, already taken.");
        return;
    }
    this.freeSpots.splice(idx, 1);

    this.actors.push(actor);
};

// Remove actor from stage
Stage.prototype.removeActor = function (actor) {
    let index = this.actors.indexOf(actor);
    if (index === -1) {
        console.log('Error: Actor not in list.');
        return;
    }

    this.actors.splice(index, 1);
};

// Set the src of the image at (x,y) to src
Stage.prototype.setImage = function (x, y, src) {
    $("#" + this.getStageId(x, y)).attr('src', src);
};

// Take one step in the animation of the game
Stage.prototype.step = function () {
    // Each actor steps
    this.actors.forEach(actor => {
        actor.step();
    });

    // Remove dead actors
    this.deadActors.forEach(actor => {
        this.removeActor(actor);
    });
    this.deadActors = [];

    // Check if won (all monsters are dead)
    if (this.checkIfWon()) {
        this.winGame();
    }

    // Draw board
    this.draw();
};

// return the first actor at coordinates (x,y), or undefined
Stage.prototype.getActor = function (x, y) {
    for (let i = 0; i < this.actors.length; i++) {
        let a = this.actors[i];
        if (a.x === x && a.y === y) {
            return a;
        }
    }
};

// Check if coordinate position is on the stage
Stage.prototype.validCoords = function (x, y) {
    return x === parseInt(x) && 0 <= x && x < this.width && y === parseInt(y) && 0 <= y && y < this.height;
};

// Redraw stage
Stage.prototype.draw = function () {
    // Set all images to blank
    for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
            this.setImage(x, y, this.blankImageSrc);
        }
    }

    // Set actor's images
    this.actors.forEach(a => {
        this.setImage(...a.getCoords(), a.getImg());
    });
};

// Called when game is lost.
Stage.prototype.loseGame = function () {
    this.stop();
    this.draw();

    let btn = $("#resetButton");

    btn.text('Game over! Play again?');
    btn.show();
};

// Called when game is won.
Stage.prototype.winGame = function () {
    this.stop();
    this.draw();

    let btn = $("#resetButton");

    btn.html('<img src="icons/loading.gif"/> You Win!! Updating Score...');
    btn.show();
    addScore();
};

// Run the game given a speed
Stage.prototype.run = function (speed) {
    this.stop();
    this.speed = speed || this.speed; // number of times to step per second
    this.interval = setInterval(() => {
        this.step()
    }, 1000 / this.speed);

    let timeElapsed = $("#time_elapsed");
    this.timer = setInterval(() => {
        timeElapsed.text(parseInt(timeElapsed.text()) + 1);
    }, 1000);

    this.state = RUNNING;
};

// Stop (or "pause") the game.
Stage.prototype.stop = function () {
    clearInterval(this.interval);
    clearInterval(this.timer);

    this.state = STOPPED;
};

// Check if we won the game (i.e. no Monsters on board)
Stage.prototype.checkIfWon = function () {
    let count = 0;
    this.actors.forEach(actor => {
        count += actor instanceof Monster;
    });
    return count === 0;
};


/*****************************************
 *************** END STAGE ***************
 *****************************************/


/*******************************************
 *************** BEGIN ACTOR ***************
 *******************************************/


// Actor lives on the stage at coordinates (x,y)
function Actor(stage, x, y) {
    this.stage = stage; // stage that the actor is on
    this.x = x;
    this.y = y;
}

// Get actor's coordinates
Actor.prototype.getCoords = function () {
    return [this.x, this.y];
};

// Set actor's coordinates
Actor.prototype.setCoords = function (x, y) {
    this.x = x;
    this.y = y;
};

// method stub - do nothing by default (like if you're a box or a wall)
Actor.prototype.step = function () {
};

// move actor to coordinates if possible
Actor.prototype.moveTo = function (x, y) {
    if (this.canMoveTo(x, y)) {
        this.setCoords(x, y);
    }
};

// check if actor can move to certain coordinates
Actor.prototype.canMoveTo = function (x, y) {
    return this.stage.validCoords(x, y) && this.stage.getActor(x, y) === undefined;
};

// get image to display for this actor
Actor.prototype.getImg = function () {
    return this.stage.blankImageSrc;
};


/*****************************************
 *************** END ACTOR ***************
 *****************************************/


/********************************************
 *************** BEGIN PLAYER ***************
 ********************************************/


// Player inherits Actor
function Player(stage, x, y) {
    Actor.call(this, stage, x, y);
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Actor;

// directions that player can move in
let directions = {
    'n': [0, -1],
    's': [0, 1],
    'e': [1, 0],
    'w': [-1, 0]
};
Object.assign(directions, {
    'ne': vertAdd(directions['n'], directions['e']),
    'nw': vertAdd(directions['n'], directions['w']),
    'se': vertAdd(directions['s'], directions['e']),
    'sw': vertAdd(directions['s'], directions['w'])
});

// move in word direction ('n' = north, etc)
Player.prototype.move = function (direction) {
    if (this.stage.state !== RUNNING) {
        return;
    }

    // get direction
    let dirCoords = directions[direction];

    // invalid direction
    if (dirCoords === undefined) {
        return;
    }

    // if we'll jump into monster, just get it over with and lose
    let nextPos = vertAdd(this.getCoords(), dirCoords);
    if (this.stage.getActor(...nextPos) instanceof Monster) {
        this.setCoords(...nextPos);
        this.stage.loseGame();
        return;
    }

    // record the actors we need to move (player & boxes)
    let actorsToMove = [this];

    // for each position, check if it's occupied by a box or w/e and act accordingly
    for (; ; nextPos = vertAdd(nextPos, dirCoords)) {
        // out of bounds, can't move it
        if (!this.stage.validCoords(...nextPos)) {
            return;
        }

        // get actor at pos
        let actor = this.stage.getActor(...nextPos);

        // if blank tile, success
        if (actor === undefined) {
            break;
        }

        // if box, add it to boxesToMove and continue
        if (actor instanceof Box) {
            actorsToMove.push(actor);
        }

        // otherwise, can't move it
        else {
            return;
        }
    }

    // succeeded, move boxes ahead of us, then move us
    let actor;
    while (actor = actorsToMove.pop()) {
        actor.setCoords(...vertAdd(actor.getCoords(), dirCoords));
    }

    // redraw stage
    this.stage.draw();
};

// player has its own img
Player.prototype.getImg = function () {
    return this.stage.playerImageSrc;
};


/********************************************
 *************** END PLAYER *****************
 ********************************************/


/********************************************
 *************** BEGIN BOX ******************
 ********************************************/


// Box inherits Actor
function Box(stage, x, y) {
    Actor.call(this, stage, x, y);
}

Box.prototype = Object.create(Actor.prototype);
Box.prototype.constructor = Actor;

// box has its own img
Box.prototype.getImg = function () {
    return this.stage.boxImageSrc;
};


/********************************************
 *************** END BOX ********************
 ********************************************/


/********************************************
 *************** BEGIN WALL *****************
 ********************************************/


// Wall inherits Actor
function Wall(stage, x, y) {
    Actor.call(this, stage, x, y);
}

Wall.prototype = Object.create(Actor.prototype);
Wall.prototype.constructor = Actor;

// wall has its own img
Wall.prototype.getImg = function () {
    return this.stage.wallImageSrc;
};


/********************************************
 *************** END WALL *******************
 ********************************************/


/********************************************
 *************** BEGIN MONSTER **************
 ********************************************/


// Monster inherits Actor
function Monster(stage, x, y) {
    Actor.call(this, stage, x, y);
}

Monster.prototype = Object.create(Actor.prototype);
Monster.prototype.constructor = Actor;

// unlike regular Actor, Monster can move to player's spot
Monster.prototype.canMoveTo = function (x, y) {
    if (this.stage.validCoords(x, y)) {
        let a = this.stage.getActor(x, y);
        return (a === undefined) || (a instanceof Player);
    }
    return false
};

// monster moves randomly
Monster.prototype.step = function () {
    // get valid moves
    let possibleMoves = Object.values(directions);
    let validMoves = possibleMoves.filter(move => this.canMoveTo(...vertAdd(this.getCoords(), move)));

    // if no valid moves, die
    if (validMoves.length === 0) {
        this.stage.deadActors.push(this);
        return;
    }

    // choose move
    let move = validMoves[rand(0, validMoves.length - 1)];
    this.moveTo(...vertAdd(this.getCoords(), move));
};

// handle eating player
Monster.prototype.moveTo = function (x, y) {
    if (this.canMoveTo(x, y)) {
        let a = this.stage.getActor(x, y);
        this.setCoords(x, y);

        // if move to player, kill player!
        if (a instanceof Player) {
            this.stage.loseGame();
        }
    }
};

// monster has its own img
Monster.prototype.getImg = function () {
    return this.stage.monsterImageSrc;
};


/********************************************
 *************** END MONSTER ****************
 ********************************************/


/*************************************************
 *************** BEGIN BLUEMONSTER ***************
 *************************************************/


// Blue Monster inherits Actor
function BlueMonster(stage, x, y) {
    Monster.call(this, stage, x, y);
}

BlueMonster.prototype = Object.create(Monster.prototype);
BlueMonster.prototype.constructor = Monster;

// blue monster has its own img
BlueMonster.prototype.getImg = function () {
    return this.stage.blueMonsterImageSrc;
};

// Blue Monster chases player
BlueMonster.prototype.step = function () {
    // get valid moves
    let possibleMoves = Object.values(directions);
    let validMoves = possibleMoves.filter(move => this.canMoveTo(...vertAdd(this.getCoords(), move)));

    // if no valid moves, die
    if (validMoves.length === 0) {
        this.stage.deadActors.push(this);
        return;
    }

    let bestMoves = [validMoves[0]];
    let h = this.heuristic(...vertAdd(this.getCoords(), bestMoves[0]));

    // choose move with best heuristic
    validMoves.forEach(move => {
        let h2 = this.heuristic(...vertAdd(this.getCoords(), move));
        if (h2 === h) {
            bestMoves.push(move);
        } else if (h2 < h) {
            h = h2;
            bestMoves = [move];
        }
    });

    // choose move
    let move = bestMoves[rand(0, bestMoves.length - 1)];
    this.moveTo(...vertAdd(this.getCoords(), move));
};

// Evaluate heuristic function at a position; the lower the result, the better to move there.
BlueMonster.prototype.heuristic = function (x, y) {
    return euclideanDist(this.stage.player.getCoords(), [x, y]);
};


/***********************************************
 *************** END BLUEMONSTER ***************
 ***********************************************/



// add to a user's score in backend
function addScore() {
    let elapsed = Math.max(1, parseInt($("#time_elapsed").text()));
    let score = Math.ceil(200 / elapsed);

    $.ajax({
        method: "POST",
        url: "/api/win/",
        data: {'score': score}
    }).done(function (data, text_status, jqXHR) {
        $("#resetButton").text('You Win!! Score saved.')

    }).fail(function (err) {
        let errorField = $('#errorField');

        errorField.text(err.responseJSON.error);
        errorField.show();
    });
}
