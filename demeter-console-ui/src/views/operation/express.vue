<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.code" clearable class="filter-item" style="width: 200px;" placeholder="请输入快递编码"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入快递名称"/>
      <el-button v-permission="['GET /admin/express/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button v-permission="['POST /admin/express/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column width="100px" align="center" label="序号" prop="id" sortable show-overflow-tooltip="true"/>
      <el-table-column align="center" label="快递类型" prop="type">
        <template slot-scope="scope">
          <el-tag >{{ scope.row.type | formatExpressType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="快递编码" prop="code" />
      <el-table-column align="center" label="快递名称" prop="name" />
      <el-table-column align="center" label="快递图标" prop="logo" >
        <template slot-scope="scope">
          <img v-if="scope.row.logo" :src="scope.row.logo" width="30">
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="快递介绍" prop="content" show-overflow-tooltip="true"/>
      <el-table-column width="100px" align="center" label="快递排序" prop="sort" show-overflow-tooltip="true"/>

      <el-table-column align="center" label="操作列表" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/express/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/express/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="快递编码" prop="code">
          <el-input v-model="dataForm.code" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="快递图标" prop="logo">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadLogo"
            class="logo-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.logo" :src="dataForm.logo" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="快递类型" prop="type">
          <el-select v-model="dataForm.type">
            <el-option
              v-for="item in expressTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="快递名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="快递介绍" prop="content">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10}"
            :rows="10"
            v-model="dataForm.content"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="快递排序" prop="sort">
          <el-input v-model="dataForm.sort" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
  .logo-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .logo-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .logo {
    width: 145px;
    height: 145px;
    display: block;
  }
</style>

<script>
import { listExpress, createExpress, updateExpress, deleteExpress } from '@/api/express'
import { roleOptions } from '@/api/role'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultExpressTypeOptions = [
  {
    label: '自营物流',
    value: 0
  },
  {
    label: '三方物流',
    value: 1
  }
]

export default {
  name: 'Express',
  components: { Pagination },
  filters: {
    formatExpressType(type) {
      for (let i = 0; i < defaultExpressTypeOptions.length; i++) {
        if (type === defaultExpressTypeOptions[i].value) {
          return defaultExpressTypeOptions[i].label
        }
      }
      return ''
    }
  },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        code: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        code: undefined,
        name: undefined,
        content: undefined,
        logo: undefined,
        type: undefined,
        sort: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      expressTypeOptions: Object.assign({}, defaultExpressTypeOptions),
      rules: {
        code: [
          { required: true, message: '快递编码称不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '快递名称不能为空', trigger: 'blur' }
        ],
        logo: [{ required: true, message: '快递图标不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '快递图标不能为空', trigger: 'blur' }]
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

    roleOptions()
      .then(response => {
        this.roleOptions = response.data.data
      })
  },
  methods: {
    formatRole(roleId) {
      for (let i = 0; i < this.roleOptions.length; i++) {
        if (roleId === this.roleOptions[i].value) {
          return this.roleOptions[i].label
        }
      }
      return ''
    },
    getList() {
      this.listLoading = true
      listExpress(this.listQuery)
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
        code: undefined,
        name: undefined,
        content: undefined,
        logo: undefined,
        type: undefined,
        sort: undefined
      }
    },
    uploadLogo: function(response) {
      this.dataForm.logo = response.data.url
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createExpress(this.dataForm)
            .then(response => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateExpress(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.dataForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '更新成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleDelete(row) {
      deleteExpress(row)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    }
  }
}
</script>
