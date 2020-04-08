<template>
  <div class="article" @click="goUrl">
    <div class="info-row flex-row">
      <div class="info-list info-list--purple">
        专栏
      </div>
      <div class="info-list">
        {{ article.user.username }}
      </div>
      <div class="info-list">
        {{ article.createdAt | dateFormat }}
      </div>
      <div class="info-list" v-for="(item, index) in article.tags" :key="index">
        {{ item.title }}
      </div>
    </div>
    <div class="title-row flex-row">
      {{ article.title }}
    </div>
    <div class="content-row flex-row">
      {{ article.content }}
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
const getTimeWord = (dateTimeStamp) => {
  if (typeof dateTimeStamp === 'string') {
    dateTimeStamp = new Date(dateTimeStamp).getTime()
  }
  var minute = 1000 * 60
  var hour = minute * 60
  var day = hour * 24
  var month = day * 30
  let result = ''
  var now = new Date().getTime()
  var diffValue = now - dateTimeStamp
  var monthC = diffValue / month
  var weekC = diffValue / (7 * day)
  var dayC = diffValue / day
  var hourC = diffValue / hour
  var minC = diffValue / minute
  if (monthC >= 1) {
    result = parseInt(monthC) + '个月前'
  } else if (weekC >= 1) {
    result = parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    result = parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    result = parseInt(hourC) + '个小时前'
  } else if (minC >= 1) {
    result = parseInt(minC) + '分钟前'
  } else result = '刚刚'
  return result
}
export default {
  name: 'Article',
  props: {
    article: {
      type: Object,
      default: () => ({ tags: [] })
    }
  },
  filters: {
    dateFormat(v = '') {
      return getTimeWord(+new Date(v.replace(/Z/, '')) + 8 * 3600 * 1000)
    }
  },
  data() {
    return {}
  },
  methods: {
    goUrl() {
      window.open(this.article.originalUrl, '_blank')
    }
  }
}
</script>
<style lang="less" scope>
.article {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 1.125rem 2rem;
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
    flex-flow: row wrap;
    width: 100%;
    justify-content: flex-start;
  }
  .title-row {
    color: #2e3135;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0.5rem 0;
  }
  .content-row {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom: 1rem;
  }
  .btn-row {
    color: #b2bac2;
  }
}
</style>
