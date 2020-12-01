<template>
  <div class="container">
    <mail-search
      ref="mail_search"
      :linktype="linkType"
      :title="tableTitle"
      :listtags="listTags"
      @setlist="setList"
    ></mail-search>

    <chong-tou ref="chongtou" @onConfirm="confirm"></chong-tou>
  </div>
</template>

<script>
import { createStatusApproval } from "@/request/api";
import MailSearch from "@/components/MailSearch/index";

// 引入组件
// import ImgUpload from "@/components/ImgUpload/index";
// import TextUpload from "@/components/TextUpload/index";
import ChongTou from "@/components/chongtou/index";

// import { getToken } from "@/utils/auth";
import { Message } from "element-ui";
// import { originalStatus, applyModifyStatus } from "@/db/db";

export default {
  components: {
    MailSearch,
    // ImgUpload,
    // TextUpload,
    ChongTou
  },
  data() {
    return {
      tableTitle: "",
      linkType: "",

      listTags: [
        {
          prop: "mailNo",
          label: "邮件号"
        },
        {
          prop: "weight",
          label: "重量(kg)"
        },
        {
          prop: "applyValue",
          label: "申报价值"
        },
        {
          prop: "typeName",
          label: "申报品名"
        }
      ],

      orderList: []
    };
  },

  //
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
      this.orderList = e;
    },

    async confirm(e) {
      // console.log(e);
      let {
        reason,
        enclosureList,
        originalStatus,
        originalNote,
        applyModifyStatus,
        applyModifyNote
      } = e;

      let { orderList, linkType } = this;

      createStatusApproval({
        orderList, //邮件信息
        reason, //申请原因
        enclosureList, // 附件数组
        originalStatus, //原邮件状态
        originalNote: originalNote || '-', //原邮件状态原因(无原因，传空字符串
        applyModifyStatus, //申请修改状态
        applyModifyNote: applyModifyNote || '-', // 申请修改状态原因(无原因，传空字符串
        linkType
      })
        .then(res => {
          Message.success("提交成功");

          this.$refs.mail_search.clear();
          this.$refs.chongtou.clear();
        })
        .catch(err => {});
    },

  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
}
</style>
