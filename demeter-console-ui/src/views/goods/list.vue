<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.goodsSn"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入商品编号"
      />
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 200px"
        placeholder="请输入商品名称"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >查找</el-button
      >
      <el-button
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="table-expand">
            <el-form-item label="宣传画廊">
              <img
                v-for="pic in props.row.gallery"
                :key="pic"
                :src="pic"
                class="gallery"
              />
            </el-form-item>
            <el-form-item label="产品宣传">
              <img :src="props.row.gallery" width="40" class="gallery" />
            </el-form-item>
            <el-form-item label="商品介绍">
              <span>{{ props.row.brief }}</span>
            </el-form-item>
            <el-form-item label="商品单位">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
            <el-form-item label="关键字">
              <span>{{ props.row.keywords }}</span>
            </el-form-item>
            <el-form-item label="类目ID">
              <span>{{ props.row.categoryId }}</span>
            </el-form-item>
            <el-form-item label="品牌商ID">
              <span>{{ props.row.brandId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品id" prop="id" />

      <el-table-column align="center" label="商品类目" prop="categoryId" />

      <el-table-column align="center" label="商品来源" prop="sourceType">
        <template slot-scope="scope">
          <el-tag :type="scope.row.sourceType ? '1' : '0'">{{
            scope.row.sourceType ? "API接口" : "系统新增"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品编号" prop="goodsSn" />

      <el-table-column
        align="center"
        min-width="100"
        label="名称"
        prop="name"
      />

      <el-table-column align="center" property="iconUrl" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="40" />
        </template>
      </el-table-column>

      <el-table-column align="center" property="iconUrl" label="分享图">
        <template slot-scope="scope">
          <img :src="scope.row.shareUrl" width="40" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="详情" prop="detail">
        <template slot-scope="scope">
          <el-dialog
            :visible.sync="detailDialogVisible"
            title="商品详情"
            width="60%"
          >
            <div v-html="goodsDetail" />
          </el-dialog>
          <el-button
            type="primary"
            size="mini"
            @click="showDetail(scope.row.detail)"
            >查看</el-button
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="专柜价格" prop="counterPrice" />

      <el-table-column align="center" label="零售价格" prop="retailPrice" />

      <el-table-column align="center" label="会员价格" prop="memberPrice" />

      <el-table-column align="center" label="虚拟销售量" prop="virtuals" />

      <el-table-column align="center" label="实际销售量" prop="sales" />

      <el-table-column align="center" label="是否新品" prop="isNew">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isNew ? 'success' : 'error'">{{
            scope.row.isNew ? "新品" : "非新品"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否热品" prop="isHot">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isHot ? 'success' : 'error'">{{
            scope.row.isHot ? "热品" : "非热品"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否在售" prop="isOnSale">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isOnSale ? 'success' : 'error'">{{
            scope.row.isOnSale ? "在售" : "未售"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-permission="['POST /admin/goods/delete']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>
          <el-button
            v-permission="['POST /admin/goods/bound']"
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
      @pagination="changePage"
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
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="商品ID" prop="goodsId" aria-readonly="true">
          <el-input v-model="dataForm.goodsId" readonly="true" />
        </el-form-item>
        <el-form-item label="商品分类ID" prop="categoryId" aria-readonly="true">
          <el-input v-model="dataForm.categoryId" readonly="true" />
        </el-form-item>
        <el-form-item label="商品品牌ID" prop="brandId" aria-readonly="true">
          <el-input v-model="dataForm.brandId" readonly="true" />
        </el-form-item>
        <el-form-item label="货品重量" prop="goodsWeight">
          <el-input v-model="dataForm.goodsWeight">
            <template slot="prepend"> >= </template>
            <template slot="append">千克(kg)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否包邮" prop="isExpressFree">
          <el-radio-group v-model="dataForm.isExpressFree">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="!dataForm.isExpressFree">
          <el-form-item label="运费模板" prop="templateId">
            <el-select v-model="dataForm.templateId" filterable>
              <el-option
                v-for="item in templateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="运费定价" prop="freightPrice">
            <el-input v-model="dataForm.freightPrice">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          v-if="dialogStatus == 'bound'"
          type="primary"
          @click="boundTemplateData"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>
  </div>
</template>

<style>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 100px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.gallery {
  width: 80px;
  margin-right: 10px;
}
</style>

<script>
import { boundTemplate, deleteGoods, listGoods } from "@/api/goods";
import { templateList } from "@/api/template";
import BackToTop from "@/components/BackToTop";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "GoodsList",
  components: { BackToTop, Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: this.$route.query.page ? this.$route.query.page * 1 : 1,
        limit: 20,
        goodsSn: this.$route.query.goodsSn || undefined,
        name: this.$route.query.name || undefined,
        sort: "add_time",
        order: "desc",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        bound: "绑定",
      },
      rules: {
        isExpressFree: [
          { required: true, message: "请选择是否包邮", trigger: "blur" },
        ],
        templateId: [
          { required: true, message: "运费模板不能为空", trigger: "blur" },
        ],
        goodsWeight: [
          { required: true, message: "货品重量不能为空", trigger: "blur" },
        ],
      },
      dataForm: {
        id: undefined,
        goodsId: undefined,
        categoryId: undefined,
        brandId: undefined,
        isExpressFree: undefined,
        templateId: undefined,
        freightPrice: undefined,
        goodsWeight: undefined,
      },
      templateList: {},
      goodsDetail: "",
      detailDialogVisible: false,
      downloadLoading: false,
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
    this.changePage();
    this.getTemplateList();
  },
  methods: {
    changePage() {
      this.getList();
      this.$router.replace({
        query: {
          page: this.listQuery.page,
          name: this.listQuery.name,
          goodsSn: this.listQuery.goodsSn,
        },
      });
    },
    getList() {
      this.listLoading = true;
      listGoods(this.listQuery)
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
    getTemplateList() {
      templateList().then((response) => {
        this.templateList = response.data.data;
      });
    },
    handleFilter() {
      // this.listQuery.page = 1
      this.getList();
      this.$router.replace({
        query: {
          page: 1,
          name: this.listQuery.name,
          goodsSn: this.listQuery.goodsSn,
        },
      });
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        goodsId: undefined,
        categoryId: undefined,
        brandId: undefined,
        isExpressFree: undefined,
        templateId: undefined,
        freightPrice: undefined,
        goodsWeight: undefined,
      };
    },
    handleCreate() {
      this.$router.push({ path: "/goods/create" });
    },
    handleUpdate(row) {
      this.$router.push({
        path: "/goods/edit",
        query: {
          page: this.listQuery.page,
          id: row.id,
          name: this.listQuery.name,
          goodsSn: this.listQuery.goodsSn,
        },
      });
    },
    showDetail(detail) {
      this.goodsDetail = detail;
      this.detailDialogVisible = true;
    },
    handleDelete(row) {
      deleteGoods(row)
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
    handleBound(row) {
      console.log(row.id);
      this.resetForm();
      this.dataForm = Object.assign({}, row);
      this.dataForm.goodsId = row.id;
      this.dialogStatus = "bound";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    boundTemplateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          boundTemplate(this.dataForm)
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
                message: "绑定成功",
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
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "商品ID",
          "商品编号",
          "名称",
          "专柜价格",
          "当前价格",
          "是否新品",
          "是否热品",
          "是否在售",
          "首页主图",
          "宣传图片列表",
          "商品介绍",
          "详细介绍",
          "商品图片",
          "商品单位",
          "关键字",
          "类目ID",
          "品牌商ID",
        ];
        const filterVal = [
          "id",
          "goodsSn",
          "name",
          "counterPrice",
          "retailPrice",
          "isNew",
          "isHot",
          "isOnSale",
          "listPicUrl",
          "gallery",
          "brief",
          "detail",
          "picUrl",
          "goodsUnit",
          "keywords",
          "categoryId",
          "brandId",
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "商品信息");
        this.downloadLoading = false;
      });
    },
  },
};
</script>
