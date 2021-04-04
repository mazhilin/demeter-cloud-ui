<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入参数Code"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入参数名称"
        prefix-icon="el-icon-edit"
      />
      <el-button
        v-permission="['GET /admin/parameter/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button>
      <el-button
        v-permission="['POST /admin/parameter/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加
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
      highlight-current-row
    >
      <el-table-column
        width="100px"
        align="center"
        label="序号"
        prop="id"
        sortable
      />

      <el-table-column align="center" label="参数编码" prop="code" />

      <el-table-column align="center" label="参数名称" prop="name" />

      <el-table-column align="center" label="参数图标" prop="icon">
        <template slot-scope="scope">
          <img v-if="scope.row.icon" :src="scope.row.icon" width="40" >
        </template>
      </el-table-column>

      <el-table-column align="center" label="参数描述" prop="message" />

      <el-table-column align="center" label="授权URl" prop="authorizeUrl" />

      <el-table-column align="center" label="参数码值" prop="value" />

      <el-table-column align="center" label="AppId" prop="appId" />

      <el-table-column align="center" label="AppSecret" prop="appSecret" />

      <el-table-column align="center" label="Endpoint" prop="endpointUrl" />

      <el-table-column align="center" label="回调地址" prop="redirectUrl" />

      <el-table-column
        align="center"
        label="操作"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/parameter/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['POST /admin/parameter/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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

    <!-- 添加对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="参数编码" prop="code">
          <el-input v-model="dataForm.code" />
        </el-form-item>
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="参数图标" prop="icon">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIcon"
            class="parameter-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.icon" :src="dataForm.icon" class="icon" >
            <i v-else class="el-icon-plus parameter-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="参数描述" prop="message">
          <el-input v-model="dataForm.message" />
        </el-form-item>

        <el-form-item label="授权URl" prop="authorizeUrl">
          <el-input v-model="dataForm.authorizeUrl" />
        </el-form-item>

        <el-form-item label="参数码值" prop="value">
          <el-input v-model="dataForm.value" />
        </el-form-item>
        <el-form-item label="AppId" prop="appId">
          <el-input v-model="dataForm.appId" />
        </el-form-item>
        <el-form-item label="AppSecret" prop="appSecret">
          <el-input v-model="dataForm.appSecret" />
        </el-form-item>
        <el-form-item label="Endpoint" prop="endpointUrl">
          <el-input v-model="dataForm.endpointUrl" />
        </el-form-item>
        <el-form-item label="回调地址" prop="redirectUrl">
          <el-input v-model="dataForm.redirectUrl" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="createData"
        >确定</el-button
        >
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
.parameter-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.parameter-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.parameter-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.icon {
  width: 145px;
  height: 145px;
  display: block;
}
</style>

<script>
import { create, remove, list, update } from '@/api/parameter'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'Parameter',
  components: { Pagination },
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
        sort: 'create_time',
        order: 'desc'
      },
      createDialogVisible: false,
      dataForm: {
        id: undefined,
        name: undefined,
        code: undefined,
        icon: undefined,
        message: undefined,
        authorizeUrl: undefined,
        value: undefined,
        appId: undefined,
        appSecret: undefined,
        endpointUrl: undefined,
        redirectUrl: undefined
      },
      updateDialogVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        code: [
          { required: true, message: '参数编码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '参数图标不能为空', trigger: 'blur' }
        ],
        message: [
          { required: true, message: '参数描述不能为空', trigger: 'blur' }
        ],
        authorizeUrl: [
          { required: true, message: '授权地址不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '参数码值不能为空', trigger: 'blur' }
        ],
        appId: [{ required: true, message: 'AppId不能为空', trigger: 'blur' }],
        appSecret: [
          { required: true, message: 'AppSecret不能为空', trigger: 'blur' }
        ],
        endpointUrl: [
          { required: true, message: '外部地址不能为空', trigger: 'blur' }
        ],
        redirectUrl: [
          { required: true, message: '回调地址不能为空', trigger: 'blur' }
        ]
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
      list(this.listQuery)
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
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        code: undefined,
        icon: undefined,
        message: undefined,
        authorizeUrl: undefined,
        value: undefined,
        appId: undefined,
        appSecret: undefined,
        endpointUrl: undefined,
        redirectUrl: undefined
      }
    },
    uploadIcon: function(response) {
      this.dataForm.icon = response.data.url
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.dataForm)
            .then((response) => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '添加成功'
              })
            })
            .catch((response) => {
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          update(this.dataForm)
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
            .catch((response) => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleDelete(row) {
      remove(row)
        .then((response) => {
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch((response) => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    }
  }
}
</script>
