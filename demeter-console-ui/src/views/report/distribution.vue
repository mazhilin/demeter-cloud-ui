<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.registrantName"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入推广会员姓名"/>
      <el-input
        v-model="listQuery.customerName"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入会员姓名"/>
      <el-button
        v-permission="['GET /admin/report/distribution']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">查找
      </el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload">导出
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      size="small"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row>

      <el-table-column align="center" label="业绩ID" prop="id" sortable/>

      <el-table-column align="center" label="推广会员" prop="registrantName"/>

      <!--    <el-table-column align="center" label="邀约数量" prop="invite"/>

      <el-table-column align="center" label="成交数量" prop="success"/>-->

      <el-table-column align="center" label="会员姓名" prop="customerName"/>

      <el-table-column align="center" label="充值总额" prop="recharge"/>

      <el-table-column align="center" label="支付总额" prop="payment"/>

      <el-table-column align="center" label="消费总额" prop="consume"/>

      <el-table-column align="center" label="会员佣金" prop="amount"/>

      <el-table-column align="center" label="统计时间" prop="addTime"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>
  </div>
</template>

<style>
</style>

<script>
import { distributionList } from '@/api/distribution'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Achievement',
  components: { Pagination },
  data() {
    return {
      list: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        registrantName: undefined,
        customerName: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        registrantName: undefined,
        invite: undefined,
        success: undefined,
        customerName: undefined,
        recharge: undefined,
        payment: undefined,
        consume: undefined,
        amount: undefined,
        addTime: undefined
      },
      downloadLoading: false
    }
  },
  computed: {
    headers() {
      return {
        'X-Console-Web-Token': getToken()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      distributionList(this.listQuery)
        .then(response => {
          this.list = response.data.data.items
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        registrantName: undefined,
        invite: undefined,
        success: undefined,
        customerName: undefined,
        recharge: undefined,
        payment: undefined,
        consume: undefined,
        amount: undefined,
        addTime: undefined
      }
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '业绩ID',
            '推广会员',
            '邀约数量',
            '成交数量',
            '会员姓名',
            '充值总额',
            '支付总额',
            '消费总额',
            '会员佣金',
            '统计时间'
          ]
          const filterVal = [
            'id',
            'registrantName',
            'customerName',
            'recharge',
            'payment',
            'consume',
            'amount',
            'addTime'
          ]
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '会员佣金报表')
          this.downloadLoading = false
        })
    }
  }
}
</script>
