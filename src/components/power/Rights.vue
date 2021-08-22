<template>
  <div>
    <!-- 顶部区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 权限主体区域 -->
      <el-table :data="rightsList"
                border
                :header-cell-style="{textAlign: 'center'}"
                :cell-style="{ textAlign: 'center' }">
        <el-table-column label='#'
                         type="index"></el-table-column>
        <el-table-column prop="authName"
                         label="权限名称">
        </el-table-column>
        <el-table-column prop="path"
                         label="路径">
        </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level=='1'"
                    type="success">二级</el-tag>
            <el-tag v-else
                    type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>

</template>

<script>
export default {
  name: 'rights',
  data () {
    return {
      rightsList: []
    }
  },

  created () {
    this.getRightsList()
  },

  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限管理列表失败!')
      }
      this.rightsList = res.data
    }
  }
}
</script>

<style>
</style>
