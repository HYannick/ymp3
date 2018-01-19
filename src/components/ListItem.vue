<template>
  <transition name="fade">
    <div ref="result-item" class="result__item">
      <div style="position: relative" @click.once="convertMP3">
        <div class="message__box" v-if="err || successText">
          <p class="err__text" v-if="err">{{err}}</p>
          <p class="success__text" v-else>{{successText}}</p>
        </div>
        <div class="download__status">
          <download-icon v-if="submitting === 'start'"></download-icon>
          <spinner class="spinner" v-else-if="submitting === 'pending'"></spinner>
          <error-icon v-else-if="submitting === 'error'"></error-icon>
          <validate-icon v-else></validate-icon>
        </div>
        <div class="result__item-head"
             :class="{converting: submitting === 'pending', complete: submitting === 'complete'}">
          <img width="100%" :src="song.thumbnails.high.url"/>
          <h3 v-html="doneTxt || status || song.title" :class="{complete : submitting === 'complete'}"></h3>
          <div class="progress" :style="{opacity: 0.6, width: `${progress}%`, backgroundColor: progressColor}"></div>
        </div>
      </div>
      <a class="dl-link" :download="`${song.title}.mp3`" :href="downloadLink"></a>
      <span v-show="successText" class="more__info">{{$t("moreInfo")}}</span>
    </div>
  </transition>
</template>
<script>
  import axios from 'axios'
  import config from '../config'
  import Spinner from './utils/Spinner'
  import DownloadIcon from './utils/DownloadIcon.vue'
  import ValidateIcon from './utils/Validate.vue'
  import ErrorIcon from './utils/Error.vue'

  export default {
    components: {
      Spinner,
      DownloadIcon,
      ValidateIcon,
      ErrorIcon
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      downloading: function (progress) {
        console.log('Conversion status ->', progress)
        if (progress.id === this.song.id) {
          this.progress = progress.status;
          if (progress.status >= 0 && progress.status < 25) {
            this.status = this.$i18n.i18next.t('status_0')
            this.progressColor = '#F51441'
          } else if (progress.status >= 30 && progress.status < 50) {
            this.status = this.$i18n.i18next.t('status_25')
            this.progressColor = '#AA00FF'
          } else if (progress.status >= 50 && progress.status < 75) {
            this.status = this.$i18n.i18next.t('status_50')
            this.progressColor = '#FF00AA'
          } else if (progress.status >= 75) {
            this.status = this.$i18n.i18next.t('status_75')
            this.progressColor = '#38ef7d'
          }
        }
      },
      sendFileError: function (err) {
        if (err.id === this.song.id) {
          console.log(err)
          this.progress = 0;
          this.submitting = 'error'
          this.$emit('onSubmit', {
            status: this.submitting,
            id: this.song.id,
            loaded: false,
            picture: this.picture,
            title: this.$i18n.i18next.t('retry')
          })
          this.err = this.$i18n.i18next.t('failed')
        }
      },
      sendFile: function (data) {
        console.log('success -> downloading')
        if (data.id === this.song.id) {
          this.progress = 0;
          const blob = new Blob([new Uint8Array(data.blob)]);
          this.progress = 0;
          this.submitting = 'complete'
          this.$emit('onSubmit', {
            status: this.submitting,
            id: this.song.id,
            loaded: false,
            picture: this.picture,
            title: this.$i18n.i18next.t('typeother')
          })
          this.downloadLink = window.URL.createObjectURL(blob)
          console.log(this.downloadLink)
          this.doneTxt = this.$i18n.i18next.t('converted');
          this.successText = this.$i18n.i18next.t('like');
          setTimeout(() => {
            console.log('downloading ...')
            console.log(this.$refs['result-item'])
            this.$refs['result-item'].querySelector('.dl-link').click()
          }, 1000)
        }
      }
    },
    props: ['song'],
    data() {
      return {
        progressColor: '',
        results: [],
        api: config.api,
        download: config.download,
        downloadLink: '',
        isConverting: false,
        submitting: 'start',
        progress: 0,
        doneTxt: '',
        err: '',
        status: '',
        successText: ''
      }
    },
    methods: {
      convertMP3() {
        console.log('submitting ...')
        this.submitting = 'pending'
        this.progress = 0;
        this.picture = this.song.thumbnails.high.url
        this.title = this.song.title
        this.$emit('onSubmit', {
          status: this.submitting,
          id: this.song.id,
          loaded: true,
          picture: this.picture,
          title: this.title
        })
        axios({
          method: 'post',
          url: `${this.api}/upload`,
          responseType: 'blob',
          data: {
            id: this.song.id,
            url: this.song.link,
            title: this.song.title.replace(new RegExp('/', 'g'), '-')
          }
        })
          .then(res => {
            console.log(res.data)
          })
          .catch(err => {
            console.log(err)
            this.progress = 0;
            this.submitting = 'error'
            this.$emit('onSubmit', {
              status: this.submitting,
              id: this.song.id,
              loaded: false,
              picture: this.picture,
              title: this.$i18n.i18next.t('retry')
            })
            this.err = this.$i18n.i18next.t('failed')
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

  .message__box {
    background: rgba(0, 0, 0, 0.5);
    /*box-shadow: 0 0 15px 10px rgba(255, 255, 255, 0.8);*/
    position: absolute;
    display: flex;
    padding: 5px 10px;
    border-radius: 50px 50px 30px 30px;
    top: 8px;
    justify-content: center;
    left: 50%;
    width: 90%;
    transform: translate(-50%);
    z-index: 1;
    font-size: 14px;
  }

  .err__text {
    color: #ff7875;
  }

  .success__text {
    color: #38ef7d;
  }

  .more__info {
    position: absolute;
    bottom: 25px;
    font-size: 12px;
    text-align: center;
    color: #38ea7a;
    /*border: 1px solid;*/
    left: 50%;
    transform: translateX(-50%);
    padding: 5px;
    border-radius: 30px 30px 50px 50px;
    width: 80%;
    box-shadow: 0 0 10px 0 rgba(170, 170, 170, 0.5);
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
      background: #11998e; /* fallback for old browsers */
      background: -webkit-linear-gradient(to right, #38ef7d, #11998e); /* Chrome 10-25, Safari 5.1-6 */
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
    cursor: pointer;
    flex: 0 1 auto;
    margin: 0 1rem 3rem;
    width: 25%;
    @media screen and (max-width: 768px) {
      width: 45%;
    }
    @media screen and (max-width: 600px) {
      width: 100%;
      margin: 0 auto 3rem;
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