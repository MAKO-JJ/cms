<template>
  <div class="container">
    <h2 class="title">用户设置</h2>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="ruleform"
    >
      <el-form-item label="原密码" prop="originalPassword">
        <el-input
          type="password"
          v-model="ruleForm.originalPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePassword } from "@/request/api";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        password: "",
        checkPass: "",
        originalPassword: "",
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      // updatePassword
      this.$refs["ruleForm"].validate((valid) => {
        console.log(valid);
        if (valid) {
          let { password, originalPassword } = this.ruleForm;
          updatePassword({
            password,
            originalPassword,
          }).then((res) => {
            this.$message.success("修改成功");
            this.$router.push({
              path: "/",
            });
          });
        } else {
          this.$message.error("填写信息错误");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
  // box-sizing: border-box;
  background-color: #fff;
  .title {
    padding: 10px 0;
  }
  .ruleform {
    width: 500px;
  }
}
</style>