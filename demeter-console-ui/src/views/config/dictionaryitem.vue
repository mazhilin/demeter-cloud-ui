<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.label"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入配置Code"
        prefix-icon="el-icon-search"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入配置名称"
        prefix-icon="el-icon-edit"
      />
      <el-button
        v-permission="['GET /admin/dictionary/item/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找
      </el-button>
      <el-button
        v-permission="['POST /admin/dictionary/item/create']"
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
      <el-table-column align="center" label="序号" prop="id" sortable />

      <el-table-column align="center" label="字典项分类" prop="type">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type ? '1' : '0'">{{
            scope.row.type === "1" ? "业务新增" : "系统新增"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="数据字典ID" prop="dictionaryId" />

      <el-table-column align="center" label="字典项名称" prop="name" />

      <el-table-column align="center" label="字典项标签" prop="label" />

      <!--      <el-table-column align="center" label="字典项图标" prop="icon">
        <template slot-scope="scope">
          <img v-if="scope.row.icon" :src="scope.row.icon" width="40">
        </template>
      </el-table-column>-->

      <el-table-column align="center" label="字典项码值" prop="value" />

      <el-table-column align="center" label="字典项描述" prop="content" />

      <el-table-column
        align="center"
        label="操作列表"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/dictionary/item/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['POST /admin/dictionary/item/delete']"
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

        <el-form-item label="数据字典ID" prop="dictionaryId">
          <el-select v-model="dataForm.dictionaryId" placeholder="请选择">
            <el-option
              v-for="item in dictionaryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字典项名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入字典项名称"/>
        </el-form-item>
        <el-form-item label="字典项标签" prop="label">
          <el-input v-model="dataForm.label" placeholder="请输入字典项标签"/>
        </el-form-item>
        <!--        <el-form-item label="字典项图标" prop="icon">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadIcon"
            class="dictionary-uploader"
            accept=".jpg,.jpeg,.png,.gif">
            <img v-if="dataForm.icon" :src="dataForm.icon" class="icon">
            <i v-else class="el-icon-plus dictionary-uploader-icon"/>
          </el-upload>
        </el-form-item>-->
        <el-form-item label="字典项码值" prop="value">
          <el-input v-model="dataForm.value" placeholder="请输入字典项码值" />
        </el-form-item>

        <el-form-item label="字典项描述" prop="content">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.content"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入字典项描述"
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

<style>
.dictionary-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.dictionary-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.dictionary-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.icon {
  width: 145px;
  height: 145px;
  display: block;
}
</style>

<script>
import { create, list, remove, update } from '@/api/dictionaryitem'
import { uploadPath } from '@/api/storage'
import { dictionaryList } from '@/api/component'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'DictionaryItem',
  components: { Pagination },
  data() {
    return {
      uploadPath,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        label: undefined,
        name: undefined,
        sort: 'create_time',
        order: 'desc'
      },
      createDialogVisible: false,
      dataForm: {
        id: undefined,
        dictionaryId: undefined,
        name: undefined,
        label: undefined,
        value: undefined,
        message: undefined
      },
      updateDialogVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        dictionaryId: [
          { required: true, message: '数据字典ID不能为空', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '字典项标签不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '字典项名称不能为空', trigger: 'blur' }
        ],
        message: [
          { required: true, message: '字典项描述不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '字典项码值不能为空', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      dictionaryList: []
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
    this.queryDictionaryList()
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
    queryDictionaryList() {
      dictionaryList().then((response) => {
        this.dictionaryList = response.data.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      this.queryDictionaryList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        dictionaryId: undefined,
        name: undefined,
        label: undefined,
        icon: undefined,
        value: undefined,
        message: undefined
      }
    },
    uploadIcon: function(response) {
      this.dataForm.icon = response.data.url
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
