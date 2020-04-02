import Vue from 'vue'

Vue.directive('real-img', async function(el, binding) {
  let imgURL = binding.value
  if (imgURL) {
    let exist = await imageIsExist(imgURL)
    if (exist) {
      el.setAttribute('src', imgURL)
    }
  }
})

/**
 * 检测图片是否存在
 * @param url
 */
let imageIsExist = function(url) {
  return new Promise((resolve) => {
    var img = new Image()
    img.onload = function() {
      if (this.complete == true) {
        resolve(true)
        img = null
      }
    }
    img.onerror = function() {
      resolve(false)
      img = null
    }
    img.src = url
  })
}
