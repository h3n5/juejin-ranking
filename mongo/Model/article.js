const mongoose = require('../server')

const Schema = mongoose.Schema

const articleSchema = new Schema(
  {
    collectionCount: Number,
    commentsCount: Number,
    content: String,
    title: String,
    gfw: Boolean,
    entryView: String,
    subscribersCount: Number,
    ngxCachedTime: Number,
    updatedAt: String,
    tags: [
      {
        ngxCachedTime: Number,
        ngxCached: Boolean,
        title: String,
        id: String
      }
    ],
    objectId: String,
    rankIndex: Number,
    hot: Boolean,
    autoPass: Boolean,
    originalUrl: String,
    buildTime: Number,
    createdAt: String,
    user: {
      collectedEntriesCount: Number,
      company: String,
      followersCount: Number,
      followeesCount: Number,
      role: String,
      postedPostsCount: Number,
      level: Number,
      isAuthor: Boolean,
      postedEntriesCount: Number,
      totalCommentsCount: Number,
      ngxCachedTime: Number,
      ngxCached: Boolean,
      viewedEntriesCount: Number,
      jobTitle: String,
      subscribedTagsCount: Number,
      totalCollectionsCount: Number,
      username: String,
      avatarLarge: String,
      objectId: String
    },
    author: String,
    screenshot: String,
    original: Boolean,
    hotIndex: Number,
    lastCommentTime: String,
    type: String,
    english: Boolean,
    category: {
      ngxCached: Boolean,
      title: String,
      id: String,
      name: String,
      ngxCachedTime: Number
    },
    viewsCount: Number,
    summaryInfo: String,
    isCollected: false
  },
  {
    collection: 'Articles'
  }
)

module.exports = mongoose.model('Articles', articleSchema)
