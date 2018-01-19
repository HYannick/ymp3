<template>
  <transition name="fade">
    <div>
      <flickity class="carousel-wrapper" ref="flickity" :options="flickityOptions">
        <div v-for="(board, i) in boards" :key="i" class="carousel-cell">
          <div class="carousel-content" :style="{alignSelf: (board.video) ? 'flex-start' : ''}">
            <div v-if="board.video" class="video__container">
              <img src="@/assets/smartphone.png" width="100%"/>
              <video v-if="i === 1" ref="videoRef" loop autoplay>
                <source :src="board.video" type="video/mp4">
              </video>
              <img class="gif" :src="board.video"  v-else/>
            </div>
            <h2>{{board.title}}</h2>
            <br>
            <p v-html="board.desc"></p>
            <button class="agreed" v-if="i === boards.length-1" @click="$emit('notNewAnymore', false)">J'ai compris
            </button>
          </div>
        </div>
      </flickity>

      <!-- if you don't want to use the buttons Flickity provides -->
      <div class="nav-btns">
        <button @click="previous()" ref="prev-btn">Prev</button>
        <button @click="next()" ref="next-btn">Next</button>
      </div>
    </div>
  </transition>
</template>
<script>
  import Flickity from 'vue-flickity';
  import config from '../config';
  export default {
    components: {
      Flickity
    },
    mounted() {
      this.$refs['prev-btn'].setAttribute('disabled', true)
      this.$refs.flickity.on('dragEnd', () => {
        const currentIndex = this.$refs.flickity.selectedIndex()
        this.setVideo(currentIndex)
        if(currentIndex + 1 === this.boards.length) {
          this.$refs['prev-btn'].removeAttribute('disabled')
          this.$refs['next-btn'].setAttribute('disabled', true)
        } else {
          this.$refs['next-btn'].removeAttribute('disabled')
        }
        if(currentIndex === 0) {
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
          prevNextButtons: true,
          pageDots: true,
          // any options from Flickity can be used
        },
        smartphone: config.smartphone,
        boards: [
          {
            title: 'Bienvenue !',
            desc: 'Je suis Ymp3 et je vais te permettre de convertir tes vidéos YouTube en fichier audio.'
          },
          {
            title: 'EasyPeasy',
            video: '/static/board_2.mp4',
            desc: 'Tu aimes une musique ? Aide-toi de ma barre de recherche et tu l\'auras :). Le tout sans pub !<br>Mais ce n\'est pas tout.'
          },
          {
            title: 'Multi-support',
            video: '/static/board_2.gif',
            desc: 'Tu peux utiliser mes services sur ton ordinateur, mais aussi sur ton smartphone.<br>Pour cela, il te suffira de m\'ajouter à ton écran d\'accueil !'
          },
          {
            desc: 'Comme toute application, j\'ai besoin de vivre.<br>Certaines appli se servent des publicités. Mais ce n\'est pas mon cas.<br>'
          },
          {
            title: 'Le principe est simple et gratuit !',
            desc: 'Il suffit d\'activer un script qui me permettra de transformer le temps que tu passes à m\'utiliser, en monnaie. cet argent me permettra de financer les serveurs que j\'utilise pour mon bon fonctionnement !<br><br> <b style="color: red;">Important</b>: Je ne récolte <b>aucune</b> donnée personnelle, et tu n\'as strictement rien à payer.'
          },
          {
            title: 'Une dernière petite chose...',
            desc: 'Toutes les musiques appartiennent à de très talentueux artistes. Cela leur demande du temps et de l\'argent pour nous faire rêver avec leur musique. N\'hésite pas à les soutenir en achetant leurs albums, Ou simplement en likant leur titre<br><br><br><br><span style="font-size: 10px">Si un artiste passe par là et ne veux pas voir ses musiques dans la liste de résultat, merci de m\'envoyer un email (ayho.nine@gmail.com) avec le nom et le lien YouTube de la musique.</span>'
          }
        ]
      }
    },
    methods: {
      stopVideo(video) {
        video.pause()
        video.currentTime = 0
      },
      setVideo (currentIndex) {
        console.log(currentIndex)
        if(currentIndex === 1) {
          this.$refs['videoRef'][0].play()
        } else {
          this.$refs['videoRef'].forEach(video =>  this.stopVideo(video))
        }
      },
      next() {
        const currentIndex = this.$refs.flickity.selectedIndex()
        this.$refs['prev-btn'].removeAttribute('disabled')
        this.$refs.flickity.next();
        this.setVideo(currentIndex + 1)
        if(currentIndex + 1 === this.boards.length) {
          this.$refs['next-btn'].setAttribute('disabled', true)
        }
      },

      previous() {
        this.$refs.flickity.previous();
        const currentIndex = this.$refs.flickity.selectedIndex()
        this.setVideo(currentIndex)
        this.$refs['next-btn'].removeAttribute('disabled')
        if(currentIndex === 0) {
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
    .carousel-content {
      max-width: 450px;
      width: 100%;
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .video__container {
      width: 200px;
      position: relative;
      margin-bottom: 1rem;
      video, img.gif {
        width: 94%;
        margin-bottom: 2rem;
        position: absolute;
        top: 37px;
        left: 8px;
        z-index: -1;
      }
    }

  }

  .nav-btns {
    position: fixed;
    z-index: 1;
    bottom: 15px;
    left: 0;
    width: 100%;
    button {
      font-size: 16px;
      border:none;
      background: transparent;
      outline: red;
      position: relative;
      transition: 0.3s;
      &:disabled {
        opacity: 0.3;
      }
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: red;
        border-radius: 50px;
        width: 10px;
        height: 4px;
        transition: 0.3s;
      }
    }
    button:first-child {
      float: left;
      &:active {
        &:after{
          left: -2px;
        }
      }
      &:after {
        left: -5px;
      }
    }
    button:last-child {
      float: right;
      &:active {
        &:after{
          right: -2px;
        }
      }
      &:after {
        right: -5px;
      }
    }
  }

  .carousel-wrapper {
    overflow: hidden;
    height: 100vh;
    border-top: 15px solid red;
    border-bottom: 15px solid red;
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