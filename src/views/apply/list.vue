<template>
  <!-- app-container必须要加,表格样式 -->
  <div class="app-container">
    <!-- 查询条件时间 -->
    <section class="head-form">
      <el-form :inline="true">
        <el-form-item>
          <span class="createtime">创建时间:</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="非必填"
            placement="top-start"
          >
            <el-date-picker
              style="width: 250px"
              size="small"
              v-model="createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="onChage"
              unlink-panels
            ></el-date-picker>
          </el-tooltip>
        </el-form-item>
        <!-- 审批单号查询 -->
        <el-form-item>
          <el-tooltip
            class="item"
            effect="dark"
            content="非必填"
            placement="top-start"
          >
            <el-input
              clearable
              v-model="approvalNo"
              placeholder="请填写报告流水号查询"
              size="small"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <!-- 审批单号查询 -->

        <!-- 邮件号查询 -->
        <el-form-item>
          <el-tooltip
            class="item"
            effect="dark"
            content="非必填"
            placement="top-start"
          >
            <el-input
              clearable
              v-model="mailNo"
              placeholder="请填写邮件号查询"
              size="small"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <!-- 邮件号查询 -->

        <!-- 备注号查询 -->
        <el-form-item>
          <el-tooltip
            class="item"
            effect="dark"
            content="非必填"
            placement="top-start"
          >
            <el-input
              clearable
              v-model="remarkNo"
              placeholder="请填写备注号查询"
              size="small"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <!-- 备注号查询 -->

        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small"
            >查询/刷新</el-button
          >
        </el-form-item>
      </el-form>
    </section>
    <!-- 查询条件时间 -->

    <!-- 表格 -->
    <el-table
      fit
      style="width: 100%"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      highlight-current-row
    >
      <!-- <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column> -->
      <el-table-column label="备注号" align="center">
        <template slot-scope="scope">{{ scope.row.remarkNo || "-" }}</template>
      </el-table-column>
      <el-table-column label="报告流水号" align="center">
        <template slot-scope="scope">{{ scope.row.approvalNo }}</template>
      </el-table-column>
      <el-table-column label="邮件号" align="center">
        <template slot-scope="scope">{{ scope.row.mailNo }}</template>
      </el-table-column>

      <el-table-column label="申请人" align="center">
        <template slot-scope="scope">{{ scope.row.applyName }}</template>
      </el-table-column>

      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">{{ scope.row.applyTime }}</template>
      </el-table-column>

      <el-table-column label="审批表状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.approvalStatus == 0">初始状态</span>
          <span v-else-if="scope.row.approvalStatus == 1">审核中</span>
          <span v-else-if="scope.row.approvalStatus == 2">审核完成</span>
        </template>
      </el-table-column>

      <el-table-column label="当前环节" align="center">
        <template slot-scope="scope">{{ scope.row.linkName }}</template>
      </el-table-column>

      <el-table-column label="申请类型" align="center">
        <template slot-scope="scope">{{ scope.row.linkTypeName }}</template>
      </el-table-column>

      <el-table-column align="center" prop="detail" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="onDetail(scope.row.approvalNo, 'detail')"
            size="mini"
            >详情</el-button
          >
          <el-button
            v-if="scope.row.right && scope.row.action == 1"
            type="success"
            @click="onDetail(scope.row.approvalNo, 'revise')"
            size="mini"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.right && scope.row.action == 2"
            type="success"
            @click="onDetail(scope.row.approvalNo, 'approval')"
            size="mini"
            >审核</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->

    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      class="el-pagination"
    ></el-pagination>
    <!-- 分页器 -->

    <!-- 详情 -->
    <el-dialog
      :destroy-on-close="true"
      :lock-scroll="lock_scroll"
      :append-to-body="true"
      top="5px"
      title="查看详情"
      :visible.sync="detailVis"
    >
      <el-button @click="onPrint" type="primary">打印</el-button>
        <Detail
          ref="detailBox"
          :supplementary="supplementary"
          :supplementaryInner="supplementaryInner"
          :link="detail.link"
          :linkType="linkType"
          :item="detail"
          :detail="detailInner"
          :enclosureList="detail.enclosureList"
          :historyList="detail.historyList"
        ></Detail>
    </el-dialog>
    <!-- 详情 -->

    <!-- 修改 -->
    <el-dialog
      :destroy-on-close="true"
      :append-to-body="true"
      :before-close="handleClose"
      title="订单修改"
      :visible.sync="modify"
      :lock-scroll="lock_scroll"
    >
      <Detail
        :linkType="linkType"
        :detail="detailInner"
        :item="detail"
        :supplementary="supplementary"
        :supplementaryInner="supplementaryInner"
        :enclosureList="detail.enclosureList"
        :historyList="detail.historyList"
        :link="detail.link"
      >
        <!-- 邮件更改模板 -->
        <div class="contorl" slot="contorl">
          <div class="contorl_title">修改操作</div>

          <chong-tou
            v-if="linkType == '110,115' || linkType == '100'"
            ref="chongtou"
            @onConfirm="onRevise_100"
          ></chong-tou>

          <!-- 出仓模板 -->
          <section
            v-if="
              linkType == '120' ||
                linkType == '125' ||
                linkType == '130' ||
                linkType == '135' ||
                detail.linkType == '145' ||
                detail.linkType == '155'
            "
          >
            <chu-cang ref="chucang" @confirm="onRevise_120"></chu-cang>
          </section>

          <!-- 补充申报模板 -->
          <section v-if="detail.linkType == '140'">
            <div class="panel">
              <h3 class="panel_title">其他说明备注:</h3>
              <el-input
                autosize
                type="textarea"
                placeholder="请输入其他说明备注"
                v-model="supplementary.remark"
                clearable
              ></el-input>
            </div>

            <!-- 上传图片 -->
            <img-upload ref="img_upload" @upload_set="uploadSet"></img-upload>
            <text-upload
              ref="text_upload"
              @upload_set="uploadSetText"
            ></text-upload>

            <el-popconfirm @onConfirm="onRevise_145" title="是否确定提交？">
              <el-button
                style="margin-top: 20px"
                type="primary"
                slot="reference"
                >提交</el-button
              >
            </el-popconfirm>
          </section>

          <section v-if="detail.linkType == '150'">
            <div class="panel">
              <h3 class="panel_title">内装实际物品:</h3>
              <el-input
                placeholder="请输入内装实际物品"
                v-model="packageContent"
                clearable
              ></el-input>
            </div>

            <!-- 上传图片 -->
            <img-upload ref="img_upload" @upload_set="uploadSet"></img-upload>
            <text-upload
              ref="text_upload"
              @upload_set="uploadSetText"
            ></text-upload>

            <el-popconfirm @onConfirm="onRevise_155" title="是否确定提交？">
              <el-button
                style="margin-top: 20px"
                type="primary"
                slot="reference"
                >提交</el-button
              >
            </el-popconfirm>
          </section>
        </div>
      </Detail>
    </el-dialog>
    <!-- 修改 -->

    <!-- 审核 -->
    <el-dialog
      :destroy-on-close="true"
      :append-to-body="true"
      :before-close="handleClose"
      title="订单审核"
      :visible.sync="approvalVis"
      :lock-scroll="lock_scroll"
    >
      <Detail
        :supplementary="supplementary"
        :supplementaryInner="supplementaryInner"
        :link="detail.link"
        :linkType="linkType"
        :item="detail"
        :detail="detailInner"
        :enclosureList="detail.enclosureList"
        :historyList="detail.historyList"
      >
        <div slot="contorl" class="contorl">
          <div class="contorl_title">
            审核操作
            <i class="el-icon-caret-bottom"></i>
          </div>
          <!-- 补充申请-审核相关 -->
          <el-form
            ref="form"
            label-position="left"
            :model="form"
            label-width="170px"
          >
            <el-form-item prop="action" label="审核是否通过">
              <el-radio-group v-model="form.action">
                <el-radio label="1">通过</el-radio>
                <el-radio label="3">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="remark" label="审核意见">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
            <section
              v-if="
                form.action == '1' &&
                  linkType == '140,145' &&
                  detail.link == '140300'
              "
            >
              <el-form-item label="邮件号码">
                <el-input disabled :placeholder="detailInner.mailNo"></el-input>
              </el-form-item>
              <el-form-item prop="taxNumber" label="税号">
                <el-input v-model="form.taxNumber"></el-input>
              </el-form-item>

              <el-form-item prop="typeName" label="品名">
                <el-input v-model="form.typeName"></el-input>
              </el-form-item>

              <el-form-item prop="num" label="数量">
                <el-input v-model="form.num"></el-input>
              </el-form-item>

              <el-form-item prop="taxPrice" label="完税价格">
                <el-input v-model="form.taxPrice"></el-input>
              </el-form-item>

              <el-form-item prop="taxRate" label="税率">
                <el-input v-model="form.taxRate"></el-input>
              </el-form-item>

              <el-form-item prop="taxed" label="是否实施征税">
                <el-radio-group v-model="form.taxed">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item prop="inWarehouseReason" label="入仓原因">
                <el-radio-group v-model="form.inWarehouseReason">
                  <el-radio label="1">补充申报</el-radio>
                  <el-radio label="2">人工查验报关</el-radio>
                  <el-radio label="3">电脑审核报关</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item
                prop="passInPersonal"
                label="是否同意按个人物品放行"
              >
                <el-radio-group v-model="form.passInPersonal">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </section>
            <section v-if="form.action == '1' && detail.link == '150300'">
              <el-form-item prop="embargo" label="是否包含禁运物品">
                <el-radio-group v-model="form.embargo">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </section>
          </el-form>
          <!-- <el-popconfirm
            @onConfirm="onApproval(detail.link)"
            title="是否确定提交？"
          > -->
          <el-button type="primary" @click="onApproval(detail.link)"
            >提交</el-button
          >
          <!-- </el-popconfirm> -->
        </div>
      </Detail>
    </el-dialog>
    <!-- 审核 -->
  </div>
