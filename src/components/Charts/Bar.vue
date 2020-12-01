<template>
  <div ref="chartbox" :style="{height:height,width:width}"></div>
</template>

<script>
var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");

export default {
  props: {
    chartData: {
      type: Array
    },
    names: {
      type: Array
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
        //提示框，鼠标悬浮交互时的信息提示
        tooltip: {
          trigger: "item",
          formatter: "{b}:{c}"
        },
        xAxis: {
          type: "category",
          data: this.names,
          axisLabel: {
            fontSize: 14,
            color: "#000"
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            fontSize: 14
          }
        },

        series: [
          {
            data: chartData,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)"
            },
            label: {
              //饼图图形上的文本标签
              normal: {
                show: true,
                textStyle: {
                  fontSize: 14 //文字的字体大小
                }
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{c}",
                  position: 'top',
                  color: "#000"
                }
              }
            }
          }
        ]
      });
    }
  }
};
</script>