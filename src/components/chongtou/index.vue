<template>
  <div class="wrapper">
    <!-- 申请原因 -->
    <div class="item">
      <h4 class="title">申请原因</h4>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="reason"
      ></el-input>
    </div>
    <!-- 申请原因 -->

    <!-- 上传附件 -->
    <div class="item">
      <img-upload ref="img_upload" @upload_set="uploadSet"></img-upload>
    </div>
    <div class="item">
      <text-upload ref="text_upload" @upload_set="uploadSetText"></text-upload>
    </div>
    <!-- 上传附件 -->

    <div class="status">
      <!-- 邮件原状态开始 -->
      <div class="item originalStatus">
        <h4>邮件原状态：</h4>
        <div class="reset_status_item">
          <el-radio v-model="originalStatus" label="0">征税放行</el-radio>
          <div class="reset_status_des">
            <div class="value">是否需删除税单</div>
            <el-radio-group v-model="isTaxBill_1">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="reset_status_item">
          <el-radio v-model="originalStatus" label="3">退运</el-radio>
        </div>
        <div class="reset_status_item">
          <el-radio v-model="originalStatus" label="4">入仓</el-radio>
          <el-input
            placeholder="请输入入仓原因"
            v-model="originalNote"
            clearable
          ></el-input>
        </div>
        <div class="reset_status_item">
          <el-radio v-model="originalStatus" label="5">免税放行</el-radio>
        </div>
      </div>
      <!-- 邮件原状态结束 -->

      <!-- 申请修改状态开始 -->
      <div class="item applyModifyStatus">
        <h4>申请修改状态：</h4>
        <div class="reset_status_item">
          <el-radio v-model="applyModifyStatus" label="0">征税放行</el-radio>
          <div class="reset_status_des">
            <div class="value">是否需删除税号</div>
            <el-radio-group v-model="isTaxBill_2">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="reset_status_item">
          <el-radio v-model="applyModifyStatus" label="3">退单</el-radio>
        </div>
        <div class="reset_status_item">
          <el-radio v-model="applyModifyStatus" label="4">退运</el-radio>
        </div>
        <div class="reset_status_item">
          <el-radio v-model="applyModifyStatus" label="5">查验</el-radio>
        </div>
        <div class="reset_status_item">
          <el-radio v-model="applyModifyStatus" label="6">入仓</el-radio>
          <el-input
            placeholder="请输入入仓原因"
            v-model="applyModifyNote"
            clearable
          ></el-input>
        </div>
        <div class="reset_status_item">
          <el-radio label="7">免税放行</el-radio>
        </div>
      </div>
      <!-- 申请修改状态结束 -->
    </div>

    <el-popconfirm @onConfirm="handleConfirm" title="是否确定提交？">
      <el-button style="width: 200px;" type="primary" slot="reference"
        >提交申请</el-button
      >
    </el-popconfirm>
  </div>
</template>

<script>
import { BASE_URL } from "@/request/api";
import { Message } from "element-ui";
import { originalStatus, applyModifyStatus } from "@/db/db";

import ImgUpload from "@/components/ImgUpload/index";
import TextUpload from "@/components/TextUpload/index";

export default {
  name: "chongtou",
  components: {
    ImgUpload,
    TextUpload
  },
  data() {
    return {
      options1: originalStatus,
      options2: applyModifyStatus,

      reason: "",

      fileList: [],
      textList: [],

      originalStatus: "0",
      isTaxBill_1: "1",
      originalNote: "",

      applyModifyStatus: "0",
      isTaxBill_2: "1",
      applyModifyNote: ""
    };
  },

  methods: {
    clear() {
      this.$refs.img_upload.clear();
      this.$refs.text_upload.clear();

      this.originalStatus = "0";
      this.reason = "";
      this.isTaxBill_1 = "1";
      this.originalNote = "";
      this.applyModifyStatus = "0";
      this.isTaxBill_2 = "1";
      this.applyModifyNote = "";
      this.fileList = [];
      this.textList = [];
    },

    uploadSet(e) {
      this.fileList = e;
    },
    uploadSetText(e) {
      this.textList = e;
    },
    handleConfirm() {
      let {
        reason,
        originalStatus,
        originalNote,
        applyModifyStatus,
        applyModifyNote,
        isTaxBill_1,
        isTaxBill_2,
        fileList,
        textList
      } = this;

      if (originalStatus == 0) {
        originalStatus = isTaxBill_1;
      }

      if (applyModifyStatus == 0) {
        applyModifyStatus = isTaxBill_2;
      }

      // 校验申请原因内容
      if (reason) {
        let filter = this.filterText(reason);
        if (!filter) {
          Message.error("请正确填写申请原因");
          return;
        }
      }

      var enclosureList = [];
      if (fileList.length > 0 || textList.length > 0) {
        let imgs = [];
        let documents = [];
        fileList.map((e, i) => {
          imgs[i] = {
            enclosure: e.enclosure,
            tag: e.tag
          };
        });

        textList.map((e, i) => {
          documents[i] = {
            enclosure: e.enclosure,
            tag: e.tag
          };
        });

        enclosureList = [...imgs, ...documents];
      }

      let pms = {
        reason,
        originalStatus,
        originalNote,
        applyModifyStatus,
        applyModifyNote,
        enclosureList //附件数组
      };

      this.$emit("onConfirm", pms);
    },

    // 过滤申请原因内容
    filterText(value) {
      const reg = /[<>]+/;
      if (reg.test(value)) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="less">
.wrapper {
  //   background-color: #fff;
  //   padding: 10px;
  .title {
    padding: 10px 0;
  }
  .status {
    display: flex;
    justify-content: space-between;
    .originalStatus {
      width: 49%;
    }
    .applyModifyStatus {
      width: 49%;
    }
  }
  .item {
    margin-bottom: 10px;
    background-color: #fff;
    padding: 10px;
    .reset_status_item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      .reset_status_des {
        display: flex;
        align-items: center;
        min-height: 30px;
        .value {
          font-size: 14px;
          padding-right: 10px;
          color: #606266;
        }
      }
    }
  }
}

.reset_status_item > .el-radio {
  min-width: 100px;
}
</style>
