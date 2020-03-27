<template>
  <Scroll
    :height="taglistHeight"
    :on-reach-bottom="handleReachBottom"
    :distance-to-edge="-50"
  >
    <ul ref="taglist" class="taglist">
      <li v-for="(item, index) in list" :key="index" class="tag-item">
        <Card>
          <div class="info-box">
            <img
              class="tag_img"
              :src="require('@/assets/code.png')"
              :alt="item.title"
              v-real-img="item.icon"
            />
            <div class="title">{{ item.title }}</div>
            <div class="meta-box">
              <div class="meta-subscribe">{{ item.subscribersCount }} 关注</div>
              <div class="meta-article">{{ item.entryCount }} 文章</div>
            </div>
            <div class="flex-center">
              <Button
                :disabled="localTagsStable(item.title)"
                size="small"
                @click="goChange(item)"
                >{{
                  !localTagsFind(item.title) ? `添加至首页` : '取消'
                }}</Button
              >
            </div>
          </div>
        </Card>
      </li>
    </ul>
  </Scroll>
</template>
<script>
import { getTag } from '@/api'
import { mapMutations, mapGetters } from 'vuex'
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
        pageSize: 20
      },
      list: [],
      count: 0
    }
  },
  computed: {
    ...mapGetters('local', ['localTagsFind', 'localTagsStable']),
    taglistHeight() {
      return 800
    }
  },
  methods: {
    ...mapMutations('local', ['_localTagsAdd', '_localTagsRm']),
    goChange(item) {
      if (this.localTagsFind(item.title)) {
        this._localTagsRm(item)
      } else {
        this._localTagsAdd(item)
      }
    },
    handleReachBottom() {
      return new Promise((resolve) => {
        this.condition.pageIndex++
        getTag(this.condition).then((res) => {
          if (res.success) {
            this.list = this.list.concat(res.data)
          } else {
            this.$Message.error(res.msg)
          }
          resolve()
        })
      })
    }
  }
}
</script>
<style lang="less" scope>
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
