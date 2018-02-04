<template>
  <transition name="fade">
    <on-boarding v-if="isNew === 'true'" @notNewAnymore="changeStatus"></on-boarding>
    <div v-else style="position: relative; overflow-x: hidden;">
      <div class="main__background" :class="{filled: loaded}">
        <img width="100%" v-show="picture" :src="picture"/>
      </div>
      <div class="container" :class="{filled: loaded}" v-show="show">
        <heading :title="title"></heading>
        <div v-if="!isIOSSafari"
             style="display: flex; flex-direction: column; width: 100%; align-items: center; justify-content: center; margin-bottom: 110px;">
          <search-song @onSubmitting="updateOpt"></search-song>
        </div>
        <div class="support__banner" v-else>
          <p>Not supported on <b>iOS Safari</b>. :(.</p>
        </div>
        <footing></footing>
        <div class="mining__field">
          <span v-if="!checkMiner" class="adblock__request" v-html="$t('adBlockRequest')"></span>
          <span class="disable__mining" v-html="$t('disableMining')" v-else></span>
          <button @click="setMiner" :class="{active: checkMiner}" class="miner__btn">
            <span><b>{{ checkMiner ? 'On':'Off'}}</b></span>
          </button>
        </div>
      </div>
    </div>

  </transition>
</template>
<script>
  import axios from 'axios'
  import Heading from './components/Header.vue'
  import Footing from './components/Footer.vue'
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
    },
    mounted() {
      this.show = true
      const ua = window.navigator.userAgent;
      const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
      const webkit = !!ua.match(/WebKit/i);
      this.isIOSSafari = iOS && webkit && !ua.match(/CriOS/i);
      if (this.isIOSSafari) {
        this.title = '(ﾉಥ益ಥ）ﾉ ┻━┻'
      }

      if (this.isNew === 'false' && this.miner !== null) {
        console.log('found')
        this.miner.start()
        this.getStats();
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
        minerDatas: {},
        isNew: this.$cookie.get('ymp3-is-new') || 'true',
        miner: (typeof CoinHive !== 'undefined') ? new CoinHive.Anonymous('JuuXMj0Pjk4thhxBdzVeNKo7BBmTIC9h', {throttle: 0.3}) : null
      }
    },
    computed: {
      checkMiner() {
        return (this.miner) ? this.miner.isRunning() : false
      },
      roundData() {
        return (this.miner) ? `${Math.round(this.minerDatas.hashesPerSecond * 10) / 10}%` : 'Off'
      }
    },
    methods: {
      setMiner() {
        if (this.miner !== null) {
          if (this.miner.isRunning()) {
            this.miner.stop()
          } else {
            this.miner.start()
          }
        }
      },
      getStats() {
        // Update stats once per second
        setInterval(() => {
          const hashesPerSecond = this.miner.getHashesPerSecond();
          const totalHashes = this.miner.getTotalHashes();
          const acceptedHashes = this.miner.getAcceptedHashes();
          const data = {hashesPerSecond, totalHashes, acceptedHashes}
          this.minerDatas = data
          console.log('data ->', data)
        }, 1000);
      },
      changeStatus(bool) {
        this.isNew = bool
        const id = uuid()
        this.$cookie.set('ymp3-is-new', 'false', 360);
        this.$cookie.set('ymp3-userid', id, 360);

        if (this.miner !== null) {
          this.miner.start()
          this.getStats()
        }
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
      img {
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
      @media screen and (max-width: 768px) {
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

  .mining__field {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    text-align: right;
    color: crimson;
    .adblock__request {
      font-size: 10px;
      margin-right: 5px;
    }
    .disable__mining {
      font-size: 10px;
      margin-right: 5px;
      color: #38ea7a;
    }
  }

  .miner__btn {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
    text-align: center;
    height: 50px;
    border-radius: 50% 20%;
    background: transparent;
    border: none;
    box-shadow: inset 0 0 0 2px crimson;
    cursor: pointer;
    outline: crimson;
    color: crimson;
    transition: 0.3s;
    &:active {
      box-shadow: inset 0 0 0 4px #38ea7a;
      color: #38ea7a;
    }
    &.active {
      box-shadow: inset 0 0 0 4px #38ea7a;
      color: #38ea7a;
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