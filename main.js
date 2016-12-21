var blipp = require('blippar').blipp;

blipp.setAutoRequiredAssets(true);

blipp.read("main.json");

var scene = blipp.getScene("default");

scene.addRequiredAssets(['Comp_rounds_2_1.mp4', 'Comp 4.mp4']);

// Global variables
var mW = blipp.getMarker().getWidth();
var mH = blipp.getMarker().getHeight();
var sW = blipp.getScreenWidth() * 1.003;
var sH = blipp.getScreenHeight() * 1.003;
var trackLost = false;
var startAnimation = true;

var playing= false;
var soundDelay;
var trackNumber = 0;
var random = false;
var randomList =[];

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
      .duration(200)
      .onEnd(
        trackLost ? scene.speakerIn.animate().scale(3.5, 3.5, 2).duration(200) : scene.speakerIn.animate().scale(5, 5, 2).duration(200)
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
    if(trackLost) {
      scene.speakerIn.setScale(3.5, 3.5, 2);
    } else {
      scene.speakerIn.setScale(5, 5, 2);
    }

  }
}

// Scene creation
scene.onCreate = function() {
  blipp.uiVisible('blippShareButton', false);
  blipp.uiVisible('photoShareButton', false);
  blipp.uiVisible('favouriteButton', false);

  scene.video1 = scene.addSprite().setBlend('add').setScale(650, 650, 1).setTranslationZ(100);
  scene.video2 = scene.addSprite().setBlend('add').setScale(1500, 1122, 1).setTranslation(-30, -850 , 600);

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

  scene.player = createPlane('player.png', -sW/2 + 5, -sH/2 + 150, sW - 10, sW/4, 'left');
  scene.close = createPlane('close.png', sW/2 - 40, -sH/2 + sW/4 + 60, sW/20, sW/20, 'right');
  scene.random = createPlane('random-gray.png', -sW/2 + 50, -sH/2 + 190, sW/15, sW/20, 'left');
  scene.randomActive = createPlane('random-blue.png', -sW/2 + 50, -sH/2 + 190, sW/15, sW/20, 'left');
  scene.play = createPlane('play.png', -sW/2 + sW/2 - sW/7/2, -sH/2 + sW/4/2 - sW/6/2 + 150 , sW/5.5, sW/6, 'left');
  scene.stop = createPlane('stop.png', -sW/2 + sW/2 - sW/7/2, -sH/2 + sW/4/2 - sW/7/2 + 150 , sW/7, sW/7, 'left');
  scene.left = createPlane('left.png', -sW/2 + sW/4 - sW/7/2, -sH/2 + sW/4/2 - sW/8/2 + 150 , sW/8, sW/8, 'left');
  scene.right = createPlane('right.png', sW/2 - sW/4 + sW/7/2 , -sH/2 + sW/4/2 - sW/8/2 + 150 , sW/8, sW/8, 'right');

  scene.category1 = createPlane('category.png', -sW/2 + 50, -sH/2 + sW/4 + 155, sW - 100, 120, 'left');
  scene.category2 = createPlane('category.png', -sW/2 + 50, -sH/2 + sW/4 + 280, sW - 100, 120, 'left');
  scene.category3 = createPlane('category.png', -sW/2 + 50, -sH/2 + sW/4 + 405, sW - 100, 120, 'left');

  scene.legal = createPlane('legal.png', -sW/2 + 5, -sH/2 + 5, sW - 10, 140, 'left');

  scene.random.on('touchEnd', function() {
    this.setHidden(true);
    scene.randomActive.setHidden(false);
    random = true;
    randomList = generateRandomList(music.first);
  });

  scene.randomActive.on('touchEnd', function() {
    this.setHidden(true);
    scene.random.setHidden(false);
    random = false;
  });

  scene.play.on('touchEnd', function() {
    backgroundSound(true);
    if(random) {
      playSound(randomList[trackNumber][0], randomList[trackNumber][1]);
    } else {
      playSound(music.first[trackNumber][0], music.first[trackNumber][1]);
    }
  });

  scene.stop.on('touchEnd', function() {
    stopSound();
  });

  scene.left.on('touchEnd', function() {
    trackCounter('left');
    if(playing) {
      stopSound();
      if(random) {
        playSound(randomList[trackNumber][0], randomList[trackNumber][1]);
      } else {
        playSound(music.first[trackNumber][0], music.first[trackNumber][1]);
      }
    }
  });

  scene.right.on('touchEnd', function() {
    trackCounter();
    if(playing) {
      stopSound();
      if(random) {
        playSound(randomList[trackNumber][0], randomList[trackNumber][1]);
      } else {
        playSound(music.first[trackNumber][0], music.first[trackNumber][1]);
      }
    }
  });

  scene.close.on('touchEnd', function() {
    showHidePlayer(true);
    scene.stopSounds();
    playing = false;
    speaker.animationStop();
    backgroundSound();
  });

  scene.buttonRed.on('touchEnd', function() {
    //showHidePlayer(false);
  });

  scene.buttonBlue.on('touchEnd', function() {
    showHidePlayer(false);
  });

  scene.buttonGold.on('touchEnd', function() {
    //showHidePlayer(false);
  });

  //showHideAll(true);
  showHidePlayer(true);
};

