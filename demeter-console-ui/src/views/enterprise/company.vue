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
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入运费模板名称"
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
      <el-table-column align="center" label="省" prop="provinceName" />
      <el-table-column align="center" label="市" prop="cityName" />
      <el-table-column align="center" label="区/县" prop="districtName" />
      <el-table-column align="center" label="详细地址" prop="address" />
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
        label-width="100px"
        style="width: 750px; margin-left: 40px"
      >
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="公司简介" prop="introduction">
          <el-input
            :autosize="{ minRows: 2, maxRows: 10 }"
            :rows="10"
            v-model="dataForm.introduction"
            type="textarea"
            maxlength="256"
            show-word-limit
            placeholder="请输入公司简介"
          />
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

        <el-form-item inline="true" label="省/市/区" prop="area">
          <el-select
            v-model="provinceId"
            filterable
            placeholder="请选择省"
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
            v-model="cityId"
            filterable
            placeholder="请选择市"
            @change="changeCity"
          >
            <el-option
              v-for="item in city"
              :key="item.code"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-select
            v-model="districtId"
            filterable
            placeholder="请选择区/县"
            @change="changeDistrict"
          >
            <el-option
              v-for="item in district"
              :key="item.code"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input v-model="dataForm.address" auto-complete="off" />
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
import { create, list, update } from "@/api/company";
import { regionList } from "@/api/component";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Company",
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
        code: undefined,
        name: undefined,
        sort: "create_time",
        order: "desc",
      },
      dataForm: {
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
        sort: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建",
      },
      rules: {
        name: [
          { required: true, message: "公司名称不能为空!", trigger: "blur" },
        ],
        introduction: [
          { required: true, message: "公司简介不能为空!", trigger: "blur" },
        ],
        portalWebsite: [
          { required: true, message: "公司简介不能为空!", trigger: "blur" },
        ],
        provinceId: [
          { required: true, message: "省级不能为空", trigger: "blur" },
        ],
        cityId: [{ required: true, message: "市级不能为空", trigger: "blur" }],
        districtId: [
          { required: true, message: "市级不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
        ],
      },
      downloadLoading: false,
      province: [],
      city: [],
      district: [],
      provinceId: "",
      provinceName: "",
      cityId: "",
      cityName: "",
      districtId: "",
      districtName: "",
    };
  },
  computed: {
    headers() {
      return {
        "X-Console-Web-Token": getToken(),
      };
    },
  },
  created() {
    this.getList();
    this.getRegionList();
  },
  methods: {
    formatRole(roleId) {
      for (let i = 0; i < this.roleOptions.length; i++) {
        if (roleId === this.roleOptions[i].value) {
          return this.roleOptions[i].label;
        }
      }
      return "";
    },
    getList() {
      this.listLoading = true;
      list(this.listQuery)
        .then((response) => {
          this.list = response.data.data.items;
          this.total = response.data.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
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
        sort: undefined,
      };
    },
    handleCreate() {
      this.provinceId = "";
      this.cityId = "";
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          create(this.dataForm)
            .then((response) => {
              this.list.unshift(response.data.data);
              this.dialogFormVisible = false;
              this.$notify.success({
                title: "成功",
                message: "添加成功",
              });
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
              });
            });
        }
      });
    },
    handleUpdate(row) {
      this.updateSite(row);
      this.dataForm = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          update(this.dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.dataForm.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.dataForm);
                  break;
                }
              }
              this.dialogFormVisible = false;
              this.$notify.success({
                title: "成功",
                message: "更新成功",
              });
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
              });
            });
        }
      });
    },
    handleDelete(row) {
      delete row
        .then((response) => {
          this.$notify.success({
            title: "成功",
            message: "删除成功",
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        })
        .catch((response) => {
          this.$notify.error({
            title: "失败",
            message: response.data.errmsg,
          });
        });
    },
    getRegionList() {
      regionList().then((response) => {
        this.province = response.data.data;
      });
    },
    changeProvince(data, setDefault = true) {
      const province = this.province.find((item) => {
        return item.value == data;
      });
      this.city = province.child;
      this.provinceName = province.label;
      if (setDefault) {
        this.cityId = province.child[0].value;
        this.cityName = province.child[0].label;
      }

      this.district = province.child[0].child;
      if (setDefault) {
        this.districtId = province.child[0].child[0].value;
        this.districtName = province.child[0].child[0].label;
      }

      this.dataForm.provinceId = this.provinceId;
      this.dataForm.provinceName = this.provinceName;
      this.dataForm.cityId = this.cityId;
      this.dataForm.cityName = this.cityName;
      this.dataForm.districtId = this.districtId;
      this.dataForm.districtName = this.districtName;
    },
    changeCity(data, setDefault = true) {
      const city = this.city.find((item) => {
        return item.value == data;
      });
      this.district = city.child;
      this.cityName = city.label;
      if (setDefault) {
        this.districtId = city.child[0].value;
        this.districtName = city.child[0].label;
      }
      this.dataForm.provinceId = this.provinceId;
      this.dataForm.provinceName = this.provinceName;
      this.dataForm.cityId = city;
      this.dataForm.cityName = city.label;
      this.dataForm.districtId = this.districtId;
      this.dataForm.districtName = this.districtName;
    },
    changeDistrict(data, setDefault = true) {
      const district = this.district.find((item) => {
        return item.value == data;
      });
      this.districtName = district.label;
      if (setDefault) {
        this.districtId = district.value;
        this.districtName = district.label;
      }
      this.dataForm.provinceId = this.provinceId;
      this.dataForm.provinceName = this.provinceName;
      this.dataForm.cityId = this.cityId;
      this.dataForm.cityName = this.cityName;
      this.dataForm.districtId = district;
      this.dataForm.districtName = district.label;
    },
    updateSite(region) {
      console.log("region", region);
      this.provinceId = region.provinceId * 1;
      this.cityId = region.cityId * 1;
      this.districtId = region.districtId * 1;
      this.changeProvince(region.districtId, false);
      this.changeCity(region.cityId, false);
      this.changeDistrict(region.districtId, false);
    },
  },
};
</script>
