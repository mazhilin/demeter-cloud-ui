<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入活动编号"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入活动名称"
        prefix-icon="el-icon-edit"
      />

      <el-button
        v-permission="['GET /admin/template/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询
      </el-button>

      <el-button
        v-permission="['POST /admin/template/create']"
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
      element-loading-text="正在查询,请稍等..."
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" prop="id" sortable/>

      <el-table-column align="center" label="活动编号" prop="code"/>

      <el-table-column align="center" label="活动名称" prop="name"/>

      <el-table-column align="center" label="活动封面" prop="coverPicture"/>

      <el-table-column align="center" label="活动简介" prop="introduction"/>

      <el-table-column align="center" label="活动内容" prop="content"/>

      <el-table-column align="center" label="活动规则" prop="regulation"/>

      <el-table-column align="center" label="活动主办方" prop="companyName"/>

      <el-table-column align="center" label="开始时间" prop="beginTime"/>

      <el-table-column align="center" label="结束时间" prop="endTime"/>

      <el-table-column align="center" label="活动状态" prop="activityStatus"/>

      <el-table-column
        align="center"
        label="操作列表"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/template/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['POST /admin/template/delete']"
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
      @pagination="queryTemplateList"
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
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>

        <el-form-item label="模板描述" prop="content">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.content"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入模板描述"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="primary"
          @click="createData"
        >确定
        </el-button
        >
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style></style>

<script>
import { createInformation, deleteInformation, listInformation, updateInformation } from '@/api/information'
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
        sort: 'create_time',
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
    this.queryTemplateList()

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
    queryTemplateList() {
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
