(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("videoPlayer");
    const overlay = document.getElementById("playerOverlay");
    const playButton = document.getElementById("playButton");
    const url = typeof playUrl === "string" ? playUrl : "";
    let prepared = false;

    if (!video || !overlay || !url) return;

    function prepare() {
      if (prepared) return;
      prepared = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({ enableWorker: true });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function begin() {
      prepare();
      overlay.classList.add("is-hidden");
      const request = video.play();
      if (request && typeof request.catch === "function") {
        request.catch(function () {});
      }
    }

    overlay.addEventListener("click", begin);
    if (playButton) playButton.addEventListener("click", begin);
    video.addEventListener("click", function () {
      if (video.paused) begin();
    });
  });
})();
