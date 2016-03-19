(function() {
  var gameField = document.querySelector('.game-field');
  var menu = document.querySelector('.menu');
  var startButton = document.querySelector('.menu__start');
  var timeYou = document.querySelector('.time-panel__you');
  var timeGunman = document.querySelector('.time-panel__gunman');
  var level = 1,
    timer = 1000,
    time, score, character, fireAllow = false,
    allow = false,
    continueNo;

  startButton.addEventListener('click', startGame);

  function startGame() {
    menu.classList.toggle('menu__show');
    startLevel();
  }

  function startLevel() {
    showLevel(level);
    timeGunman.textContent = (timer / 1000).toFixed(2);
    timeYou.textContent = (0).toFixed(2);
    score = +document.querySelector('.score-panel__score_num').textContent;
    character = new Character(level);
    message = new Message();
    gameField.classList.remove('game-field__kill');
    message.hide();
    character.div.addEventListener('click', fire);
    setTimeout(function() {
      character.move();
      startBattle();
    }, 3000);
  }

  function startBattle() {
    character.stay();
    continueNo = setTimeout(function() {
      character.ready();
      message.show('Fire !');
      fireAllow = true;
      timeCounter(new Date().getTime());
      setTimeout(killYou, timer);
    }, 5000);
  }

  function timeCounter(a) {
    var currTime;
    (function timeCompare() {
      currTime = new Date().getTime();
      if (fireAllow) {
        time = ((currTime - a + 10) / 1000).toFixed(2);
        timeYou.textContent = time;
        setTimeout(timeCompare, 10);
      }
    })();
  }

  function killYou() {
    if (fireAllow) {
      allow = false;
      fireAllow = false;
      character.shoot();
      message.show('you loose !');
      gameField.classList.add('game-field__kill');
      setTimeout(function() {
        message.hide();
        deathSfx.play();
        finishGame('GAME OVER');
      }, 1500);
    }
  }

  function fire() {
    if (allow) {
      allow = false;
      if (fireAllow) {
        shotSfx.play();
        fireAllow = false;
        message.show('you won !');
        character.die();
        scoreCount();
        level++;
        timer -= 200;
        if (level === 6) {
          character.new();
          setTimeout(function() {
            message.hide();
            winSfx.play();
            finishGame('YOU WON !');
          }, 1500);
          return;
        };
        setTimeout(character.new, 2500);
        setTimeout(startLevel, 2510);
      } else {
        message.show('too early !');
        clearTimeout(continueNo);
        foulSfx.play();
        setTimeout(character.new, 1500);
        setTimeout(startLevel, 1510);
      }
    };
  }

  function showLevel(level) {
    setTimeout(function() {
      var showL = document.querySelector('.game-field__level');
      var showOnPanel = document.querySelector('.score-panel__level');
      showL.style.display = 'block';
      showL.textContent = 'level ' + level;
      showOnPanel.textContent = 'level: ' + level;
      document.querySelector('.score-panel__score').style.display = 'block';
      document.querySelector('.score-panel__score_num').textContent = score;
      setTimeout(function() {
        showL.style.display = 'none';
      }, 1500);
    }, 500);
  }

  function scoreCount() {
    var scoreDiv = document.querySelector('.score-panel__score_num');
    var temp = +((+(timer / 1000) * 100 - +(+timeYou.textContent) * 100) * 100 * level).toFixed(0);
    (function count() {
      if (+scoreDiv.textContent - score < temp) {
        scoreDiv.textContent = +scoreDiv.textContent + 100;
        setTimeout(count, 10);
      }
    })();
  }

  function finishGame(text) {
    document.querySelector('.gameover').style.display = 'block';
    document.querySelector('.gameover__reason').textContent = text;
    document.querySelector('.gameover__total-score').textContent = 'Your score: ' + document.querySelector('.score-panel__score_num').textContent;;
  }

  function Character(level) {
    var characterDiv = document.querySelector('.game-field__character');

    this.stay = function() {
      setTimeout(function() {
        stopAnime();
        message.show('ready ?');
        characterDiv.classList.add('skin' + level + '__stay');
        allow = true;
      }, 4000);
    };

    this.ready = function() {
      fireSfx.play();
      stopAnime();
      characterDiv.classList.add('skin' + level + '__ready');
    };

    this.move = function() {
      introSfx.play();
      characterDiv.classList.add('character__move');
      characterDiv.classList.add('skin' + level);
      characterDiv.classList.add('skin' + level + '__walk');
    };

    this.die = function() {
      winSfx.play();
      stopAnime();
      characterDiv.classList.add('skin' + level + '__dead');
      characterDiv.classList.add('skin' + level + '__die');
    };

    this.new = function() {
      stopAnime();
      characterDiv.classList.remove('character__move');
      characterDiv.classList.remove('skin' + level);
    };

    this.shoot = function() {
      shotSfx.play();
      stopAnime();
      characterDiv.classList.add('skin' + level + '__stay');
      characterDiv.classList.add('skin' + level + '__shoot');
    };

    function stopAnime() {
      characterDiv.classList.remove('skin' + level + '__walk');
      characterDiv.classList.remove('skin' + level + '__stay');
      characterDiv.classList.remove('skin' + level + '__ready');
      characterDiv.classList.remove('skin' + level + '__die');
      characterDiv.classList.remove('skin' + level + '__dead');
      characterDiv.classList.remove('skin' + level + '__shoot');
    };

    this.div = characterDiv;
  }

  function Message() {
    var message = document.querySelector('.game-field__message');

    this.show = function(text) {
      message.style.display = 'block';
      message.textContent = text;
    };

    this.hide = function() {
      message.style.display = 'none';
    };
  }

  var introSfx = new Audio('sfx/intro.m4a');
  var fireSfx = new Audio('sfx/fire.m4a');
  var foulSfx = new Audio('sfx/foul.m4a');
  var shotSfx = new Audio('sfx/shot.m4a');
  var winSfx = new Audio('sfx/win.m4a');
  var deathSfx = new Audio('sfx/death.m4a');

})();
