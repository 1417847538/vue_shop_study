<template>
  <div>
    <!-- 顶部区域 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 警告区 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数!"
                type="warning"
                :closable="false"
                show-icon>
      </el-alert>
      <el-row class="list_top">
        <el-col>
          <span>请选择商品分类:</span>
          <el-cascader v-model="newCateList"
                       :options="cateList"
                       :props="cascaderProps"
                       @change="cateChange"
                       clearable>
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 动态列表数据 -->
      <el-tabs v-model="activeName"
               @tab-click="handleTabClick">
        <el-tab-pane label="动态参数"
                     name="many">
          <el-button type="primary"
                     :disabled='isDisabled'
                     @click="addCateDialogVisible=true">添加参数</el-button>
          <el-table :data="manyList"
                    border
                    stripe
                    :header-cell-style="{textAlign: 'center'}"
                    :cell-style="{ textAlign: 'center' }">
            <!-- 扩展区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="primary"
                        closable
                        v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        @close="handleClose(scope.row,index)">{{item}}
                </el-tag>
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label='#'
                             type="index"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope='scope'>
                <el-button type="primary"
                           icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态列表属性 -->
        <el-tab-pane label="静态属性"
                     name="only">
          <el-button type="primary"
                     :disabled='isDisabled'
                     @click="addCateDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyList"
                    border
                    stripe
                    :header-cell-style="{textAlign: 'center'}"
                    :cell-style="{ textAlign: 'center' }">
            <!-- 扩展区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="primary"
                        closable
                        v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        @close="handleClose(scope.row,index)">{{item}}
                </el-tag>
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label='#'
                             type="index"></el-table-column>
            <el-table-column prop="attr_name"
                             label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope='scope'>
                <el-button type="primary"
                           icon="el-icon-edit"
                           @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+titleText"
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
                      prop="attr_name">
          <el-input v-model="addForm.attr_name"
                    clearable></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->

    <el-dialog :title="'修改'+titleText"
               :visible.sync="editCateDialogVisible"
               width="50%"
               @close="editCateDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="editForm"
               :rules="editFormRules"
               status-icon
               ref="editFormRef"
               label-width="80px">
        <el-form-item label="分类名称"
                      prop="attr_name">
          <el-input v-model="editForm.attr_name"
                    clearable></el-input>
        </el-form-item>

      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',
  data () {
    return {
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      newCateList: [],
      activeName: 'many',
      manyList: [],
      onlyList: [],
      addCateDialogVisible: false,
      addForm: {
        attr_name: '',
        attr_sel: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      editCateDialogVisible: false,
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }

    }
  },
  created () {
    this.getCateList()
  },

  methods: {
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    cateChange () {
      this.getParamsData()
    },
    handleTabClick () {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData () {
      if (this.newCateList.length !== 3) {
        this.newCateList = []
        this.manyList = []
        this.onlyList = []
        return false
      }
      const { data: res } = await this.$http.get('categories/' + this.newCateList[2] + '/attributes', { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }

      res.data.forEach(item => {
        item.attr_vals === '' ? item.attr_vals = [] : item.attr_vals = item.attr_vals.split(' ')
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyList = res.data
      } else {
        this.onlyList = res.data
      }
    },
    // 添加属性对话框关闭重置
    addCateDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) { return false }
        const { data: res } = await this.$http.post('categories/' + this.newCateList[2] + '/attributes', { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addCateDialogVisible = false
      })
    },
    // 修改参数
    async showEditDialog (nowid) {
      const { data: res } = await this.$http.get('categories/' + this.newCateList[2] + '/attributes/' + nowid, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data
      this.editCateDialogVisible = true
    },
    editCateDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮修改参数信息
    editParams () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) { return false }
        const { data: res } = await this.$http.put('categories/' + this.newCateList[2] + '/attributes/' + this.editForm.attr_id, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editCateDialogVisible = false
      })
    },
    // 根据ID删除参数
    async removeParams (nowid) {
      const confirmRes = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => { return err })

      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('categories/' + this.newCateList[2] + '/attributes/' + nowid)
      if (res.meta.status !== 200) {
        return this.$message.error('删除该参数失败!')
      }
      this.$message.success('删除该参数成功!')
      this.getParamsData()
    },
    // 参数列表添加参数文本框操作
    showInput (obj) {
      obj.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    async handleInputConfirm (obj) {
      if (obj.inputValue.trim().length === 0) {
        obj.inputValue = ''
        obj.inputVisible = false
        return false
      }
      // 输出内容后续处理
      obj.attr_vals.push(obj.inputValue.trim())
      obj.inputValue = ''
      this.saveAttrValues(obj)
    },
    async saveAttrValues (obj) {
      const { data: res } = await this.$http.put('categories/' + this.newCateList[2] + '/attributes/' + obj.attr_id, { attr_name: obj.attr_name, attr_sel: this.activeName, attr_vals: obj.attr_vals.join(' ') })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败!')
      }
      this.$message.success('修改参数成功!')
      obj.inputVisible = false
    },
    // 删除对应参数
    handleClose (obj, index) {
      obj.attr_vals.splice(index, 1)

      this.saveAttrValues(obj)
    }
  },
  computed: {
    isDisabled () {
      if (this.newCateList.length === 3) {
        return false
      } else {
        return true
      }
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}

</script>

<style scoped>
.list_top {
  margin-top: 20px;
}

.el-cascader {
  margin-left: 10px;
}

.input-new-tag {
  width: 90px;
}
</style>
