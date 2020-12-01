<template>
  <el-dialog :title="title" :append-to-body="true" top="10px" :visible.sync="show">
    
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    close(num) {
      this.$emit("close", num);
    },
  },
  watch: {
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
</style>