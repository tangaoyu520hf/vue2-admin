<template>
  <div class="list">
    <!--删除及查询条件 start-->
    <el-col :span="20" class='actions-top'>
      <el-button type='danger' icon='delete'
                 :disabled='batchFlag'
                 @click='onDelete(true)'>删除选中
      </el-button>

      <el-form :inline="true" :model='search_data' class="demo-form-inline">
        <el-form-item>
          <el-input placeholder="标题" v-model='search_data.title'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click='onSearch'>查询</el-button>
          <el-button type="primary" icon="plus" @click='dialogFormVisible=!dialogFormVisible'>新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--删除及查询条件 end-->
    <el-col :span="24" class='actions-top'>
      <el-table border style="width: 100%" align='center'
                :data='data'
                @selection-change='handleSelectionChange'>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="菜单名称"
          width="180"
          prop="menuName">
        </el-table-column>
        <el-table-column
          label="菜单编码"
          width="180"
          prop="menuCode">
        </el-table-column>
        <el-table-column
          label="菜单图标"
          width="180"
          prop="menuIcon">
        </el-table-column>
        <el-table-column
          label="菜单地址"
          width="180"
          prop="menuUrl">
        </el-table-column>
        <el-table-column
          label="排序"
          width="80"
          prop="sort">
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
              @click='onDelete(scope.row,scope.$index,data)'></el-button>
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
    </el-col>

    <el-dialog :close-on-click-modal=false size="large" title="菜单编辑" v-model="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="应用名称" prop="name">
          <el-select v-model="ruleForm.applicationId" placeholder="请选择">
            <el-option
              v-for="item in applicationList"
              :key="item.applicationId"
              :label="item.applicationName"
              :value="item.applicationId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上级菜单" prop="name">
          <el-input
            placeholder="请输入内容"
            v-model="ruleForm.pid"
            :readonly="true"
            @click.native="onDelete">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
<!--      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>-->
    </el-dialog>

    <!--    <el-col :span="24" class='btm-action'>

        </el-col>-->
    <!--    <el-dialog size="small"
                   :title="dialog.article_info.title"
                   v-model="dialog.show"
                   @close='onCloseView'>
          <div v-html="dialog.article_info.content"></div>
          &lt;!&ndash;  <span slot="footer" class="dialog-footer">
              <el-button @click="dialog.show = false">取 消</el-button>
              <el-button type="primary" @click="dialog.show = false">确 定</el-button>
          </span> &ndash;&gt;
        </el-dialog>-->
  </div>

</template>

<script>
  export default {
    name: 'menu',
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
      onDelete(){
        alert(123);
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

        this.$http.get("security/menu/page",{params:data}).then(response=> {
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
