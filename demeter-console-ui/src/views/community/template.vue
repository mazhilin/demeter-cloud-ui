<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入模板编号"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入模板名称"
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
      <el-table-column align="center" label="序号" width="100px" prop="id" sortable/>

      <el-table-column align="center" label="模板编号" prop="code"/>

      <el-table-column align="center" label="模板名称" prop="name"/>

      <el-table-column align="center" label="模板描述" prop="content"/>

      <el-table-column align="center" label="封面图" prop="coverPicture" width="120">
        <template slot-scope="scope">
          <img
            v-if="scope.row.coverPicture"
            :src="scope.row.coverPicture"
            style="width: 100%"
            width="40px"
            height="100px"
            onprogress="async"
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="背景音乐" prop="backgroundMusic">
        <template slot-scope="scope">
          <audio
            v-if="scope.row.backgroundMusic"
            :src="scope.row.backgroundMusic"
            style="width: 100%"
            width="40px"
            height="100px"
            controls="controls"
            onprogress="async"
          />
        </template>
      </el-table-column>

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
        label-width="128px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>

        <!--        <el-form-item label="模板描述" prop="content">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.content"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入模板描述"
          />
        </el-form-item>-->

        <el-form-item label="模板描述" prop="content">
          <editor :init="editorInit" v-model="dataForm.content" style="width: 220%"/>
        </el-form-item>

        <el-form-item label="模板封面" prop="coverPicture">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAvatar"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.coverPicture" :src="dataForm.coverPicture" onprogress="async" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="模板轮播" prop="rotatePictures">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadLicense"
            class="license-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.rotatePictures" :src="dataForm.rotatePictures" onprogress="async" class="license">
            <i v-else class="el-icon-plus license-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="背景音乐" prop="backgroundMusic">
          <el-upload
            :headers="headers"
            :auto-upload="true"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadAudio"
            class="audio-uploader"
            accept=".mp3,.flac,.acc,.wma">
            <audio
              v-if="dataForm.backgroundMusic"
              :src="dataForm.backgroundMusic"
              controls="controls"
              class="audio"/>
            <i v-else class="el-icon-plus audio-uploader-icon"/>
          </el-upload>
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

  .audio-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .audio-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .audio-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .audio {
    width: 145px;
    height: 145px;
    display: block;
  }
</style>

<script>
import { create, list, remove, update } from '@/api/template'
import { roleOptions } from '@/api/role'
import { uploadEditor, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
// Secondary package based on el-pagination

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
  components: { Audio, Pagination, Editor },
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
        code: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        content: undefined,
        coverPicture: undefined,
        rotatePictures: undefined,
        backgroundMusic: undefined
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
      downloadLoading: false,
      editorInit: {
        language: 'zh_CN',
        convert_urls: false,
        plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
        toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          uploadEditor(formData).then(res => {
            success(res.data.data.url)
          }).catch(() => {
            failure('上传失败，请重新上传')
          })
        }
      }
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
      this.queryTemplateList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        content: undefined,
        coverPicture: undefined,
        rotatePictures: undefined,
        backgroundMusic: undefined
      }
    },
    uploadAvatar: function(response) {
      this.dataForm.coverPicture = response.data.url
    },
    uploadLicense: function(response) {
      this.dataForm.rotatePictures = response.data.url
    },
    uploadAudio: function(response) {
      this.dataForm.backgroundMusic = response.data.url
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
