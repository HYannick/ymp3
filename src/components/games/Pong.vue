<template>
  <transition name="fade">
  <div class="pong__game">
    <div class="dl__status" :style="{ width: `${percent}%`}"></div>
    <img id="paddle" style="display: none" src="/static/paddle.png"/>
    <p v-if="!launch" class="instructions"><span>Get the Highest score each time you download a song ^o^/</span><br><br>Tap to start!</p>
    <p v-else class="score"><span>Score</span><br>{{score}}</p>
    <p class="highest">Highest score<br><br><b>{{highestScore}}</b>pts</p>
    <canvas ref="pong" moz-opaque class="canvas"></canvas>
  </div>
  </transition>
</template>
<script>
  export default {
    props: ['percent'],
    data() {
      return {
        score: 0,
        highestScore: this.$cookie.get('ymp3-game-highest-score') || 0,
        rightPressed: false,
        leftPressed: false,
        launch: false
      }
    },
    methods: {},
    mounted() {
      const canvas = this.$refs['pong'];
      const ctx = canvas.getContext("2d");

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      let x = canvas.width / 2;
      let y = canvas.height - 30;

      let speed = 5;
      let dx = .8;
      let dy = 5.5;

      const ballRadius = 10;
      const paddleHeight = 20;
      const paddleWidth = 100;

      let paddleX = (canvas.width - paddleWidth) / 2;

      const drawPaddle = () => {
        const img = document.getElementById("paddle")
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
        ctx.fillStyle = 'transparent'
        ctx.fillStyle = ctx.drawImage(img, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fill();
        ctx.closePath();
      }

      const drawBall = () => {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FC3A51';
        ctx.fill();
        ctx.closePath();
      };


      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        if (this.launch) {
          x += dx;
          y += dy;
        } else {
          x = paddleX + paddleWidth / 2
        }

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
          dx *= -1;
        }

        if (y + dy < ballRadius) {
          dy *= -1;
        } else if (y + dy > canvas.height - ballRadius - 5) {
          if (x > paddleX && x < paddleX + paddleWidth) {
            console.log('Go for it')
            let centerOfPaddleX = paddleX + paddleWidth / 2;
            let ballDistFromPaddleCenterX = x - centerOfPaddleX;
            dx = ballDistFromPaddleCenterX * 0.15;
            this.score += 25
            dy = -dy - 1;
          }
          else {
            if (this.highestScore < this.score) {
              this.highestScore = this.score;
              this.$cookie.set('ymp3-game-highest-score',  this.highestScore, 360)
            }
            this.score = 0;
            this.launch = false;
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = speed;
            dy = -speed;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
        requestAnimationFrame(draw);
      }


      canvas.addEventListener("touchmove", moveHandler, false);
      canvas.addEventListener("mousemove", moveHandler, false);

      canvas.addEventListener("click", () => this.launch = true, false);

      function moveHandler(e) {
        let touch = e;
        if (e.type === 'touchmove') {
          touch = e.touches[0];
        }
        let relativeX = touch.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
          paddleX = relativeX - paddleWidth / 2;
        }
      }

      draw()

    }
  }
</script>
<style lang="scss">
  .pong__game {
    position: fixed;
    background: white;
    top: 0;
    left: 0;
    z-index: 999;
    .dl__status {
      position: absolute;
      top: 0;
      left:0;
      opacity: 0.8;
      height: 10px;
      background: #ee0979;  /* fallback for old browsers */
      background: -webkit-linear-gradient(to right, #ff6a00, #ee0979);  /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(to right, #ff6a00, #ee0979); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
      transition: all 0.3s;
    }
    .highest {
      position: absolute;
      width: 100%;
      display: block;
      top: 20px;
      text-align: center;
    }
    .score, .instructions{
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 70px;
      font-weight: bold;
      text-align: center;
      opacity: 0.2;
      span {
        font-size: 12px;
      }
    }
    .instructions {
      width: 100%;
      font-size: 36px;
      padding: 0 15px;
      opacity: 0.5;
      span {
        font-size: 20px;
      }
    }
  }
</style>