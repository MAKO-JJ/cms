<template>
  <div>
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 隐藏组件 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!--这部分才是自定义组件 -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
        <!--这部分才是自定义组件 -->
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      // 路由 index.js 配置的路径
      return this.$router.options.routes;
    },
    // 当前激活菜单的 index，交给路由配置文件控制
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    // 顶部logo
    showLogo() {
      // return this.$store.state.settings.sidebarLogo
      return true;
    },
    // 样式css
    variables() {
      return variables;
    },
    // 是否水平折叠收起菜单（仅在 mode 为 vertical(横向)时可用）
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
