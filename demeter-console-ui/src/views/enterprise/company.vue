<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入运费模板编码"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入运费模板名称"
        prefix-icon="el-icon-edit"
      />
      <el-button
        v-permission="['GET /admin/freight/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询
      </el-button>
      <el-button
        v-permission="['POST /admin/freight/create']"
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
      <el-table-column align="center" label="公司名称" prop="name" />
      <el-table-column align="center" label="登录账户" prop="account" />
      <el-table-column align="center" label="联系人" prop="contacts" />
      <el-table-column align="center" label="联系电话" prop="mobile" />
      <el-table-column align="center" label="公司简介" prop="introduction" />
      <el-table-column align="center" label="详细地址" prop="address" />
      <el-table-column align="center" label="邮政编码" prop="zipCode" />
      <el-table-column align="center" label="版权声明" prop="copyright" />
      <el-table-column
        align="center"
        label="操作列表"
        width="200"
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
        label-width="128px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>

        <el-form-item label="公司层级" prop="level">
          <el-select
            v-model="dataForm.level"
            filterable
            @change="onLevelChange"
          >
            <el-option label="上级公司" value="L1" />
            <el-option label="下级公司" value="L2" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="dataForm.level === 'L2'" label="父类目" prop="parentId">
          <el-select v-model="dataForm.parentId" filterable>
            <el-option
              v-for="item in parentCompany"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!--       <el-form-item label="公司简介" prop="introduction">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.introduction"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入公司简介"
          />
        </el-form-item>-->

        <el-form-item label="公司简介" prop="introduction">
          <editor :init="editorInit" v-model="dataForm.introduction" style="width: 220%"/>
        </el-form-item>

        <el-form-item label="官网地址" prop="portaleWbsite">
          <el-input v-model="dataForm.portaleWbsite" auto-complete="off" />
        </el-form-item>

        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="dataForm.contacts" auto-complete="off" />
        </el-form-item>

        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off" />
        </el-form-item>

        <el-form-item label="登录账号" prop="account">
          <el-input v-model="dataForm.account" auto-complete="off" />
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input v-model="dataForm.address" auto-complete="off" />
        </el-form-item>

        <el-form-item label="邮政编码" prop="zipCode">
          <el-input v-model="dataForm.zipCode" auto-complete="off" />
        </el-form-item>

        <el-form-item label="版权声明" prop="copyright">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.copyright"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入公司简介"
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
import { create, list, update, edit, remove } from '@/api/company'
import { parentCompanyList } from '@/api/component'
import { uploadEditor, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Company',
  components: { Pagination, Editor },
  filters: {},
  data() {
    return {
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
      dataForm: {
        id: undefined,
        code: undefined,
        name: undefined,
        content: undefined,
        portaleWbsite: undefined,
        contacts: undefined,
        mobile: undefined,
        account: undefined,
        address: undefined,
        zipCode: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '公司名称不能为空!', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '公司简介不能为空!', trigger: 'blur' }
        ],
        portalWebsite: [
          { required: true, message: '公司简介不能为空!', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
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
      },
      parentCompany: [],
      province: [],
      city: [],
      district: [],
      provinceId: '',
      provinceName: '',
      cityId: '',
      cityName: '',
      districtId: '',
      districtName: ''
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
    this.getParentCompanyList()
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
    getParentCompanyList() {
      parentCompanyList().then((response) => {
        this.parentCompany = response.data.data
      })
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
        code: undefined,
        name: undefined,
        content: undefined,
        provinceId: undefined,
        provinceName: undefined,
        cityId: undefined,
        cityName: undefined,
        districtId: undefined,
        districtName: undefined,
        sort: undefined
      }
    },
    onLevelChange: function(value) {
      if (value === 'L1') {
        this.parentId = undefined
      }
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
              this.getParentCompanyList()
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
              this.getParentCompanyList()
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
          this.getParentCompanyList()
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
