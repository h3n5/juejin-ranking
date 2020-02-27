<template>
  <div ref="scroll" class="scroll" @wheel="onWheel">
    <div class="article-block">
      <div class="article-nav">
        <selectupdown
          v-for="item in select"
          :key="item.type"
          :item="item"
          @changeSort="
            ;(item.sort = item.sort === 'desc' ? 'asc' : 'desc'),
              handleReachBottom(false)
          "
          @click="goSelect(item)"
        />
        <div class="nav-rest">
          <Input
            v-model="condition.title"
            size="small"
            search
            enter-button
            style="width: 300px;margin-right:10px;"
            @on-search="handleReachBottom(false)"
          />
          <Tag
            :color="
              condition.sort === 'desc' &&
              select.every((v) => v.selected === false)
                ? 'primary'
                : 'default'
            "
            @click.native="hot"
            >热门</Tag
          >
        </div>
      </div>
      <div class="article-list">
        <articlecom
          v-for="(item, index) in list"
          :key="index"
          :article="item"
        />
      </div>
      <div v-if="isDone" class="isDone">
        已经到底了
      </div>
    </div>
    <Spin v-if="showSpin" class="spin">加载中...</Spin>
    <BackTop></BackTop>
  </div>
</template>
<script>
import throttle from 'lodash.throttle'
import { getArticle } from '@/api'
import articlecom from '@/components/article'
import selectupdown from '@/components/selectupdown'
export default {
  name: 'Articles',
  components: {
    articlecom,
    selectupdown
  },
  async asyncData() {
    const { success, data, count } = await getArticle({ sort: false })
    if (success) {
      return {
        list: data,
        count
      }
    }
  },
  data() {
    return {
      isDone: false,
      condition: {
        title: '',
        type: '',
        sort: 'desc',
        pageIndex: 0,
        pageSize: 20
      },
      list: [],
      count: 0,
      showSpin: false,
      select: [
        {
          type: 'createTime',
          name: '创建时间',
          sort: 'desc',
          selected: false
        },
        {
          type: 'thumbUpCount',
          name: '点赞数',
          sort: 'desc',
          selected: false
        },
        {
          type: 'commentCount',
          name: '评论',
          sort: 'desc',
          selected: false
        },
        {
          type: 'viewsCount',
          name: '阅读数',
          sort: 'desc',
          selected: false
        }
      ]
    }
  },
  computed: {},
  methods: {
    goSelect(item) {
      this.select.forEach((element) => {
        element.selected = false
      })
      item.selected = true
      this.handleReachBottom(false)
    },
    hot() {
      this.select.forEach((element) => {
        element.selected = false
      })

      this.condition.sort = this.condition.sort === 'desc' ? 'asc' : 'desc'
      this.condition.type = ''
      this.handleReachBottom(false)
    },
    handleReachBottom(add = true) {
      return new Promise((resolve) => {
        if (!add) {
          this.isDone = false
          this.condition.pageIndex = 0
        } else {
          this.condition.pageIndex++
        }
        this.showSpin = true
        const data = {
          ...this.condition,
          ...this.select.find((v) => v.selected)
        }
        if (this.isDone) {
          this.showSpin = false
          return this.$Message.warning('已经到底了')
        }
        getArticle(data).then((res) => {
          if (res.success) {
            if (add) {
              this.list = this.list.concat(res.data)
            } else {
              this.list = res.data
            }
            if (this.list.length >= res.count) {
              this.isDone = true
            }
          } else {
            this.$Message.error(res.msg)
          }
          this.showSpin = false
          resolve()
        })
      })
    },
    onWheel: throttle(
      function(e) {
        const direction = event.wheelDelta
          ? event.wheelDelta
          : -(event.detail || event.deltaY)
        const el = document.documentElement
        const scrollTop = el.scrollTop
        const scrollHeight = el.scrollHeight
        const clientHeight = el.clientHeight
        const rest = scrollHeight - clientHeight
        const condition = rest - scrollTop < rest / 3
        if (direction < 0 && rest > 0) {
          if (condition && !this.showSpin) {
            this.handleReachBottom()
          }
        }
      },
      2000,
      { trailing: false }
    )
  }
}
</script>
<style lang="less" scope>
.spin {
  height: 30px;
  line-height: 30px;
  background: #fff;
}
.isDone {
  text-align: center;
}
.article-block {
  width: 1000px;
  margin: auto;
  .article-nav {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 10px 0;
    .article-select {
      margin-right: 10px;
    }
    .nav-rest {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
