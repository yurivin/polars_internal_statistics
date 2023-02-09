<template>
  <div
    class="d-flex flex-row list_buttons"
    :style="{ width: text.length * 169 + 'px' }"
  >
    <router-link
      v-for="(info, idx) in text"
      :key="idx"
      :to="info.path"
      class="col links txt"
    >
      {{ info.title }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NavCards',
  props: {
    // TODO: fix props description https://polars.atlassian.net/browse/PI-328
    text: {
      title: String,
      path: String,
    },
  },
}
</script>

<style scoped lang="scss">
.list_buttons {
  display: flex;
  margin: 0 25px;
  max-width: 507px;
  height: 33px;
  background: #1c1c25;
  border-radius: 13px;
  @media (max-width: 768px) {
    height: 37px;
    width: 312px !important;
  }
  @media (max-width: 375px) {
    height: 37px;
    width: 230px !important;
    margin: 0 10px;
  }
}
.links {
  background: #1c1c25;
  max-width: 169px;
  height: 33px;
  border-radius: 13px;
  border: none;
  font-size: 16px;
  line-height: 92%;
  color: #8c8c8c;
  padding-top: 11px;
  text-decoration: none;
  @media (max-width: 768px) {
    width: 169px !important;
    height: 37px;
    font-size: 11px;
    padding: 15px;
  }
}
.router-link-active {
  max-width: 169px;
  height: 33px;
  background: white;
  border-radius: 13px;
  border: none;
  font-size: 16px;
  line-height: 92%;
  color: black;
  @media (max-width: 768px) {
    width: 169px !important;
    height: 37px;
    font-size: 11px;
  }
}
</style>
