<template>
  <div>
    <!-- 顶部区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 添加角色区域 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="addDialogVisible = true">添加角色 </el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList"
                border
                :header-cell-style="{textAlign: 'center'}"
                :cell-style="{ textAlign: 'center' }">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children"
                    :key='index1'
                    class="top_line bottom_line"
                    type="flex"
                    align="middle">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close='removeRight(scope.row,item1.id)'>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item1.children"
                        :key="index2"
                        class="bottom_line bottom_no_line "
                        type="flex"
                        align="middle">
                  <el-col :span="6">
                    <el-tag closable
                            type="success"
                            @close='removeRight(scope.row,item2.id)'>
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag closable
                            type="warning"
                            v-for="(item3,index3) in item2.children"
                            :key="index3"
                            @close='removeRight(scope.row,item3.id)'>
                      {{item3.authName}}
                    </el-tag>

                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label='#'
                         type="index"></el-table-column>
        <el-table-column prop="roleName"
                         label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc"
                         label="角色描述">
        </el-table-column>
        <el-table-column label="操作"
                         width="500px">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       @click="editRoleDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       @click="removeRole(scope.row.id)">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-setting"
                       @click="setRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色"
               :visible.sync="addDialogVisible"
               width="30%"
               @close="addDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="addForm"
               status-icon
               :rules="addFormRules"
               ref="addFormRef"
               label-width="80px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addForm.roleName"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addForm.roleDesc"
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="修改角色"
               :visible.sync="editDialogVisible"
               width="30%"
               @close="editDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="editForm"
               status-icon
               :rules="editFormRules"
               ref="editFormRef"
               label-width="80px">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="editForm.roleName"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="editForm.roleDesc"
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addedit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展开分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setDialogVisible"
               width="50%"
               @close="setRightDialogClosed">
      <!-- 内容主题区__树形控件 -->
      <el-tree :data="setRightList"
               show-checkbox
               node-key="id"
               default-expand-all
               :default-checked-keys="checkedKeysList"
               :props="treeProps"
               ref="treeRef">
      </el-tree>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      rolesList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请对该角色进行描述', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请对该角色进行描述', trigger: 'blur' }
        ]
      },
      setDialogVisible: false,
      setRightList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      checkedKeysList: [],
      roleId: ''
    }
  },

  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolesList = res.data
    },
    // 添加角色
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addRole () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) { return false }
        const { data: res } = await this.$http.post('/roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败!')
        }
        this.$message.success('添加角色成功!')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    // 编辑角色
    async editRoleDialog (nowid) {
      const { data: res } = await this.$http.get('/roles/' + nowid)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色列表失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },

    addedit () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) { return false }
        const { data: res } = await this.$http.put('/roles/' + this.editForm.roleId, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色失败!')
        }
        this.$message.success('编辑角色成功!')
        this.editDialogVisible = false
        this.getRolesList()
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 删除角色
    async removeRole (id) {
      const confirmRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => { return err })

      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败!')
      }
      this.$message.success('删除角色成功!')
      this.getRolesList()
    },
    // 删除角色权限
    async removeRight (obj, id) {
      const confirmRes = await this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => { return err })

      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/roles/' + obj.id + '/rights/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色权限失败!')
      }
      this.$message.success('删除角色权限成功!')
      obj.children = res.data
    },
    // 分配权限
    async setRightDialog (obj) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分配权限失败!')
      }
      this.roleId = obj.id
      this.setRightList = res.data
      this.getRoleSetRight(obj, this.checkedKeysList)
      this.setDialogVisible = true
    },
    // 递归函数得到角色分配三级id
    getRoleSetRight (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getRoleSetRight(item, arr)
      })
    },
    // 关闭重置checkedKyesLists
    setRightDialogClosed () {
      this.checkedKeysList = []
    },
    // 增加权限到展开列
    async addRight () {
      const Keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const keysStr = Keys.join(',')
      const { data: res } = await this.$http.post('roles/' + this.roleId + '/rights', { rids: keysStr })
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色权限失败!')
      }
      this.$message.success('更新角色权限成功!')
      this.getRolesList()
      this.setDialogVisible = false
    }
  }
}
</script>

<style scoped>
.top_line:first-child {
  border-top: 1px solid #eee;
}
.bottom_line {
  border-bottom: 1px solid #eee;
}
.bottom_no_line:last-child {
  border-bottom: none;
}
.el-tag {
  margin: 10px;
}
</style>
