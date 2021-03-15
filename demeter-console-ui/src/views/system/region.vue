<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入行政区域名称"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.code"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入行政区域编码"
        prefix-icon="el-icon-edit"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button
      >
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button
      >
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        min-width="30px"
        label="区域ID"
        prop="id"
        sortable
      />

      <el-table-column
        align="center"
        min-width="50px"
        label="区域编码"
        prop="code"
      />

      <el-table-column
        align="center"
        min-width="80px"
        label="区域名称"
        prop="name"
      />

      <el-table-column
        align="center"
        min-width="50px"
        label="区域等级"
        prop="level"
      />

      <el-table-column
        align="center"
        min-width="50px"
        label="区域类型"
        prop="type"
      >
        <template slot-scope="scope">
          {{ scope.row.type | typeFilter }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        min-width="50px"
        label="区域父ID"
        prop="parentId"
      />

      <el-table-column
        align="center"
        min-width="50px"
        label="来源类型"
        prop="sourceType"
      >
        <template slot-scope="scope">
          {{ scope.row.sourceType | sourceTypeFilter }}
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listRegion } from '@/api/region'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Region',
  components: { Pagination },
  filters: {
    typeFilter(status) {
      const typeMap = {
        1: '省',
        2: '市',
        3: '区'
      }
      return typeMap[status]
    },
    sourceTypeFilter(sourceType) {
      const sourceTypeMap = {
        0: '系统设置',
        1: '系统新增',
        2: '接口拉取'
      }
      return sourceTypeMap[sourceType]
    }
  },
  data() {
    return {
      list: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        code: undefined
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listRegion(this.listQuery)
        .then((response) => {
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '区域ID',
          '区域父ID',
          '区域名称',
          '区域类型',
          '区域编码'
        ]
        const filterVal = ['id', 'pid', 'name', 'type', 'code']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '行政区域信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
