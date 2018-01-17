<template>
  <div class="header">
    <div class="lang__changer">
      <a @click="changeLanguage('en')"><flag-icon :lang="'en'"></flag-icon></a>
      <a @click="changeLanguage('fr')"><flag-icon :lang="'fr'"></flag-icon></a>
    </div>
    <img :src="logo"/>
    <h1 class="title">{{ title || $t("intro") }}</h1>
  </div>
</template>
<script>
  import config from '../config'
  import FlagIcon from './utils/Flags.vue'
  export default {
    props: ['title'],
    components: {
      FlagIcon
    },
    data () {
      return {
        logo: config.logo
      }
    },
    methods: {
      changeLanguage(lang) {
        this.$i18n.i18next.changeLanguage(lang);
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
    height: 220px;
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
  .lang__changer {
    position: absolute;
    top: 5px;
    right: 10px;
    svg {
      width: 30px;
    }
  }
</style>