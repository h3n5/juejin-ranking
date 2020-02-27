const Tag = require('../Model/tag')

export async function findTag(params) {
  let conditions = {}
  let sort = {
    sort: '-subscribersCount'
  }
  if (params.title) {
    conditions.title = { $regex: title, $options: 'gi' }
  }
  const res = await Tag.find(conditions, sort).exec()

  console.log(res)
}

// export async function searchList(params) {
//   let page = 1
//   const { pageSize, pageIndex, filter } = params
//   let conditions = {}
//   let backCondition = {}
//   if (filter.title) {
//     conditions.title = { $regex: keyword, $options: 'gi' }
//   }
//   switch (rest) {
//     case 'title':
//       break
//     case 'tag':
//       conditions.labels = { $regex: keyword, $options: 'gi' }
//       break
//     case 'date':
//       if (
//         Array.isArray(keyword) &&
//         keyword.length === 2 &&
//         keyword[0] &&
//         keyword[1]
//       ) {
//         const start = new Date(keyword[0])
//         const end = new Date(keyword[1])
//         conditions.publishTime = { $gte: start, $lt: end }
//       }
//       break
//     default:
//       conditions.$or = [
//         {
//           title: {
//             $regex: keyword,
//             $options: 'gi'
//           }
//         },
//         {
//           labels: {
//             $regex: keyword,
//             $options: 'gi'
//           }
//         },
//         {
//           content: {
//             $regex: keyword,
//             $options: 'gi'
//           }
//         }
//       ]
//   }

//   const data = await Promise.all([
//     Post.find(
//       conditions,
//       {},
//       {
//         skip: (page - 1) * pageSize,
//         limit: pageSize,
//         sort: '-publishTime'
//       }
//     )
//       .populate('category')
//       .populate('comments', '_id')
//       .exec(),
//     Post.countDocuments(conditions).exec()
//   ])
//   const postList = data[0]
//   const count = data[1]
//   const pageCount = Math.ceil(count / pageSize)

//   return {
//     postList,
//     count,
//     hasNext: pageCount > page
//   }
// }
