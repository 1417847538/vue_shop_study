<template>
  <div class="login_container"
       @keyup.enter="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="userimg_box">
        <img src="../assets/dog.png"
             alt="">
      </div>
      <!-- 登陆表单 -->
      <el-form class="login_form"
               :model="form"
               ref="loginForm"
               :rules="rules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon='iconfont icon-user'
                    v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prefix-icon
                      prop="password">
          <el-input prefix-icon="iconfont icon-3702mima"
                    v-model="form.password"
                    type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class='btns'>
          <el-button type="primary"
                     @click="login">登陆</el-button>

          <el-button type="warning"
                     @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }, { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.loginForm.resetFields()
    },
    login () {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) { return }
        const { data: res } = await this.$http.post('/login', this.form)
        if (res.meta.status !== 200) {
          this.$message.error('登陆失败')
        } else {
          this.$message.success(res.meta.msg)
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.userimg_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.userimg_box img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
