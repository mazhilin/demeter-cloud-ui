<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      label-width="0"
    >
      <div class="login-header">
        <img class="login-logo" src="@/assets/logo/pivotal-cloud.png" alt="" />
      </div>
      <div class="title-container">
        <h3 class="title" style="font-size: x-large">Dcloud投票管控平台</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.account"
          name="account"
          size="small"
          type="text"
          auto-complete="off"
          placeholder="请输入登录账户"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          name="password"
          size="small"
          auto-complete="off"
          placeholder="请输入登录密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        class="login-btn"
        @click.native.prevent="handleLogin"
        >登录
      </el-button>

      <el-form-item prop="remember">
        <el-checkbox v-model="loginForm.remember">自动登录</el-checkbox>
      </el-form-item>

      <div class="link-box">
        <a class="link" href="javascript:;" />
        <a class="link" href="javascript:;" />
        <a class="link" href="javascript:;" />
      </div>
    </el-form>
    <div class="login-copyright">
      Copyright © 2020-2021 Technology Systems Incorporated. All rights
      reserved.<br />极点网络工作室
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (validateUsername == null) {
        callback(new Error("请输入正确的管理员用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("管理员密码长度应大于6"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: "",
        password: "",
        remember: false,
      },
      loginRules: {
        account: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      loading: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid && !this.loading) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
              console.log("redirect", this.redirect);
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.message,
              });
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
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
  .el-form-item__content {
    border-bottom: 1px solid #ddd;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
    }
  }

  .el-form-item {
    color: #454545;
  }
}
.login-copyright {
  color: #fff;
  width: 100%;
  position: fixed;
  bottom: 30px;
  text-align: center;
  line-height: 28px;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background-color: #fff;
  background-image: url("/static/pictures/background.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 380px;
    max-width: 100%;
    padding: 80px 40px 40px;
    margin: 50px auto 0;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
  }

  .login-header {
    position: absolute;
    left: 0;
    right: 0;
    top: -25px;
    z-index: 10;
    margin: auto;
    text-align: center;
    .login-logo {
      height: 82px;
      position: relative;
      vertical-align: middle;
    }
  }
  .show-pwd {
    position: absolute;
    right: 14px;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 45px;
    margin-top: 40px;
    font-size: 18px;
    font-weight: 600;
  }
  .link-box {
    text-align: center;
    margin-top: 40px;
    .link {
      color: #409eff;
      font-size: 12px;
      margin: 0 8px;
      font-weight: 700;
    }
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
      font-size: 16px;
      color: #409eff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .copyright {
    font-size: 12px;
    color: #fff;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-bottom: 20px;
    letter-spacing: 0.6px;
    a {
      font-weight: bold;
      border-bottom: 1px solid #fff;
      font-family: "PingFangSC-Semibold", sans-serif;
    }
  }
}
</style>
