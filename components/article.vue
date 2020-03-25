<template>
  <div class="article">
    <div class="info-row flex-row">
      <div class="info-list info-list--purple">
        专栏
      </div>
      <div class="info-list">
        {{ article.user.username }}
      </div>
      <div class="info-list" v-for="(item, index) in article.tags" :key="index">
        {{ item.title }}
      </div>
    </div>
    <div class="title-row flex-row">
      {{ article.title }}
    </div>
    <div class="btn-row flex-row">
      <ButtonGroup>
        <Button size="small" icon="md-thumbs-up">{{
          article.collectionCount
        }}</Button>
        <Button size="small" icon="md-mail">{{ article.commentsCount }}</Button>
      </ButtonGroup>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Article',
  props: {
    article: {
      type: Object,
      default: () => ({ tags: [] })
    }
  },
  data() {
    return {}
  },
  created() {}
}
</script>
<style lang="less" scope>
.article {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: #fff;
  flex-flow: column wrap;
  color: #909090;
  border-bottom: 1px solid rgba(178, 186, 194, 0.15);
  .info-row {
    .info-list {
      font-size: 12px;
      &::after {
        content: '·';
        color: rgb(178, 186, 194);
        margin-right: 2px;
      }
    }
    .info-list--purple {
      color: #b71ed7;
      font-weight: 500;
    }
  }
  .flex-row {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    justify-content: flex-start;
  }
  .title-row {
    color: #2e3135;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0.5rem 0 1rem;
  }
  .btn-row {
    color: #b2bac2;
  }
}
</style>
