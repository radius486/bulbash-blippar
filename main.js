var blipp = require('blippar').blipp;

blipp.read("main.json");

var scene = blipp.getScene("default");

// Global variables
var mW = blipp.getMarker().getWidth();
var mH = blipp.getMarker().getHeight();

// Scene creation
scene.onCreate = function() {
	scene.speakerOut = scene.getChild("speakerOut");
  scene.speakerIn = scene.getChild("speakerIn");
  scene.year2017 = scene.getChild("year2017");
  scene.drops1 = scene.getChild("drops1");
  scene.drops2 = scene.getChild("drops2");
  scene.drops3 = scene.getChild("drops3");
  scene.buttonRed = scene.getChild("buttonRed");
  scene.buttonBlue = scene.getChild("buttonBlue");
  scene.buttonGold = scene.getChild("buttonGold");
  scene.buttonSilver = scene.getChild("buttonSilver");

  scene.buttonRed.setTranslationX(2000);
  scene.buttonBlue.setTranslationX(-2000);
  scene.buttonSilver.setTranslationX(-2000);
  scene.buttonGold.setTranslationX(2000);

  scene.buttonRed.on('touchEnd', function() {
    this.setHidden(true);
  });

  scene.buttonBlue.on('touchEnd', function() {
    this.setHidden(true);
  });

  scene.buttonGold.on('touchEnd', function() {
    this.setHidden(true);
  });
};

scene.onShow = function() {
  tranlateButtonX(scene.buttonSilver, 0, 100, 300);
  tranlateButtonX(scene.buttonRed, 0, 300, 300);
  tranlateButtonX(scene.buttonBlue, 0, 500, 300);
  tranlateButtonX(scene.buttonGold, 0, 700, 300);
  shakeAllButtons(800);
}

scene.on('trackLost', function () {
  showHideAll(true);
});

scene.on('track', function () {
  showHideAll(false);
});

function showHideAll(flag) {
  scene.speakerOut.setHidden(flag);
  scene.speakerIn.setHidden(flag);
  scene.year2017.setHidden(flag);
  scene.drops1.setHidden(flag);
  scene.drops2.setHidden(flag);
  scene.drops3.setHidden(flag);
  scene.buttonRed.setHidden(flag);
  scene.buttonBlue.setHidden(flag);
  scene.buttonGold.setHidden(flag);
  scene.buttonSilver.setHidden(flag);
}

function tranlateButtonX(button, x, delay, duration, collBack) {
  button.animate()
    .translationX(x)
    .delay(delay)
    .duration(duration)
    .onEnd = collBack;
}

function tranlateButtonY(button, y, delay, duration, collBack) {
  button.animate()
    .translationY(y)
    .delay(delay)
    .duration(duration)
    .onEnd = collBack;
}

function buttonShake(button, delayTime) {
  tranlateButtonX(button, 50, delayTime + 40, 40);
  tranlateButtonY(button, -1550, delayTime + 80, 40);
  tranlateButtonX(button, 0, delayTime + 120, 40);
  tranlateButtonY(button, -1500, delayTime + 160, 40);
  tranlateButtonX(button, 50, delayTime + 200, 40);
  tranlateButtonY(button, -1550, delayTime + 240, 40);
  tranlateButtonX(button, 0, delayTime + 280, 40);
  tranlateButtonY(button, -1500, delayTime + 320, 40);
  tranlateButtonX(button, 50, delayTime + 360, 40);
  tranlateButtonY(button, -1550, delayTime + 400, 40);
  tranlateButtonX(button, 0, delayTime + 440, 40);
  tranlateButtonY(button, -1500, delayTime + 460, 40);
}

function delay(delay, onEnd){
  return scene.animate().delay(delay).onEnd = onEnd;
}

function shakeAllButtons(delayTime) {
  delay(delayTime, function() {
    buttonShake(scene.buttonRed, 200);
    buttonShake(scene.buttonBlue, 250);
    buttonShake(scene.buttonGold, 300);
  });
}

