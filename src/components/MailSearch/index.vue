<template>
  <div class="wrapper">
    <h2 class="title">{{ title }}</h2>

    <!-- 内容 -->
    <div class="table">
      <div class="table_list">
        <el-table
          :data="orderList"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            v-for="i in listtags"
            :key="i.prop"
            :prop="i.prop"
            :label="i.label"
          >
            <template slot-scope="scope">{{ scope.row[i.prop] }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button
                @click="handleDelete(scope.$index)"
                type="danger"
                icon="el-icon-delete"
                size="small"
                >移除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 内容 -->

    <div class="control">
      <el-button
        :disabled="disabled"
        type="primary"
        @click="handleAdd"
        icon="el-icon-plus"
        >点击添加邮件信息</el-button
      >
    </div>

    <!-- 搜索弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :append-to-body="true"
      title="搜索邮件信息"
      :visible.sync="show"
      @close="handleClose"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单个邮件搜索" name="search">
          <div class="search">
            <el-input
              clearable
              v-model="searchData.mailNo"
              placeholder="请填写邮件编号"
            >
              <el-button
                slot="append"
                :loading="searchLoading"
                icon="el-icon-search"
                @click="onSearch"
                >搜索</el-button
              >
            </el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="批量邮件搜索" name="upload" class="tab-pane-upload">
          <!--  -->
          <text-upload
            ref="text_upload"
            :updateUrl="updateurl"
            @uploadResult="uploadSuccess"
            :links="linktype"
          ></text-upload>

          <!-- 模板 -->
          <a download href="./static/2020-08-12.xlsx"
            ><el-button type="primary">点击下载模板</el-button></a
          >
        </el-tab-pane>
      </el-tabs>

      <div class="error">
        <div class="error_item" v-for="i in error" :key="i">
          {{i}}
        </div>
      </div>
      <div class="table">
        <div class="table_list">
          <el-table style="margin: 10px 0" :data="searchData.list" border>
            <el-table-column
              v-for="i in listtags"
              :key="i.prop"
              :prop="i.prop"
              :label="i.label"
            >
              <template slot-scope="scope">{{ scope.row[i.prop] }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <el-button
                  @click="handleDeleteDialog(scope.$index)"
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <el-button :disabled="searchDisable" type="primary" @click="onPrimary"
        >确定选择</el-button
      >
    </el-dialog>
    <!-- 搜索弹框 -->

    <!-- 补充的搜索弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :append-to-body="true"
      title="选择对应审核表"
      :visible.sync="suppleyShow"
      @close="handleClose"
    >
      <div class="table">
        <div class="table_list">
          <el-table style="margin: 10px 0" :data="searchData.list" border>
            <el-table-column prop="approvalNo" label="单号">
              <template slot-scope="scope">{{ scope.row.approvalNo }}</template>
            </el-table-column>
            <el-table-column
              v-for="i in listtags"
              :key="i.prop"
              :prop="i.prop"
              :label="i.label"
            >
              <template slot-scope="scope">{{
                scope.row[i.prop] || "-"
              }}</template>
            </el-table-column>
            <el-table-column align="center" prop="detail" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="onSelected(scope.row)"
                  >选择</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <!-- 补充的搜索弹框 -->
  </div>
</template>

<script>
import {
  queryReMailInfo,
  querySupplementaryDeclaration,
  queryPrintedAudioVideoTransfer,
  BASE_URL
} from "@/request/api";
import { Message } from "element-ui";
import TextUpload from "@/components/TextUpload/index";

export default {
  name: "MailSearch",
  components: {
    TextUpload
  },
  data() {
    return {
      updateurl: `${BASE_URL}/approval/applicant/common/batchQueryMailInfo`,

      disabled: false,

      // search
      searchLoading: false,
      show: false,

      // suppleyShow
      suppleyShow: false,

      multipleSelection: [],

      searchData: {
        mailNo: "",
        list: []
      },

      // orderList
      orderList: [],

      searchDisable: false,

      activeName: "search",

      error: []
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    linktype: {
      type: Number,
      default: ""
    },
    listtags: {
      type: Array,
      default: []
    }
  },
  watch: {
    "searchData.list": {
      handler(v, ov) {
        if (v.length > 0) {
          this.searchDisable = false;
        } else {
          this.searchDisable = true;
        }
      },
      immediate: true, // 第一次进入的时候就开始监听
      deep: true // 深度监听
    },
    orderList: {
      handler(v, ov) {
        if (this.linktype >= 140) {
          if (v.length == 1) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    uploadSuccess(e) {
      // console.log(e);
      this.searchData.list = e.data;
      if (e.message) {
        // console.log(e.message.split("；"));
        this.error = e.message.split("；");
        // Message.error(e.message);
      }
    },

    handleClick(e) {
      // console.log(e);
    },

    // 删除行信息，删除自己
    handleDelete(index) {
      this.orderList.splice(index, 1);
      // 同步父组件列表数据
      this.$emit("setlist", this.orderList);
    },

    //
    handleDeleteDialog(index) {
      this.searchData.list.splice(index, 1);
    },

    handleAdd() {
      switch (this.linktype) {
        case 145:
          this.suppleyShow = !this.suppleyShow;
          this.onSearch();
          break;
        case 155:
          this.suppleyShow = !this.suppleyShow;
          this.onSearch();
          break;
        default:
          this.show = !this.show;
          break;
      }
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

    // 关闭搜索框的回调
    handleClose() {
      this.searchData = {
        mailNo: "",
        list: []
      };
      this.error = "";

      // 因为出仓申请是没有批量上传功能的
      this.$refs.text_upload && this.$refs.text_upload.clear();
      // 同步父组件列表数据
      this.$emit("setlist", this.orderList || []);
    },

    onSearch() {
      if (this.linktype == 145) {
        querySupplementaryDeclaration({})
          .then(res => {
            if (res.data) {
              // 返回数据是对象
              this.searchData.list = res.data.list;
            }
            this.searchLoading = false;
          })
          .catch(error => {
            this.searchLoading = false;
          });
      } else if (this.linktype == 155) {
        queryPrintedAudioVideoTransfer({})
          .then(res => {
            if (res.data) {
              // 返回数据是对象
              this.searchData.list = res.data.list;
            }
            this.searchLoading = false;
          })
          .catch(error => {
            this.searchLoading = false;
          });
      } else {
        let mailNo = this.searchData.mailNo;

        let index = this.filterList(this.orderList, mailNo);
        if (index) {
          this.$message({
            showClose: true,
            message: "申请列表中已存在相同邮件号"
          });
          return;
        }

        if (mailNo.trim()) {
          if (!this.filterText(mailNo)) {
            this.$message({
              showClose: true,
              message: "请正确输入邮件号码"
            });
            return;
          }
          queryReMailInfo({
            mailNo: this.searchData.mailNo,
            linkType: this.linktype
          })
            .then(res => {
              if (res.data) {
                // 返回数据是对象
                this.searchData.list = [{ ...res.data, tag: res.tag }];
              }
              this.searchLoading = false;
            })
            .catch(error => {
              this.searchLoading = false;
            });

          // 需要接受错误信息
          this.searchLoading = true;
        } else {
          this.$message({
            showClose: true,
            message: "请先输入邮件号再查询"
          });
        }
      }
    },

    // target合并后结果: []，list需要合并的内容: {}
    // some()是对数组中每一项运行给定函数，如果该函数对任一项返回true，则返回true。
    filterList(target, obj) {
      return target.some(e => e.mailNo.includes(obj));
    },

    // todo: 去重
    onPrimary() {
      this.orderList = [...this.orderList, ...this.searchData.list];
      this.show = false;
    },

    onSelected(e) {
      this.orderList = [{ ...e, tag: "mako" }];
      this.suppleyShow = false;
    },

    // 父组件提交申请成功后，清空数据
    clear() {
      this.orderList = [];
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../styles/base";

.wrapper {
  background-color: #fff;
  padding: 10px;
  margin-bottom: 10px;
  .title {
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid @font;
  }
  .control {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    // .search_btn {
    //   color: #fff;
    //   background-color: @from;
    //   border-color: @from;
    // }
  }
}
.el-tabs {
  min-height: 180px;
  .tab-pane-upload {
    display: flex;
    justify-content: space-between;
  }
  .upload {
    flex: 1;
  }
}
.table {
  max-height: 400px;
  overflow: auto;
  .table_none {
    padding: 20px 0;
    color: @font;
    text-align: center;
    font-weight: 600;
  }
}
.error {
  max-height: 100px;
  overflow: auto;
  display: flex;
  // justify-content: space-around;
  flex-wrap: wrap;
  color: red;
  .error_item{
    padding: 2px 5px;
  }
}
</style>
