<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.code"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入商品编码"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入商品名称"
        prefix-icon="el-icon-edit"
      />
      <el-button
        v-permission="['GET /admin/goods/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button
      >
      <el-button
        v-permission="['POST /admin/goods/create']"
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
      <el-table-column align="center" label="商品ID" prop="id" sortable="true"/>

      <el-table-column align="center" label="商品编码" prop="code"/>

      <el-table-column align="center" label="商品类型" prop="goodsType">
        <template slot-scope="scope">
          <el-tag :type="scope.row.goodsType ? '1' : '0'">{{
            scope.row.goodsType === "1" ? "虚拟商品" : "实物商品"
          }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品名称" prop="name"/>

      <el-table-column align="center" label="商品类目" prop="categoryName"/>

      <el-table-column align="center" label="关键字" prop="keywords"/>

      <el-table-column
        align="center"
        min-width="100"
        label="商品描述"
        prop="content"
      />

      <el-table-column align="center" min-width="100" label="商品图标" property="productPicture">
        <template slot-scope="scope">
          <img
            v-if="scope.row.productPicture"
            :src="scope.row.productPicture"
            style="width: 100%"
            width="80"
            height="100px">
        </template>
      </el-table-column>

      <el-table-column align="center" label="关键字" prop="keywords"/>

      <el-table-column align="center" label="零售价格" prop="retailPrice"/>

      <el-table-column align="center" label="销售价格" prop="salePrice"/>

      <el-table-column align="center" label="商品库存" prop="inventory"/>

      <el-table-column align="center" label="商品单位" prop="unit"/>

      <el-table-column
        align="center"
        label="操作"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/goods/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button
          >
          <el-button
            v-permission="['POST /admin/goods/delete']"
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
        label-width="128px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="dataForm.keywords"/>
        </el-form-item>

        <el-form-item label="商品简介" prop="content">
          <editor :init="editorInit" v-model="dataForm.content" style="width: 220%"/>
        </el-form-item>

        <el-form-item label="商品类型" prop="goodsType">
          <el-select
            v-model="dataForm.goodsType"
            filterable
            @change="onLevelChange"
          >
            <el-option label="虚拟商品" value="0"/>
            <el-option label="实物商品" value="1"/>
          </el-select>
        </el-form-item>

        <el-form-item label="所属分类" prop="categoryId">
          <el-cascader
            :options="categoryList"
            v-model="dataForm.categoryId"
            expand-trigger="hover"
            filterable
            @change="handleCategoryChange"
          />
        </el-form-item>

        <el-form-item label="商品图片" prop="productPicture">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIconUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img
              v-if="dataForm.productPicture"
              :src="dataForm.productPicture"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品轮播" prop="galleryPictures">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadPicUrl"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
          >
            <img v-if="dataForm.galleryPictures" :src="dataForm.galleryPictures" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="零售价格" prop="retailPrice">
          <el-input v-model="dataForm.retailPrice"/>
        </el-form-item>

        <el-form-item label="销售价格" prop="salePrice">
          <el-input v-model="dataForm.salePrice"/>
        </el-form-item>

        <el-form-item label="库存数量" prop="inventory">
          <el-input v-model="dataForm.inventory"/>
        </el-form-item>

        <el-form-item label="商品单位" prop="unit">
          <el-input v-model="dataForm.unit"/>
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
import { create, list, update } from '@/api/goods'
import { goodsCategoryList } from '@/api/component'
import { uploadEditor, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Goods',
  components: { Pagination, Editor },
  data() {
    return {
      uploadPath,
      list: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        name: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      dataForm: {
        name: '',
        keywords: '',
        goodsType: '1',
        categoryId: undefined,
        content: '',
        productPicture: undefined,
        galleryPictures: undefined,
        retailPrice: undefined,
        salePrice: undefined,
        inventory: undefined,
        unit: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '商品描述不能为空', trigger: 'blur' }]
      },
      categoryList: [],
      categoryIds: [],
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
    this.getGoodsCategoryList()
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
    getGoodsCategoryList() {
      goodsCategoryList().then((response) => {
        this.categoryList = response.data.data.categoryList
      })
    },
    handleCategoryChange(value) {
      this.dataForm.categoryId = value[value.length - 1]
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      this.getGoodsCategoryList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: '',
        keywords: '',
        goodsType: '1',
        categoryId: undefined,
        content: '',
        productPicture: undefined,
        galleryPictures: undefined,
        retailPrice: undefined,
        salePrice: undefined,
        inventory: undefined,
        unit: undefined
      }
    },
    onLevelChange: function(value) {
      if (value === '1') {
        this.goodsType = undefined
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
    uploadIconUrl: function(response) {
      this.dataForm.productPicture = response.data.url
    },
    uploadPicUrl: function(response) {
      this.dataForm.galleryPictures = response.data.url
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
                message: '创建成功'
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
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then((excel) => {
          const tHeader = [
            '类目ID',
            '名称',
            '关键字',
            '级别',
            '父类目ID',
            '类目图标',
            '类目图片',
            '简介'
          ]
          const filterVal = [
            'id',
            'name',
            'keywords',
            'level',
            'pid',
            'iconUrl',
            'picUrl',
            'desc'
          ]
          excel.export_json_to_excel2(
            tHeader,
            this.list,
            filterVal,
            '商品类目信息'
          )
          this.downloadLoading = false
        })
    }
  }
}
</script>
