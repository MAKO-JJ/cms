<template>
  <div ref="chartbox" :style="{height:height,width:width}"></div>
</template>

<script>
// 按需引入
// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/pie");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");

export default {
  props: {
    chartData: {
      type: Array
    },
    title: {
      type: String
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "350px"
    }
  },
  data() {
    return { chart: null };
  },
  // 数据是异步请求回来的，所以需要监听数据变化
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose(); // 释放托管资源
    this.chart = null;
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(this.$refs.chartbox);
      // 绘制图表
      this.setOptions(this.chartData);
    },
    setOptions(chartData) {
      this.chart.setOption({
        // color: ["#4F96E2", "#A0D8FE", "#24CCA9"], //饼图颜色
        title: {
          text: this.title,
          //   subtext: "=====",
          left: "center"
        },
        // 提示框
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
          // formatter:格式
          formatter: "{b} : {c} <br/> ({d}%)"
        },
        // 图例列表
        legend: {
          orient: "vertical", //布局朝向
          left: "left", // 距离左侧
          textStyle:{
            fontSize:14
          }
        },
        // 一系列
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"], // 水平，竖直
            data: chartData,
            // [
            //   { value: 335, name: "直接访问" },
            //   { value: 310, name: "邮件营销" }
            // ]
            // 修改提示信息得字体样式
            label: {
              //饼图图形上的文本标签
              normal: {
                show: true,
                textStyle: {
                  fontSize: 14 //文字的字体大小
                }
              }
            },
            // 指针的tips
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b}:{c}",
                  color: "#000"
                }
              }
            },
            // 当前选项的样式
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
};
</script>