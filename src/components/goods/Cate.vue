<template>
  <div>
    <!-- 顶部区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table :data="cateList"
                  :columns="columns"
                  border
                  :selection-type="false"
                  :expand-type='false'
                  show-index>
        <!-- 是否有效 -->
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted===false"
             style="color:lightgreen"></i>
          <i class="el-icon-error"
             v-else
             style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort"
                  slot-scope="scope">
          <el-tag size="mini"
                  v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini"
                  type="success"
                  v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini"
                  type="warning"
                  v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt"
                  slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="editCate(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="removeCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="cateInfo.pagenum"
                     :page-sizes="[1, 3, 5, 10]"
                     :page-size="cateInfo.pagesize"
                     layout="total, sizes , prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加商品分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="50%"
               @close="addCateDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="addForm"
               :rules="addFormRules"
               status-icon
               ref="addFormRef"
               label-width="80px">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="addForm.cat_name"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader v-model="newParentCateList"
                       :options="parentCateList"
                       :props="cascaderProps"
                       @change="parentCateChange"
                       clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类"
               :visible.sync="editCateDialogVisible"
               width="30%"
               @close="editCateDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="editForm"
               :rules="editFormRules"
               status-icon
               ref="editFormRef"
               label-width="80px">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="editForm.cat_name"
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addEditCate">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'cate',
  data () {
    return {
      cateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'sort'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      //   增加分类
      addCateDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      newParentCateList: [],

      //   编辑分类
      editCateDialogVisible: false,
      editForm: {
        cat_name: '',
        cat_id: 0
      },
      editFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('/categories', { params: this.cateInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败!')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 切换切面显示数据多少
    handleSizeChange (newSize) {
      this.cateInfo.pagesize = newSize
      this.getCateList()
    },
    // 切换页码值
    handleCurrentChange (newPage) {
      this.cateInfo.pagenum = newPage
      this.getCateList()
    },
    // 添加增加分类对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 添加分类中获得父级分类数据
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败!')
      }
      this.parentCateList = res.data
    },
    parentCateChange () {
      if (this.newParentCateList.length === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        this.addForm.cat_pid = this.newParentCateList[this.newParentCateList.length - 1]
        this.addForm.cat_level = this.newParentCateList.length
      }
    },
    // 点击确定添加商品分类
    async addCate () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) { return false }
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('获取分类失败!')
        }
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 关闭增加分类对话框重置表单
    addCateDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.newParentCateList = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 打开编辑分类对话框并获取分类数据
    async editCate (nowid) {
      const { data: res } = await this.$http.get('categories/' + nowid)
      if (res.meta.status !== 200) {
        return this.$message.error('查询该分类失败!')
      }
      this.editForm = res.data
      this.editCateDialogVisible = true
    },
    editCateDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定更新编辑分类
    async addEditCate () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) { return false }
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, { cat_name: this.editForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error('更新分类失败!')
        }
        this.$message.success('更新分类成功!')
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 删除某分类
    async removeCate (nowid) {
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
      const { data: res } = await this.$http.delete('categories/' + nowid)
      if (res.meta.status !== 200) {
        return this.$message.error('删除该分类失败!')
      }
      this.$message.success('删除该分类成功!')
      this.getCateList()
    }
  }
}
</script>

<style>
</style>
