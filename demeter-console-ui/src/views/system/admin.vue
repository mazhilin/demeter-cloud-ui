<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.account"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入管理员账户"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入管理员名称"
        prefix-icon="el-icon-edit"
      />
      <el-button
        v-permission="['GET /admin/user/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button
      >
      <el-button
        v-permission="['POST /admin/user/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button
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
      <el-table-column align="center" label="用户账户" prop="account" />
      <el-table-column align="center" label="用户名称" prop="name" />
      <el-table-column align="center" label="用户头像" prop="profilePicture">
        <template slot-scope="scope">
          <img
            v-lazy="scope.row.profilePicture"
            v-if="scope.row.profilePicture"
            style="width: 100%"
            width="80"
            height="100px"
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户角色" prop="roleIds">
        <template slot-scope="scope">
          <el-tag
            v-for="roleId in scope.row.roleIds"
            :key="roleId"
            type="primary"
            style="margin-right: 20px"
          >
            {{ formatRole(roleId) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户类型" prop="type">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.type | formatAdminType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户状态" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#409eff"
            inactive-color="#c0ccda"
            @change="updateStatus($event, scope.row)"
          >
            >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上次登录" prop="lastLoginTime" />
      <el-table-column align="center" label="登录IP" prop="lastLoginIp" />

      <el-table-column
        align="center"
        label="操作列表"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/user/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button
          >
          <el-button
            v-permission="['POST /admin/user/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button
          >
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
        <el-form-item label="管理员账户" prop="account">
          <el-input v-model="dataForm.account" />
        </el-form-item>
        <el-form-item label="管理员姓名" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="管理员密码" prop="password">
          <el-input
            v-model="dataForm.password"
            type="password"
            auto-complete="off"
          />
        </el-form-item>
        <el-form-item label="管理员头像" prop="profilePicture">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img
              v-if="dataForm.profilePicture"
              :src="dataForm.profilePicture"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="管理员角色" prop="roleIds">
          <el-select v-model="dataForm.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
</style>

<script>
import { list, create, update, remove, edit } from '@/api/admin'
import { options } from '@/api/role'
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
  name: 'Admin',
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
      options: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        nickname: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        account: undefined,
        name: undefined,
        nickname: undefined,
        password: undefined,
        profilePicture: undefined,
        roleIds: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        account: [
          { required: true, message: '管理员账户不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '管理员名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
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
    options().then((response) => {
      this.options = response.data.data
    })
  },
  methods: {
    formatRole(roleId) {
      for (let i = 0; i < this.options.length; i++) {
        if (roleId === this.options[i].value) {
          return this.options[i].label
        }
      }
      return ''
    },
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
        account: undefined,
        username: undefined,
        password: undefined,
        profilePicture: undefined,
        roleIds: []
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.profilePicture = response.data.url
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
                message: response.data.message
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
    updateStatus(status, row) {
      const data = {
        status: status,
        id: row.id
      }
      if (status === 1) {
        update(data)
          .then((response) => {
            this.$notify.success({
              title: '温馨提示',
              message: '启用成功'
            })
          })
          .catch((response) => {
            this.$notify.error({
              title: '温馨提示',
              message: response.message
            })
          })
      } else {
        update(data)
          .then((response) => {
            this.$notify.success({
              title: '温馨提示',
              message: '禁用成功'
            })
          })
          .catch((response) => {
            this.$notify.error({
              title: '温馨提示',
              message: response.data.message
            })
          })
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          edit(this.dataForm)
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
                title: '温馨提示',
                message: '更新成功'
              })
            })
            .catch((response) => {
              this.$notify.error({
                title: '温馨提示',
                message: response.data.message
              })
            })
        }
      })
    },
    handleDelete(row) {
      remove(row)
        .then((response) => {
          this.$notify.success({
            title: '温馨提示',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch((response) => {
          this.$notify.error({
            title: '温馨提示',
            message: response.data.message
          })
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['管理员ID', '管理员名称', '管理员头像']
        const filterVal = ['id', 'username', 'avatar']
        excel.export_json_to_excel2(
          tHeader,
          this.list,
          filterVal,
          '管理员信息'
        )
        this.downloadLoading = false
      })
    }
  }
}
</script>
