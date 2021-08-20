<template>
  <div>
    <!-- 顶部区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span='7'>
          <el-input placeholder="请输入内容"
                    v-model="userInfo.query"
                    @keyup.enter.native="getUserList"
                    clearable
                    @clear='getUserList'>
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type="primary"
                     @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data=userList
                border
                stripe
                :header-cell-style="{textAlign: 'center'}"
                :cell-style="{ textAlign: 'center' }">
        <el-table-column label='#'
                         type="index"></el-table-column>
        <el-table-column label="用户名"
                         prop='username'></el-table-column>
        <el-table-column label="邮箱"
                         prop='email'></el-table-column>
        <el-table-column label="电话"
                         prop='mobile'></el-table-column>
        <el-table-column label="角色"
                         prop='role_name'></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         width="180px">
          <template slot-scope='scope'>
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="editDialog(scope.row.id)"></el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeUser(scope.row.id)"></el-button>
            <el-tooltip effect="dark"
                        content="分配角色"
                        placement="top"
                        :enterable=false>
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="mini"
                         @click="setUserRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="userInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="userInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="30%"
               @close="addDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="addForm"
               status-icon
               :rules="addFormRules"
               ref="addFormRef"
               label-width="80px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户"
               :visible.sync="editDialogVisible"
               width="30%"
               @close="editDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="editForm"
               status-icon
               :rules="editFormRules"
               ref="editFormRef"
               label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addedit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配用户角色对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="setUserRoleDialogVisible"
               width="30%"
               @close="setRoleDialogClosed">
      <!-- 内容主题区 -->
      <div>
        <p>当前的用户:{{userMes.username}}</p>
        <p>当前的角色:{{userMes.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRole"
                     placeholder="请选择">
            <el-option v-for="item in rolesList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="setUserRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',

  data () {
    // 验证合法邮箱
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的邮箱'))
      }
    }
    // 验证合法手机号
    var checkMobile = (rule, value, callback) => {
      const regEmail = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的手机号'))
      }
    }
    return {
      userInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框显示和隐藏
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名的长度在 6 到 15 个字符', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      },
      // 控制修改用户对话框显示和隐藏
      editDialogVisible: false,
      editForm: {
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }]
      },
      // 控制分配用户角色对话框的显示和隐藏
      setUserRoleDialogVisible: false,
      userMes: {},
      rolesList: [],
      selectedRole: ''
    }
  },

  created () {
    this.getUserList()
  },

  methods: {
    // 获取用户列表信息
    async getUserList () {
      const { data: res } = await this.$http.get('/users', { params: this.userInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听页面大小的改变
    handleSizeChange (newSize) {
      this.userInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值的改变
    handleCurrentChange (newPage) {
      this.userInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关的改变
    async userStateChange (userState) {
      const { data: res } = await this.$http.put(`/users/${userState.id}/state/${userState.mg_state}`)
      if (res.meta.status !== 200) {
        userState.mg_state = !userState.mg_state
        return this.$message.error('更新用户状态失败!')
      }
      this.$message.success('更新用户状态成功!')
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) { return false }
        const { data: res } = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('用户添加失败!')
        }
        this.$message.success('用户添加成功!')
        this.addDialogVisible = false
        // 重新获取用户列表
        this.getUserList()
      })
    },
    // 修改用户
    async editDialog (nowid) {
      const { data: res } = await this.$http.get('/users/' + nowid)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    addedit () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) { return false }
        const { data: res } = await this.$http.put('/users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑用户提交失败!')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('编辑用户提交成功!')
      })
    },
    // 删除用户信息
    async removeUser (nowid) {
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('/users/' + nowid)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败!')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 获取角色列表与打开分配角色对话框
    async setUserRole (obj) {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.userMes = obj
      this.rolesList = res.data
      this.setUserRoleDialogVisible = true
    },
    setRoleDialogClosed () {
      this.selectedRole = ''
    },
    // 保存更新用户所选角色
    async saveRole () {
      if (!this.selectedRole) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put('/users/' + this.userMes.id + '/role', { rid: this.selectedRole })
      if (res.meta.status === 400) {
        return this.$message.error('不允许修改admin账户')
      } else if (res.meta.status !== 200) {
        return this.$message.error('更新用户角色失败!')
      }
      this.$message.success('更新用户角色成功!')
      this.getUserList()
      this.setUserRoleDialogVisible = false
    }
  },

  watch: {
    userInfo: {
      deep: true,
      handler () {
        this.getUserList()
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>
