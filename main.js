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

	scene.speakerIn = scene.getChild("speaker_in");
	scene.speakerOut = scene.getChild("speaker_out");
  scene.year2017 = scene.getChild("year2017");
    //scene.speakerIn.setScale(5, 5, 1);
    //scene.speakerOut.setScale(5, 5, 1);
    //scene.year2017.setTranslation(0, -1000, 0);
    console.log('Height:'+ mH);
    console.log('Width:' + mW);
};
