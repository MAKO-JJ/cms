<template>
  <div class="container">
    <mail-search
      ref="mail_search"
      :linktype="linkType"
      :title="tableTitle"
      :listtags="listTags"
      @setlist="setList"
    ></mail-search>

    <div class="item">
      <h4 class="title">内装实际物品</h4>
      <el-input v-model="packageContent"></el-input>
    </div>

    <div class="item">
      <img-upload ref="img_upload" @upload_set="uploadSet"></img-upload>
    </div>
    <div class="item">
      <text-upload ref="text_upload" @upload_set="uploadSetText"></text-upload>
    </div>

    <el-popconfirm @onConfirm="handleConfirm" title="是否确定提交？">
      <el-button style="width: 200px;" type="primary" slot="reference"
        >提交</el-button
      >
    </el-popconfirm>
  </div>
</template>

<script>
import MailSearch from "@/components/MailSearch/index";
import ImgUpload from "@/components/ImgUpload/index";
import TextUpload from "@/components/TextUpload/index";
import { Message } from "element-ui";
import { createPrintedAudioVideoTransferApproval } from "@/request/api";

export default {
  components: {
    MailSearch,
    ImgUpload,
    TextUpload
  },
  data() {
    return {
      linkType: "",
      tableTitle: "",

      // table
      listTags: [
        {
          prop: "mailNo",
          label: "邮件号"
        },
        {
          prop: "weight",
          label: "重量"
        },
        {
          prop: "typeName",
          label: "品名"
        },
        {
          prop: "inWarehouseTime",
          label: "入仓时间"
        }
      ],

      // photo
      fileList: [],
      textList: [],

      //
      mailList: [],
      
      packageContent: ""
      
    };
  },
  created() {
    // 申请表类型
    this.linkType = this.$route.meta && this.$route.meta.linkType;

    this.tableTitle = this.$route.meta && this.$route.meta.title;
  },

  methods: {
    uploadSet(e) {
      this.fileList = e;
    },
    uploadSetText(e) {
      this.textList = e;
    },

    // 同步父组件orderList
    setList(e) {
      this.mailList = e;
    },

    // HW000000008BG
    async handleConfirm() {
      let imgs = [];
      let documents = [];
      this.fileList.map((e, i) => {
        imgs[i] = {
          enclosure: e.enclosure,
          tag: e.tag
        };
      });

      this.textList.map((e, i) => {
        documents[i] = {
          enclosure: e.enclosure,
          tag: e.tag
        };
      });

      let pms = {
        ...this.mailList[0],
        packageContent: this.packageContent,
        enclosureList: [...imgs, ...documents],
        linkType: this.linkType
      };
      let res = await createPrintedAudioVideoTransferApproval(pms);

      this.$refs.mail_search.clear();
      this.$refs.img_upload.clear();
      this.$refs.text_upload.clear();
      this.mailList = [];
      this.packageContent = [];

      Message.success("提交成功");
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
  height: 100%;
  overflow: auto;

  .title {
    padding: 10px 0;
  }
  .item {
    margin-bottom: 10px;
    background-color: #fff;
    padding: 10px;
  }
}
</style>
