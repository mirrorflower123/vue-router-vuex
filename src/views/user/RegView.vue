<template>
  <div>
    <div>{{ title }}</div>
    <div style="display: flex">
      <el-form :model="user" :rules="rules" ref="myform">
        <el-form-item prop="username">
          <el-input v-model="user.username" placeholder="登录名"></el-input>
        </el-form-item>

        <el-form-item prop="passwoerd">
          <el-input v-model="user.passwoerd" placeholder="登录密码"></el-input>
        </el-form-item>

        <el-form-item prop="pwd2">
          <el-input v-model="user.username" placeholder="确认密码"></el-input>
        </el-form-item>

        <el-form-item prop="nickname">
          <el-input v-model="user.nickname" placeholder="姓名"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="reg" type="primary">注册</el-button>
          <el-button @click="reset" type="danger">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
let app
export default {
  name: 'UserRegView',
  data() {
    //
    function checkPwd2(rule, value, callback) {
      console.log(rule, value, callback)
      if (app.user.passwoerd == value) {
        //密码一致，调用空参数的callback表示校验通过
        callback()
      } else {
        //失败就传入错误信息参数
        callback(new Error('密码不一致'))
      }
    }

    return {
      title: '用户注册',
      user: {
        username: '',
        passwoerd: '',
        nickname: '',
        //校验密码的字段
        pwd2: '',
      },
      //校验规则
      rules: {
        username: [
          { required: true, message: '登录必须填写' },
          { min: 4, max: 16, message: '登录必须是4-16位' },
        ],
        passwoerd: [
          { required: true, message: '登录必须填写' },
          { min: 4, max: 16, message: '登录必须是4-16位' },
        ],
        nickname: [{ required: true, message: '登录必须填写' }],
        //validator表示启用自定义校验方式
        pwd2: [{ validator: checkPwd2 }],
      },
    }
  },
  computed: {},
  methods: {
    reset() {
      this.$refs.myform.resetFields()
    },
    reg() {
      this.$refs.myform.validate((valid) => {
        if (valid) {
          //校验成功的情况
          //作业一，完成注册的功能
          //作业二，给登录界面添加校验功能
        }
      })
    },
  },
  created() {
    app = this
    console.log(app.title)
  },
}
</script>
