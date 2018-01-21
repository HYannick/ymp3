<template>
  <div class="clickIt">
    <p>Score:: {{score}}</p>
    <canvas ref="pong" class="canvas"></canvas>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        score: 0
      }
    },
    mounted() {
      const canvas = this.$refs['pong'];
      const ctx = canvas.getContext("2d");

      console.log(ctx)

    }
  }
</script>
<style lang="scss">

</style>