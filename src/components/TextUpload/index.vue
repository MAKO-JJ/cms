<template>
  <!-- 上传附件 -->
  <div class="upload">
    <div class="title">
      <h4>上传附件</h4>
      <span>(附件不超过50M)</span>
    </div>

    <el-upload
      style="width: 30%;"
      :action="updateUrl"
      :headers="updateHeaders"
      :data="updateData"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :file-list="fileList"
      list-type="text"
      :limit="limit"
      :on-exceed="onExceed"
    >
      <el-button type="primary">点击上传</el-button>
    </el-upload>
  </div>
  <!-- 上传附件 -->
</template>

<script>
import { getToken } from "@/utils/auth";
import { BASE_URL } from "@/request/api";
import { Message } from "element-ui";
export default {
  name: "TextUpload",
  data() {
    return {
      // 上传图片设置
      updateHeaders: {},
      updateData: {},
      fileList: [],

      dialogImageUrl: "",
      dialogVisible: false,

      fileType: ["doc", "docx", "xls", "xlsx", "pdf"],

      limit: null
    };
  },
  props: {
    updateUrl: {
      type: String,
      default: `${BASE_URL}/approval/applicant/upload/file`
    },
    links: {
      type: Number
    }
  },

  watch: {
    // (this.updateUrl.indexOf("batchQueryMailInfo") != -1)
    "updateUrl": {
      handler(v, ov) {
        if (v.indexOf("batchQueryMailInfo") != -1) {
          this.limit = 1;
        }
      },
      immediate: true, // 第一次进入的时候就开始监听
      deep: true // 深度监听
    }
  },
  created() {
    const token = getToken();
    this.updateHeaders = {
      Authorization: token
    };
  },
  methods: {
    clear() {
      this.fileList = [];
    },

    beforeUpload(file) {
      var _self = this;
      return new Promise((resolve, reject) => {
        let token = getToken();
        _self.updateHeaders = {
          Authorization: token
        };

        // doc、docx、xls、xlsx、pdf png、jpg、jpeg
        const isImage = this.fileType.some(e => file.name.indexOf(e) != -1);

        // console.log(isImage);
        const isLt5M = file.size / 1024 / 1024 < 50;

        if (!isImage) {
          _self.$message.error("上传格式不符");
          reject(false);
        }

        if (!isLt5M) {
          _self.$message.error("只能上传文件大小小于50M");
          reject(false);
        }

        if (this.updateUrl.indexOf("batchQueryMailInfo") != -1) {
          _self.updateData = {
            linkType: this.links
          };
        }

        resolve(true);
      });
    },

    // 移除照片
    handleRemove(file, fileList) {
      // console.log(fileList);

      this.fileList = fileList;
      this.$emit("upload_set", fileList);
    },

    // 上传图片失败
    handleError() {
      Message.error("上传文件失败，请检查网络");
    },

    // 上传图片成功
    handleSuccess(file, fileList) {
      if (file.code === 200) {
        // console.log(file);  // 成功返回的数据
        // console.log(fileList); // 当前文件的全部数据

        this.$emit("uploadResult", file);

        // 自定义操作，组件限定了规则
        this.fileList.push({
          name: fileList.name,
          enclosure: file.data,
          tag: file.tag
        });

        Message.success("上传文件成功");
      } else {
        // 删除最后一个
        this.fileList.pop();
        Message.error(file.message);
      }

      this.$emit("upload_set", this.fileList);
    },
    onExceed(){
      Message.error('最大允许上传一个文件');
    }
  }
};
</script>

<style lang="less" scoped>
.upload {
  .title {
    display: flex;
    padding: 10px 0;
  }
}
</style>
