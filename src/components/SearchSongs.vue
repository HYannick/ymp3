<template>
  <transition name="fade">
    <div>
      <form class="youtube__search" @submit.prevent="searchSong">
        <div class="input__container">
          <input @keyup="searchSong" class="input__search" type="text" placeholder="Type here . . ."
                 v-model="search"/>
        </div>
      </form>
      <div class="results__container">
        <div class="result__item" v-for="(song, i) in results" :key="i">
          <div class="result__item-head">
            <img width="100%" :src="song.thumbnails.high.url"/>
            <h3>{{song.title}}</h3>
          </div>
          <button class="get__it"><img :src="download"/></button>
        </div>
      </div>
    </div>

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
        results: [],
        search: '',
        api: config.api,
        download: config.download,
        opts: {
          maxResults: 10,
          key: 'AIzaSyDPY75GaIBzt5P3p1ULzNehW9TQ4JdHBOI'
        }
      }
    },
    methods: {
      searchSong() {
        axios.get(`${this.api}/search?item=${this.search}`)
          .then(res => {
            console.log(res.data.results)
            this.results = res.data.results.filter(item => item.kind === 'youtube#video')
          })
          .catch(error => {
            this.err = 'Failed to get infos'
          })
      }
    }
  }
</script>
<style lang="scss">
  .get__it {
    border-radius: 0 0 35px 35px;
    background: white;
    border: none;
    color: red;
    width: 100%;
    font-size: 16px;
    padding: 0 1.5rem;
    img {
      width: 30px;
    }
  }
  .youtube__search {
    display: flex;
    justify-content: center;
    margin-bottom: 4rem;
  }
  .results__container {
    padding: 15px;
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
    h3{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      text-align: center;
      width: 90%;
      color: #333;
      box-shadow: 0 0 30px 5px rgba(170, 170, 170, 0.5);
      background: rgba(255, 255, 255, 0.43);
      border-radius: 30px 30px 50px 50px;
      padding: 1rem;
    }
    img {
      opacity: 0.5;
    }
  }
  .result__item {
    box-shadow: 0 0 30px 5px rgba(170, 170, 170, 0.5);
    margin-bottom: 3rem;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 40px;
    position: relative;
  }
  .input__search {
    margin-top: 1rem;
    background: transparent;
    color: #333;
    padding: 1rem 2rem;
    outline: #333;
    font-size: 18px;
    border-radius: 30px 30px 50px 50px;
    border: none;
    background: white;
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
</style>