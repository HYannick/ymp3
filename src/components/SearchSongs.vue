<template>
  <transition name="fade">
    <div class="input__container">
      <div class="youtube__search">
        <div style="width: 100%; padding: 0 15px;">
          <form v-if="submitting === 'complete' || submitting === 'start' || submitting ==='error'" class="search__wrapper" @submit.prevent="searchSong">
            <input class="input__search" :disabled="requesting" type="text" :placeholder="$t('placeholder')"
                   v-model="search"/>
            <button class="yt__upload" type="submit" :class="{active : (search !== '')}" :disabled="requesting || (search === '')">
              <search-icon v-if="!requesting"></search-icon>
              <spinner v-else></spinner>
            </button>
          </form>
          <h3 style="font-size: 18px; text-align: center" v-else>{{$t("pending")}}</h3>
        </div>
      </div>
      <div class="results__container">
        <list-item :song="song" v-for="(song, i) in results" :key="song.id" @onSubmit="filterResults"></list-item>
      </div>
    </div>

  </transition>
</template>
<script>
  import axios from 'axios'
  import config from '../config'
  import Spinner from './utils/Spinner'
  import SearchIcon from './utils/SearchIcon.vue'
  import ListItem from './ListItem.vue'
  export default {
    components: {
      Spinner,
      ListItem,
      SearchIcon
    },
    data() {
      return {
        results: [],
        search: '',
        api: config.api,
        download: config.download,
        downloadLink: '',
        submitting: 'start',
        requesting: false,
        opts: {
          maxResults: 10,
          key: 'AIzaSyDPY75GaIBzt5P3p1ULzNehW9TQ4JdHBOI'
        }
      }
    },
    methods: {
      filterResults (data) {
        console.log('filtering')
        console.log(data)
        this.results = this.results.filter(song => song.id === data.id)
        this.$emit('onSubmitting', data)
        this.submitting = data.status
      },
      youtube_parser(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
      },
      searchSong() {
        this.requesting = true;
        axios.get(`${this.api}/search?item=${this.search}`)
          .then(res => {
            this.requesting = false;
            this.results = this.youtube_parser(this.search) ? [res.data.results[0]] : res.data.results
          })
          .catch(error => {
            this.err = 'Failed to get infos'
          })
      }
    }
  }
</script>
<style lang="scss">
  .input__container {
    width: 100%;
  }
  .youtube__search {
    display: flex;
    justify-content: center;
    max-width: 450px;
    margin: 0 auto 1rem;
  }

  .results__container {
    padding: 30px 15px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .search__wrapper {
    overflow: hidden;
    display: flex;
    margin-top: 1rem;
    border-radius: 30px 30px 50px 50px;
    border: none;
    background: white;
    box-shadow: 0 0 20px 0 rgba(170, 170, 170, 0.50);
    transition: 0.3s;
  }
  .yt__upload {
    width: 4rem;
    align-self: center;
    outline: #333;
    /*flex: 0.2;*/
    font-size: 18px;
    border-radius: 0 30px 50px 0;
    border: none;
    background: white;
    transition: 0.5s;
    position: relative;
    /*overflow: hidden;*/
    padding: 0.8rem;
    &:after {
      content: '';
      background: #ff0102;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 0;
      transition: 0.4s;
      z-index:  -1;
    }
    &.active {
      color: white;
      &:after {
        height: 100%;
      }
    }

    svg {
      width: 30px;
      height: 30px;
      stroke: white;
      .path-1 {
        fill: transparent;
      }
      transition: 0.3s;
    }
    &.active {
      background: #ff0102;
      color: white;
      svg {
        fill: white;
      }

    }
    &:active {
      box-shadow: 0 0 10px 0 rgba(170, 170, 170, 0.50);
    }
    &:disabled {
      opacity: 0.7;
    }
  }
  .input__search {
    color: #333;
    padding: 0.8rem 0rem 0.8rem 1.5rem;
    outline: #333;
    font-size: 18px;
    flex: 1;
    border: none;
    background: white;
    transition: 0.3s;
    &:active {
      box-shadow: 0 0 10px 0 rgba(170, 170, 170, 0.50);
    }
    &:disabled {
      opacity: 0.4;
    }
  }
</style>