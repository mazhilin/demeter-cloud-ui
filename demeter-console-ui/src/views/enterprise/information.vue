<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入产品名称"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.company"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入公司名称"
        prefix-icon="el-icon-edit"
      />
      <el-button
        v-permission="['GET /admin/information/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询
      </el-button>
      <el-button
        v-permission="['POST /admin/information/create']"
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
        align="center"
        label="序号"
        prop="id"
        sortable
        show-overflow-tooltip="true"
      />
      <el-table-column
        align="center"
        label="产品名称"
        prop="name"
        show-overflow-tooltip="true"
      />
      <el-table-column
        align="center"
        label="官网地址"
        prop="portalUrl"
        show-overflow-tooltip="true"
      />
      <el-table-column
        align="center"
        label="公司名称"
        prop="company"
        show-overflow-tooltip="true"
      />
      <el-table-column
        align="center"
        label="联系人"
        prop="contacts"
        show-overflow-tooltip="true"
      />
      <el-table-column
        align="center"
        label="联系电话"
        prop="mobile"
        show-overflow-tooltip="true"
      />
      <el-table-column
        align="center"
        label="详细地址"
        prop="address"
        show-overflow-tooltip="true"
      />
      <el-table-column
        align="center"
        label="版权声明"
        prop="copyright"
        show-overflow-tooltip="true"
      />

      <el-table-column
        align="center"
        label="操作列表"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/information/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['POST /admin/information/delete']"
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

    <!-- 添加或修改对话框 -->
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
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="官网地址" prop="portalUrl">
          <el-input v-model="dataForm.portalUrl" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="dataForm.company" />
        </el-form-item>
        <el-form-item label="企业简介" prop="introduction">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.introduction"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="dataForm.contacts" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="dataForm.mobile" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="dataForm.address" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="dataForm.longitude" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="dataForm.latitude" />
        </el-form-item>
        <el-form-item label="QQ" prop="tencent">
          <el-input v-model="dataForm.tencent" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="dataForm.version" />
        </el-form-item>
        <el-form-item label="版权声明" prop="copyright">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.copyright"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入内容"
          />
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

<style></style>

<script>
import {
  createInformation,
  deleteInformation,
  listInformation,
  updateInformation
} from '@/api/information'
import { roleOptions } from '@/api/role'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultAdminTypeOptions = [
  {
    label: '管理人员',
    value: 0
  },
  {
    label: '内部员工',
    value: 1
  }
]

export default {
  name: 'Information',
  components: { Pagination },
  filters: {
    formatAdminType(type) {
      for (let i = 0; i < defaultAdminTypeOptions.length; i++) {
        if (type === defaultAdminTypeOptions[i].value) {
          return defaultAdminTypeOptions[i].label
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
      roleOptions: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        company: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        portalUrl: undefined,
        company: undefined,
        introduction: undefined,
        contacts: undefined,
        mobile: undefined,
        address: undefined,
        longitude: undefined,
        latitude: undefined,
        tencent: undefined,
        version: undefined,
        copyright: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        portalUrl: [
          { required: true, message: '官网地址不能为空', trigger: 'blur' }
        ],
        company: [{ required: true, message: '公司不能为空', trigger: 'blur' }],
        introduction: [
          { required: true, message: '公司简介不能为空', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '经度不能为空', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '纬度不能为空', trigger: 'blur' }
        ],
        tencent: [{ required: true, message: 'QQ不能为空', trigger: 'blur' }],
        copyright: [
          { required: true, message: '版权声明不能为空', trigger: 'blur' }
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

    roleOptions().then((response) => {
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
      listInformation(this.listQuery)
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
        portalUrl: undefined,
        company: undefined,
        introduction: undefined,
        contacts: undefined,
        mobile: undefined,
        address: undefined,
        longitude: undefined,
        latitude: undefined,
        tencent: undefined,
        version: undefined,
        copyright: undefined
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.avatar = response.data.url
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
          createInformation(this.dataForm)
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
          updateInformation(this.dataForm)
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
      deleteInformation(row)
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
