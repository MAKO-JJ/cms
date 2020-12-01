<template>
  <div class="container">
    <mail-search
      ref="mail_search"
      :linktype="linkType"
      :title="tableTitle"
      :listtags="listTags"
      @setlist="setList"
    ></mail-search>

    <!-- 物品列表 -->
    <div class="item">
      <h4 class="title">内件列表</h4>
      <el-table
        border
        fit
        :data="goods"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        class="goods_table"
      >
        <el-table-column prop="mailNo" label="邮件号"></el-table-column>
        <el-table-column prop="goodsName" label="物品名称"></el-table-column>
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column prop="value" label="价格币制"></el-table-column>
      </el-table>
    </div>
    <!-- 物品列表 -->

    <!-- 其它说明 -->
    <div class="item">
      <h4 class="title">其他说明备注</h4>
      <el-input
        autosize
        type="textarea"
        placeholder="请输入其他说明备注"
        v-model="remark"
        clearable
      ></el-input>
    </div>
    <!-- 其它说明 -->

    <div class="item">
      <img-upload ref="img_upload" @upload_set="uploadSet"></img-upload>
    </div>

    <div class="item">
      <text-upload ref="text_upload" @upload_set="uploadSetText"></text-upload>
    </div>

    <!-- 上传图片 -->
    <section class="bottom">
      <el-popconfirm @onConfirm="handleConfirm" title="是否确定提交？">
        <el-button style="width: 200px;" type="primary" slot="reference"
          >提交</el-button
        >
      </el-popconfirm>
    </section>
  </div>
</template>

<script>
import MailSearch from "@/components/MailSearch/index";
import ImgUpload from "@/components/ImgUpload/index";
import TextUpload from "@/components/TextUpload/index";
import { Message } from "element-ui";
import { createSupplementaryDeclarationApproval } from "@/request/api";

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

      mailList: [],
      fileList: [],
      textList: [],

      remark: "",
      goods: [],

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
          prop: "supplementType",
          label: "申报类型"
        },
        {
          prop: "idTypeName",
          label: "证件类型"
        },
        {
          prop: "typeName",
          label: "品名"
        },
        {
          prop: "totalValue",
          label: "价值"
        },
        {
          prop: "inWarehouseTime",
          label: "入仓时间"
        }
      ]
    };
  },
  created() {
    // 申请表类型
    this.linkType = this.$route.meta && this.$route.meta.linkType;

    this.tableTitle = this.$route.meta && this.$route.meta.title;
  },
  watch: {
    // mailNo
    // goodsName
    // num
    // value
    mailList: {
      handler(v, ov) {
        if (v.length > 0) {
          let arr = [];
          this.mailList.map((e, i) => {
            if (e.goods.length > 0) {
              e.goods.map((j, k) => {
                j.mailNo = e.mailNo;
              });
            } else {
              // 这里必须是数组形式
              e.goods = [{
                mailNo: e.mailNo,
                goodsName: "无",
                num: "无",
                value: "无"
              }];
            }
            arr = [...arr, ...e.goods];
          });
          this.goods = arr;
        } else {
          this.goods = [];
        }
      },
      immediate: true
    }
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },

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

    // BC000000006SB
    async handleConfirm() {
      let { remark } = this;
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
        enclosureList: [...imgs, ...documents],
        remark,
        linkType: this.linkType
      };
      let res = await createSupplementaryDeclarationApproval(pms);

      this.$refs.mail_search.clear();
      this.$refs.img_upload.clear();
      this.$refs.text_upload.clear();
      this.mailList = [];
      this.remark = "";
      this.goods = [];

      Message.success("提交成功");
    }
  }
};
</script>

<style lang="less">
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
  .goods_table{
    overflow: auto;
    max-height: 300px;
  }
}
</style>
