<template>
  <!-- 上传附件 -->
  <div class="upload">
    <div class="title">
      <h4>上传照片</h4>
      <span>(图片不超过50M)</span>
    </div>

    <el-upload
      :action="updateUrl"
      :headers="updateHeaders"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :on-preview="onPreview"
      list-type="picture-card"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
      <el-image
        style="height: 500px"
        fit="contain"
        :src="dialogImageUrl"
        alt="###"
      ></el-image>
    </el-dialog>
  </div>
  <!-- 上传附件 -->
</template>

<script>
import { getToken } from "@/utils/auth";
import { BASE_URL } from "@/request/api";
import { Message } from "element-ui";
export default {
  name: "ImgUpload",
  data() {
    return {
      // 上传图片设置
      updateHeaders: {},
      updateUrl: `${BASE_URL}/approval/applicant/upload/file`,
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,

      fileType: ["png", "jpg", "jpeg"]
    };
  },
  //
  created() {
    // 上传图片使用
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
      // console.log(file);
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
          _self.$message.error("只能上传图片大小小于50M");
          reject(false);
        }
        resolve(true);
      });
    },

    // 移除照片
    handleRemove(file, fileList) {
      var _tmp = this.fileList;
      this.fileList.map((e, i) => {
        if (e.name == file.name) {
          _tmp.splice(i, 1);
        }
      });
      this.fileList = _tmp;

      this.$emit("upload_set", this.fileList);
    },

    // 上传图片失败
    handleError(file, fileList) {
      Message.error("上传图片失败，请检查网络");
    },

    // 上传图片成功
    handleSuccess(file, fileList) {
      // console.log(file); // 请求回来的数据
      // console.log(fileList);
      if (file.code === 200) {
        // 自定义操作，组件限定了规则
        this.fileList.push({
          name: fileList.name,
          enclosure: file.data,
          tag: file.tag,
          url: fileList.url
        });
        Message.success("上传图片成功");
      } else {
        // 删除最后一个
        this.fileList.pop();
        Message.error(file.message);
      }

      this.$emit("upload_set", this.fileList);
    },

    // 预览图片
    onPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
