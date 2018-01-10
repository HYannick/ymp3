<template>
  <transition name="fade">
    <form class="youtube__upl" @submit.prevent="onSubmit">
      <div class="preview" :class="{'is-visible': loaded}">
        <img width="100%" :class="{blurry: submitting}" v-show="picture" :src="picture"/>
        <div class="submitting" v-if="submitting">
          <spinner></spinner>
          <div class="progress" :style="{width: `${progress}%`}"></div>
        </div>
      </div>
      <div class="input__container">
        <svg v-show="submitting" class="infos-loading" version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
  <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
  <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z">
    <animateTransform attributeType="xml"
      attributeName="transform"
      type="rotate"
      from="0 20 20"
      to="-360 20 20"
      dur="0.5s"
      repeatCount="indefinite"/>
    </path>
  </svg>
        <input @change="updatePreview" class="yt__url" :disabled="submitting"
               :class="{'has-preview': loaded, 'err-border': err}" type="text" placeholder="Type here . . ."
               v-model="url"/>
        <span v-if="err" class="err-msg">{{err}}</span>
      </div>

      <button class="yt__upload" :class="{active : loaded}" type="submit" :disabled="submitting || !loaded">
        Get my song
      </button>
      <div class="download__wrapper" v-show="downloadLink">
        <p>Download didn't launch? Click here:</p>
        <a ref="dn-link" :download="`${title}.mp3`" :href="downloadLink">Download</a>
      </div>
    </form>
  </transition>
</template>
<script>
  import axios from 'axios'
  import config from '../config'
  import Spinner from './utils/Spinner'

  export default {
    components: {
      Spinner
    },
    data() {
      return {
        picture: '',
        title: '',
        url: '',
        loaded: false,
        submitting: false,
        err: '',
        show: false,
        downloadLink: '',
        api: config.api,
        progress: 0
      }
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      customEmit: function (val) {
        console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
      },
      downloading: function (progress) {
        console.log(progress)
        this.progress = progress;
      }
    },
    updated() {
      const {loaded, picture, title} = this;
      if (!this.loaded) {
        this.updatePreview()
      }
      const obj = {
        loaded,
        picture,
        title
      }
      this.$emit('loaded', obj)
    },
    methods: {
      youtube_parser(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
      },
      updatePreview() {
        this.loaded = false
        if (this.url === '') {
          this.err = ''
        } else if (this.youtube_parser(this.url)) {
          this.submitting = true
          this.err = false
          axios.get(`${this.api}/preview?url=${this.url}`)
            .then(res => {
              this.picture = res.data.img
              this.title = res.data.title
              this.submitting = false
              this.loaded = true
            })
            .catch(error => {
              this.err = 'Failed to get infos'
            })
        } else {
          this.err = 'Please input a valid Youtube Link.'
        }

      },
      onSubmit() {
        console.log('submitting ...')
        this.submitting = true
        this.progress = 0;
        axios({
          method: 'post',
          url: `${this.api}/upload`,
          responseType: 'blob',
          data: {url: this.url}
        })
          .then(res => {
            this.submitting = false
            this.downloadLink = window.URL.createObjectURL(res.data)
            setTimeout(() => {
              this.$refs['dn-link'].click()
            }, 1000)
          })
          .catch(err => {
            this.err = 'Failed to format the video'
          })

      }
    }
  }
</script>
<style lang="scss">
  .err-msg {
    color: red;
    font-size: 10px;
    display: block;
    text-align: center;
    transition: 0.3s;
    padding: 0.5rem 0 0;
  }

  .submitting {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    z-index: 20;
    background: rgba(221, 214, 243, 0.50); /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, rgba(221, 214, 243, 0.50), rgba(250, 172, 168, 0.50)); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, rgba(221, 214, 243, 0.50), rgba(250, 172, 168, 0.50)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    .progress {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 100%;
      transition: 0.3s ease-out;
      background: rgba(255, 0, 0, 0.40);
      z-index: 5;
    }
  }

  .download__wrapper {
    text-align: center;
    margin: 1rem 0;
    font-size: 12px;
    a {
      display: block;
      margin-top: 5px;
      color: crimson;
      font-weight: bold;
    }
  }

  .preview {
    position: relative;
    width: 100%;
    opacity: 0;
    height: 0;
    display: flex;
    align-items: center;
    border-radius: 50px 50px 0 0;
    transition: 0.3s;
    overflow: hidden;
    background-color: white;
    img {
      transition: 0.3s;
      transform: scale(1.1);
      &.blurry {
        opacity: 0.8;
        filter: blur(2px);
      }
    }
    &.is-visible {
      height: 150px;
      opacity: 1;
      img {
        transform: none;
      }
    }
  }

  .youtube__upl {
    width: 100%;
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding: 15px;
    transition: all 0.3s;
    input {
      text-align: center;
      width: 100%;
      padding: 1rem 1.5rem;
      transition: all 0.3s;
      outline: greenyellow;
      border: none;
      border-radius: 30px 30px 50px 50px;
      box-shadow: 0 0 20px 0 rgba(170, 170, 170, 0.50);
      &.err-border {
        box-shadow: 0 0 0 2px #ff0102;
      }
      &.has-preview {
        border-radius: 0 0 50px 50px;
      }
      &:disabled {
        opacity: 0.1;
        background: white;
      }
      font-weight: bold;
      font-size: 16px;
    }
    .input__container {
      position: relative;
      width: 100%;
      .infos-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        path,
        rect {
          fill: red;
          stroke: none;
        }
      }
    }

    .yt__upload {
      margin-top: 1rem;
      background: transparent;
      color: #333;
      padding: 1rem 2rem;
      outline: #333;
      font-size: 18px;
      border-radius: 30px 30px 50px 50px;
      border: none;
      box-shadow: 0 0 20px 0 rgba(170, 170, 170, 0.50);
      transition: 0.3s;
      &.active {
        background: #ff0102;
        color: white;
      }
      &:active {
        box-shadow: 0 0 10px 0 rgba(170, 170, 170, 0.50);
      }
      &:disabled {
        opacity: 0.4;
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