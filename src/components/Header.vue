<template>
  <div class="header">
    <div class="lang__changer">
      <a @click="changeLanguage('en')"><flag-icon :lang="'en'"></flag-icon></a>
      <a @click="changeLanguage('fr')"><flag-icon :lang="'fr'"></flag-icon></a>
    </div>
    <logo class="logo__svg"></logo>
    <h1 class="title" v-html="title || $t('intro')"></h1>
  </div>
</template>
<script>
  import FlagIcon from './utils/Flags.vue'
  import Logo from './utils/Logo.vue'
  export default {
    props: ['title'],
    components: {
      FlagIcon,
      Logo
    },
    methods: {
      changeLanguage(lang) {
        this.$i18n.i18next.changeLanguage(lang);
      }
    }
  }
</script>
<style lang="scss" scoped>
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
    .logo__svg {
      margin-top: 4rem;
    }
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
      width: 8rem;
    }
    h1 {
      font-size: 22px;
      position: relative;
      display: block;
      margin: 1.5rem 0 2rem;
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