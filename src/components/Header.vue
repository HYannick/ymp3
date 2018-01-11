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
  .options {
    padding: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
    .separator {
      width: 1px;
      height: 30px;
      background: #5c5c5c;
      opacity: 0.2;
    }
    input[type="radio"] {
      display: none;
      &:checked + label {
        color: white;
        &:after {
         height: 100%;
        }
      }
    }
    label {
      width: 150px;
      transition: 0.3s;
      padding: 0.5rem 1.5rem;
      cursor: pointer;
      display: block;
      position: relative;
      box-shadow: 0 0 20px 0 rgba(170, 170, 170, 0.50);
      overflow: hidden;
      border-radius: 10px 0 0 20px;
      &:last-child{
        border-radius: 0 10px 20px 0;
      }
      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 0;
        bottom:0;
        left: 0;
        z-index: -1;
        background: red;
        transition: 0.3s;
      }
    }
  }
  .header {
    width: 100%;
    height: 260px;
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
      height: 0%;
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
      padding: 0 15px;
    }
  }
</style>