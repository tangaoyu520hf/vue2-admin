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
              <el-input placeholder="标题" icon="search" v-model='search_data.title'></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click='onSearch'>查询</el-button>
              <el-button type="primary" icon="plus" @click='dialogFormVisible=true'>新增</el-button>
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
          label="应用名称"
          prop="applicationName">
        </el-table-column>
        <el-table-column
          label="应用编码"
          prop="applicationCode">
        </el-table-column>
        <el-table-column
          label="应用地址"
          prop="applicationUrl">
        </el-table-column>
        <el-table-column
          label="应用图标"
          prop="applicationIcon">
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createName">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="180"
          prop="createTime">
        </el-table-column>

        <el-table-column
          label="操作"
          width="160">
          <template scope='scope'>
            <el-button
              type="info"
              icon='view'
              size="mini"
              @click='onSelect(scope.row)'></el-button>
            <el-button
              type="info"
              icon='edit'
              size="mini"
              @click='onEdit(scope.row)'></el-button>
            <el-button
              type="danger"
              icon='delete'
              size="mini"
              @click='onDelete(scope.row.applicationId)'></el-button>
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
      <el-dialog title="应用" :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm">
          <el-form-item label="活动名称" :label-width="formLabelWidth">
            <el-input v-model="ruleForm.applicationName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" :label-width="formLabelWidth">
            <el-select v-model="ruleForm.applicationId" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </imp-panel>


</template>

<script>
  import panel from "@/components/common/components/Panel.vue";
  import * as api from "@/api/security";
  export default {
    name: 'menu',
    components: {
      'imp-panel': panel,
    },
    created:function () {
      this.getDataList();
      this.getApplicationList();
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
        ruleForm: {
          applicationId: '',
          pid: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },

        dialogFormVisible: false,//dialog 隐藏与否
        batch_flag: true, //符合批量删除为true,否则为false:
        data: [],
        multipleSelection: [],//多选
        search_data: {
          title: ''
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
          this.$http.post(api.SYS_APPLICATION_DELETE, ["dwa"])
            .then(res => {
              this.$message('操作成功');
              this.load();
            })
        });
      },
      onEdit(){

      },
      onSelect(){

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
      /**
       * 获取列表数据
       */
      getDataList(){
        let data = {
          current: this.paginations.currentPage,
          size: this.paginations.pageSize,
          ...this.search_data
        };

        this.$http.get(api.SYS_APPLICATION_PAGE,{params:data}).then(response=> {
          this.data = response.data.data.records;
          this.paginations.total = response.data.data.total;
        });
      },
      /**
       * 获取应用下拉值
       */
      getApplicationList(){
        //完成查询
        this.$http.get("security/application/list").then(response=> {
          this.applicationList = response.data.data;
        });
      }

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
