(function () {
  const video = document.getElementById('video-player');
  const overlay = document.querySelector('.play-overlay');

  if (!video || !overlay) {
    return;
  }

  const videoUrl = overlay.dataset.videoUrl;
  let hlsInstance = null;
  let attached = false;

  function attachSource() {
    if (attached || !videoUrl) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(videoUrl);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = videoUrl;
  }

  function playVideo() {
    attachSource();
    overlay.classList.add('is-hidden');

    const promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }
  }

  overlay.addEventListener('click', playVideo);

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0) {
      overlay.classList.remove('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
