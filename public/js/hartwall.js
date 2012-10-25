$(document).ready(function() {
  var Debug = {

    log: function (msg) {
      console.log(new Date().toJSON() +": "+ msg);
    },

    toggle: function(speed) {
      speed = speed || 'fast';
      defaultDebug.slideToggle(speed);
    }
  };

  function goFullscreen(id) {
    var element = document.getElementById(id);

    if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }

  function init() {
    document.getElementById('player1').muted = false;

    $('#fullscreen').on('click', function() {
      console.log("Going fullscreen");

      goFullscreen('wrapper');
    });

    $('#trigger').on('click', function() {
      socket.emit('trigger');
    });

    $('#player2').on('ended', function() {
      socket.emit('eventVideoEnded');
    });
  }

  /*
  * Main
  */

  var socket = new io.connect(window.location.href),
      playingEventVideo = false;
  
  init();

  /*
  * Socket stuff
  */

  function strdecode(data) {
    return JSON.parse(decodeURIComponent(escape(data)));
  }

  socket.on('connect', function() {
    Debug.log("Connected.");
  });
      
  socket.on('disconnect', function() {
    Debug.log("Disconnected.");
  });
    
  socket.on('tot', function(data) {
    Debug.log("Current viewers: "+ data.tot);
  });

  socket.on('trigger', function(data) {
    Debug.log("Trigger event arrived.");

    $('#player1').toggleClass('fadeout');
    $('#player2').toggleClass('fadein');

    document.getElementById('player1').pause();
    // document.getElementById('player1').volume = 0;

    playingEventVideo = true;
    socket.emit('playingEventVideo', true);

    document.getElementById('player2').currentTime = 0;
    document.getElementById('player2').play();
    // document.getElementById('player2').volume = 1;
  });

  socket.on('restore', function(data) {
    Debug.log("Restore event arrived.");

    $('#player1').toggleClass('fadein');
    $('#player2').toggleClass('fadeout');

    document.getElementById('player1').currentTime = 0;
    document.getElementById('player1').play();
    // document.getElementById('player1').volume = 1;

    playingEventVideo = false;
    socket.emit('playingEventVideo', false);

    document.getElementById('player2').pause();
    document.getElementById('player2').currentTime = 0;
    // document.getElementById('player2').volume = 0;
  });

});