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
              <el-input placeholder="表名" icon="search" v-model='search_data.name'></el-input>
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
          label="表名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="说明"
          prop="comments">
        </el-table-column>
        <el-table-column
          label="类名"
          prop="className">
        </el-table-column>
        <el-table-column
          label="父表"
          prop="parentTable">
        </el-table-column>

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

    </div>
  </imp-panel>


</template>

<script>
  import panel from "@/components/common/Panel.vue";
  import * as api from "@/api/security";
  import util from "@/core/util";
  export default {
    name: 'menu',
    components: {
      'imp-panel': panel,
    },
    created:function () {
      this.getDataList();
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
          this.$http.post("/table/delete",ids)
            .then(res => {
              this.$message('操作成功');
              this.getDataList();
            })
        });
      },
      onAdd(){
          this.$router.push("/table/addOrUpdate")
      },
      onEdit(row){
        this.$router.push({path:"/table/addOrUpdate",query: { name: row.name,id: row.id }})
      },
      onSelect(){

      },
      onSave(){
        let saveOrUpdateUrl =  api.SYS_APPLICATION_ADD;
        //不为空则是更新
        if(this.ruleForm.applicationId){
          saveOrUpdateUrl = api.SYS_APPLICATION_UPDATE
        }
        this.$refs['ruleForm'].validate((valid) => {
            if (valid){
              this.$http.post(saveOrUpdateUrl, this.ruleForm)
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
      /**
       * 获取列表数据
       */
      getDataList(){
        let data = {
          current: this.paginations.currentPage,
          size: this.paginations.pageSize,
          ...this.search_data
        };

        this.$http.get("/table/page",{params:data}).then(response=> {
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
