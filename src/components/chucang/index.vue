<template>
  <div class="wrapper">
    <!-- 邮件类型 -->
    <div class="item">
      <h4 class="title">邮件类型</h4>
      <el-radio-group v-model="mailType">
        <el-radio label="1">进口</el-radio>
        <el-radio label="2">出口</el-radio>
      </el-radio-group>
    </div>
    <!-- 邮件类型 -->

    <!-- 上传附件 -->
    <div class="item">
      <img-upload ref="img_upload" @upload_set="uploadSet"></img-upload>
    </div>
    <div class="item">
      <text-upload ref="text_upload" @upload_set="uploadSetText"></text-upload>
    </div>
    <!-- 上传附件 -->

    <!-- 邮件原状态开始 -->
    <div class="item">
      <div class="status">
        <!-- 扣仓原因 -->
        <div class="originalStatus">
          <h4 class="title">扣仓原因</h4>
          <el-radio-group class="" v-model="holdReason">
            <div
              v-for="i in holdReasonOptions"
              :key="i.key"
              :label="i.key"
              class="reset_status_item"
            >
              <el-radio :label="i.key">{{ i.label }}</el-radio>
            </div>
          </el-radio-group>
          <el-input
            v-if="holdReason === 3 || holdReason === 17"
            :rows="2"
            type="textarea"
            placeholder="备注内容"
            v-model="otherHoldReason"
            clearable
          ></el-input>
        </div>

        <!-- 出仓原因 -->
        <div class="originalStatus">
          <h4 class="title">出仓原因</h4>
          <el-radio-group class="" v-model="outWarehouseReason">
            <div
              v-for="i in outWareholdReasonOptions"
              :key="i.key"
              :label="i.key"
              class="reset_status_item"
            >
              <el-radio :label="i.key">{{ i.label }}</el-radio>
            </div>
          </el-radio-group>
          <el-input
            v-if="
              outWarehouseReason === 1 ||
                outWarehouseReason === 2 ||
                outWarehouseReason === 6 ||
                outWarehouseReason === 7 ||
                outWarehouseReason === 9
            "
            :rows="2"
            type="textarea"
            placeholder="备注内容"
            v-model="otherOutWarehouseReason"
            clearable
          ></el-input>
        </div>
      </div>
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
import { holdReason, outWareholdReason } from "@/db/db";

import ImgUpload from "@/components/ImgUpload/index";
import TextUpload from "@/components/TextUpload/index";

export default {
  name: "chucang",
  components: {
    ImgUpload,
    TextUpload
  },
  data() {
    return {
      holdReasonOptions: holdReason,
      outWareholdReasonOptions: outWareholdReason,

      mailType: "1", // 邮件类型
      holdReason: 1,
      otherHoldReason: "", //备注
      outWarehouseReason: 1,
      otherOutWarehouseReason: "", //备注

      fileList: [],
      textList: []
    };
  },

  methods: {
    clear() {
      this.$refs.img_upload.clear();
      this.$refs.text_upload.clear();

      this.mailType = "1";
      this.holdReason = 1;
      this.otherHoldReason = "";
      this.outWarehouseReason = 1;
      this.otherOutWarehouseReason = "";
      this.fileList = [];
      this.textList = [];
    },

    uploadSet(e) {
      this.fileList = e;
    },
    uploadSetText(e) {
      this.textList = e;
    },

    // 过滤申请原因内容
    filterText(value) {
      const reg = /[<>]+/;
      if (reg.test(value)) {
        return false;
      } else {
        return true;
      }
    },

    handleConfirm() {
      let {
        mailType,
        holdReason,
        otherHoldReason,
        outWarehouseReason,
        otherOutWarehouseReason,
        fileList,
        textList
      } = this;

      // 校验申请原因内容
      if (otherHoldReason) {
        let filter = this.filterText(otherHoldReason);
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
        mailType,
        holdReason,
        otherHoldReason,
        outWarehouseReason,
        otherOutWarehouseReason,
        enclosureList
      };

      this.$emit("confirm", pms);
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  .title {
    padding: 10px 0;
  }
  .status {
    display: flex;
    justify-content: space-between;
    .originalStatus {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }
  .item {
    margin-bottom: 10px;
    background-color: #fff;
    padding: 10px;
    .reset_status_item {
      display: flex;
      align-items: center;
      height: 40px;
    }
  }
}
</style>
