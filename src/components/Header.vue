<template>
  <div class="header">
    <img :src="logo"/>
    <h1 class="title">{{ title || 'Just put your damn link.' }}</h1>
  </div>
</template>
<script>
  import config from '../config'
  export default {
    props: ['title'],
    data () {
      return {
        logo: config.logo
      }
    }
  }
</script>
<style lang="scss" scoped>
  .header {
    flex: 0.5;
    height: 150px;
    width: 100%;
    padding: 15px;
    background-size: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    transition: all 0.3s;
    .title {
      text-align: center;
    }
    &:before {
      content: '';
      width: 20px;
      height: %;
      border-radius: 0 0 50px 50px;
      position: absolute;
      background: #ff0100;
      top: 0;
      left: 50%;
      z-index: -1;
      transition: all 0.3s;
      transform: translateX(-50%);
    }
    img {
      width: 5rem;
    }
    h1 {
      font-size: 22px;
      position: relative;
      display: block;
      margin-top: 1rem;
    }
  }
</style>