//require("blippar").blipp.addScene().addTransform().read("hierarchy.json")

var blipp = require('blippar').blipp;

blipp.read("main.json");

var scene = blipp.getScene("default");

// Global variables
var mW = blipp.getMarker().getWidth();
var mH = blipp.getMarker().getHeight();

// Scene creation
scene.onCreate = function() {
  //var Plane = scene.addSprite().setColor('#ff7d32aa').setScale(mW, mH, 1);
  //var speaker1 = scene.addTransform().read("hierarchy.json").setScale(mW, mH, 1);
  //scene.setScale(mW, mH, 1);

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
  scene.buttonRed1 = scene.getChild("buttonRed1");
  scene.buttonRed2 = scene.getChild("buttonRed2");
  scene.buttonRed3 = scene.getChild("buttonRed3");
  //scene. = scene.getChild("");
  //scene. = scene.getChild("");
  //scene. = scene.getChild("");
  //scene. = scene.getChild("");
  //scene.speakerIn.setScale(5, 5, 1);
  //scene.speakerOut.setScale(5, 5, 1);
  //scene.year2017.setTranslation(0, -1000, 0);
};

scene.on('trackLost', function () {
  showHideAll(true);
});

scene.on('track', function () {
  showHideAll(false);
});

function showHideAll (trigger) {
  scene.speakerOut.setHidden(trigger);
  scene.speakerIn.setHidden(trigger);
  scene.year2017.setHidden(trigger);
  scene.drops1.setHidden(trigger);
  scene.drops2.setHidden(trigger);
  scene.drops3.setHidden(trigger);
  scene.buttonRed.setHidden(trigger);
  scene.buttonBlue.setHidden(trigger);
  scene.buttonGold.setHidden(trigger);
  scene.buttonSilver.setHidden(trigger);
  scene.buttonRed1.setHidden(trigger);
  scene.buttonRed2.setHidden(trigger);
  scene.buttonRed3.setHidden(trigger);
}
