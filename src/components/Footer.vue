<template>
  <div class="footer">
    <p class="copyright">{{$t("made")}} <a href="https://github.com/HYannick" target="_blank" style="color: crimson">Ayho</a></p>
    <p class="help">{{$t("help")}}<br>
      <a href="https://github.com/fent/node-ytdl-core" target="_blank" style="color: crimson">ytdl</a> &
      <a href="https://github.com/fluent-ffmpeg/node-fluent-ffmpeg" target="_blank" style="color: crimson">fluent-ffmpeg</a>
    </p>
  </div>
</template>

<style lang="scss" scoped>
  .footer {
    width: 100%;
    padding: 15px;
    position: absolute;
    bottom: 0;
    text-align: center;
    transition: all 0.3s;
    &:after {
      content: '';
      width: 20px;
      border-radius: 50px 50px 0 0;
      position: absolute;
      background: #ff0100;
      bottom: 0;
      height: 0;
      left: 50%;
      z-index: -1;
      transform: translateX(-50%);
      transition: all 0.3s;
    }
    .copyright {
      bottom: 50%;
      left: 0;
      //transform: translateY(-50%) rotate(-90deg);
      font-size: 10px;
      opacity: 0.5;
    }

    .help {
      right: 0;
      bottom: 50%;
      //transform: translateY(-50%) rotate(90deg);
      font-size: 10px;
      opacity: 0.5;
    }

  }
</style>