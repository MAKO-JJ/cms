<template>
  <div class="container">
    <mail-search
      ref="mail_search"
      :linktype="linkType"
      :title="tableTitle"
      :listtags="linkType == 155 ? listTags_2 : listTags"
      @setlist="setList"
    ></mail-search>

    <chu-cang ref="chucang" @confirm="onConfirm"></chu-cang>
  </div>
</template>

<script>
import MailSearch from "@/components/MailSearch/index";
import ChuCang from "@/components/chucang/index";

import { Message } from "element-ui";

import {
  queryReMailInfo,
  createOutWarehouseApproval,
  BASE_URL
} from "@/request/api";

export default {
  components: {
    MailSearch,
    ChuCang
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
          prop: "num",
          label: "件数"
        },
        {
          prop: "typeName",
          label: "内装物品"
        },
        {
          prop: "weight",
          label: "重量(kg)"
        },
        {
          prop: "inWarehouseTime",
          label: "入仓时间"
        }
      ],
      listTags_2: [
        {
          prop: "mailNo",
          label: "邮件号"
        },
        {
          prop: "typeName",
          label: "内装物品"
        },
        {
          prop: "weight",
          label: "重量(kg)"
        },
        {
          prop: "inWarehouseTime",
          label: "入仓时间"
        }
      ],

      mailList: []
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

    // 提交表单 BC000000010SB
    async onConfirm(e) {
      // console.log(e);
      let {
        mailType,
        holdReason,
        otherHoldReason,
        enclosureList,
        outWarehouseReason,
        otherOutWarehouseReason,
      } = e;
      let mailList = this.mailList;

      let pms = {};
      if (this.linkType == 145) {
        let supplementaryApprovalNo = mailList[0].approvalNo;
        pms = {
          mailList,
          mailType,
          holdReason,
          outWarehouseReason,
          otherOutWarehouseReason: otherOutWarehouseReason || '-',
          otherHoldReason: otherHoldReason || '-',
          enclosureList,
          linkType: this.linkType,
          supplementaryApprovalNo
        };
      } else if (this.linkType == 155) {
        let mail = mailList[0];
        let transferApprovalNo = mail.approvalNo;
        mail.num = 1;
        pms = {
          mailList: [mail],
          mailType,
          holdReason,
          enclosureList,
          linkType: this.linkType,
          outWarehouseReason,
          otherOutWarehouseReason: otherOutWarehouseReason || '-',
          otherHoldReason: otherHoldReason || '-',
          transferApprovalNo
        };
      } else {
        pms = {
          mailList,
          mailType,
          holdReason,
          enclosureList,
          linkType: this.linkType,
          outWarehouseReason,
          otherOutWarehouseReason: otherOutWarehouseReason || '-',
          otherHoldReason: otherHoldReason || '-'
        };
      }

      // console.log(pms);
      createOutWarehouseApproval(pms)
        .then(res => {
          this.$refs.mail_search.clear();
          this.$refs.chucang.clear();

          this.mailList = [];
          Message.success("提交成功");
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../styles/base";

.container {
  padding: 10px;
  height: 100%;
  overflow: auto;
  .item {
    padding: 10px;
    margin-top: 10px;
    background-color: #fff;
    .title {
      line-height: 40px;
      // border-bottom: 1px solid @font;
    }
    .el-radio-group {
      .el-radio {
        padding: 10px;
      }
    }
  }
}
</style>
