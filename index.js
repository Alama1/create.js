let canvas, stage, w, h;
let loader;
let update = true;

function init() {
    stage = new createjs.Stage("gameCanvas");
    w = stage.canvas.width;
    h = stage.canvas.height;

    canvas = stage.canvas

    let manifest = [
        {src: "background.jpg", id: "background"},
        {src: "rock.png", id: "rock"},
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
    let container = new createjs.Container();
    let background = new createjs.Shape();

    let bitmap;
    background.graphics.beginBitmapFill(loader.getResult('background')).drawRect(0, 0, w, h)
    background.x = 0
    background.y = 0
    stage.addChild(background)
    stage.addChild(container);

    for (let i = 0; i < 20; i++) {
        bitmap = new createjs.Bitmap(loader.getResult("rock"));
        container.addChild(bitmap);
        bitmap.x = canvas.width * Math.random() | 0;
        bitmap.y = canvas.height * Math.random() | 0;
        bitmap.regX = bitmap.image.width / 2 | 0;
        bitmap.regY = bitmap.image.height / 2 | 0;
        bitmap.cursor = 'pointer'
        bitmap.scale = bitmap.originalScale = Math.random() * 0.2 + 0.4;
        bitmap.name = "rock_" + i;

        bitmap.on("mousedown", function (evt) {
            this.parent.addChild(this);
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        });

        bitmap.on("pressmove", function (evt) {
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;
            update = true;
        });

        bitmap.on("rollover", function (evt) {
            this.scale = this.originalScale * 1.2;
            update = true;
        });

        bitmap.on("rollout", function (evt) {
            this.scale = this.originalScale;
            update = true;
        });

    }

    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
    if (update) {
        update = false;
        stage.update(event);
        console.log('update')
    }
}