scene.onShow = function() {
  scene.video1.playVideo('Comp_rounds_2_1.mp4', '', false, false, false);
  scene.video1.on('videoTextureEnd', function () {
    this.fadeOut();
    this.fadeIn().playVideo('Comp_rounds_2_1.mp4', '', false, false, false);
  });

  scene.video2.playVideo('Comp 4.mp4', '', false, false, false);
  scene.video2.on('videoTextureEnd', function () {
    this.fadeOut();
    this.fadeIn().playVideo('Comp 4.mp4', '', false, false, false);
  });
  fadeInAll(2000);
  delay(2000, function() {
    flyButtons();
    //shakeAllButtons(800);
    backgroundSound();
  });
  //scene.buttonSilver.playVideo('backgroundSound.mp3', 'backgroundSound.mp3', false, false, false);
}

scene.on('trackLost', function () {
  trackLost = true;
  showHideAll(true);

  if(playing) {
    speaker.animation(3.65);
  }

  scene.speakerOut.setTranslationY(420).setScale(3.5, 3.5, 2);
  scene.speakerIn.setTranslationY(420).setScale(3.5, 3.5, 2);
  scene.video1.setTranslationY(400).setScale(470, 470, 1);
  scene.year2017.setTranslationY(-700).setScale(5, 5, 5);
  scene.video2.setScale(700, 600, 1).setTranslation(-30, -300 , 300);

  buttonsOnLost();

});

scene.on('track', function () {
  trackLost = false;
  showHideAll(false);

  if(playing) {
    speaker.animation(5.3);
  }

  scene.speakerOut.setTranslationY(0).setScale(5, 5, 2);
  scene.speakerIn.setTranslationY(0).setScale(5, 5, 2);
  scene.video1.setTranslationY(0).setScale(650, 650, 1);
  scene.year2017.setTranslationY(-1650).setScale(10, 10, 10);
  scene.video2.setScale(1500, 1122, 1).setTranslation(-30, -850 , 600);

  buttonsOnTrack();
});

function showHideAll(flag) {
  //scene.video1.setHidden(flag);
  //scene.video2.setHidden(flag);
  //scene.speakerOut.setHidden(flag);
  //scene.speakerIn.setHidden(flag);
  //scene.year2017.setHidden(flag);
  scene.drops1.setHidden(flag);
  scene.drops2.setHidden(flag);
  scene.drops3.setHidden(flag);
  // scene.buttonRed.setHidden(flag);
  // scene.buttonBlue.setHidden(flag);
  // scene.buttonGold.setHidden(flag);
  scene.buttonSilver.setHidden(flag);
}

