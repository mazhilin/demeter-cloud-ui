<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.templateCode"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入运费模板编码"/>
      <el-input
        v-model="listQuery.templateName"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入运费模板名称"/>
      <el-button
        v-permission="['GET /admin/freight/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">查询
      </el-button>
      <el-button
        v-permission="['POST /admin/freight/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">添加
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
      highlight-current-row>
      <el-table-column :show-overflow-tooltip="true" width="100px" align="center" label="序号" prop="id" sortable/>
      <el-table-column align="center" label="快递编号" prop="expressId"/>
      <el-table-column align="center" label="快递名称" prop="expressName"/>
      <el-table-column align="center" label="模板编号" prop="templateId"/>
      <el-table-column align="center" label="模板名称" prop="templateName"/>
      <el-table-column align="center" label="省份编码" prop="provinceCode"/>
      <el-table-column align="center" label="省份名称" prop="provinceName"/>
      <el-table-column align="center" label="市级编码" prop="cityCode"/>
      <el-table-column align="center" label="市级名称" prop="cityName"/>
      <el-table-column align="center" label="基础重量" prop="freightWeight"/>
      <el-table-column align="center" label="基础定价" prop="freightPrice"/>
      <el-table-column align="center" label="标准重量" prop="continueWeight"/>
      <el-table-column align="center" label="标准定价" prop="continuePrice"/>
      <el-table-column align="center" label="排序" prop="sort"/>
      <el-table-column align="center" label="操作列表" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/freight/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button
            v-permission="['POST /admin/freight/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 600px; margin-left:50px;">
        <el-form-item label="运费模板" prop="templateId">
          <el-select v-model="dataForm.templateId" filterable>
            <el-option v-for="item in templateList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="快递方式" prop="expressId">
          <el-select v-model="dataForm.expressId" filterable>
            <el-option v-for="item in expressList" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="配送区域" prop="area">
          <el-select
            v-model="provinceValue"
            filterable
            placeholder="请选择"
            @change="changeProvince"
          >
            <el-option
              v-for="item in province"
              :key="item.code"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="cityValue"
            filterable
            placeholder="请选择"
            @change="changeCity"
          >
            <el-option
              v-for="item in city"
              :key="item.code"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="基础重量" prop="freightWeight">
          <el-input v-model="dataForm.freightWeight" auto-complete="off">
            <template slot="prepend"><=</template>
            <template slot="append">千克(kg)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="基础定价" prop="freightPrice">
          <el-input v-model="dataForm.freightPrice" auto-complete="off">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="标准重量" prop="continueWeight">
          <el-input v-model="dataForm.continueWeight" auto-complete="off">
            <template slot="prepend">
              >=
            </template>
            <template slot="append">千克(kg)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="标准定价" prop="continuePrice">
          <el-input v-model="dataForm.continuePrice" auto-complete="off">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="模板排序" prop="sort">
          <el-input v-model="dataForm.sort" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>

</style>

<script>
import { createFreight, deleteFreight, listFreight, updateFreight } from '@/api/freight'
import { expressList } from '@/api/express'
import { regionList } from '@/api/region'
import { templateList } from '@/api/template'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Freight',
  components: { Pagination },
  filters: {},
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        templateCode: undefined,
        templateName: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        expressId: undefined,
        expressName: undefined,
        templateId: undefined,
        templateName: undefined,
        provinceCode: undefined,
        provinceName: undefined,
        cityCode: undefined,
        cityName: undefined,
        districtCode: undefined,
        districtName: undefined,
        freightWeight: undefined,
        freightPrice: undefined,
        continueWeight: undefined,
        continuePrice: undefined,
        sort: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        expressId: [{ required: true, message: '快递编号不能为空', trigger: 'blur' }],
        expressName: [{ required: true, message: '快递名称不能为空', trigger: 'blur' }],
        templateId: [{ required: true, message: '运费模板编码称不能为空', trigger: 'blur' }],
        templateName: [{ required: true, message: '运费模板名称不能为空', trigger: 'blur' }],
        provinceCode: [{ required: true, message: '运费模板省份不能为空', trigger: 'blur' }],
        cityCode: [{ required: true, message: '运费模板市级不能为空', trigger: 'blur' }],
        freightWeight: [{ required: true, message: '运费模板区域不能为空', trigger: 'blur' }],
        freightPrice: [{ required: true, message: '运费模板区域不能为空', trigger: 'blur' }],
        continueWeight: [{ required: true, message: '运费模板区域不能为空', trigger: 'blur' }],
        continuePrice: [{ required: true, message: '运费模板区域不能为空', trigger: 'blur' }]
      },
      downloadLoading: false,
      templateList: {},
      expressList: {},
      province: [],
      city: [],
      provinceValue: '',
      provinceName: '',
      cityValue: '',
      cityName: ''
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
    this.getRegionList()
    this.getTemplateList()
    this.getExpressList()
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
    getList() {
      this.listLoading = true
      listFreight(this.listQuery)
        .then(response => {
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
    getTemplateList() {
      templateList().then(response => {
        this.templateList = response.data.data
      })
    },
    getExpressList() {
      expressList().then(response => {
        this.expressList = response.data.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        expressId: undefined,
        expressName: undefined,
        templateId: undefined,
        templateName: undefined,
        provinceCode: undefined,
        provinceName: undefined,
        cityCode: undefined,
        cityName: undefined,
        districtCode: undefined,
        districtName: undefined,
        freightWeight: undefined,
        freightPrice: undefined,
        continueWeight: undefined,
        continuePrice: undefined,
        sort: undefined
      }
    },
    handleCreate() {
      this.provinceValue = ''
      this.cityValue = ''
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
          createFreight(this.dataForm)
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
      this.updateSite(row)
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
          updateFreight(this.dataForm)
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
      deleteFreight(row)
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
    getRegionList() {
      regionList()
        .then(response => {
          this.province = response.data.data
        })
        .catch(() => {

        })
    },
    changeProvince(province, setDefault = true) {
      console.log('this.province', this.province)
      console.log('province', province)
      const city = this.province.find(item => {
        return item.value == province
      })
      console.log('city', city)
      this.city = city.child
      this.provinceName = city.label
      if (setDefault) {
        this.cityValue = city.child[0].value
        this.cityName = city.child[0].label
      }
      console.log('this.provinceValue', this.provinceValue)
      this.dataForm.provinceCode = this.provinceValue
      this.dataForm.provinceName = this.provinceName
      this.dataForm.cityCode = this.cityValue
      this.dataForm.cityName = this.cityName
    },
    changeCity(city) {
      const district = this.city.find(item => {
        return item.value == city
      })
      this.dataForm.provinceCode = this.provinceValue
      this.dataForm.provinceName = this.provinceName
      this.dataForm.cityCode = city
      this.dataForm.cityName = district.label
      console.log(this.dataForm)
    },
    updateSite(region) {
      console.log('region', region)
      this.provinceValue = region.provinceCode * 1
      this.cityValue = region.cityCode * 1
      this.changeProvince(region.provinceCode, false)
    }
  }
}
</script>
