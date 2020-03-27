const state = () => ({
  localTags: [
    { title: '前端', stable: true },
    { title: '后端', stable: true },
    { title: 'JavaScript' },
    { title: 'GitHub' },
    { title: '架构' },
    { title: '面试' },
    { title: '算法' },
    { title: 'CSS' }
  ]
})
const getters = {
  localTagsFind: (state) => (title) => {
    return state.localTags.map((v) => v.title).includes(title)
  },
  localTagsStable: (state) => (title) => {
    return state.localTags
      .filter((v) => v.stable)
      .map((v) => v.title)
      .includes(title)
  }
}
const mutations = {
  _localTagsAdd(state, val) {
    if (!state.localTags.find((v) => v.title === val.title)) {
      state.localTags.push(val)
    }
  },
  _localTagsRm(state, val) {
    let index = state.localTags.findIndex((v) => v.title === val.title)
    if (index !== -1) {
      state.localTags.splice(val)
    }
  }
}

export default { namespaced: true, state, mutations, getters }
