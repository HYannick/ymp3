<template>
  <transition name="fade">
    <on-boarding v-if="isNew === 'true'" @notNewAnymore="changeStatus"></on-boarding>
    <div v-else style="position: relative; overflow-x: hidden;">
      <div class="main__background" :class="{filled: loaded}">
        <img width="100%" v-show="picture" :src="picture"/>
      </div>
      <div class="container" :class="{filled: loaded}" v-show="show">
        <heading :title="title"></heading>
        <!--<pong-game></pong-game>-->
        <div v-if="!isIOSSafari" style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center">
          <search-song @onSubmitting="updateOpt"></search-song>
        </div>
        <div class="support__banner" v-else>
          <p>Not supported on <b>iOS Safari</b>. :(.</p>
        </div>
        <footing></footing>
      </div>
    </div>

  </transition>
</template>
<script>
  import axios from 'axios'
  import Heading from './components/Header.vue'
  import Footing from './components/Footer.vue'
  import PongGame from './components/games/Pong.vue'
  import OnBoarding from './components/OnBoarding.vue'
  import SearchSong from './components/SearchSongs.vue'
  import Spinner from './components/utils/Spinner.vue'
  import config from './config'
  import uuid from 'uuid/v4'
  export default {
    components: {
      Spinner,
      Heading,
      Footing,
      SearchSong,
      OnBoarding,
      PongGame
    },
    mounted() {
      console.log('new ?',this.isNew)
      this.show = true
      const ua = window.navigator.userAgent;
      const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
      const webkit = !!ua.match(/WebKit/i);
      this.isIOSSafari = iOS && webkit && !ua.match(/CriOS/i);
      if(this.isIOSSafari) {
        this.title = '(ﾉಥ益ಥ）ﾉ ┻━┻'
      }
    },
    data() {
      return {
        lang: 'fr',
        show: false,
        loaded: false,
        picture: '',
        title: '',
        isIOSSafari: false,
        isNew: this.$cookie.get('ymp3-is-new') || 'true'
      }
    },
    methods: {
      changeStatus(bool) {
        this.isNew = bool
        const id = uuid()
        this.$cookie.set('ymp3-is-new', 'false', 360);
        this.$cookie.set('ymp3-userid', id, 360);
      },
      updateOpt(data) {
        console.log(data)
        const {loaded, picture, title} = data;
        this.loaded = loaded;
        this.picture = picture;
        this.title = title;
      }
    }
  }
</script>
<style lang="scss">
  .support__banner {
    text-align: center;
    flex: 1;
    .logos {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      img{
        margin: 0 10px;
      }
    }
  }
  .main__background {
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    z-index: -1;
    overflow: hidden;
    transition: 0.3s;
    transform: scale(1.1);
    opacity: 0;
    &.filled {
      transform: none;
      opacity: 1;
    }
    img {
      width: 100%;
      opacity: 0.3;
      transform: scale(1.5);
      @media screen and (min-width: 768px) {
        filter: blur(1px);
      }
      transition: 0.3s;
      @media screen and  (max-width: 768px) {
        transform: scale(3.5);
      }
    }
  }

  .container {
    min-height: 100vh;
    margin: 0 auto;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    &.filled {
      .header {
        &:before {
          height: 10%;
        }
      }
      .footer {
        &:after {
          height: 15%;
        }
      }

    }
  }

  //transition
  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
    transform: translateY(-5px);
  }
</style>