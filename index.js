let canvas, stage, w, h;
let loader;
let snowballSpeedMultiplier = 1;
let score = 0;
let snowballsContainer;
let baseSnowballSpawnTime = 2000;
let gameOver = false;
let lives = 3;
let scoreText, livesText;
let snowballSpeed = 3000;

function init() {
    stage = new createjs.Stage("gameCanvas");
    w = stage.canvas.width;
    h = stage.canvas.height;

    canvas = stage.canvas

    let manifest = [
        {src: "background.png", id: "background"},
        {src: "snowball.png", id: "snowball"},
        {src: "snowcastle.png", id: "castle"},
        {src: "explotion_sprite.png", id: "explosion"},
    ];

    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    loader = new createjs.LoadQueue(true);
    loader.addEventListener("complete", handleImageLoad);
    loader.loadManifest(manifest, true, "./assets/");
}

function stop() {
    createjs.Ticker.removeEventListener("tick", tick);
}

function handleImageLoad(event) {
    snowballsContainer = new createjs.Container();
    let background = new createjs.Shape();

    background.graphics.beginBitmapFill(loader.getResult('background')).drawRect(0, 0, w, h)
    background.x = 0
    background.y = 0
    stage.addChild(background)
    stage.addChild(snowballsContainer);

    let castle = new createjs.Bitmap(loader.getResult('castle'))
    castle.y = h - 400
    castle.x = 100 + (w * Math.random() - 200)
    castle.name = 'castle'
    castle.scale = 0.6
    stage.addChild(castle)

    createScore()
    createLives()
    handleSnowballSpawn()

    createjs.Ticker.timingMode = createjs.Ticker.RAF
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.addEventListener("tick", checkCollision);
}

//Я хз чого я захотiв тут рекурсiю
function handleSnowballSpawn() {
    if (gameOver) return
    let snowball = new createjs.Bitmap(loader.getResult("snowball"))
    let snowballX = canvas.width * Math.random() < 150 ? 150 : canvas.width * Math.random() | 150
    snowballsContainer.addChild(snowball);
        snowball.x = snowballX - 100
        snowball.y = -300
        snowball.regX = 50
        snowball.regY = 50
        snowball.cursor = 'pointer'
        snowball.name = "snowball_" + score;

    snowball.addEventListener('click', handleClickOnSnowball)
    let timeForNextSnowball = baseSnowballSpawnTime - score > 500 ? 2000 - score : 500
    createjs.Tween.get(snowball)
        .to({ y: h, x: (w / 2 - 300) + 600 * Math.random(), rotation: 360 }, snowballSpeed * snowballSpeedMultiplier)
    setTimeout(() => {
        handleSnowballSpawn()
    }, timeForNextSnowball)
}

function handleClickOnSnowball(event) {
    let snowball = event.target;
    let spriteSheet  = new createjs.SpriteSheet({
        framerate: 16,
        "images": [loader.getResult("explosion")],
        "frames": {"regX": 0, "height": 64, "count": 16, "regY": 0, "width": 64},
        "animations": {
            "explosion": [0, 16, 'blank'],
            "blank": 16
        }
    });
    let explosion = new createjs.Sprite(spriteSheet, 'blank')
    explosion.x = snowball.x - snowball.regX
    explosion.y = snowball.y - snowball.regY
    explosion.scale = 2 + Math.random()

    stage.addChild(explosion)
    explosion.gotoAndPlay('explosion')


    score += 10
    snowballsContainer.removeChild(snowball)
    scoreText.text = `Score: ${score}`
}

function checkCollision() {
    snowballsContainer.children.forEach(snowball => {

        let leftX = snowball.x - snowball.regX + 5
        let leftY = snowball.y - snowball.regY + 5

        if (snowball.y === h) {
            snowballsContainer.removeChild(snowball)
        }

        let points = [
            new createjs.Point(leftX, leftY),
            new createjs.Point(leftX + snowball.image.width - 10, leftY),
            new createjs.Point(leftX, + leftY + snowball.image.width - 10 ),
            new createjs.Point(leftX + snowball.image.width - 10, leftY + snowball.image.height - 10)
        ]
        for (let i = 0; i < points.length; i++) {
            let objectsUnderPoint = stage.getObjectsUnderPoint(points[i].x, points[i].y)
            if (objectsUnderPoint.filter((obj) => obj.name === 'castle').length > 0) {
                lives--
                snowballsContainer.removeChild(snowball)
                livesText.text = `Lives: ${lives}`
            }
        }


    })
    if (lives <= 0) {
        let gameOverText = new createjs.Text('Game over!', "bold 128px Arial", '#000000')
        gameOverText.textAlign = 'center'
        gameOverText.textBaseline = 'middle'
        gameOverText.x = w / 2
        gameOverText.y = h / 2
        stage.addChild(gameOverText)
        gameOver = true
        stage.update()
        stop()

    }
}

function createLives() {
    livesText = new createjs.Text(`Lives: ${lives}`, 'bold 48px Arial', '#000000')
    livesText.textAlign = 'center'
    livesText.textBaseline = 'middle'
    livesText.x = w - 200
    livesText.y = 40
    stage.addChild(livesText)
}

function createScore() {
    scoreText = new createjs.Text(`Score: ${score}`, 'bold 48px Arial', '#000000')
    scoreText.textAlign = 'center'
    scoreText.textBaseline = 'middle'
    scoreText.x = 140
    scoreText.y = 40
    stage.addChild(scoreText)
}

function tick(event) {
    stage.update(event);
}
