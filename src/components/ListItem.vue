<template>
  <transition name="fade">
    <div ref="result-item" class="result__item">
      <div style="position: relative" @click.once="convertMP3(song.link)">
        <div class="download__status">
          <download-icon v-if="submitting === 'start'"></download-icon>
          <spinner class="spinner" v-else-if="submitting === 'pending'"></spinner>
          <validate v-else></validate>
        </div>
        <div class="result__item-head" :class="{converting: submitting === 'pending', complete: submitting === 'complete'}">
          <img width="100%" :src="song.thumbnails.high.url"/>
          <h3 :class="{complete : submitting === 'complete'}">{{doneTxt || song.title}}</h3>
          <div class="progress" :style="{width: `${progress}%`}"></div>
        </div>
      </div>
      <a class="dl-link" :download="`${song.title}.mp3`" :href="downloadLink"></a>
    </div>
  </transition>
</template>
<script>
  import axios from 'axios'
  import config from '../config'
  import Spinner from './utils/Spinner'
  import DownloadIcon from './utils/DownloadIcon.vue'
  import Validate from './utils/Validate.vue'

  export default {
    components: {
      Spinner,
      DownloadIcon,
      Validate
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      downloading: function (progress) {
        console.log('progress status ->', progress)
        console.log(progress.id === this.song.id)
        if(progress.id === this.song.id) {
          this.progress =  progress.status;
        }
      }
    },
    props: ['song'],
    data() {
      return {
        results: [],
        api: config.api,
        download: config.download,
        downloadLink: '',
        submitting: 'start',
        progress: 0,
        doneTxt: ''
      }
    },
    methods: {
      convertMP3(url) {
        console.log('submitting ...')
        console.log(url)
        this.submitting = 'pending'
        this.progress = 0;
        this.picture = this.song.thumbnails.high.url
        this.title = this.song.title
        this.$emit('onSubmit', {status: this.submitting, id: this.song.id, loaded: true, picture: this.picture, title: this.title})
        axios({
          method: 'post',
          url: `${this.api}/upload`,
          responseType: 'blob',
          data: {url}
        })
          .then(res => {
            this.progress = 0;
            this.submitting = 'complete'
            this.$emit('onSubmit', {status: this.submitting, id: this.song.id, loaded: false, picture: this.picture, title: 'Type some other titles (─‿─)'})
            this.downloadLink = window.URL.createObjectURL(res.data)
            console.log(this.downloadLink)
            this.doneTxt = 'Converted !'
            setTimeout(() => {
              console.log('downloading ...')
              console.log(this.$refs['result-item'])
              this.$refs['result-item'].querySelector('.dl-link').click()
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
  .download__status {
    background: transparent;
    border: none;
    width: 100%;
    font-size: 16px;
    padding: 0 1.5rem;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 5px;
    z-index: 5;
    svg {
      width: 35px;
      height: 35px;
      circle {
        stroke: white
      }
    }
  }

  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 100%;
    transition: 0.3s ease-out;
    background: rgba(255, 0, 0, 0.40);
    z-index: 1;
  }
  .result__item-head {
    position: relative;
    overflow: hidden;
    height: 150px;
    display: flex;
    align-items: center;
    background: rgba(221, 214, 243, 0.50); /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, rgba(221, 214, 243, 0.50), rgba(250, 172, 168, 0.50)); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, rgba(221, 214, 243, 0.50), rgba(250, 172, 168, 0.50)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    &.converting, &.complete {
      img {
        filter: blur(5px);
      }
    }
    &.complete {
      background: #11998e;  /* fallback for old browsers */
      background: -webkit-linear-gradient(to right, #38ef7d, #11998e);  /* Chrome 10-25, Safari 5.1-6 */
      background: linear-gradient(to right, #38ef7d, #11998e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    h3 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 5;
      text-align: center;
      width: 90%;
      color: #333;
      box-shadow: 0 0 30px 5px rgba(170, 170, 170, 0.5);
      background: rgba(255, 255, 255, 0.43);
      border-radius: 30px 30px 50px 50px;
      padding: 1rem;
      &.complete {
        color: #fff;
      }
    }
    img {
      transition: 0.3s;
      opacity: 0.5;
    }
  }

  .result__item {
    flex: 0 1 auto;
    margin: 0 1rem 3rem;
    width: 25%;
    @media screen and (max-width: 768px) {
      width: 45%;
    }
    @media screen and (max-width: 600px) {
      width: 100%;
    }
    box-shadow: 0 0 30px 5px rgba(170, 170, 170, 0.5);
    display: flex;
    overflow: hidden;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 40px;
    transition: 0.3s;
  }
</style>