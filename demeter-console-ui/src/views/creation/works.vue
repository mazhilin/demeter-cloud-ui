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
      >查找</el-button
      >
      <el-button
        v-permission="['POST /admin/works/create']"
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
      <el-table-column align="center" width="100px" label="作品ID" prop="id" sortable/>
      <el-table-column align="center" label="作品来源" prop="sourceType">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sourceType | formatSourceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作品编号" prop="code"/>
      <el-table-column align="center" label="作品名称" prop="name"/>
      <el-table-column align="center" label="作品作者" prop="customerName"/>
      <el-table-column align="center" label="作品简介" prop="introduction"/>

      <el-table-column align="center" label="封面图" width="120px" prop="coverPicture">
        <template slot-scope="scope">
          <img
            v-if="scope.row.coverPicture"
            :src="scope.row.coverPicture"
            style="width: 100%"
            width="40px"
            height="100px"
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="作品内容" prop="content">
        <template slot-scope="scope">
          <el-dialog :visible.sync="detailDialogVisible" title="作品内容" width="60%" style="position: center">
            <div v-html="worksContent"/>
          </el-dialog>
          <el-button type="primary" size="mini" @click="showDetail(scope.row.content)">预览</el-button>
        </template>
      </el-table-column>

      <el-table-column label="作品投票数" align="center">
        <template slot-scope="scope">
          <p>虚拟：{{ scope.row.virtualVote }}</p>
          <p>实际：{{ scope.row.actualVote }}</p>
        </template>
      </el-table-column>
      <el-table-column label="作品点赞数" align="center">
        <template slot-scope="scope">
          <p>虚拟：{{ scope.row.virtualLike }}</p>
          <p>实际：{{ scope.row.actualLike }}</p>
        </template>
      </el-table-column>

      <el-table-column align="center" label="IP地址" min-width="100px" prop="ipAddress"/>

      <el-table-column align="center" label="详情" prop="detail">
        <template slot-scope="scope">
          <el-button
            v-permission="['GET /admin/works/detail']"
            type="primary"
            size="mini"
            @click="handleDetail(scope.row)">详情
          </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="作品状态" prop="status">
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
        width="250"
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
          </el-button>
          <el-button
            v-permission="['POST /admin/works/bound']"
            type="success"
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
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >

        <el-form-item label="作品名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>

        <el-form-item label="作者姓名" prop="customerId">
          <el-select v-model="dataForm.customerId" filterable>
            <el-option
              v-for="item in customers"
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
          <editor :init="editorInit" v-model="dataForm.content" style="width: 220%"/>
        </el-form-item>

        <el-form-item label="虚拟投票数" prop="virtualVote">
          <el-input v-model="dataForm.virtualVote" placeholder="0"/>
        </el-form-item>

        <el-form-item label="实际投票数" prop="actualVote">
          <el-input v-model="dataForm.actualVote" placeholder="0" readonly="true"/>
        </el-form-item>

        <el-form-item label="虚拟点赞数" prop="virtualLike">
          <el-input v-model="dataForm.virtualLike" placeholder="0"/>
        </el-form-item>
        <el-form-item label="实际点赞数" prop="actualLike">
          <el-input v-model="dataForm.actualLike" placeholder="0" readonly="true"/>
        </el-form-item>

        <el-form-item label="作品名称" prop="name">
          <el-input v-model="dataForm.name"/>
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
            <img v-if="dataForm.coverPicture" :src="dataForm.coverPicture" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
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

        <el-form-item label="作品ID" prop="worksId">
          <el-input v-model="boundDataForm.worksId" readonly="true"/>
        </el-form-item>

        <el-form-item label="礼品列表" prop="goodsIds">
          <el-select v-model="boundDataForm.goodsIds" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in products"
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

    <!-- 订单详情对话框 -->
    <el-dialog :visible.sync="worksGoodsDialogVisible" title="详情" width="800">

      <el-form :data="worksGoods" label-position="left">
        <el-form-item label="作品编码">
          <span>{{ worksGoods.works.code }}</span>
        </el-form-item>

        <el-form-item label="作品名称">
          <span>{{ worksGoods.works.name }}</span>
        </el-form-item>

        <el-form-item label="作品作者">
          <span>{{ worksGoods.works.customerName }}</span>
        </el-form-item>

        <el-form-item label="创建时间">
          <span>{{ worksGoods.works.createTime }}</span>
        </el-form-item>

        <el-form-item label="商品信息">
          <el-table
            v-loading="dataListLoading"
            :data="worksGoods.goods"
            size="small"
            border
            fit
            highlight-current-row>
            <el-table-column align="center" label="商品编号" prop="code"/>
            <el-table-column align="center" label="商品名称" prop="name"/>
            <el-table-column align="center" label="货品图片" prop="productPicture">
              <template slot-scope="scope">
                <img :src="scope.row.productPicture" width="40">
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
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
import { bound, create, detail, edit, list, remove } from '@/api/works'
import { customerList, productList } from '@/api/component'
import { uploadEditor, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
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
  name: 'Works',
  components: { Pagination, Editor },
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
      dataListLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        mobile: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      dataListQuery: {
        page: 1,
        limit: 20,
        worksId: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        name: undefined,
        customerId: undefined,
        introduction: undefined,
        content: undefined,
        rotatePictures: undefined,
        coverPicture: undefined,
        virtualVote: undefined,
        actualVote: undefined,
        virtualLike: undefined,
        actualLike: undefined,
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
      boundDialogFormVisible: false,
      worksGoodsDialogVisible: false,
      worksGoods: {
        works: {},
        goods: [],
        total: 0
      },
      boundDialogStatus: '',
      boundDataForm: {
        worksId: undefined,
        goodsIds: undefined
      },
      boundTextMap: {
        bound: '绑定'
      },
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
        content: [
          { required: true, message: '作品内容不能为空', trigger: 'blur' }
        ]
      },
      customers: [],
      products: [],
      goodList: [],
      worksContent: '',
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
    this.getList()
    this.getCustomerList()
    this.getProductList()
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
    getCustomerList() {
      customerList().then((response) => {
        this.customers = response.data.data
      })
    },
    getProductList() {
      productList().then((response) => {
        this.products = response.data.data
      })
    },
    showDetail(content) {
      this.worksContent = content
      this.detailDialogVisible = true
    },
    handleDetail(row) {
      this.dataListQuery.page = 1
      this.dataListLoading = true
      detail(row).then(response => {
        this.worksGoods.goods = response.data.data.goods
        this.worksGoods.total = response.data.data.total
        this.worksGoods.works = response.data.data.works
        this.dataListLoading = false
      }).catch(() => {
        this.worksGoods.goods = []
        this.worksGoods.total = 0
        this.worksGoods.works = undefined
        this.dataListLoading = false
      })
      this.worksGoodsDialogVisible = true
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      this.getCustomerList()
      this.getProductList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        customerId: undefined,
        introduction: undefined,
        content: undefined,
        rotatePictures: undefined,
        coverPicture: undefined,
        virtualVote: undefined,
        actualVote: undefined,
        virtualLike: undefined,
        actualLike: undefined,
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
      this.boundDataForm.worksId = row.id
      this.boundDataForm.goodsIds = row.goodsIds
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
