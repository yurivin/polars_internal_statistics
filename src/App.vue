<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  },
  created() {
    this.$store.dispatch('initFetchTransaction')
  },
}
</script>

<style>
#app {
  text-align: center;
  color: #2c3e50;
  background: #1f1f27;
  min-height: 100vh;
  padding: 50px 0;
}
</style>
