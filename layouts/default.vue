<template>
  <Layout id="Layout">
    <header class="header" :class="{ visible: headerVisable }">
      <nuxt-link to="/">
        <img class="header-logo" src="../assets/logo.svg" />
      </nuxt-link>
    </header>
    <nuxt class="layout-ctx" />
  </Layout>
</template>
<script>
export default {
  name: 'Main',
  data() {
    return {
      headerVisable: true
    }
  },
  mounted() {
    this.$eventBus.$on('headerVisable', (e) => (this.headerVisable = e))
  }
}
</script>
<style>
html {
  font-family: 'rubik,arial', 'Source Sans Pro', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #263646;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: #f5f7f9;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
.header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  z-index: 2;
  font-size: 20px;
  background-color: #fff;
  padding: 0 40px;
  position: fixed;
  transition: all 0.2s;
  transform: translate3d(0, -100%, 0);
}
.visible {
  transform: translateZ(0);
}
.layout-ctx {
  padding-top: 50px;
}
.header-logo {
  vertical-align: middle;
}
#Layout .ivu-layout {
  background: #fdfdfd;
}
</style>
