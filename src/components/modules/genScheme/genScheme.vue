<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12">
          <el-button type='danger' icon='delete'
                     :disabled='batchFlag'
                     @click='onDelete(true)'>删除选中
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-form  :inline="true" :model='search_data' class="demo-form-inline">
            <el-form-item>
              <el-input placeholder="方案名称" icon="search" v-model='search_data.name'></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click='onSearch'>查询</el-button>
              <el-button type="primary" icon="plus" @click='onAdd'>新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </h3>
    <div slot="body">
      <el-table border style="width: 100%" align='center'
                :data='data'
                @selection-change='handleSelectionChange'>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="方案名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="生成模块"
          prop="packageName">
        </el-table-column>
        <el-table-column label="模块名" prop="moduleName"></el-table-column>

        <el-table-column label="功能名" prop="functionName"></el-table-column>
        <el-table-column label="功能作者" prop="functionAuthor"></el-table-column>

        <el-table-column
          label="操作"
          width="160">
          <template scope='scope'>
            <el-button
              type="info"
              icon='edit'
              size="mini"
              @click='onEdit(scope.row)'></el-button>
            <el-button
              type="danger"
              icon='delete'
              size="mini"
              @click='onDelete(scope.row.id)'></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页开始-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginations.currentPage"
        :page-sizes="paginations.pageSizes"
        :page-size="paginations.pageSize"
        :layout="paginations.layout"
        :total="paginations.total">
      </el-pagination>


      <!--分页结束-->
      <el-dialog title="生成方案" :visible.sync="dialogFormVisible">
        <el-form :model="viewData.genScheme" :rules="rules"  ref="ruleForm">
         <el-form-item prop="name" label="方案名称" :label-width="formLabelWidth">
            <el-input v-model="viewData.genScheme.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="category" label="模板分类" :label-width="formLabelWidth">
            <el-select filterable v-model="viewData.genScheme.category">
              <el-option
                v-for="item in viewData.config.categoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="packageName" label="生成包路径" :label-width="formLabelWidth">
            <el-input v-model="viewData.genScheme.packageName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="moduleName" label="生成模块名" :label-width="formLabelWidth">
            <el-input v-model="viewData.genScheme.moduleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="subModuleName" label="生成子模块名" :label-width="formLabelWidth">
            <el-input v-model="viewData.genScheme.subModuleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="functionNameSimple" label="生成功能名" :label-width="formLabelWidth">
            <el-input v-model="viewData.genScheme.functionNameSimple" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="functionName" label="生成功能描述" :label-width="formLabelWidth">
            <el-input v-model="viewData.genScheme.functionName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="functionAuthor" label="生成功能作者" :label-width="formLabelWidth">
            <el-input v-model="viewData.genScheme.functionAuthor" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item prop="genTableId" label="业务表名" :label-width="formLabelWidth">
            <el-select filterable v-model="viewData.genScheme.genTableId">
              <el-option
                v-for="item in viewData.tableList"
                :key="item.id"
                :label="item.name+':'+item.comments"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="是否覆盖现有同名文件">
            <el-switch on-text="" off-text="" v-model="viewData.genScheme.replaceFile"></el-switch>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSave">保存方案</el-button>
          <el-button type="primary" @click="onSave(true)">保存方案并生成代码</el-button>
        </div>
      </el-dialog>

    </div>
  </imp-panel>


</template>

<script>
  import panel from "@/components/common/Panel.vue";
  import * as api from "@/api/security";
  import util from "@/core/util";
  import ElCheckbox from "../../../../node_modules/element-ui/packages/checkbox/src/checkbox";
  export default {
    components: {
      ElCheckbox,
      'imp-panel': panel,
    },
    created:function () {
      this.getDataList();
      this.getViewData();
    },
    computed: {
      batchFlag(){
          return !this.multipleSelection.length>0;
      }
    },
    data () {
      return {
        applicationList :[],
        formLabelWidth: '100px',
        viewData:{
          genScheme:{
            name:'',
            category:'',
            packageName:'',
            moduleName:'',
            subModuleName:'',
            functionNameSimple:'',
            functionName:'',
            functionAuthor:'',
            replaceFile:false
          },
          config:{
            categoryList:[]
          },
          tableList:[],
        },
        rules:{},
        dialogFormVisible: false,//dialog 隐藏与否
        batch_flag: true, //符合批量删除为true,否则为false:
        data: [],
        multipleSelection: [],//多选
        search_data: {
          name: null
        },
        //需要给分页组件传的信息
        paginations: {
          currentPage: 1,
          total: 0,
          pageSize: 12,
          pageSizes: [3, 9, 12, 24],
          layout: "total, sizes, prev, pager, next, jumper"
        },
      }
    },
    methods: {
      onDelete(id){
        let ids = [];
        if(id){
          ids.push(id);
        }else {
          ids = this.selectNodeKeys;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post("/table/delete",ids)
            .then(res => {
              this.$message('操作成功');
              this.getDataList();
            })
        });
      },
      onAdd(){
          this.dialogFormVisible = true;
      },
      onEdit(row){
        this.getViewData(row.id);
        this.dialogFormVisible = true;
      },
      onSelect(){

      },
      onSave(isGen){
        if(isGen){
          this.viewData.genScheme.genIs = 'true';
        }
        this.$refs['ruleForm'].validate((valid) => {
            if (valid){
              this.$http.post("/genScheme/save", this.viewData.genScheme)
                .then(res => {
                  this.$message('操作成功');
                  this.getDataList();
                  this.dialogFormVisible = false
                })
            }
        });

      },
      /**
       * 搜索
       */
      onSearch() {
        this.getDataList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.paginations.pageSize = val;
        this.getDataList();
      },
      handleCurrentChange(val) {
        this.paginations.currentPage = val;
        this.getDataList();
      },
      getViewData(id){
        id = id||'';
        this.$http.get("/genScheme/viewData",{params:{id:id}}).then(response=> {
          this.viewData = response.data;
        });
      },
      /**
       * 获取列表数据
       */
      getDataList(){
        let data = {
          current: this.paginations.currentPage,
          size: this.paginations.pageSize,
          ...this.search_data
        };
        this.$http.get("/genScheme/page",{params:data}).then(response=> {
          this.data = response.data.records;
          this.paginations.total = response.data.total;
        });
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .demo-form-inline {
    display: inline-block;
    float: right;
  }

  .btm-action {
    margin-top: 20px;
    text-align: center;
  }

  .actions-top {
    height: 46px;
  }

  .pagination {
    display: inline-block;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
