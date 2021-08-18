<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div><img src="../assets/dog.png"
             alt=""><span>电商后台管理系统</span></div>
      <el-button type="info"
                 @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu background-color="#333744"
                 text-color="#fff">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>

            <el-menu-item index="1-4-1">
              <template>
                <i class="el-icon-location"></i>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>Main</el-main>
    </el-container>

  </el-container>

</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      menuList: []
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.menuList = res.data
    }
  }
}
</script>

<style>
.home_container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0 !important;
  background-color: #373d41;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 20px;
}
.el-header img {
  width: 50px;
  height: 50px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
