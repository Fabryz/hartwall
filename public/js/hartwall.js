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
    $('#fullscreen').on('click', function() {
      console.log("Going fullscreen");

      goFullscreen('wrapper');
    });

    $('#trigger').on('click', function() {
      socket.emit('trigger');
    });
  }

  /*
  * Main
  */

  var socket = new io.connect(window.location.href);
  
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

    $('#player1').toggleClass('fade').toggleClass('out');

    $('#player2').toggleClass('fade').toggleClass('in');
  });

});