<template>
  <div ref="scroll" class="wrap-scroll" @wheel="onWheel($event), onNav()">
    <div class="article-block">
      <div class="article-nav" :class="{ 'fix-zero': navFixZero }">
        <Button
          :type="condition.type ? 'text' : 'primary'"
          class="default-btn"
          @click="goDefault"
        >
          默认
        </Button>
        <selectupdown
          v-for="item in select"
          :key="item.type"
          :item="item"
          @changeSort="goSort(item)"
          @click="goSelect(item)"
        />
      </div>
      <div class="article-list">
        <div style="margin:10px 0">
          <Tag
            v-for="(item, index) in checks"
            :color="item.color"
            :key="index"
            closable
            @on-close="checks.splice(index, 1)"
          >
            {{ item.title }}
          </Tag>
        </div>
        <articlecom
          v-for="(item, index) in list"
          :key="index"
          :search="condition.title"
          :article="item"
          @click.native="_preveousTags(item.tags)"
        />
      </div>
      <div v-if="isDone" class="isDone">
        已经到底了
      </div>
      <Spin v-if="showSpin" class="spin">加载中...</Spin>
      <BackTop></BackTop>
    </div>
    <div class="tag-block">
      <Input
        v-model="condition.title"
        placeholder="enter somethings……"
        suffix="ios-search"
        enter-button
        @click.native="handleReachBottom(false)"
        @on-enter="handleReachBottom(false)"
      />

      <div class="tag-list">
        <Tag color="error" @click.native="hot">热门</Tag>
        <Tag
          v-for="(item, index) in localTags"
          :color="item.color"
          :key="index"
          :closable="!item.stable"
          @click.native="goCheck(item)"
          @on-close="_localTagsRm(item)"
        >
          {{ item.title }}
        </Tag>
      </div>
      <div class="tag-list">
        <Button icon="ios-add" type="dashed" size="small" to="/tags">
          标签管理
        </Button>
        <Button type="primary" size="small" @click="isShowModalPost = true">
          同步数据
        </Button>
      </div>
      <Card class="comment-card" dis-hover>
        <p slot="title">
          推荐文章
        </p>
        <List>
          <a
            v-for="(item, index) in recomment"
            target="_blank"
            :href="item.article_info.link_url"
            :key="item._id"
          >
            <ListItem>
              <ListItemMeta :title="item.article_info.title" />
            </ListItem>
          </a>
        </List>
      </Card>
    </div>
    <ModalPost v-model="isShowModalPost" />
  </div>
</template>
<script>
import throttle from 'lodash.throttle'
import { getArticle, getRecomment } from '@/api'
import articlecom from '@/components/article'
import selectupdown from '@/components/selectupdown'
import ModalPost from '@/components/ModalPost'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Articles',
  props: {
    tag: {
      type: String,
      default: ''
    }
  },
  components: {
    articlecom,
    selectupdown,
    ModalPost
  },
  async asyncData({ query = {} }) {
    const { tag = '' } = query
    const { success, data, count, msg } = await getArticle({
      sort: false
    })
    let checks = tag ? [{ title: tag }] : []
    if (success) {
      return {
        list: data,
        count,
        checks: checks
      }
    } else {
      console.log('接口获取失败', msg)
    }
  },
  computed: {
    ...mapState('local', ['localTags', 'preveousTags'])
  },
  data() {
    return {
      navFixZero: false,
      isShowModalPost: false,
      checks: [],
      isDone: false,
      condition: {
        title: '',
        type: '',
        sort: 'desc',
        pageIndex: 0,
        pageSize: 20,
        tags: []
      },
      list: [],
      count: 0,
      showSpin: false,
      select: [
        {
          type: 'thumbUpCount',
          name: '点赞数',
          sort: 'desc',
          selected: false
        },
        {
          type: 'commentCount',
          name: '评论数',
          sort: 'desc',
          selected: false
        },
        {
          type: 'viewsCount',
          name: '阅读数',
          sort: 'desc',
          selected: false
        },
        {
          type: 'createTime',
          name: '创建时间',
          sort: 'desc',
          selected: false
        }
      ],
      recomment: []
    }
  },
  watch: {
    checks(v) {
      if (v.length) {
        this.condition.tags = v
      } else {
        this.condition.tags = []
      }
      this.handleReachBottom(false)
    },
    title: {
      handler(v) {
        this.condition.title = v
      },
      immediate: true
    },
    preveousTags() {
      this.getRecomment()
    }
  },
  methods: {
    ...mapMutations('local', [
      '_localTagsAdd',
      '_localTagsRm',
      '_preveousTags'
    ]),
    goSort(item) {
      item.sort = item.sort === 'desc' ? 'asc' : 'desc'
      this.handleReachBottom(false)
    },
    goCheck(item) {
      if (!this.checks.find((v) => v.title === item.title)) {
        this.checks.push(item)
      }
    },
    goDefault() {
      this.condition.type = ''
      this.select.forEach((v) => (v.selected = false))
      this.handleReachBottom(false)
    },
    goSelect(item) {
      this.select.forEach((element) => {
        element.selected = false
      })
      item.selected = true
      this.condition.type = item.type
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
    getRecomment() {
      let data = { tags: this.preveousTags }
      getRecomment(data).then((res) => {
        if (res.success) {
          this.recomment = res.data
        }
      })
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
      function(event) {
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
      { trailing: true, leading: false }
    ),
    onNav() {
      const el = document.documentElement
      const scrollTop = el.scrollTop
      this.navFixZero = scrollTop > 400
      this.$eventBus.$emit('headerVisable', !this.navFixZero)
    }
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
  padding: 10px;
}
.wrap-scroll {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.tag-block {
  width: 250px;
  margin-top: 52px;
  .tag-list {
    margin-top: 20px;
    background-color: #fff;
    padding: 10px 5px;
    > div {
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }
  .comment-card {
    background-color: #fff;
    margin-top: 20px;
    /deep/.ivu-card-body {
      padding: 0 10px;
    }
  }
}
.article-block {
  width: 700px;
  margin-right: 20px;
  margin-top: 60px;
  .article-nav {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 10px;
    background: #fff;
    position: fixed;
    top: 60px;
    z-index: 2;
    width: 700px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    .default-btn {
      margin-right: 10px;
    }
    .article-select {
      margin-right: 10px;
      min-width: 100px;
    }
    .nav-rest {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .fix-zero {
    top: 0;
  }
}
</style>
