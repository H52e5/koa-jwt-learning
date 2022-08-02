const jwt = require('jsonwebtoken')

const { createUser, getUserInfo } = require('../service/user.service')
const { userRegisterError } = require('../constant/err.types')

const { JWT_SECRET } = require('../config/config.default')

class UserController {
  async register(ctx, next) {
    // 获取数据
    const { user_name, password } = ctx.request.body

    // 操作数据库
    try {
      const res = await createUser(user_name, password)
      // console.log(res)
      ctx.body = {
        code: 200,
        message: '用户注册成功',
        data: {
          id: res.id,
          user_name: res.user_name
        }
      }
    }catch (err) {
      console.log(err)
      ctx.app.emit('error', userRegisterError, ctx)
    }
  }

  async login(ctx, next) {
    const { user_name } = ctx.request.body
    // 获取用户信息
    try {
      const {password, ...res} = await getUserInfo({ user_name })
      ctx.body = {
        code: 0,
        message: '用户登录成功',
        data: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (err) {
      console.error('用户登录失败', err)
    }
  }
}

module.exports = new UserController()
