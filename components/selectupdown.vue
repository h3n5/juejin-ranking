<template>
  <div class="article-select">
    <Button type="text" @click.native="click">
      {{ item.name }}
      <Icon
        v-if="item.selected"
        :type="item.sort === 'desc' ? 'ios-arrow-down' : 'ios-arrow-up'"
      />
    </Button>
  </div>
</template>
<script>
export default {
  name: 'Compontent',
  props: {
    item: {
      type: Object,
      default: () => ({
        selected: false
      })
    }
  },
  data() {
    return {}
  },
  methods: {
    click() {
      if (this.item.selected) {
        this.$emit('changeSort')
      } else {
        this.$emit('click')
      }
    }
  }
}
</script>
