<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入报名编号"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入报名IP"
        prefix-icon="el-icon-edit"
      />

      <el-button
        v-permission="['GET /admin/enroll/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询
      </el-button>

      <el-button
        v-permission="['POST /admin/enroll/create']"
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

      <el-table-column align="center" label="报名编号" prop="code"/>

      <el-table-column align="center" label="报名活动" prop="subjectName"/>

      <el-table-column align="center" label="活动封面" prop="subjectPicture">
        <template slot-scope="scope">
          <img
            v-if="scope.row.subjectPicture"
            :src="scope.row.subjectPicture"
            style="width: 100%"
            width="40px"
            height="100px"
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="报名人" prop="enrollUserName"/>

      <el-table-column align="center" label="参赛作品" prop="worksName"/>

      <el-table-column align="center" label="活动封面" prop="worksPicture">
        <template slot-scope="scope">
          <img
            v-if="scope.row.worksPicture"
            :src="scope.row.worksPicture"
            style="width: 100%"
            width="40px"
            height="100px"
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="报名IP" prop="ipAddress"/>

      <el-table-column align="center" label="报名时间" prop="enrollTime"/>

      <el-table-column
        align="center"
        label="操作列表"
        class-name="small-padding fixed-width"
        width="180"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/enroll/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['POST /admin/enroll/delete']"
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
      @pagination="queryEnrollList"
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

        <el-form-item label="报名主体" prop="subjectId">
          <el-select v-model="dataForm.subjectId" filterable placeholder="请选择">
            <el-option
              v-for="item in activities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="参赛选手" prop="enrollUserName">
          <el-input v-model="dataForm.enrollUserName"/>
        </el-form-item>

        <el-form-item label="选手地址" prop="profileAddress">
          <el-input v-model="dataForm.profileAddress"/>
        </el-form-item>

        <el-form-item label="选手简介" prop="personalProfile">
          <el-input v-model="dataForm.personalProfile"/>
        </el-form-item>

        <el-form-item label="选手手机" prop="mobile">
          <el-input v-model="dataForm.mobile"/>
        </el-form-item>

        <el-form-item label="作品名称" prop="worksName">
          <el-input v-model="dataForm.worksName"/>
        </el-form-item>

        <el-form-item label="作品内容" prop="worksContent">
          <el-input v-model="dataForm.worksContent"/>
        </el-form-item>

        <el-form-item label="选手头像" prop="profilePicture">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.profilePicture" :src="dataForm.profilePicture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="选手作品" prop="worksPicture">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadLicense"
            class="license-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.worksPicture" :src="dataForm.worksPicture" class="license">
            <i v-else class="el-icon-plus license-uploader-icon"/>
          </el-upload>
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

  .license-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .license-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .license-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .license {
    width: 145px;
    height: 145px;
    display: block;
  }
</style>

<script>
import { create, list, remove, update } from '@/api/enroll'
import { roleOptions } from '@/api/role'
import { activityList } from '@/api/component'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
// Secondary package based on el-pagination
import Pagination from '@/components/Pagination'

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
        subjectId: undefined,
        enrollUserId: undefined,
        worksId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        subjectId: [
          { required: true, message: '报名主体ID不能为空', trigger: 'blur' }
        ],
        enrollUserId: [
          { required: true, message: '报名人ID不能为空', trigger: 'blur' }
        ],
        worksId: [{ required: true, message: '作品ID不能为空', trigger: 'blur' }]
      },
      activities: [],
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
    this.queryEnrollList()
    this.queryActivityList()
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
    queryEnrollList() {
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
    queryActivityList() {
      activityList().then((response) => {
        this.activities = response.data.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.queryEnrollList()
      this.queryActivityList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        subjectId: undefined,
        enrollUserName: undefined,
        mobile: undefined,
        profileAddress: undefined,
        personalProfile: undefined,
        worksName: undefined,
        worksContent: undefined,
        profilePicture: undefined,
        worksPicture: undefined
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.profilePicture = response.data.url
    },
    uploadLicense: function(response) {
      this.dataForm.worksPicture = response.data.url
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
            title: '成功',
            message: '删除成功'
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch((response) => {
          this.$notify.error({
            title: '失败',
            message: response.data.message
          })
        })
    }
  }
}
</script>
