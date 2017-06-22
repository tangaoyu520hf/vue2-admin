<template>
  <imp-panel>
    <h3  v-if="!isNext" class="box-title" slot="header" style="width: 100%;">
      <el-select v-model="table.name" filterable placeholder="请选择" >
        <el-option
          v-for="item in tables"
          :key="item.name"
          :label="item.name+':'+item.comments"
          :value="item.name">
        </el-option>
      </el-select>
      <el-button type="primary"  @click='next'>下一步</el-button>
    </h3>

    <div slot="body" v-if="isNext">

      <el-form :model="table"  label-width="100px" class="demo-ruleForm">
        <el-form-item label="表名" prop="name">
          <el-input v-model="table.name"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="name">
          <el-input v-model="table.comments"></el-input>
        </el-form-item>
        <el-form-item label="父表" prop="region">
          <el-select v-model="table.parentTable" filterable placeholder="请选择" >
            <el-option
              v-for="item in tables"
              :key="item.name"
              :label="item.name+':'+item.comments"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前表外键" prop="region">
          <el-select v-model="table.parentTableFk" filterable placeholder="请选择" >
            <el-option
              v-for="item in table.columnList"
              :key="item.name"
              :label="item.name+':'+item.comments"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-table border style="width: 100%" align='center'
                :data='table.columnList'>
        <el-table-column width="150" fixed label="列名" prop="name" ></el-table-column>
        <el-table-column
          label="说明"
          prop="comments"
          width="120"
          >
          <template scope="scope">
            <el-input v-model="scope.row.comments"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="物理类型"
          width="150"
          prop="jdbcType">
        </el-table-column>
        <el-table-column width="150" label="Java类型" prop="javaType">
          <template scope="scope">
            <el-select v-model="scope.row.javaType">
              <el-option
                v-for="item in options.javaType"
                :key="item.value"
                :label="item.lable"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="150" label="Java属性名称" prop="javaField">
          <template scope="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="主键" prop="javaField" >
          <template scope="scope">
              <el-checkbox v-model="scope.row.isPk" true-label="1" false-label="0"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="可空" prop="javaField" >
          <template scope="scope">
            <el-checkbox v-model="scope.row.isNull" true-label="1" false-label="0"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="插入" prop="javaField" >
          <template scope="scope">
            <el-checkbox v-model="scope.row.isInsert" true-label="1" false-label="0"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="编辑" prop="javaField" >
          <template scope="scope">
            <el-checkbox v-model="scope.row.isEdit" true-label="1" false-label="0"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="列表" prop="javaField" >
          <template scope="scope">
            <el-checkbox v-model="scope.row.isList" true-label="1" false-label="0"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="查询" prop="javaField" >
          <template scope="scope">
            <el-checkbox v-model="scope.row.isQuery" true-label="1" false-label="0"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column label="显示表单类型" width="150" prop="queryType">
          <template scope="scope">
            <el-select v-model="scope.row.showType">
              <el-option
                v-for="item in options.showType"
                :key="item.value"
                :label="item.lable"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="查询匹配方式" width="150" prop="queryType">
          <template scope="scope">
            <el-select v-model="scope.row.queryType">
              <el-option
                v-for="item in options.queryType"
                :key="item.value"
                :label="item.lable"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="字典类型" width="150" prop="dictType">
          <template scope="scope">
            <el-input v-model="scope.row.dictType"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="排序" prop="dictType">
          <template scope="scope">
            <el-input v-model="scope.row.sort"></el-input>
          </template>
        </el-table-column>

      </el-table>

      <el-button type="primary" icon="plus" @click='onSave'>保存</el-button>

    </div>
  </imp-panel>


</template>

<script>
  import panel from "@/components/common/Panel.vue";
  import util from "@/core/util";
  export default {
    components: {
      'imp-panel': panel,
    },
    created:function () {
      this.getTablesByDB();
      //从编辑页面过来的
      if(this.$route.query.name){
        this.isNext = true;
        this.table.name = this.$route.query.name
        this.table.id = this.$route.query.id
        this.getTypes();
        this.getTableColunms();
      }
    },
    data () {
      return {
        multipleSelection: [],
        tables: [],
        table:{
          name: '',
          id:"",
          parentTable: '',
          parentTableFk:'',
          columnList:[],
        },
        isNext:false,
        options:{
          javaType:[],
          queryType:[],
          showType:[],
        }
      }
    },
    methods: {
      next(){
          if(this.table.name){
            this.isNext=true
            this.getTableColunms();
          }else{
            this.$message.error('请选择table再进行下一步');
          }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      onSave(){
        this.$http.post("/table/save",this.table).then(response=> {
          this.tables = response.data;
        });
      },
      /**
       * 获取列表数据
       */
      getTablesByDB(){
        this.$http.get("/table/getTablesByDB").then(response=> {
          this.tables = response.data;
        });
      },
      getTableColunms(){
        this.$http.get("/table/getTablesColumnByDB",{params:{name:this.table.name,id: this.table.id}}).then(response=> {
          this.table = response.data;
        });
      },
      getTypes(){
        this.$http.get("/table/getTypes").then(response=> {
          this.options.showType = response.data.showTypes;
          this.options.javaType = response.data.javaTypes;
          this.options.queryType = response.data.queryTypes;
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
