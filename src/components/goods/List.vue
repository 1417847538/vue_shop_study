<template>
  <div>
    <!-- 顶部区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span='8'>
          <el-input placeholder="请输入内容"
                    v-model="goodsInfo.query"
                    clearable>
            <el-button slot='append'
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList"
                border
                stripe
                style="width: 100%">
        <el-table-column type="index"
                         align="center">
        </el-table-column>
        <el-table-column label="商品名称"
                         prop="goods_name">
        </el-table-column>
        <el-table-column label="商品价格(元)"
                         prop="goods_price"
                         width="100px"
                         align="center">
        </el-table-column>
        <el-table-column label="商品重量(kg)"
                         prop="goods_weight"
                         width="80px"
                         align="center">
        </el-table-column>
        <el-table-column label="创建时间"
                         prop="add_time"
                         width="190px"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat()}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="180px"
                         align="center">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row.goods_id)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="goodsInfo.pagenum"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="goodsInfo.pagesize"
                     layout="total, sizes , prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'list',
  data () {
    return {
      goodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.goodsInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.goodsInfo.pagesize = newSize
    },
    handleCurrentChange (newpage) {
      this.goodsInfo.pagenum = newpage
    },
    // 删除商品
    async removeGoods (nowid) {
      const confirmRes = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => { return err })

      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('goods/' + nowid)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败!')
      }
      this.$message.success('删除商品成功!')
      this.getGoodsList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
    }
  },
  watch: {
    goodsInfo: {
      deep: true,
      handler () {
        this.getGoodsList()
      }
    }
  }
}
</script>

<style scoped>
</style>
