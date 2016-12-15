var blipp = require('blippar').blipp;

blipp.read("main.json");

var scene = blipp.getScene("default");

// Global variables
var mW = blipp.getMarker().getWidth();
var mH = blipp.getMarker().getHeight();
var sW = blipp.getScreenWidth() * 1.003;
var sH = blipp.getScreenHeight() * 1.003;

var playing= false;
var soundDelay;
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
    playSound(music.first[0][0], music.first[0][1]);
  });

  scene.stop.on('touchEnd', function() {
    soundDelay.stop();
    stopSound();
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

function delay2(delay, onEnd){
  soundDelay = scene.animate();
  soundDelay.duration(delay).onEnd = onEnd;
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
  delay2(duration, function() {
    stopSound();
  });
}

function stopSound() {
  scene.stop.setHidden(true);
  scene.play.setHidden(false);
  scene.stopSounds();
  playing = false;
  speaker.animationStop();
}

var music = {
  first: [
    ['1_1_52.mp3', 28000],
    ['1_2_76.mp3', 41000],
    ['1_3_95.mp3', 51000],
    ['1_4_95.mp3', 43000],
    ['1_5_79.mp3', 29000],
    ['1_6_53.mp3', 21000],
    ['1_7_40.mp3', 21000],
    ['1_8_83.mp3', 45000],
    ['1_9_45.mp3', 24000],
    ['1_10_48.mp3', 26000],
    ['1_11_53.mp3', 29000],
    ['1_12_51.mp3', 27000],
    ['1_13_63.mp3', 33000],
    ['1_14_32.mp3', 17000],
    ['1_15_67.mp3', 35000],
    ['1_17_85.mp3', 45000],
    ['1_18_60.mp3', 33000],
    ['1_19_60.mp3', 32000],
    ['1_20_49.mp3', 26000],
    ['1_21_45.mp3', 24000],
    ['1_22_48.mp3', 26000],
    ['1_23_41.mp3', 22000],
    ['1_24_41.mp3', 22000],
    ['1_25_56.mp3', 30000],
    ['1_27_66.mp3', 35000],
    ['1_28_81.mp3', 43000],
    ['1_29_59.mp3', 32000],
    ['1_30_42.mp3', 22000],
    ['1_31_62.mp3', 34000],
    ['1_32_57.mp3', 57000],
    ['1_33_30.mp3', 30000],
    ['2_1_102.mp3', 55000],
    ['2_2_76.mp3', 41000],
    ['2_3_35.mp3', 19000],
    ['2_4_42.mp3', 22000],
    ['2_5_22.mp3', 12000],
    ['2_6_41.mp3', 22000],
    ['2_7_18.mp3', 9000],
    ['2_8_19.mp3', 10000],
    ['2_9_20.mp3', 10000],
    ['2_10_24.mp3', 12000],
    ['2_11_19.mp3', 10000],
    ['2_12_80.mp3', 43000],
    ['2_13_82.mp3', 44000],
    ['3_1_84.mp3', 44000],
    ['3_2_76.mp3', 41000],
    ['3_3_72.mp3', 39000],
    ['3_4_130.mp3',71000]
  ],
  second: [],
  third: []
}


