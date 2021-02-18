<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名"/>
      <el-input v-model="listQuery.mobile" clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/user/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" size="small" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="用户ID" prop="id" sortable/>
      <el-table-column align="center" label="会员来源" prop="sourceType">
        <template slot-scope="scope">
          <el-tag >{{ scope.row.sourceType | formatSourceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员账户" prop="account"/>

      <el-table-column align="center" label="会员编号" prop="memberNumber"/>

      <el-table-column align="center" label="会员姓名" prop="username"/>

      <el-table-column align="center" label="用户头像" prop="avatar" >
        <template slot-scope="scope">
          <img v-image-preview v-if="scope.row.avatar" :src="scope.row.avatar" style="width: 100%" width="40">
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员性别" prop="gender">
        <template slot-scope="scope">
          <el-tag >{{ scope.row.gender | formatGenderType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码" prop="mobile"/>

      <el-table-column align="center" label="会员邮箱" prop="email"/>

      <!--    <el-table-column align="center" label="会员生日" prop="birthday"/>-->

      <el-table-column align="center" label="会员等级" prop="userLevel">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.userLevel | formatLevelType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="营业执照" prop="licenseUrl">
        <template slot-scope="scope">
          <img v-image-preview v-if="scope.row.licenseUrl" :src="scope.row.licenseUrl" style="width: 100%" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录时间" prop="lastLoginTime"/>

      <el-table-column align="center" label="登录IP" prop="lastLoginIp"/>

      <!--    <el-table-column align="center" label="会员状态" prop="status">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status | formatStatus}}</el-tag>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="操作" width="400" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/user/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/user/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-permission="['GET /admin/user/detailApprove']" v-if="scope.row.status==0 && scope.row.userLevel==2" type="primary" size="mini" @click="handleDetail(scope.row)">推广</el-button>
          <el-button v-permission="['POST /admin/user/approveAgency']" v-else-if="scope.row.status==3" type="primary" size="mini" @click="handleApproveAgency(scope.row)">审批</el-button>
          <el-button v-permission="['GET /admin/user/detailApprove']" v-else type="info" size="mini" >非代理</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="会员账户" prop="account">
          <el-input v-model="dataForm.account"/>
        </el-form-item>
        <el-form-item label="会员密码" prop="password">
          <el-input v-model="dataForm.password" type="password" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="会员名称" prop="username">
          <el-input v-model="dataForm.username"/>
        </el-form-item>
        <el-form-item label="管理员头像" prop="avatar">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.avatar" :src="dataForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="会员手机" prop="mobile">
          <el-input v-model="dataForm.mobile"/>
        </el-form-item>
        <el-form-item label="会员邮箱" prop="email">
          <el-input v-model="dataForm.email"/>
        </el-form-item>
        <el-form-item label="会员类型" prop="userLevel">
          <el-select v-model="dataForm.userLevel">
            <el-option
              v-for="item in userLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="会员性别" prop="gender">
          <el-select v-model="dataForm.gender">
            <el-option
              v-for="item in userGenderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="营业执照" prop="licenseUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadLicense"
            class="license-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.licenseUrl" :src="dataForm.licenseUrl" class="license">
            <i v-else class="el-icon-plus license-uploader-icon"/>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <!-- 详情对话框 -->
    <el-dialog :visible.sync="detailDialogVisible" title="代理详情" width="700">
      <el-form :data="agencyDetail" label-position="left">
        <el-form-item label="佣金比例(%)">
          <span>{{ agencyDetail.settlementRate }}</span>
        </el-form-item>
        <el-form-item label="推广二维码">
          <img :src="agencyDetail.shareUrl" width="300">
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 代理审批 -->
    <el-dialog :visible.sync="approveDialogVisible" title="代理审批">
      <el-form ref="approveForm" :model="approveForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="佣金比例(%)" prop="settlementRate">
          <el-input v-model="approveForm.settlementRate"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmApprove">确定</el-button>
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
import { approveAgency, createMember, deleteMember, detailApprove, listMember, updateMember } from '@/api/user'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultSourceTypeOptions = [
  {
    label: '系统新增',
    value: 0
  },
  {
    label: '主动注册',
    value: 1
  },
  {
    label: '会员邀请',
    value: 2
  }
]

const defaultLevelOptions = [
  {
    label: '注册会员',
    value: 0
  },
  {
    label: '标准会员',
    value: 1
  },
  {
    label: '高级会员',
    value: 2
  }
]
const defaultGenderOptions = [
  {
    label: '保密',
    value: 0
  },
  {
    label: '女',
    value: 1
  },
  {
    label: '男',
    value: 2
  }
]

const defaultStatusOptions = [
  {
    label: '启用',
    value: 0
  },
  {
    label: '禁用',
    value: 1
  },
  {
    label: '删除',
    value: 2
  }
]

export default {
  name: 'User',
  components: { Pagination },
  filters: {
    formatLevelType(type) {
      for (let i = 0; i < defaultLevelOptions.length; i++) {
        if (type === defaultLevelOptions[i].value) {
          return defaultLevelOptions[i].label
        }
      }
      return ''
    },
    formatGenderType(gender) {
      for (let i = 0; i < defaultGenderOptions.length; i++) {
        if (gender === defaultGenderOptions[i].value) {
          return defaultGenderOptions[i].label
        }
      }
      return ''
    },
    formatSourceType(sourceType) {
      for (let i = 0; i < defaultSourceTypeOptions.length; i++) {
        if (sourceType === defaultSourceTypeOptions[i].value) {
          return defaultSourceTypeOptions[i].label
        }
      }
      return ''
    },
    formatStatus(status) {
      for (let i = 0; i < defaultStatusOptions.length; i++) {
        if (status === defaultStatusOptions[i].value) {
          return defaultStatusOptions[i].label
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
        username: undefined,
        mobile: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        account: undefined,
        username: undefined,
        password: undefined,
        avatar: undefined,
        mobile: undefined,
        email: undefined,
        userLevel: undefined,
        licenseUrl: undefined,
        gender: undefined,
        sourceType: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      sourceTypeOptions: Object.assign({}, defaultSourceTypeOptions),
      userLevelOptions: Object.assign({}, defaultLevelOptions),
      userGenderOptions: Object.assign({}, defaultGenderOptions),
      detailDialogVisible: false,
      agencyDetail: {},
      approveDialogVisible: false,
      approveForm: {
        userId: undefined,
        settlementRate: undefined
      },
      rules: {
        account: [{ required: true, message: '会员账户不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '会员名称不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '会员密码不能为空', trigger: 'blur' }],
        avatar: [{ required: true, message: '会员账户不能为空', trigger: 'blur' }],
        licenseUrl: [{ required: true, message: '营业执照不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '会员手机不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '会员邮箱不能为空', trigger: 'blur' }],
        userLevel: [{ required: true, message: '会员等级不能为空', trigger: 'blur' }]
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
      listMember(this.listQuery).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      }).catch(() => {
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
        avatar: undefined,
        mobile: undefined,
        email: undefined,
        userLevel: undefined,
        birthday: undefined,
        gender: undefined,
        sourceType: undefined
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.avatar = response.data.url
    },
    uploadLicense: function(response) {
      this.dataForm.licenseUrl = response.data.url
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
          createMember(this.dataForm)
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
          updateMember(this.dataForm)
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
      deleteMember(row)
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
    },
    handleDetail(row) {
      this.agencyDetail = {
        shareUrl: undefined,
        settlementRate: undefined
      }
      detailApprove(row.id).then(response => {
        this.agencyDetail = response.data.data
      })
      this.detailDialogVisible = true
    },
    handleApproveAgency(row) {
      this.approveForm.userId = row.id

      this.approveDialogVisible = true
      this.$nextTick(() => {
        this.$refs['approveForm'].clearValidate()
      })
    },
    confirmApprove() {
      this.$refs['approveForm'].validate((valid) => {
        if (valid) {
          approveAgency(this.approveForm).then(response => {
            this.approveDialogVisible = false
            this.$notify.success({
              title: '成功',
              message: '审批成功'
            })
            this.getList()
          }).catch(response => {
            this.$notify.error({
              title: '审批失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['会员ID', '会员来源', '会员账户', '会员编号', '会员姓名', '会员性别', '会员手机', '会员生日', '会员等级', '会员状态']
        const filterVal = ['id', 'sourceType', 'account', 'memberNumber', 'username', 'gender', 'mobile', 'birthday', 'userLevel', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '会员信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
