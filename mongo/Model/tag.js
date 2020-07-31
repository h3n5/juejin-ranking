const mongoose = require('../server')
const Schema = mongoose.Schema

const tagSchema = new Schema({
  tag_id: String,
  tag: {
    id: Number,
    tag_id: String,
    tag_name: String,
    color: String,
    icon: String,
    back_ground: String,
    show_navi: Number,
    tag_alias: String,
    post_article_count: Number,
    concern_user_count: Number
  },
  user_interact: {
    id: Number,
    omitempty: Number,
    user_id: Number,
    is_digg: Boolean,
    is_follow: Boolean,
    is_collect: Boolean
  }
})

module.exports = mongoose.model('tags', tagSchema)
