const mongoose = require('../server')
const Schema = mongoose.Schema
const articleSchema = new Schema(
  {
    article_id: {
      type: String
    },
    article_info: {
      article_id: String,
      user_id: String,
      category_id: String,
      tag_ids: [Number],
      visible_level: Number,
      link_url: String,
      cover_image: String,
      is_gfw: Number,
      title: String,
      brief_content: String,
      is_english: Number,
      is_original: Number,
      user_index: Number,
      original_type: Number,
      original_author: String,
      content: String,
      ctime: String,
      mtime: String,
      rtime: String,
      draft_id: String,
      view_count: Number,
      collect_count: Number,
      digg_count: Number,
      comment_count: Number,
      hot_index: Number,
      is_hot: Number,
      rank_index: Number,
      status: Number,
      verify_status: Number,
      audit_status: Number,
      mark_content: String
    },
    author_user_info: {
      user_id: String,
      user_name: String,
      company: String,
      job_title: String,
      avatar_large: String,
      level: Number,
      description: String,
      followee_count: Number,
      follower_count: Number,
      post_article_count: Number,
      digg_article_count: Number,
      got_digg_count: Number,
      got_view_count: Number,
      post_shortmsg_count: Number,
      digg_shortmsg_count: Number,
      isfollowed: Boolean,
      favorable_author: Number,
      power: Number
    },
    category: {
      category_id: String,
      category_name: String,
      category_url: String,
      rank: Number,
      ctime: Number,
      mtime: Number,
      show_type: Number
    },
    tags: {
      type: [
        {
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
        }
      ]
    },
    user_interact: {
      id: Number,
      omitempty: Number,
      user_id: Number,
      is_digg: Boolean,
      is_follow: Boolean,
      is_collect: Boolean
    }
  },
  {
    collection: 'Articles'
  }
)
module.exports = mongoose.model('Articles', articleSchema)
