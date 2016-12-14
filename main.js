var blipp = require('blippar').blipp;

blipp.read("main.json");

var scene = blipp.getScene("default");

// Global variables
var mW = blipp.getMarker().getWidth();
var mH = blipp.getMarker().getHeight();
var sW = blipp.getScreenWidth() * 1.003;
var sH = blipp.getScreenHeight() * 1.003;

var speakerAnim;
var speakerAnimPlay = false;
var playing= false;
var random = false;

var speaker = {
  anim: undefined,
  animPlay: false,
  currentAmplitude: 5,

  animation: function(amplitude) {
    if(!this.animPlay) {
      this.play(amplitude);
    }

    if(this.animPlay && this.currentAmplitude != amplitude) {
      this.animationReset();
      this.play(amplitude);
    }
  },

  play: function(amplitude) {
    this.anim = scene.speakerIn.animate();
    this.anim.loop()
      .scale(amplitude, amplitude, 2)
      .translationZ(45)
      .duration(200)
      .onEnd(
        scene.speakerIn.animate()
          .scale(5, 5, 2)
          .translationZ(50)
          .duration(200)
      );
    this.animPlay = true;
    this.currentAmplitude = amplitude;
  },

  animationStop: function() {
    this.animationReset();
    this.animPlay = false;
  },

  animationReset: function() {
    this.anim.stop();
    scene.speakerIn.setScale(5, 5, 2);
  }
}

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
  //scene.prepareSound('backgroundSound.mp3', 'backgroundSound');


  scene.player = createPlane('player.png', -sW/2 + 5, -sH/2 + 150, sW - 10, sW/4, 'left');
  scene.close = createPlane('close.png', sW/2 - 40, -sH/2 + sW/4 + 60, sW/20, sW/20, 'right');
  scene.random = createPlane('random-gray.png', -sW/2 + 50, -sH/2 + 190, sW/15, sW/20, 'left');
  scene.randomActive = createPlane('random-blue.png', -sW/2 + 50, -sH/2 + 190, sW/15, sW/20, 'left');
  scene.play = createPlane('play.png', -sW/2 + sW/2 - sW/7/2, -sH/2 + sW/4/2 - sW/6/2 + 150 , sW/5.5, sW/6, 'left');
  scene.stop = createPlane('stop.png', -sW/2 + sW/2 - sW/7/2, -sH/2 + sW/4/2 - sW/7/2 + 150 , sW/7, sW/7, 'left');
  scene.left = createPlane('left.png', -sW/2 + sW/4 - sW/7/2, -sH/2 + sW/4/2 - sW/8/2 + 150 , sW/8, sW/8, 'left');
  scene.right = createPlane('right.png', sW/2 - sW/4 + sW/7/2 , -sH/2 + sW/4/2 - sW/8/2 + 150 , sW/8, sW/8, 'right');


  // scene.randomActive.setHidden(true);
  // scene.stop.setHidden(true);

  scene.random.on('touchEnd', function() {
    this.setHidden(true);
    scene.randomActive.setHidden(false);
    random = true;
  });

  scene.randomActive.on('touchEnd', function() {
    this.setHidden(true);
    scene.random.setHidden(false);
    random = false;
  });

  scene.play.on('touchEnd', function() {
    playSound('swing.mp3', 1000);
  });

  scene.stop.on('touchEnd', function() {
    this.setHidden(true);
    scene.play.setHidden(false);
    scene.stopSounds();
    playing = false;
    speaker.animationStop();
  });

  scene.close.on('touchEnd', function() {
    showHidePlayer(true);
    scene.stopSounds();
    playing = false;
    speaker.animationStop();
  });

  scene.buttonRed.on('touchEnd', function() {
    showHidePlayer(false);
  });

  scene.buttonBlue.on('touchEnd', function() {
    showHidePlayer(false);
  });

  scene.buttonGold.on('touchEnd', function() {
    showHidePlayer(false);
  });
};

scene.onShow = function() {
  tranlateButtonX(scene.buttonSilver, 0, 100, 300);
  tranlateButtonX(scene.buttonRed, 0, 300, 300);
  tranlateButtonX(scene.buttonBlue, 0, 500, 300);
  tranlateButtonX(scene.buttonGold, 0, 700, 300);
  shakeAllButtons(800);
  scene.playSound('backgroundSound.mp3', true, 'backgroundSound', 0.3, 0.3);
  playing = true;
  showHidePlayer(true);
  speaker.animation(5.2);
  //scene.buttonSilver.playVideo('backgroundSound.mp3', 'backgroundSound.mp3', false, false, false);

}

scene.on('trackLost', function () {
  showHideAll(true);
  showHidePlayer(false);
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

function createPlane(texture, x, y, sX, sY, direction) {
  return scene.getScreen()
    .addSprite()
    .setTexture(texture)
    .setTranslation(x, y)
    .setScale(sX, sY)
    .setType('aura')
    .setHAlign(direction)
    .setVAlign('bottom');
}

function showHidePlayer(flag) {
  scene.player.setHidden(flag);
  scene.close.setHidden(flag);
  scene.left.setHidden(flag);
  scene.right.setHidden(flag);
  scene.random.setHidden(flag);
  scene.randomActive.setHidden(flag);
  scene.play.setHidden(flag);
  scene.stop.setHidden(flag);
  if(!flag) {
    if(playing) {
      scene.play.setHidden(true);
      scene.stop.setHidden(false);
    } else {
      scene.play.setHidden(false);
      scene.stop.setHidden(true);
    }
    if(random) {
      scene.random.setHidden(true);
      scene.randomActive.setHidden(false);
    } else {
      scene.random.setHidden(false);
      scene.randomActive.setHidden(true);
    }
  }
}

function playSound(name, duration) {
  scene.play.setHidden(true);
  scene.stop.setHidden(false);
  scene.playSound(name, false);
  playing = true;
  speaker.animation(5.5);
  delay(duration, function() {
    scene.stop.setHidden(true);
    scene.play.setHidden(false);
    scene.stopSounds();
    playing = false;
    speaker.animationStop();
  });
}
