<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.linkTypeName" name="1">
        <div class="detail">
          <!-- 100-115 -->
          <section
            v-if="
              item.linkType == '100' ||
                item.linkType == '110' ||
                item.linkType == '115'
            "
          >
            <div class="table">
              <el-row :gutter="20">
                <el-col :span="12" class="row_item">
                  <div class="title">备注号:</div>
                  <div class="value">{{ item.remarkNo }}</div>
                </el-col>
                <el-col :span="12" class="row_item">
                  <div class="title">报告流水号:</div>
                  <div class="value">{{ detail.approvalNo }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24" class="row_item">
                  <div class="title">申请原因:</div>
                  <div class="value">{{ detail.reason }}</div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12" class="row_item">
                  <div class="title">原状态:</div>
                  <div class="value">{{ detail.originalStatus }}</div>
                </el-col>
                <el-col
                  :span="12"
                  class="row_item"
                  v-if="detail.originalStatus === '入仓'"
                >
                  <div class="title">原入仓原因:</div>
                  <div class="value">
                    {{ detail.originalNote || "(暂无)" }}
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12" class="row_item">
                  <div class="title">修改状态:</div>
                  <div class="value">{{ detail.applyModifyStatus }}</div>
                </el-col>
                <el-col
                  :span="12"
                  class="row_item"
                  v-if="detail.applyModifyStatus === '入仓'"
                >
                  <div class="title">修改入仓原因:</div>
                  <div class="value">
                    {{ detail.applyModifyNote || "(暂无)" }}
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-table
              v-if="detail.mailList"
              :data="detail.mailList"
              border
              style="width: 100%;"
            >
              <el-table-column label="邮件号" align="center" width="200">
                <template slot-scope="scope">{{ scope.row.mailNo }}</template>
              </el-table-column>
              <el-table-column label="申报价值" align="center" width="100">
                <template slot-scope="scope">{{
                  scope.row.applyValue
                }}</template>
              </el-table-column>
              <el-table-column label="品名" align="center">
                <template slot-scope="scope">{{ scope.row.typeName }}</template>
              </el-table-column>
              <el-table-column label="重量(kg)" align="center" width="100">
                <template slot-scope="scope">{{ scope.row.weight }}</template>
              </el-table-column>
            </el-table>
          </section>
          <!-- 100-115 -->

          <!-- 140-155  -->
          <div
            class="table"
            v-if="item.linkType == '140' || item.linkType == '150'"
          >
            <el-row>
              <el-col :span="24" class="row_item">
                <div class="title">审批单号:</div>
                <div class>{{ item.approvalNo }}</div>
              </el-col>
            </el-row>
            <section v-for="i in detail.mailList" :key="i.mailNo">
              <el-row :gutter="20">
                <el-col :span="12" class="row_item">
                  <div class="title">重量(kg):</div>
                  <div>{{ i.weight }}</div>
                </el-col>
                <el-col :span="12" class="row_item">
                  <div class="title">内件数:</div>
                  <div>{{ i.num }}</div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12" class="row_item">
                  <span class="title">申报价格:</span>
                  <span>{{ i.applyValue }}</span>
                </el-col>
                <el-col :span="12" class="row_item">
                  <span class="title">申报品名:</span>
                  <span>{{ i.mailName }}</span>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12" class="row_item">
                  <div class="title">内装物品:</div>
                  <div>{{ i.mailName }}</div>
                </el-col>
                <el-col :span="12" class="row_item">
                  <div class="title">入仓时间:</div>
                  <div>{{ i.inWarehouseTime }}</div>
                </el-col>
              </el-row>
            </section>

            <section>
              <el-row :gutter="20">
                <el-col :span="8" class="row_item">
                  <div class="title">邮件号:</div>
                  <div>{{ detail.mailNo }}</div>
                </el-col>
                <el-col :span="8" class="row_item">
                  <div class="title">品名:</div>
                  <div>{{ detail.typeName }}</div>
                </el-col>
                <el-col :span="8" class="row_item">
                  <div class="title">重量(kg):</div>
                  <div>{{ detail.weight }}</div>
                </el-col>
              </el-row>

              <el-row :gutter="20" v-if="detail.packageContent">
                <el-col :span="24" class="row_item">
                  <div class="title">内装实际物品:</div>
                  <div>{{ detail.packageContent }}</div>
                </el-col>
              </el-row>
            </section>

            <section>
              <el-row :gutter="20">
                <el-col :span="6" class="row_item">
                  <div class="title">申报类型:</div>
                  <div>{{ detail.supplementType }}</div>
                </el-col>
                <el-col :span="6" class="row_item">
                  <div class="title">收件人:</div>
                  <div>{{ detail.receiver }}</div>
                </el-col>
                <el-col :span="6" class="row_item">
                  <div class="title">证件类型:</div>
                  <div>{{ detail.idTypeName }}</div>
                </el-col>
                <el-col :span="6" class="row_item">
                  <div class="title">价值:</div>
                  <div>{{ detail.totalValue }}</div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="24" class="row_item">
                  <div class="title">其他说明:</div>
                  <div>{{ detail.remark }}</div>
                </el-col>
              </el-row>
            </section>
          </div>

          <!-- 出仓 -->
          <div
            class="table"
            v-if="
              item.linkType == '120' ||
                item.linkType == '125' ||
                item.linkType == '130' ||
                item.linkType == '135' ||
                item.linkType == '145' ||
                item.linkType == '155'
            "
          >
            <el-row :gutter="20">
              <el-col :span="12" class="row_item">
                <div class="title">审批单号:</div>
                <div class>{{ detail.approvalNo }}</div>
              </el-col>
              <el-col :span="12" class="row_item">
                <div class="title">邮件类型:</div>
                <div class>{{ detail.mailType }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12" class="row_item">
                <div class="title">扣仓原因:</div>
                <div class>{{ detail.holdReason || "(暂无)" }}</div>
              </el-col>
              <el-col :span="12" class="row_item">
                <div class="title">扣仓原因备注:</div>
                <div class>{{ detail.otherHoldReason || "(暂无)" }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12" class="row_item">
                <div class="title">出仓原因:</div>
                <div class>{{ detail.outWarehouseReason || "(暂无)" }}</div>
              </el-col>
              <el-col :span="12" class="row_item">
                <div class="title">出仓原因备注:</div>
                <div class>
                  {{ detail.otherOutWarehouseReason || "(暂无)" }}
                </div>
              </el-col>
            </el-row>
            <section v-for="i in detail.mailList" :key="i.mailNo">
              <el-row :gutter="20">
                <el-col :span="12" class="row_item">
                  <div class="title">重量(kg):</div>
                  <div>{{ i.weight }}</div>
                </el-col>
                <el-col :span="12" class="row_item">
                  <div class="title">内件数:</div>
                  <div>{{ i.num }}</div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8" class="row_item">
                  <span class="title">邮件号:</span>
                  <span>{{ i.mailNo }}</span>
                </el-col>
                <el-col :span="8" class="row_item">
                  <span class="title">品名:</span>
                  <span>{{ i.typeName }}</span>
                </el-col>
                <el-col :span="8" class="row_item">
                  <div class="title">入仓时间:</div>
                  <div>{{ i.inWarehouseTime }}</div>
                </el-col>
              </el-row>
            </section>
          </div>

          <!-- 图片 -->
          <div class="row">
            <div class="row_title">
              图片
              <i class="el-icon-caret-bottom"></i>
            </div>
            <div class="row_img">
              <viewer v-if="photos.length > 0" :images="photos" class="viewer" ref="viewer">
                <img
                  v-for="i in photos"
                  :key="i.enclosureName"
                  style="width: 100px; height: 100px"
                  :src="i.enclosurePath"
                />
              </viewer>
              <div v-if="photos.length == 0">暂无图片</div>
            </div>
          </div>

          <!-- 附件 -->
          <div class="row">
            <div class="row_title">
              附件
              <i class="el-icon-caret-bottom"></i>
            </div>
            <div class="row_text">
              <div class="text_item" v-for="i in files" :key="i.enclosureFile">
                <a class="target" target="_blank" :href="i.enclosurePath">{{
                  i.enclosureName
                }}</a>
              </div>
            </div>
          </div>

          <!-- 预览图片 -->
          <!-- <el-dialog
            :lock-scroll="false"
            :append-to-body="true"
            :visible.sync="visible"
          >
            <el-image
              style="height: 500px"
              fit="contain"
              :src="previewPicUrl"
              alt="###"
            ></el-image>
          </el-dialog> -->
          <!-- 预览图片 -->

          <!-- <viewer :images="photos" class="viewer" ref="viewer">
            <img
              v-for="i in photos"
              :src="i.enclosurePath"
              :key="i.enclosureName"
            />
          </viewer> -->

          <!-- 好物列表 -->
          <div class="row" v-if="detail.goods">
            <div class="row_title">
              内件列表
              <i class="el-icon-caret-bottom"></i>
            </div>
            <section v-for="i in detail.goods" :key="i.goodsName">
              <el-row :gutter="20">
                <el-col :span="12" class="row_i">
                  <div class="title">物品名称:</div>
                  <div>{{ i.goodsName }}</div>
                </el-col>
                <el-col :span="6" class="row_i">
                  <div class="title">数量:</div>
                  <div>{{ i.num }}</div>
                </el-col>
                <el-col :span="6" class="row_i">
                  <div class="title">价格币制:</div>
                  <div>{{ i.value }}</div>
                </el-col>
              </el-row>
            </section>
          </div>

          <!-- 税单列表 -->
          <div class="row" v-if="detail.taxList">
            <div class="row_title">
              税单列表
              <i class="el-icon-caret-bottom"></i>
            </div>
            <section v-for="i in detail.taxList" :key="i.num">
              <el-row :gutter="20">
                <el-col :span="8" class="row_i">
                  <div class="title">品名:</div>
                  <div>{{ i.typeName }}</div>
                </el-col>
                <el-col :span="8" class="row_i">
                  <div class="title">税号:</div>
                  <div>{{ i.taxNumber }}</div>
                </el-col>
                <el-col :span="8" class="row_i">
                  <div class="title">数量:</div>
                  <div>{{ i.num }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8" class="row_i">
                  <div class="title">完税价格:</div>
                  <div>{{ i.taxPrice }}</div>
                </el-col>
                <el-col :span="8" class="row_i">
                  <div class="title">税率:</div>
                  <div>{{ i.taxRate }}</div>
                </el-col>
                <el-col :span="8" class="row_i">
                  <div class="title">是否实施征税:</div>
                  <div>{{ i.taxed }}</div>
                </el-col>
              </el-row>
            </section>
          </div>

          <!-- 历史 -->
          <div class="row">
            <div class="row_title">
              历史
              <i class="el-icon-caret-bottom"></i>
            </div>

            <div class="row_img" v-if="historyList.length == 0">
              暂无历史数据
            </div>

            <el-collapse>
              <el-collapse-item
                v-for="i in historyList"
                :key="i.operatorTime"
                :title="
                  i.operatorTime +
                    ' / ' +
                    i.action +
                    ' / ' +
                    i.operator +
                    ' / ' +
                    i.link
                "
              >
                <div>操作人员：{{ i.operator }}</div>
                <div>环节：{{ i.link }}</div>
                <div>审核结果：{{ i.action }}</div>
                <div>审核说明：{{ i.remark }}</div>
              </el-collapse-item>
            </el-collapse>
          </div>

          <slot name="contorl"></slot>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="item.linkType | label"
        name="2"
        v-if="item.linkType == 145 || item.linkType == 155"
      >
        <div class="detail">
          <!-- 出仓 -->
          <div class="table" v-if="item.linkType == 145">
            <el-row :gutter="20">
              <el-col :span="24" class="row_item">
                <div class="title">审批单号:</div>
                <div class>{{ supplementary.approvalNo }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12" class="row_item">
                <div class="title">邮件号码:</div>
                <div class>{{ supplementaryInner.mailNo }}</div>
              </el-col>
              <el-col :span="12" class="row_item">
                <div class="title">重量(kg):</div>
                <div class>{{ supplementaryInner.weight || "(暂无)" }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12" class="row_item">
                <div class="title">收件人:</div>
                <div class>{{ supplementaryInner.receiver }}</div>
              </el-col>
              <el-col :span="12" class="row_item">
                <div class="title">电话:</div>
                <div class>{{ supplementaryInner.phone || "-" }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24" class="row_item">
                <div class="title">其他需要说明的情况:</div>
                <div class>{{ supplementaryInner.remark }}</div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12" class="row_item">
                <div class="title">申报类型:</div>
                <div class>{{ supplementaryInner.supplementType }}</div>
              </el-col>
              <el-col :span="12" class="row_item">
                <div class="title">证件类型:</div>
                <div class>{{ supplementaryInner.idTypeName }}</div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8" class="row_item">
                <div class="title">品名:</div>
                <div class>{{ supplementaryInner.typeName }}</div>
              </el-col>
              <el-col :span="8" class="row_item">
                <div class="title">价值:</div>
                <div class>{{ supplementaryInner.totalValue }}</div>
              </el-col>
              <el-col :span="8" class="row_item">
                <div class="title">入仓时间:</div>
                <div class>{{ supplementaryInner.inWarehouseTime }}</div>
              </el-col>
            </el-row>

            <section v-for="i in supplementaryInner.goods" :key="i.num">
              <el-row :gutter="20">
                <el-col :span="8" class="row_item">
                  <div class="title">物品名称:</div>
                  <div>{{ i.goodsName }}</div>
                </el-col>
                <el-col :span="8" class="row_item">
                  <div class="title">物品数量:</div>
                  <div>{{ i.num }}</div>
                </el-col>
                <el-col :span="8" class="row_item">
                  <div class="title">价格币值:</div>
                  <div>{{ i.value }}</div>
                </el-col>
              </el-row>
            </section>
          </div>

          <div class="table" v-if="item.linkType == 155">
            <el-row :gutter="20">
              <el-col :span="24" class="row_item">
                <div class="title">审批单号:</div>
                <div class>{{ supplementary.approvalNo }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12" class="row_item">
                <div class="title">邮件号:</div>
                <div class>{{ supplementaryInner.mailNo }}</div>
              </el-col>
              <el-col :span="12" class="row_item">
                <div class="title">重量(kg):</div>
                <div class>{{ supplementaryInner.weight }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12" class="row_item">
                <div class="title">申报品名:</div>
                <div class>{{ supplementaryInner.typeName || "-" }}</div>
              </el-col>
              <el-col :span="12" class="row_item">
                <div class="title">内装实际物品:</div>
                <div class>{{ supplementaryInner.packageContent }}</div>
              </el-col>
            </el-row>
          </div>
          <!-- 图片 -->
          <div class="row">
            <div class="row_title">
              图片
              <i class="el-icon-caret-bottom"></i>
            </div>
            <div class="row_img">
              <viewer v-if="photos.length > 0" :images="photos" class="viewer" ref="viewer">
                <img
                  v-for="i in photos"
                  :key="i.enclosureName"
                  style="width: 100px; height: 100px"
                  :src="i.enclosurePath"
                />
              </viewer>
              <div v-if="photos.length == 0">暂无图片</div>
            </div>
          </div>

          <!-- 附件 -->
          <div class="row">
            <div class="row_title">
              附件
              <i class="el-icon-caret-bottom"></i>
            </div>
            <div class="row_text">
              <div
                class="text_item"
                v-for="i in supplyFiles"
                :key="i.enclosureFile"
              >
                <a class="target" target="_blank" :href="i.enclosurePath">{{
                  i.enclosureName
                }}</a>
              </div>
            </div>
          </div>

          <!-- 预览图片 -->
          <el-dialog
            :lock-scroll="false"
            :append-to-body="true"
            :visible.sync="visible"
          >
            <el-image
              style="height: 500px"
              fit="contain"
              :src="previewPicUrl"
              alt="###"
            ></el-image>
          </el-dialog>
          <!-- 预览图片 -->

          <!-- 税单列表 -->
          <div class="row" v-if="supplementaryInner.taxList">
            <div class="row_title">
              税单列表
              <i class="el-icon-caret-bottom"></i>
            </div>
            <section v-for="i in supplementaryInner.taxList" :key="i.num">
              <el-row :gutter="20">
                <el-col :span="8" class="row_i">
                  <div class="title">品名:</div>
                  <div>{{ i.typeName }}</div>
                </el-col>
                <el-col :span="8" class="row_i">
                  <div class="title">税号:</div>
                  <div>{{ i.taxNumber }}</div>
                </el-col>
                <el-col :span="8" class="row_i">
                  <div class="title">数量:</div>
                  <div>{{ i.num }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8" class="row_i">
                  <div class="title">完税价格:</div>
                  <div>{{ i.taxPrice }}</div>
                </el-col>
                <el-col :span="8" class="row_i">
                  <div class="title">税率:</div>
                  <div>{{ i.taxRate }}</div>
                </el-col>
                <el-col :span="8" class="row_i">
                  <div class="title">是否实施征税:</div>
                  <div>{{ i.taxed }}</div>
                </el-col>
              </el-row>
            </section>
          </div>

          <!-- 历史 -->
          <div class="row">
            <div class="row_title">
              历史
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-collapse>
              <el-collapse-item
                v-for="i in supplementary.historyList"
                :key="i.operatorTime"
                :title="
                  i.operatorTime +
                    ' / ' +
                    i.action +
                    ' / ' +
                    i.operator +
                    ' / ' +
                    i.link
                "
              >
                <div>操作人员：{{ i.operator }}</div>
                <div>环节：{{ i.link }}</div>
                <div>审核结果：{{ i.action }}</div>
                <div>审核说明：{{ i.remark }}</div>
              </el-collapse-item>
            </el-collapse>
          </div>

          <slot name="contorl"></slot>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer/src/component.vue";

export default {
  name: "Detail",
  components: {
    Viewer
  },
  filters: {
    // linkType
    label(val) {
      switch (val) {
        case "145":
          return "补充申报审批表";
          break;
        case "155":
          return "音像制品移交审批表";
          break;

        default:
          break;
      }
    }
  },
  beforeDestroy() {
    this.activeName = "1";
  },
  data() {
    return {
      activeName: "1",
      // 预览图片
      visible: false,
      previewPicUrl: "",

      photos: [],
      files: [],
      supplyPhotos: [],
      supplyFiles: [],
      // photosLen: 0,

      supplementaryData: {},
    };
  },
  props: {
    detail: {
      type: Object
    },
    item: {
      type: Object
    },
    supplementary: {
      type: Object
    },
    supplementaryInner: {
      type: Object
    },
    linkType: {
      type: String
    },
    link: {
      type: String
    },
    historyList: {
      type: Array
    },
    enclosureList: {
      type: Array
    }
  },

  watch: {
    enclosureList: {
      handler(v) {
        if (v.length) {
          let photos = [];
          let files = [];
          v.map((e, i) => {
            if (e.enclosureType == "1") {
              photos.push(e);
            } else if (e.enclosureType == "2") {
              files.push(e);
            }
          });
          this.photos = photos;
          this.files = files;
        } else {
          this.photos = [];
          this.files = [];
        }
      },
      immediate: true,
      deep: true
    },
    "supplementary.enclosureList": {
      handler(v) {
        if (v && v.length) {
          let supplyPhotos = [];
          let supplyFiles = [];
          v.map((e, i) => {
            if (e.enclosureType == "1") {
              supplyPhotos.push(e);
            } else if (e.enclosureType == "2") {
              supplyFiles.push(e);
            }
          });
          this.supplyPhotos = supplyPhotos;
          this.supplyFiles = supplyFiles;
        } else {
          this.supplyPhotos = [];
          this.supplyFiles = [];
        }
      },
      immediate: true,
      deep: true
    },
    "detail.mailList": {
      handler(v) {
        if (v) {
          this.supplementaryData = v[0];
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
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

    // 预览图片
    // previewPic(e) {
    //   // this.previewPicUrl = e.enclosurePath;
    //   // this.visible = !this.visible;
    // }
  }
};
</script>

<style lang="less" scoped>
.container {
  .el-row {
    margin: unset !important;
  }
  .detail {
    .table {
      .row_item {
        border: 1px solid #f4f4f4;
        height: 40px;
        display: flex;
        align-items: center;
        margin: 0 !important;
        .title {
          margin-right: 10px;
        }
      }
    }
    .row {
      margin-top: 10px;
      .row_title {
        font-weight: 600;
        border: 1px solid #000;
        text-align: center;
        line-height: 40px;
      }
      .row_text {
        display: flex;
        flex-direction: column;
        .text_item {
          padding: 5px 0;
          .target {
            color: skyblue;
            text-decoration: underline;
          }
        }
      }
      .row_img {
        padding: 10px;
        border: 1px solid #f4f4f4;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .row_i {
        border: 1px solid #f4f4f4;
        height: 40px;
        display: flex;
        align-items: center;
        .title {
          margin-right: 10px;
          font-weight: 600;
        }
      }
    }

    .contorl {
      margin: 10px 0;
      border: 1px solid #f4f4f4;

      .panel {
        padding: 10px 0;
        .panel_title {
          font-size: 16px;
          font-weight: 600;
          padding: 5px 0;
          margin-bottom: 5px;
        }
        .radio-group-wrap {
          .el-radio-item {
            padding: 10px;
          }
        }
      }
      .upload {
        .upload_title {
          display: flex;
          align-items: center;
        }
      }
      .value {
        display: flex;
        align-items: center;
        padding: 5px 0;
        .value_title {
          color: #666;
          min-width: 120px;
        }
        .value_content {
          word-break: normal;
          width: auto;
          display: block;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
