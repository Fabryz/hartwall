$(document).ready(function() {

  var video = document.getElementsByTagName('video')[0],
      togglePlay = document.getElementById('play'),
      position = document.getElementById('position'),
      using = document.getElementById('using'),
      ready = false,
      controls = document.getElementById('controls'),
      fullscreen = null;

  addEvent(togglePlay, 'click', function () {
    if (ready) {
      // video.playbackRate = 0.5;
      if (video.paused) {
        if (video.ended) video.currentTime = 0;
        video.play();
        this.value = "pause";
      } else {
        video.pause();
        this.value = "play";
      }
    }
  });

  addEvent(video, 'timeupdate', function () {
    position.innerHTML = asTime(this.currentTime);
  });

  addEvent(video, 'ended', function () {
    togglePlay.value = "play";
  });

  // this used to be canplay, but really it should have been loadedmetadata - sorry folks
  function loadedmetadata() {
    video.muted = true;
    ready = true;
    document.querySelector('#duration').innerHTML = asTime(this.duration);
    using.innerHTML = this.currentSrc;
    // note: .webkitSupportsFullscreen is false while the video is loading, so we bind in to the canplay event
    if (video.webkitSupportsFullscreen) {
      fullscreen = document.createElement('input');
      fullscreen.setAttribute('type', 'button');
      fullscreen.setAttribute('value', 'fullscreen');
      controls.insertBefore(fullscreen, controls.firstChild);
      addEvent(fullscreen, 'click', function () {
        video.webkitEnterFullScreen();
      });
    }
  }

  if (video.readyState > 0) { // metadata is loaded already - fire the event handler manually
    loadedmetadata.call(video);
  } else {
    addEvent(video, 'loadedmetadata', loadedmetadata);
  }

  function asTime(t) {
    t = Math.round(t);
    var s = t % 60;
    var m = Math.round(t / 60);
    
    return two(m) + ':' + two(s);
  }

  function two(s) {
    s += "";
    if (s.length < 2) s = "0" + s;
    return s;
  }

  // addEvent(video, 'webkitTransitionEnd', function () {
  //   alert( "Finished transition!" );
  // });


});