function fadeInAll(duration) {
  scene.video1.fadeIn(duration);
  scene.video2.fadeIn(duration);
  scene.speakerOut.fadeIn(duration);
  scene.speakerIn.fadeIn(duration);
  scene.year2017.fadeIn(duration);
  scene.drops1.fadeIn(duration);
  scene.drops2.fadeIn(duration);
  scene.drops3.fadeIn(duration);
  scene.buttonRed.fadeIn(duration);
  scene.buttonBlue.fadeIn(duration);
  scene.buttonGold.fadeIn(duration);
  scene.buttonSilver.fadeIn(duration);
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

function flyButtons() {
  tranlateButtonX(scene.buttonSilver, 0, 100, 300);
  tranlateButtonX(scene.buttonRed, 0, 300, 300);
  tranlateButtonX(scene.buttonBlue, 0, 500, 300);
  tranlateButtonX(scene.buttonGold, 0, 700, 300, function() {
    startAnimation = false;

    if (trackLost) {
      buttonsOnLost();
    }
  });
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
    buttonShake(scene.buttonRed, 400);
    buttonShake(scene.buttonBlue, 450);
    buttonShake(scene.buttonGold, 500);
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

  scene.category1.setHidden(flag);
  scene.category2.setHidden(flag);
  scene.category3.setHidden(flag);

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
  if(trackLost) {
    speaker.animation(3.65);
  } else {
    speaker.animation(5.3);
  }

  delay2(duration, function() {
    //stopSound();
    trackCounter();
    playSound(music.first[trackNumber][0], music.first[trackNumber][1]);
  });
}

function stopSound() {
  if(typeof soundDelay == 'object') {
    soundDelay.stop();
  }

  scene.stop.setHidden(true);
  scene.play.setHidden(false);
  scene.stopSounds();
  playing = false;
  speaker.animationStop();
}

function backgroundSound(stop) {
  if(stop) {
    scene.stopSound('backgroundSound.mp3');
    //speaker.animationStop();
  } else {
    scene.playSound('backgroundSound.mp3', true, 'backgroundSound', 0.3, 0.3);
    //speaker.animation(5.2);
  }
}

function trackCounter (direction) {
  if(direction == 'left') {
    trackNumber--;
  } else {
    trackNumber++;
  }

  var trackLength = music.first.length;

  if(trackNumber >= (trackLength - 1)) {
    trackNumber = 0;
  }

  if(trackNumber < 0) {
    trackNumber = (trackLength - 1);
  }
}

function randomSound(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomList() {
  var trackListLength = music.first.length;
  do {
    var randomTrack = randomSound(0, trackListLength - 1);
    for(var i = 0; i < randomList.length; i++) {
      randomList.push(randomTrack);
      console.log(randomList);
      if(randomTrack != randomList[i]) break;
    }
  } while(randomList.length < trackListLength);
}

function generateRandomList(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function buttonsOnLost() {
  if (!startAnimation) {
    scene.buttonRed.setTranslation(-360, -510, 0).setScale(4, 4, 4).setRotationZ(26);
    scene.buttonBlue.setTranslation(300, -450, 0).setScale(4, 4, 4).setRotationZ(-26);
    scene.buttonGold.setTranslation(-350, -450, 0).setScale(4, 4, 4).setRotationZ(26);
  }
}

function buttonsOnTrack() {
  if (!startAnimation) {
    scene.buttonRed.setTranslation(0, -1500, 0).setScale(10, 10, 10).setRotationZ(0);
    scene.buttonBlue.setTranslation(0, -1500, 0).setScale(10, 10, 10).setRotationZ(0);
    scene.buttonGold.setTranslation(0, -1500, 0).setScale(10, 10, 10).setRotationZ(0);
  }
}

var music = {
  first: [
    ['1_1_52.mp3', 28000],
    ['1_3_95.mp3', 51000],
    ['1_4_95.mp3', 43000],
    ['1_5_79.mp3', 44000],
    ['1_6_53.mp3', 29000],
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


