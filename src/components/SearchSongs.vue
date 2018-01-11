<template>
  <transition name="fade">
    <div>
      <form class="youtube__search" @submit.prevent="searchSong">
        <div class="input__container">
          <input v-if="submitting === 'complete' || submitting === 'start'" @keyup="searchSong" class="input__search" type="text" placeholder="Type here . . ."
                 v-model="search"/>
          <h3 style="font-size: 18px" v-else>Wait ｡◕‿◕｡</h3>
        </div>
      </form>
      <ul class="results__container">
        <list-item :song="song" v-for="(song, i) in results" :key="song.id" @onSubmit="filterResults"></list-item>
      </ul>
    </div>

  </transition>
</template>
<script>
  import axios from 'axios'
  import config from '../config'
  import Spinner from './utils/Spinner'
  import ListItem from './ListItem.vue'
  export default {
    components: {
      Spinner,
      ListItem
    },
    data() {
      return {
        results: [],
        search: '',
        api: config.api,
        download: config.download,
        downloadLink: '',
        submitting: 'start',
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
      searchSong() {
        axios.get(`${this.api}/search?item=${this.search}`)
          .then(res => {
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

  .youtube__search {
    display: flex;
    justify-content: center;
    margin-bottom: 4rem;
  }

  .results__container {
    padding: 15px;
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