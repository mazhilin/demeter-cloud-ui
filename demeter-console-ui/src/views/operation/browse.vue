<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入作品编码"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入作品名称"
        prefix-icon="el-icon-edit"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button
      >
      <el-button
        v-permission="['POST /admin/works/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加
      </el-button
      >
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出
      </el-button
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
      <el-table-column align="center" width="100px" label="浏览ID" prop="id" sortable/>
      <el-table-column align="center" label="浏览来源" prop="sourceType">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sourceType | formatSourceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览编号" prop="code"/>
      <el-table-column align="center" label="浏览名称" prop="name"/>
      <el-table-column align="center" label="浏览主体" prop="subjectId"/>
      <el-table-column align="center" label="浏览作品" prop="subjectName"/>
      <el-table-column align="center" label="IP地址" prop="ipAddress"/>
      <el-table-column align="center" label="浏览时间" prop="browseTime"/>
      <el-table-column align="center" label="浏览状态" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#409eff"
            inactive-color="#c0ccda"
            @change="updateStatus($event, scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/works/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button
          >
          <el-button
            v-permission="['POST /admin/works/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除
          </el-button
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

        <el-form-item label="作品名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>

        <el-form-item label="作品作者" prop="customerUserId">
          <el-select v-model="dataForm.customerUserId">
            <el-option
              v-for="item in userGenderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="作品简介" prop="introduction">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.introduction"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="作品简介"
          />
        </el-form-item>

        <el-form-item label="作品内容" prop="content">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.content"
            type="textarea"
            maxlength="1024"
            show-word-limit
            placeholder="请输入作品内容"
          />
        </el-form-item>

        <el-form-item label="作品封面图" prop="coverPicture">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.coverPicture" :src="dataForm.coverPicture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="参赛作品图片" prop="rotatePictures">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadLicense"
            class="license-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.rotatePictures" :src="dataForm.rotatePictures" class="license">
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
import { create, edit, list, remove } from '@/api/works'
import { uploadPath } from '@/api/storage'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const defaultSourceTypeOptions = [
  {
    label: '系统新增',
    value: 0
  },
  {
    label: '活动报名',
    value: 1
  },
  {
    label: '礼品购买',
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
  name: 'Browse',
  components: { Pagination },
  filters: {
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
        name: undefined,
        mobile: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        customerUserId: undefined,
        introduction: undefined,
        content: undefined,
        rotatePictures: undefined,
        coverPicture: undefined,
        sourceType: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      sourceTypeOptions: Object.assign({}, defaultSourceTypeOptions),
      userGenderOptions: Object.assign({}, defaultGenderOptions),
      detailDialogVisible: false,
      rules: {
        name: [
          { required: true, message: '作者名称不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '作者手机不能为空', trigger: 'blur' }
        ],
        profilePicture: [
          { required: true, message: '作者头像不能为空', trigger: 'blur' }
        ],
        licenseUrl: [
          { required: true, message: '营业执照不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '会员邮箱不能为空', trigger: 'blur' }
        ],
        userLevel: [
          { required: true, message: '会员等级不能为空', trigger: 'blur' }
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
        customerUserId: undefined,
        introduction: undefined,
        content: undefined,
        rotatePictures: undefined,
        coverPicture: undefined,
        sourceType: undefined
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.coverPicture = response.data.url
    },
    uploadLicense: function(response) {
      this.dataForm.rotatePictures = response.data.url
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
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then((excel) => {
          const tHeader = [
            '会员ID',
            '会员来源',
            '会员账户',
            '会员编号',
            '会员姓名',
            '会员性别',
            '会员手机',
            '会员生日',
            '会员等级',
            '会员状态'
          ]
          const filterVal = [
            'id',
            'sourceType',
            'account',
            'memberNumber',
            'username',
            'gender',
            'mobile',
            'birthday',
            'userLevel',
            'status'
          ]
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '会员信息')
          this.downloadLoading = false
        })
    }
  }
}
</script>
