<template>
  <div class="login-container">
    <div class="form-box">
      <div class="map">
        <img src="../login/earth.png" alt="">
        <p style="margin-top: -20px">智位导航</p>
        <p>后台管理系统</p>
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >

        <div class="title-container">
          <h4 class="title">注册</h4>
        </div>

        <el-form-item prop="userCode">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.userCode"
            placeholder="请输入账号"
            size="small"
            name="userCode"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="passWord">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.passWord"
              :type="passwordType"
              placeholder="请输入密码"
              name="passWord"
              tabindex="2"
              auto-complete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="passwordAgain">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.passwordAgain"
              :type="passwordType"
              placeholder="请确认密码"
              name="passwordAgain"
              tabindex="2"
              auto-complete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item prop="adminCode">
          <span class="svg-container">
            <i class="el-icon-success" />
          </span>
          <el-input
            v-model="loginForm.adminCode"
            placeholder="请输入授权码"
            size="small"
            name="adminCode"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;background-color: #27CDF0"
          @click.native.prevent="handleLogin"
        >登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请填写用户名'))
        } else {
          callback()
        }
      }
      const validateAdminCode = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请填写授权码'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('请填写至少6位密码'))
        } else {
          callback()
        }
      }
      const validatePasswordAgain = (rule, value, callback) => {
        if (value !== this.loginForm.passWord) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          userCode: '',
          passWord: '',
          passwordAgain: '',
          adminCode: ''
        },
        loginRules: {
          userCode: [{ required: true, trigger: 'blur', validator: validateUsername }],
          passWord: [{ required: true, trigger: 'blur', validator: validatePassword }],
          passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }],
          adminCode: [{ required: true, trigger: 'blur', validator: validateAdminCode }]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        showDialog: false,
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      // window.addEventListener('storage', this.afterQRScan)
    },
    mounted() {
      if (this.loginForm.userCode === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.passWord === '') {
        this.$refs.password.focus()
      }
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      checkCapslock({ shiftKey, key } = {}) {
        if (key && key.length === 1) {
          if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
            this.capsTooltip = true
          } else {
            this.capsTooltip = false
          }
        }
        if (key === 'CapsLock' && this.capsTooltip === true) {
          this.capsTooltip = false
        }
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            console.log('form', this.loginForm)
            this.loading = true
            this.$store.dispatch('user/register', this.loginForm)
              .then(() => {
                this.$router.push({ path: '/login' })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 17px;
      width: 85%;
      input {
        /*background: transparent;*/
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        /*padding: 12px 5px 12px 15px;*/
        color: #000;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item--medium .el-form-item__content {
      line-height: 20px
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: white;
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-image: url("../login/bg.png");
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
    .form-box {
      width: 660px;
      margin: 0 auto;
      background: rgba(1, 12, 38, 0.4);
      display: flex;
      flex-direction: row;
      border-radius: 10px;
      margin-top: 150px;
      padding: 10px;
      height: 350px;
      align-items: center;
    }
    .map {
      width: 300px;
      height: 250px;
      margin-right: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 300px;
        height: 300px;
      }
      p {
        position: absolute;
        color: #FEFEFE;
        font-size: 32px;
        font-weight: bolder;
      }
    }
    .login-form {
      position: relative;
      width: 320px;
      max-width: 100%;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 20px;
        color: $light_gray;
        margin: 0px auto 10px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
