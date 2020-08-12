
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
            //debuging
            debug: true
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
// var game receives the configuration object (config)
var game = new Phaser.Game(config);
var gameStarted = false;
var score = 0;
var scoreText;
var gameWon = false;

function preload() {
    this.load.image('ball', './assets/ball.png');
    this.load.image('paddle', './assets/paddle.png');
    this.load.image('brick1', './assets/brick1.png');
    this.load.image('brick2', './assets/brick2.png');
    this.load.image('brick3', './assets/brick3.png');
    this.load.image('brick4', './assets/brick4.png');
    this.load.image('brick5', './assets/brick5.png');
    this.load.image('background', './assets/background.jpg');
}

function create() {
    //add background
    this.add.image(400,340,'background').setScale(0.9);

    //setup the game objects
    this.player = this.physics.add.sprite(0, 610, 'paddle').setScale(0.2);
    this.ball = this.physics.add.sprite(0, 575, 'ball').setScale(0.2);
    this.blueBricks = createBricksGroup('brick1', 170, this);
    this.greenBricks = createBricksGroup('brick2', 140, this);
    this.purpleBricks = createBricksGroup('brick3', 110, this);
    this.yellowBricks = createBricksGroup('brick4', 80, this);
    this.redBricks = createBricksGroup('brick5', 50, this);

    //set the ball borders (like in the config borders)
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1, 1.05);
    //remove the border under the player so the ball can fall and the player can lose
    this.physics.world.checkCollision.down = false;

    // what will hapen if the ball hits the brickes or the player(the paddle)
    this.physics.add.collider(this.ball, this.blueBricks, brickCollision, null, this);
    this.physics.add.collider(this.ball, this.greenBricks, brickCollision, null, this);
    this.physics.add.collider(this.ball, this.purpleBricks, brickCollision, null, this);
    this.physics.add.collider(this.ball, this.yellowBricks, brickCollision, null, this);
    this.physics.add.collider(this.ball, this.redBricks, brickCollision, null, this);
    //set the player to not move when being hit by the ball(or anything else)
    this.player.setImmovable(true);
    this.physics.add.collider(this.ball, this.player, playerCollision, null, this);

    this.startText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'Click to Play',
    {
        fontFamily: 'Arial',
        fontSize: '50px',
        fill: '#fff'
    });
    this.startText.setOrigin(0.5);

    this.gameOverText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'Game Over!',
    {
        fontFamily: 'Arial',
        fontSize: '50px',
        fill: '#fff'
    });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.setVisible(false);

    this.winText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'You Win!',
    {
        fontFamily: 'Arial',
        fontSize: '50px',
        fill: '#fff'
    });
    this.winText.setOrigin(0.5);
    this.winText.setVisible(false);

    scoreText = this.add.text(
    10,
    10,
    'Score: 0',
    {
        fontFamily: 'Arial',
        fontSize: '18px',
        fill: '#fff'
    }
);
}

function update() {
    
    if (!gameWon) {
        //updateScore();
        
        if (isGameOver(this.physics.world, this.ball)) {

            //change the game over text(adding score)
            this.gameOverText = this.add.text(
                this.physics.world.bounds.width / 2,
                this.physics.world.bounds.height / 2,
                'Game Over!'+score,
                {
                    fontFamily: 'Arial',
                    fontSize: '50px',
                    fill: '#fff'
                });
                this.gameOverText.setOrigin(0.5);
            this.gameOverText.setVisible(true);
            this.ball.destroy()
            this.player.destroy();
        } else {
            this.player.setX(this.input.x);
            if (!gameStarted) {
                this.ball.setX(this.player.x);

                if (this.input.activePointer.isDown) {
                    gameStarted = true;
                    this.ball.setVelocityY(-300);
                    this.startText.setVisible(false);
                }
            }
        }
    }
}

function isGameOver(world, ball) {
    return ball.body ? ball.body.y > world.bounds.height : true;
}

function brickCollision(ball, brick) {
    brick.destroy();
    addScore(brick);

    if (ball.body.velocity.x === 0) {
        if (ball.x < brick.x) {
            ball.body.setVelocityX(-130);
        } else {
            ball.body.setVelocityX(130);
        }
    }

    if (isWon(this.blueBricks, this.greenBricks, this.purpleBricks, this.yellowBricks, this.redBricks)) {
        this.winText = this.add.text(
            this.physics.world.bounds.width / 2,
            this.physics.world.bounds.height / 2,
            'You Win! '+score,
            {
                fontFamily: 'Arial',
                fontSize: '50px',
                fill: '#fff'
            });
            this.winText.setOrigin(0.5);
        this.wonText.setVisible(true);
        this.ball.destroy();
        this.player.destroy();
        gameWon = true;
    }
}

function addScore(brick) {
    switch (brick.texture.key) {
        case "brick1":
            score += 10;
            break;
        case "brick2":
            score += 20;
            break;
        case "brick3":
            score += 30;
            break;
        case "brick4":
            score += 40;
            break;
        case "brick5":
            score += 50;
            break;
    }
    scoreText.setText('Score: ' + score);    
}

function isWon(blueBricks, greenBricks, purpleBricks, yellowBricks, redBricks) {
    return (
        blueBricks.countActive() === 0 &&
        greenBricks.countActive() === 0 &&
        purpleBricks.countActive() === 0 &&
        yellowBricks.countActive() === 0 &&
        redBricks.countActive() === 0
    );
}

function playerCollision(ball, player) {
    var velX = Math.abs(ball.body.velocity.x);

    if (ball.x < player.x) {
        ball.setVelocityX(-velX);
    } else {
        ball.setVelocityX(velX);
    }
}

function createBricksGroup(name, y, scene) {
    return scene.physics.add.group({
        key: name,
        repeat: 0,
        immovable: true,
        setXY: {
            x: 80,
            y: y,
            stepX: 80
        },
        setScale: { x: 0.2, y: 0.2 }
    });
}
