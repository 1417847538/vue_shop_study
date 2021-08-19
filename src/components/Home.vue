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
      <el-aside :width="isCollapse
                ?'64px':'200px'">
        <div class="toggle_button"
             @click="toggleFold">|||</div>
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#4098ff"
                 unique-opened
                 router
                 :collapse=isCollapse
                 :collapse-transition=false
                 :default-active=activePath>
          <el-submenu :index="item.id+''"
                      v-for="item in menuList"
                      :key='item.id'>

            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="'/'+subitem.path"
                          v-for='subitem in item.children'
                          :key="subitem.id"
                          @click="saveNav('/'+subitem.path)">
              <i class="el-icon-menu"></i>
              <span>{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>

</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.menuList = res.data
      console.log(this.menuList)
    },
    // 点击按钮，切换菜单折叠与展开
    toggleFold () {
      this.isCollapse = !this.isCollapse
    },
    // 保存激活状态
    saveNav (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
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
  width: 64px;
  height: 64px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.toggle_button {
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  letter-spacing: 2px;
  cursor: pointer;
}
.el-menu {
  border-right: 0 !important;
}
.iconfont {
  margin-right: 10px;
}
</style>
