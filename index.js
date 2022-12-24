let canvas, stage, w, h;
let loader;
let snowballSpeedMultiplier = 1;
let score = 0;
let snowballsContainer;
let baseSnowballSpawnTime = 2000;
let gameOver = false;
let lives = 3;
let scoreText, livesText;
let snowballSpeed = 3000

function init() {
    stage = new createjs.Stage("gameCanvas");
    w = stage.canvas.width;
    h = stage.canvas.height;

    canvas = stage.canvas

    let manifest = [
        {src: "background.png", id: "background"},
        {src: "snowball.png", id: "snowball"},
        {src: "explotion.gif", id: "explotion"}
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
    snowball = new createjs.Bitmap(loader.getResult("snowball"))
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
        .to({ y: h, rotation: 360 }, snowballSpeed * snowballSpeedMultiplier)
    setTimeout(() => {
        handleSnowballSpawn()
    }, timeForNextSnowball)
}

function handleClickOnSnowball(event) {
    let snowball = event.target;
    score += 10
    snowballsContainer.removeChild(snowball)
    scoreText.updateCache()
}

function checkCollision() {
    snowballsContainer.children.forEach(snowball => {
        if(snowball.y >= h - 250) {
            snowballsContainer.removeChild(snowball)
            lives--
            livesText.updateCache()
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
    let bounds = livesText.getBounds()
    livesText.cache(-140, -40, bounds.width * 3 + Math.abs(bounds.x), bounds.height + Math.abs(bounds.y))
    stage.addChild(livesText)
}

function createScore() {
    scoreText = new createjs.Text(`Score: ${score}`, 'bold 48px Arial', '#000000')
    scoreText.textAlign = 'center'
    scoreText.textBaseline = 'middle'
    scoreText.x = 140
    scoreText.y = 40
    let bounds = scoreText.getBounds()
    scoreText.cache(-140, -40, bounds.width * 3 + Math.abs(bounds.x), bounds.height + Math.abs(bounds.y))
    stage.addChild(scoreText)
}

function tick(event) {
    stage.update(event);
}
