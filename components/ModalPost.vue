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
      <Button type="primary" @click="submit" :loading="loading">{{
        loading ? '同步中' : '同步'
      }}</Button>
    </div>
  </Modal>
</template>
<script>
import { refreshData } from '@/api'
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
        this.$emit('input', v)
      }
    }
  },
  data() {
    return {
      code: '',
      loading: false,
      progress: 0
    }
  },
  methods: {
    submit() {
      this.loading = true
      refreshData({ code: this.code }).then((res) => {
        if (res.success) {
          this.progress = res.msg
          setTimeout()
        } else {
          this.loading = false
          this.$Message.error('code error')
        }
      })
    }
  }
}
</script>
