<template>
  <transition name="fade">
    <div>
      <flickity class="carousel-wrapper" ref="flickity" :options="flickityOptions">
        <div v-for="(board, i) in boards" :key="i" class="carousel-cell">
          <div class="carousel-content" :style="{alignSelf: (board.video) ? 'flex-start' : ''}">
            <div v-if="board.video" class="video__container">
              <img src="@/assets/smartphone.png" width="100%"/>
              <video v-if="i === 1 || i === 5" ref="videoRef" loop autoplay>
                <source :src="board.video" type="video/mp4">
                <source :src="board.video" type="video/webm">
              </video>
              <img class="gif" :src="board.video" v-else-if="i === 2"/>
            </div>
            <logo style="width: 50%; margin-bottom: 0" v-if="i === 0"></logo>
            <img style="width: 90%; margin-bottom: 4rem" v-if="board.picture" :src="board.picture"/>
            <h1 v-html="board.title"></h1>
            <br>
            <p v-html="board.desc"></p>
            <button class="agreed" v-if="i === boards.length-1" @click="$emit('notNewAnymore', false)">
              {{ $t('understood') }}
            </button>
          </div>
        </div>
      </flickity>

      <!-- if you don't want to use the buttons Flickity provides -->
      <button class="nav nav-prev" @click="previous()" ref="prev-btn"><img src="/static/002-left-arrow.svg"/></button>
      <button class="nav nav-next" @click="next()" ref="next-btn"><img src="/static/001-right-arrow.svg"/></button>
    </div>
  </transition>
</template>
<script>
  import Flickity from 'vue-flickity';
  import Logo from './utils/Logo.vue'
  import config from '../config';

  export default {
    components: {
      Flickity,
      Logo
    },
    mounted() {
      this.$refs['prev-btn'].setAttribute('disabled', true)
      this.$refs.flickity.on('dragEnd', () => {
        const currentIndex = this.$refs.flickity.selectedIndex()
        this.setVideo(currentIndex)
        if (currentIndex + 1 === this.boards.length) {
          this.$refs['prev-btn'].removeAttribute('disabled')
          this.$refs['next-btn'].setAttribute('disabled', true)
        } else {
          this.$refs['next-btn'].removeAttribute('disabled')
        }
        if (currentIndex === 0) {
          this.$refs['next-btn'].removeAttribute('disabled')
          this.$refs['prev-btn'].setAttribute('disabled', true)
        } else {
          this.$refs['prev-btn'].removeAttribute('disabled')
        }
      })
    },
    data() {
      return {
        flickityOptions: {
          initialIndex: 0,
          prevNextButtons: false,
          pageDots: true,
          // any options from Flickity can be used
        },
        smartphone: config.smartphone,
        boards: [
          {
            picture: '/static/shy.svg',
            title: this.$i18n.i18next.t('board_0_title'),
            desc: this.$i18n.i18next.t('board_0_desc')
          },
          {
            title: this.$i18n.i18next.t('board_1_title'),
            video: '/static/board_2.mp4',
            desc: this.$i18n.i18next.t('board_1_desc')
          },
          {
            title: this.$i18n.i18next.t('board_2_title'),
            video: '/static/board_2.gif',
            desc: this.$i18n.i18next.t('board_2_desc')
          },
          {
            picture: '/static/shy.svg',
            title: this.$i18n.i18next.t('board_3_title'),
            desc: this.$i18n.i18next.t('board_3_desc')
          },
          {
            picture: '/static/yeah.svg',
            title: this.$i18n.i18next.t('board_4_title'),
            desc: this.$i18n.i18next.t('board_4_desc')
          },
          {
            video: '/static/board_3.mp4',
            title: this.$i18n.i18next.t('board_5_title'),
            desc: this.$i18n.i18next.t('board_5_desc')
          },
          {
            title: this.$i18n.i18next.t('board_6_title'),
            desc: this.$i18n.i18next.t('board_6_desc')
          }
        ]
      }
    },
    methods: {
      stopVideo(video) {
        video.pause()
        video.currentTime = 0
      },
      setVideo(currentIndex) {
        console.log(currentIndex)
        if (currentIndex === 1) {
          this.$refs['videoRef'][0].play()
        } else if (currentIndex === 5) {
          this.$refs['videoRef'][1].play()
        } else {
          this.$refs['videoRef'].forEach(video => this.stopVideo(video))
        }
      },
      next() {
        const currentIndex = this.$refs.flickity.selectedIndex()
        this.$refs['prev-btn'].removeAttribute('disabled')
        this.$refs.flickity.next();
        this.setVideo(currentIndex + 1)
        if (currentIndex + 1 === this.boards.length) {
          this.$refs['next-btn'].setAttribute('disabled', true)
        }
      },

      previous() {
        this.$refs.flickity.previous();
        const currentIndex = this.$refs.flickity.selectedIndex()
        this.setVideo(currentIndex)
        this.$refs['next-btn'].removeAttribute('disabled')
        if (currentIndex === 0) {
          this.$refs['prev-btn'].setAttribute('disabled', true)
        }
      }
    }
  }
</script>
<style lang="scss">
  .carousel-cell {
    width: 100%;
    height: 100vh;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 15rem;
      margin-bottom: 2rem;
    }
    .carousel-content {
      max-width: 450px;
      width: 100%;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .video__container {
      width: 30vh;
      position: relative;
      margin-bottom: 1rem;
      background: #eff1f3;
      border-radius: 15px;
      img {
        position: relative;
        z-index: 1;
      }
      video, img.gif {
        width: 94%;
        margin-bottom: 2rem;
        position: absolute;
        top: 37px;
        left: 8px;
        z-index: 0;
      }
    }

  }

  .nav {
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    width: 30px;
    border: none;
    outline: red;
    transition: 0.3s;
    overflow: hidden;
    background: crimson;
    img {
      transition: transform 0.3s;
    }
    &:disabled {
      opacity: 0.3;
    }
  }

  .nav-prev {
    left: 0;
    padding: 30px 5px 30px 0;
    border-radius: 0 20px 20px 0;
    &:active {
      img {
        transform: translateX(-4px);
      }
    }
  }

  .nav-next {
    right: 0;
    padding: 30px 0 30px 5px;
    border-radius: 20px 0 0 20px;
    &:active {
      img {
        transform: translateX(4px);
      }
    }
  }

  .carousel-wrapper {
    overflow: hidden;
    height: 100vh;
    border-top: 15px solid crimson;
    border-bottom: 15px solid crimson;
  }

  .agreed {
    margin-top: 2rem;
    border-radius: 30px 30px 50px 50px;
    border: none;
    font-size: 16px;
    padding: 5px 15px;
    background: #38ef7d;
    color: white;
    box-shadow: 0 0 20px 0 rgba(56, 239, 125, 0.5);
  }
</style>