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
        v-permission="['GET /admin/activity/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询
      </el-button>

      <el-button
        v-permission="['POST /admin/activity/create']"
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

      <el-table-column align="center" min-width="100" label="活动封面" property="coverPicture">
        <template slot-scope="scope">
          <img
            v-if="scope.row.coverPicture"
            :src="scope.row.coverPicture"
            style="width: 100%"
            width="80"
            height="100px">
        </template>
      </el-table-column>

      <el-table-column align="center" label="活动简介" prop="introduction"/>

      <el-table-column align="center" label="活动举办方" prop="companyName"/>

      <el-table-column label="活动浏览数" align="center">
        <template slot-scope="scope">
          <p>虚拟：{{ scope.row.virtualBrowse }}</p>
          <p>实际：{{ scope.row.actualBrowse }}</p>
        </template>
      </el-table-column>
      <el-table-column label="活动报名数" align="center">
        <template slot-scope="scope">
          <p>虚拟：{{ scope.row.virtualEnroll }}</p>
          <p>实际：{{ scope.row.actualEnroll }}</p>
        </template>
      </el-table-column>

      <el-table-column align="center" label="开始时间" prop="beginTime"/>

      <el-table-column align="center" label="结束时间" prop="endTime"/>

      <el-table-column align="center" label="活动状态" prop="activityStatus">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.activityStatus | formatActivityStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作列表"
        class-name="small-padding fixed-width"
        width="250"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/activity/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['POST /admin/activity/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-button
            v-permission="['POST /admin/activity/bound']"
            type="danger"
            size="mini"
            @click="handleBound(scope.row)"
          >绑定
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
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>

        <el-form-item label="活动简介" prop="introduction">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.introduction"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入活动简介"
          />
        </el-form-item>

        <el-form-item label="活动内容" prop="content">
          <editor :init="editorInit" v-model="dataForm.content" style="width: 220%"/>
        </el-form-item>

        <el-form-item label="活动规则" prop="regulation">
          <editor :init="editorInit" v-model="dataForm.regulation" style="width: 220%"/>
        </el-form-item>

        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker
            v-model="dataForm.beginTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"/>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="dataForm.endTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间"/>
        </el-form-item>

        <el-form-item label="虚拟浏览量" prop="virtualBrowse">
          <el-input v-model="dataForm.virtualBrowse" placeholder="0"/>
        </el-form-item>

        <el-form-item label="实际浏览量" prop="actualBrowse">
          <el-input v-model="dataForm.actualBrowse" placeholder="0" readonly="true"/>
        </el-form-item>

        <el-form-item label="虚拟报名量" prop="virtualEnroll">
          <el-input v-model="dataForm.virtualEnroll" placeholder="0"/>
        </el-form-item>

        <el-form-item label="实际报名量" prop="actualEnroll">
          <el-input v-model="dataForm.actualEnroll" placeholder="0" readonly="true"/>
        </el-form-item>

        <el-form-item label="活动模板" prop="templateId">
          <el-select v-model="dataForm.templateId" filterable>
            <el-option
              v-for="item in template"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="活动举办方" prop="companyId">
          <el-cascader
            :options="companyList"
            v-model="dataForm.companyId"
            expand-trigger="hover"
            filterable
            label-width="100px"
            @change="handleCompanyChange"
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

    <!-- 绑定对话框 -->
    <el-dialog :title="boundTextMap[boundDialogStatus]" :visible.sync="boundDialogFormVisible">
      <el-form
        ref="boundDataForm"
        :rules="rules"
        :model="boundDataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >

        <el-form-item label="活动ID" prop="activityId">
          <el-input v-model="boundDataForm.activityId" readonly/>
        </el-form-item>

        <el-form-item label="奖项列表" prop="prizeItemIds">
          <el-select v-model="boundDataForm.prizeItemIds" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in prizeItems"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="奖项组列表" prop="batchGroupIds">
          <el-select v-model="boundDataForm.batchGroupIds" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in prizeRules"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="boundDialogFormVisible = false">取消</el-button>
        <el-button
          v-if="boundDialogStatus == 'bound'"
          type="primary"
          @click="boundData"
        >确定
        </el-button
        >
      </div>
    </el-dialog>

  </div>
</template>

<style></style>

<script>
import { bound, create, list, remove, update } from '@/api/activity'
import { companyList, templateList, prizeItemList, prizeRulesList } from '@/api/component'
import { roleOptions } from '@/api/role'
import { uploadEditor, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { getToken } from '@/utils/auth'
// Secondary package based on el-pagination
import Pagination from '@/components/Pagination'

const defaultActivityStatusOptions = [
  {
    label: '未开始',
    value: 0
  },
  {
    label: '进行中',
    value: 1
  },
  {
    label: '已结束',
    value: 2
  }
]

export default {
  name: 'Information',
  components: { Pagination, Editor },
  filters: {
    formatActivityStatus(type) {
      for (let i = 0; i < defaultActivityStatusOptions.length; i++) {
        if (type === defaultActivityStatusOptions[i].value) {
          return defaultActivityStatusOptions[i].label
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
        portalUrl: undefined,
        content: undefined,
        introduction: undefined,
        regulation: undefined,
        beginTime: undefined,
        endTime: undefined,
        virtualBrowse: undefined,
        actualBrowse: undefined,
        virtualEnroll: undefined,
        actualEnroll: undefined,
        templateId: undefined,
        companyId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '活动简介不能为空', trigger: 'blur' }
        ],
        content: [{ required: true, message: '活动内容不能为空', trigger: 'blur' }],
        regulation: [
          { required: true, message: '活动规则不能为空', trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: '活动开始时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '活动结束时间不能为空', trigger: 'blur' }
        ],
        templateId: [
          { required: true, message: '活动模板不能为空', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '活动模板不能为空', trigger: 'blur' }
        ]
      },
      boundDialogFormVisible: false,
      boundDialogStatus: '',
      boundDataForm: {
        activityId: undefined,
        prizeItemIds: undefined,
        batchGroupIds: undefined
      },
      boundTextMap: {
        bound: '绑定'
      },
      template: [],
      companyList: [],
      prizeItems: [],
      prizeRules: [],
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
    this.queryActivityList()
    this.queryTemplateList()
    this.getCompanyList()
    this.queryPrizeItemList()
    this.queryPrizeRulesList()
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
    queryActivityList() {
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
    queryTemplateList() {
      templateList().then((response) => {
        this.template = response.data.data
      })
    },
    queryPrizeItemList() {
      prizeItemList().then((response) => {
        this.prizeItems = response.data.data
      })
    },
    queryPrizeRulesList() {
      prizeRulesList().then((response) => {
        this.prizeRules = response.data.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.queryActivityList()
      this.queryTemplateList()
      this.getCompanyList()
      this.queryPrizeItemList()
      this.queryPrizeRulesList()
    },
    getCompanyList() {
      companyList().then((response) => {
        this.companyList = response.data.data.companyList
      })
    },
    handleCompanyChange(value) {
      this.dataForm.companyId = value[value.length - 1]
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        portalUrl: undefined,
        content: undefined,
        introduction: undefined,
        regulation: undefined,
        beginTime: undefined,
        endTime: undefined,
        virtualBrowse: undefined,
        actualBrowse: undefined,
        virtualEnroll: undefined,
        actualEnroll: undefined,
        templateId: undefined,
        companyId: undefined
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
          create(this.dataForm)
            .then((response) => {
              this.list.unshift(response.data.data)
              this.dialogFormVisible = false
              this.$notify.success({
                title: '温馨提示',
                message: '添加成功'
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
    handleBound(row) {
      this.boundDataForm = Object.assign({}, row)
      this.boundDataForm.activityId = row.id
      this.boundDialogStatus = 'bound'
      this.boundDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['boundDataForm'].clearValidate()
      })
    },
    boundData() {
      this.$refs['boundDataForm'].validate((valid) => {
        if (valid) {
          bound(this.boundDataForm)
            .then((response) => {
              this.list.unshift(response.data.data)
              this.boundDialogFormVisible = false
              this.$notify.success({
                title: '温馨提示',
                message: '绑定成功'
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
    }
  }
}
</script>
