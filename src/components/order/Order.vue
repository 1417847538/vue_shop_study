<template>
  <div>
    <!-- 顶部区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="orderInfo.query"
                    clearable>
            <el-button type="primary"
                       slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="ordersList"
                border
                stripe
                style="width: 100%"
                :header-cell-style="{textAlign: 'center'}"
                :cell-style="{ textAlign: 'center' }">
        <el-table-column type="index"
                         width="50px">
        </el-table-column>
        <el-table-column prop="order_number"
                         label="订单编号"
                         width="width">
        </el-table-column>
        <el-table-column prop="order_price"
                         label="订单价格"
                         width="100px">
        </el-table-column>
        <el-table-column prop="pay_status"
                         label="是否付款"
                         width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status==='1'"
                    type="success">已付款</el-tag>
            <el-tag v-else
                    type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send"
                         label="是否发货"
                         width="100px">
          <template slot-scope='scope'>
            {{scope.row.is_send}}
          </template>
        </el-table-column>
        <el-table-column prop="create_time"
                         label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="180px">
          <template>
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showBox"></el-button>
            <el-button type="success"
                       icon="el-icon-location"
                       size="mini"
                       @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="orderInfo.pagenum"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="orderInfo.pagesize"
                     layout="total, sizes , prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址"
               :visible.sync="addressVisible"
               width="50%"
               @close="addressClosed">
      <!-- 内容主题区 -->
      <el-form :model="addressForm"
               :rules="addressFormRules"
               status-icon
               ref="addressFormRef"
               label-width="100px">
        <el-form-item label="省市区/县"
                      prop="address1">
          <el-cascader :options="cityData"
                       v-model="addressForm.address1"
                       :props="cascaderProps"
                       clearable
                       class="top171">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address2">
          <el-input v-model="addressForm.address2"
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog title="物流进度"
               :visible.sync="progressVisible"
               width="50%">
      <!-- 内容主题区 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo"
                          :key="index"
                          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <!-- 底部按钮区 -->
      <span slot="footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="progressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data () {
    return {
      orderInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      ordersList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'value',
        label: 'label',
        children: 'children'
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', { params: this.orderInfo })
      if (res.meta.status !== 200) {
        this.$message.erros('获取订单列表失败')
      }
      this.total = res.data.total
      this.ordersList = res.data.goods
    },
    handleSizeChange (newSize) {
      this.orderInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange (newNum) {
      this.orderInfo.pagenum = newNum
      this.getOrdersList()
    },
    showBox () {
      this.addressVisible = true
    },
    addressClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox () {
      this.progressVisible = true
    }
  },
  watch: {
    ordersInfo: {
      deep: true,
      handler () {
        this.getOrdersList()
      }
    }
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
