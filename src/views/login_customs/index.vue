<template>
  <div class="login-container">
    <!-- <div class="section-background">
      <img class="section-background-img" :src="background" alt="bg">
    </div>-->
    <div class="mask"></div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">智慧通关邮件无纸化申请审批系统【海关】</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:80%"
        @click.native.prevent="handleLogin"
      >登 录</el-button>
    </el-form>
  </div>
</template>

<script>
// username的配置，用来本地测试
// import { validUsername } from '@/utils/validate'
import { setType } from "@/utils/auth";
import { Message } from "element-ui";
export default {
  name: "Login",
  data() {
    // Username规则
    const validateUsername = (rule, value, callback) => {
      // if (!validUsername(value)) {
      if (!value) {
        callback(new Error("请输入正确得用户名"));
      } else {
        callback();
      }
    };
    // Password规则
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码长度有误"));
      } else {
        callback();
      }
    };
    return {
      // background,
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      inPath: undefined,
    };
  },
  watch: {
    // 监听路由变化
    $route: {
      handler: function (route) {
        this.inPath = route.path;
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
        }
      },
      immediate: true,
    },
  },
  created() {
    // console.log(this.$route.path); //path: "/login_customs"
  },
  methods: {
    getAllRole() {},
    // pws栏的小眼睛控制文本显示隐蔽
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      // 赋予焦点的效果
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    // 登录事件
    // validate是ele框架的一个属性，对整个表单进行校验
    handleLogin() {
      // validator 上面设置的必须要有校验的逻辑，不然走不通
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 显示登陆等待动画
          this.loading = true;

          let pms = {
            ...this.loginForm,
            type: this.inPath === "/login_cms" ? 1 : 2,
          };
          // 调用登陆函数
          this.$store
            .dispatch("user/login", pms)
            .then((res) => {
              this.$router.push({
                path: this.redirect || "/",
              });
              //inPath
              setType(this.inPath);

              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
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
.mask {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
}
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    background-color: transparent;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      // input框自动填充颜色
      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 0px transparent inset !important;
      //   -webkit-text-fill-color: #fff !important;
      // }
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      transition-delay: 99999s;
      transition: color 99999s ease-out, background-color 99999s ease-out;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    width: 80%;
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
  // background-color: $bg;
  overflow: hidden;
  position: relative;
  background-image: url("../../assets/background_customs.jpg");
  background-position: top center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-form {
    width: 620px;
    max-width: 100%;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
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
      font-size: 26px;
      color: #fff;
      margin: 0px auto 40px auto;
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
}
</style>
