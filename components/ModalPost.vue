<template>
  <Modal
    :transfer="false"
    title="同步数据"
    width="500"
    v-model="isShow"
    :mask-closable="false"
  >
    <Form ref="form" :label-width="80">
      <FormItem label="code">
        <Input placeholder="please input code" v-model="code"></Input>
      </FormItem>
      <FormItem label="progress">
        <Progress :percent="progress" status="active" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="text" @click="isShow = false">关闭</Button>
      <Button type="primary" @click="submit" :loading="loading">
        {{ loading ? '同步中' : '同步' }}
      </Button>
    </div>
  </Modal>
</template>
<script>
import { refreshData, getRefresh } from '@/api'
export default {
  name: 'compontent',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShow: {
      get() {
        return this.value
      },
      set(v) {
        if (!v) {
          this.init()
        }
        this.$emit('input', v)
      }
    }
  },
  data() {
    return {
      code: '',
      loading: false,
      progress: 0,
      timer: null
    }
  },
  methods: {
    init() {
      this.code = ''
      this.loading = false
      this.progress = 0
      this.timer && clearTimeout(this.timer)
    },
    submit() {
      this.loading = true
      this.update()
    },
    update() {
      refreshData({ code: this.code }).then((res) => {
        if (res.success) {
          this.getProgress(res.msg)
        } else {
          this.loading = false
          this.$Message.error('code error')
        }
      })
    },
    async getProgress(id) {
      let res = await getRefresh({ id: id })
      this.progress = res.progress
      if (this.progress < 100) {
        this.timer = setTimeout(() => {
          this.getProgress(id)
        }, 1000)
      } else {
        this.timer = null
        this.loading = false
      }
    }
  }
}
</script>
