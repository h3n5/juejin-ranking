<template>
  <div class="tag-scroll" @wheel="onWheel">
    <div class="tag-type">
      <Tabs
        v-model="condition.type"
        type="card"
        class="tag-tab"
        size="small"
        @on-click="loadList(true)"
      >
        <TabPane name="hot" label="最热"></TabPane>
        <TabPane name="new" label="最新"></TabPane>
      </Tabs>
      <Input
        v-model="condition.keyword"
        placeholder="搜索标签"
        @on-enter="loadList(true)"
        style="width: 200px;margin-left:20px;"
      />
    </div>
    <ul ref="taglist" class="taglist">
      <li v-for="(item, index) in list" :key="item.tag_id" class="tag-item">
        <Card @click.native="jump(item.tag)">
          <div class="info-box">
            <img
              class="tag_img"
              :src="require('@/assets/code.png')"
              :alt="item.tag.tag_name"
              v-real-img="item.tag.icon"
            />
            <div class="title">{{ item.tag.tag_name }}</div>
            <div class="meta-box">
              <div class="meta-subscribe">
                {{ item.tag.concern_user_count }} 关注
              </div>
              <div class="meta-article">
                {{ item.tag.post_article_count }} 文章
              </div>
            </div>
            <div class="flex-center">
              <Button
                :disabled="localTagsStable(item.tag.tag_name)"
                size="small"
                @click.stop="goChange(item.tag)"
              >
                {{ !localTagsFind(item.tag.tag_name) ? `添加至首页` : '取消' }}
              </Button>
            </div>
          </div>
        </Card>
      </li>
    </ul>
  </div>
</template>
<script>
import { getTag } from '@/api'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import throttle from 'lodash.throttle'
export default {
  name: 'Tags',
  async asyncData() {
    const { success, data, count, msg } = await getTag()
    if (success) {
      return {
        list: data,
        count
      }
    } else {
      console.log('标签获取失败', msg)
    }
  },
  data() {
    return {
      condition: {
        pageIndex: 0,
        pageSize: 20,
        keyword: '',
        type: 'hot'
      },
      list: [],
      count: 0
    }
  },
  computed: {
    ...mapGetters('local', ['localTagsFind', 'localTagsStable'])
  },
  methods: {
    ...mapActions('local', ['selectTag']),
    ...mapMutations('local', ['_localTagsAdd']),
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
          if (condition) {
            this.handleReachBottom()
          }
        }
      },
      2000,
      { trailing: true, leading: false }
    ),
    goChange(item) {
      this.selectTag({ title: item.tag_name })
    },
    jump(item) {
      this._localTagsAdd({ title: item.tag_name })
      this.$router.push({ name: 'index', query: { tag: item.tag_name } })
    },
    loadList(reset = false) {
      return getTag(this.condition).then((res) => {
        if (res.success) {
          if (reset) {
            this.list = res.data
          } else {
            this.list = this.list.concat(res.data)
          }
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    handleReachBottom() {
      return new Promise(async (resolve) => {
        this.condition.pageIndex++
        await this.loadList()
        resolve()
      })
    }
  }
}
</script>
<style lang="less" scope>
.tag-type {
  padding: 20px;
  padding-bottom: 0;
  width: 1000px;
  margin: auto;
  display: flex;
  flex-flow: row wrap;
  .tag-tab {
  }
}
.taglist {
  display: flex;
  flex-flow: row wrap;
  padding: 20px 0;
  width: 1000px;
  margin: auto;
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  .tag-item {
    list-style-type: none;
    flex-basis: 25%;
    margin-bottom: 1.3rem;
    padding: 0 0.7rem;
    box-sizing: border-box;
    .info-box {
      text-align: center;
      .tag_img {
        height: 50px;
        width: 50px;
      }
      .title {
        font-size: 16px;
        padding: 0 0 10px 0;
        color: #333;
        font-weight: 700;
      }
      .meta-box {
        display: flex;
        flex-flow: row nowrap;
        .meta-subscribe,
        .meta-article {
          flex: 1;
          cursor: default;
        }
      }
    }
  }
}
</style>
