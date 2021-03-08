<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <div :class="{ 'menu-open': !isCollapse }" class="menu-logo">
        <img class="logo" src="@/assets/logo/pivotal-cloud.png" alt="" />
        <div class="title">投票管控平台</div>
      </div>

      <sidebar-item
        v-for="route in permission_routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-logo {
  display: flex;
  align-items: center;
  text-align: center;
  &.menu-open {
    padding: 20px 10px;
    .title {
      display: block;
    }
  }
  .logo {
    width: 36px;
    height: 56px;
    object-fit: contain;
  }
  .title {
    display: none;
    color: rgb(191, 203, 217);
    font-size: 19px;
    font-weight: bold;
    margin-left: 10px;
  }
}
</style>
