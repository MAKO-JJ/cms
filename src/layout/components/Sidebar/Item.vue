<script>
export default {
  name: 'MenuItem',
  functional: true, // 使组件无状态 (没有 data) 和无实例 (没有 this 上下文)。他们用一个简单的 render 函数返回虚拟节点使它们渲染的代价更小。
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // 渲染函数，参数接受上下文内容
  render(h, context) {
    // console.log(context);
    const { icon, title } = context.props
    const vnodes = []

    // 入口文件已经引入 icon/index.js 就是 svg-icon 组件
    // {icon} 对应的名字
    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
