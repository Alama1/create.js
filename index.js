let stage, w, h, loader, canvas;
let background, grant, ground, hill, hill2;
let shouldUpdate = true

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
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "./assets/");
}

function handleComplete() {
    background = new createjs.Shape();
    background.graphics.beginBitmapFill(loader.getResult("background")).drawRect(0, 0, w, h);
    let container = new createjs.Container();
    let rock;

    for (let i = 0; i < 100; i++) {
        rock = new createjs.Bitmap(loader.getResult("rock"));
        container.addChild(rock);
        rock.x = canvas.width * Math.random() | 0;
        rock.y = canvas.height * Math.random() | 0;
        rock.regX = rock.image.width / 2 | 0;
        rock.regY = rock.image.height / 2 | 0;
        rock.cursor = 'pointer'
        rock.scale = rock.originalScale = Math.random() * 0.4 + 0.6;
        rock.name = "bmp_" + i;

        rock.addEventListener('pressmove', function (evt) {
            shouldUpdate = true
        })
    }

    stage.addChild(background)

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);

}

function tick(event) {
    if (shouldUpdate) {
        shouldUpdate = false
        stage.update(event);
        console.log('update')
    }
}
