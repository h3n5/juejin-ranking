<template>
  <div class="container">
    <h1 class="title">
      <logo />
      <span style="vertical-align: super;">juejin</span>
    </h1>
    <h2 class="subtitle">
      <Input
        v-model="search"
        search
        enter-button
        size="large"
        @click.native="goArticle"
      />
    </h2>
    <div class="view-nav">
      <ul class="nav-list left">
        <li class="nav-item active">
          <div class="category-popover-box">
            <a>推荐</a>
          </div>
        </li>
        <li class="nav-item">
          <div class="category-popover-box">
            <a>后端</a>
          </div>
        </li>
        <li class="nav-item">
          <div class="category-popover-box">
            <a>前端</a>
          </div>
        </li>
        <li class="nav-item">
          <div class="category-popover-box">
            <a>Android</a>
          </div>
        </li>
        <li class="nav-item">
          <div class="category-popover-box">
            <a>iOS</a>
          </div>
        </li>
        <li class="nav-item">
          <div class="category-popover-box">
            <a>人工智能</a>
          </div>
        </li>
        <li class="nav-item right">
          <nuxt-link to="/tags">标签管理</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
export default {
  components: {
    Logo
  },
  data() {
    return {
      search: ''
    }
  },
  methods: {
    goArticle() {
      this.$router.push('/articles?title=' + this.search)
    }
  }
}
</script>

<style lang="less" scope>
html,
body,
#__nuxt,
#__layout,
.ivu-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.container {
  margin: 0 auto;
  min-width: 900px;
  max-width: 1000px;
  padding: 200px;
  padding-top: 100px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  flex: 1;
  .view-nav .nav-list {
    height: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    position: relative;
    padding-right: 100px;
    .right {
      position: absolute;
      right: 0;
    }
  }

  .view-nav .nav-list .nav-item {
    height: 100%;
    align-items: center;
    display: flex;
    flex-shrink: 0;
    font-size: 1.16rem;
    color: #71777c;
    padding: 0 1rem;
  }

  .view-nav .nav-list .nav-item:first-child {
    padding: 0 1rem 0 0;
  }

  .view-nav .nav-list .nav-item:last-child {
    padding: 0 0 0 1rem;
  }

  .view-nav .nav-list .nav-item.active,
  .view-nav .nav-list .nav-item:hover {
    color: #007fff;
  }

  .view-nav .nav-list .nav-item a {
    color: inherit;
  }

  .nav-item {
    position: relative;
    cursor: pointer;
  }

  .nav-item > a:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
  text-align: center;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  padding-top: 15px;
}
</style>