</template>

<script>
import {
  approvalList,
  approvalDetaiL,
  approvalAction,
  modifyStatusApproval,
  modifyOutWarehouseApproval,
  supplementaryDeclaration,
  modifySupplementaryDeclarationApproval,
  modifyPrintedAudioVideoTransferApproval,
  printedAudioVideoTransfer,
  BASE_URL
} from "@/request/api";
import Detail from "./children/detail";
import ImgUpload from "@/components/ImgUpload/index";
import TextUpload from "@/components/TextUpload/index";
import ChongTou from "@/components/chongtou/index";
import ChuCang from "@/components/chucang/index";

import { getToken } from "@/utils/auth";
import { Message } from "element-ui";
import { mapGetters } from "vuex";
import { $_upload } from "@/utils/table";

// import { pastTime } from "gettimesjs";
// import { parseTime } from "@/utils/index.js";

export default {
  components: {
    Detail,
    ImgUpload,
    TextUpload,
    ChongTou,
    ChuCang
  },
  filters: {},
  data() {
    return {
      lock_scroll: true,

      linkType: "",

      historyListLen: "",
      resizable: false, // 表格是否允许拖动

      list: [], // 表格数据
      total: 0,
      pageNo: 1, // 当前页码，1 开始
      pageSize: 10, // 一页显示
      beginTime: "", // 查询条件开始时间
      endTime: "", // 查询条件结束时间
      approvalNo: "", // 查询条件审批单号
      mailNo: "",
      remarkNo: "",

      listLoading: false,
      deptId: -1, // 当前状态，下标值
      createTime: [], // 绑定开始结束日期的值

      // 详情页/修改/审核
      detailVis: false,
      modify: false,
      approvalVis: false,
      detail: {}, // 查看详情返回结果
      detailInner: {}, // 查看详情返回结果
      supplementary: {},
      supplementaryInner: {},

      // 审核相关
      form: {
        action: "1",
        remark: "",
        inWarehouseReason: "1",

        // taxList
        taxNumber: "",
        typeName: "",
        num: "",
        taxPrice: "",
        taxRate: "",
        taxed: "1",

        passInPersonal: "1",

        embargo: "2"
      },

      supplementary: {
        remark: ""
      },

      packageContent: "",

      // 图片上传
      fileList: [],
      textList: []
    };
  },

  watch: {
    "detail.historyList": {
      handler(v, ov) {
        this.historyListLen = v.length;
      },
      deep: true
    }
  },

  computed: {
    ...mapGetters(["name"])
  },

  // 周期函数
  created() {
    // 申请表类型
    this.linkType = this.$route.meta && this.$route.meta.linkType;

    this.fetchData();
  },

  methods: {
    onPrint() {
      this.$print(this.$refs.detailBox);
    },
    onApproval(e) {
      switch (e) {
        case "140300":
          this.onApprovalAction_other();
          break;
        case "150300":
          this.onTransfer();
          break;

        default:
          this.onApprovalAction();
          break;
      }
    },
    // 修改出仓申请
    async onRevise_120(e) {
      let {
        mailType,
        holdReason,
        otherHoldReason,
        enclosureList,
        outWarehouseReason,
        otherOutWarehouseReason
      } = e;

      let pms = {
        approvalNo: this.detail.approvalNo,
        mailType,
        holdReason,
        otherHoldReason: otherHoldReason || "-",
        outWarehouseReason,
        otherOutWarehouseReason: otherOutWarehouseReason || "-",
        enclosureList,
        linkType: this.detail.linkType
      };

      modifyOutWarehouseApproval(pms)
        .then(res => {
          this.$refs.chucang.clear();

          this.modify = false;
          this.pageNo = 1;
          this.fetchData();
          Message.success("提交成功");
        })
        .catch(err => {});
    },

    // 上传图片
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

    async onRevise_100(e) {
      let {
        reason,
        enclosureList,
        originalStatus,
        originalNote,
        applyModifyStatus,
        applyModifyNote
      } = e;

      let { linkType, approvalNo } = this.detail;

      modifyStatusApproval({
        approvalNo, //邮件信息
        reason, //申请原因
        enclosureList, // 附件数组
        originalStatus, //原邮件状态
        originalNote: originalNote || "-", //原邮件状态原因(无原因，也要传东西
        applyModifyStatus, //申请修改状态
        applyModifyNote: applyModifyNote || "-", // 申请修改状态原因(无原因，也要传东西
        linkType
      })
        .then(res => {
          this.modify = !this.modify;
          this.pageNo = 1;
          this.fetchData();

          Message.success("提交成功");

          this.$refs.chongtou.clear();
        })
        .catch(err => {});
    },

    // 确定修改表单——140
    async onRevise_145() {
      let { approvalNo } = this.detail;

      let filter = this.filterText(this.supplementary.remark);
      if (!filter) {
        Message.error("请正确填写备注");
        return;
      }

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
        remark: this.supplementary.remark,
        approvalNo,
        enclosureList: [...imgs, ...documents]
      };
      await modifySupplementaryDeclarationApproval(pms);

      this.$refs.img_upload.clear();
      this.$refs.text_upload.clear();

      this.supplementary = {
        remark: ""
      };

      this.modify = !this.modify;

      this.pageNo = 1;
      this.fetchData();
      Message.success("提交成功");
    },

    async onRevise_155() {
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
        approvalNo: this.detail.approvalNo,
        packageContent: this.packageContent,
        enclosureList: [...imgs, ...documents]
      };
      let res = await modifyPrintedAudioVideoTransferApproval(pms);

      this.$refs.img_upload.clear();
      this.$refs.text_upload.clear();

      this.modify = !this.modify;

      this.pageNo = 1;
      this.fetchData();

      Message.success("提交成功");
    },

    // 修改或者审核弹窗关闭的时候，清理数据
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          // 审核相关
          this.form = {
            action: "1",
            remark: "",
            inWarehouseReason: "1",

            // taxList
            taxNumber: "",
            typeName: "",
            num: "",
            taxPrice: "",
            taxRate: "",
            taxed: "1",

            passInPersonal: "1",

            embargo: "2"
          };

          this.supplementary = {
            remark: ""
          };

          this.fileList = [];
          done();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 确定审核表单
    async onApprovalAction() {
      // 确定审核表单
      let { action, remark } = this.form;
      let { approvalNo, link } = this.detail;

      // 校验申请原因内容
      let filter = this.filterText(remark);
      if (!filter) {
        Message.error("请正确填写申请原因");
        return;
      }

      // 发请求
      await approvalAction({
        action, //邮件信息
        remark, //申请原因
        link, // 环节编码
        approvalNo //审批单号
      });

      this.$refs.form.resetFields();

      this.approvalVis = false;
      this.pageNo = 1;
      this.fetchData();
      Message.success("提交审核成功");
    },

    async onApprovalAction_other() {
      let {
        action,
        remark,
        inWarehouseReason,
        passInPersonal,
        taxNumber,
        typeName,
        num,
        taxPrice,
        taxRate,
        taxed
      } = this.form;
      let { approvalNo, link } = this.detail;

      // 校验申请原因内容
      let filter = this.filterText(remark);
      if (!filter) {
        Message.error("请正确填写申请原因");
        return;
      }

      let pms = {
        approvalNo,
        link,
        action,
        remark,
        inWarehouseReason,
        passInPersonal,
        taxList: [
          {
            taxNumber,
            typeName,
            num,
            taxPrice,
            taxRate,
            taxed
          }
        ]
      };
      // 发请求
      await supplementaryDeclaration(pms);

      this.$refs.form.resetFields();

      this.approvalVis = false;
      this.pageNo = 1;
      this.fetchData();
      Message.success("提交审核成功");
    },

    async onTransfer() {
      let { action, remark, embargo } = this.form;
      let { approvalNo, link } = this.detail;

      // 校验申请原因内容
      let filter = this.filterText(remark);
      if (!filter) {
        Message.error("请正确填写申请原因");
        return;
      }

      let pms = {
        approvalNo,
        link,
        action,
        remark,
        embargo
      };
      // 发请求
      await printedAudioVideoTransfer(pms);

      this.$refs.form.resetFields();

      this.approvalVis = false;
      this.pageNo = 1;
      this.fetchData();
      Message.success("提交审核成功");
    },

    // 分页器触发方法
    handleCurrentChange(e) {
      this.pageNo = e;
      this.fetchData();
    },

    // 选中日期
    onChage(e) {
      console.log(e);
      if (e) {
        this.beginTime = `${e[0]} 00:00:00`;
        this.endTime = `${e[1]} 23:59:59`;
      } else {
        this.beginTime = "";
        this.endTime = "";
      }
    },

    // 查询/刷新
    onSubmit() {
      // 页码
      this.pageNo = 1;
      this.fetchData();
    },

    // 根据申请单号查看详情
    async onDetail(approvalNo, type) {
      this.listLoading = true;
      let res = await approvalDetaiL({ approvalNo });

      this.listLoading = false;

      this.detail = res.data;
      this.detailInner = res.data.detail || {};

      if (res.data.detail) {
        let supplementaryApprovalNo = res.data.detail.supplementaryApprovalNo;
        let transferApprovalNo = res.data.detail.transferApprovalNo;
        if (supplementaryApprovalNo || transferApprovalNo) {
          let supplementary = await approvalDetaiL({
            approvalNo: supplementaryApprovalNo || transferApprovalNo
          });
          if (supplementary.data) {
            this.supplementary = supplementary.data || {};
            this.supplementaryInner = supplementary.data.detail || {};
          }
        }
      }

      switch (type) {
        case "detail":
          this.detailVis = !this.detailVis;
          break;
        case "approval":
          this.approvalVis = !this.approvalVis;
          break;
        case "revise":
          this.modify = !this.modify;
          break;

        default:
          break;
      }
    },

    // 列表请求
    fetchData() {
      this.listLoading = true;
      let {
        approvalNo,
        beginTime,
        endTime,
        pageSize,
        pageNo,
        mailNo,
        remarkNo
      } = this;
      // 接口规定，填 null 才有效果
      approvalList({
        mailNo: mailNo || null,
        approvalNo: approvalNo || null,
        beginTime,
        endTime,
        pageSize,
        pageNo,
        linkType: this.linkType,
        remarkNo: remarkNo || null
      })
        .then(res => {
          if (res.code === 200) {
            let { list, pageNo, pageSize, total } = res.data;
            this.list = list;
            this.total = total;
            this.pageSize = pageSize;
            this.pageNo = pageNo;
            this.listLoading = false;
          }
        })
        .catch(error => {
          this.listLoading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el_drawer {
  .el-drawer__body {
    overflow-y: scroll;
  }
}
.el-form-item {
  margin: 0;
  padding-left: 12px;
}
.createtime {
  padding: 0 12px 0 0;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
  line-height: 32px;
}
.el-pagination {
  margin-top: 12px;
}
.app-container {
  padding: 10px 20px;
  .head-form {
    margin-bottom: 10px;
  }
}
.contorl_title {
  text-align: center;
  border: 1px solid #000;
  line-height: 40px;
  font-weight: 600;
}
</style>
