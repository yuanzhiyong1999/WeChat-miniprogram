// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env: cloud.DYNAMIC_CURRENT_ENV
  }
)
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('task').where({
      _id: _.neq(0)
    }).update({
      data: {
        status: '未完成'
      }
    })
  } catch (e) {
    console.log(e)
  }
}