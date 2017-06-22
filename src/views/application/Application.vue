<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12">
          <el-button type='danger' icon='delete'
                     :disabled='batchFlag'
                     @click='onDelete(true)'>{{$t("button.delete")}}
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-form  :inline="true" :model='search_data' class="demo-form-inline">
            <el-form-item>
              <el-input :placeholder='$t("application.applicationName.lable")' icon="search" v-model='search_data.title'></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click='onSearch'>{{$t("button.query")}}</el-button>
              <el-button type="primary" icon="plus" @click='onAdd'>{{$t("button.add")}}</el-button>
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
          :label='$t("application.applicationName.lable")'
          prop="applicationName">
        </el-table-column>
        <el-table-column
          :label='$t("application.applicationCode.lable")'
          prop="applicationCode">
        </el-table-column>
        <el-table-column
          :label='$t("application.applicationUrl.lable")'
          prop="applicationUrl">
        </el-table-column>
        <el-table-column
          :label='$t("application.applicationIcon.lable")'
          prop="applicationIcon">
        </el-table-column>
        <el-table-column
          :label='$t("application.createName.lable")'
          prop="createName">
        </el-table-column>
        <el-table-column
          :label='$t("application.createTime.lable")'
          width="180"
          prop="createTime">
        </el-table-column>

        <el-table-column
          :label='$t("common.operate")'
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
      <el-dialog :title='$t("application.title")' :label='$t("application.title")' :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="applicationName" :label='$t("application.applicationName.lable")' :label-width="formLabelWidth">
            <el-input v-model="ruleForm.applicationName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="applicationUrl" :label='$t("application.applicationUrl.lable")' :label-width="formLabelWidth">
            <el-input v-model="ruleForm.applicationUrl" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="applicationCode" :label='$t("application.applicationCode.lable")' :label-width="formLabelWidth">
            <el-input v-model="ruleForm.applicationCode" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="applicationIcon" :label='$t("application.applicationIcon.lable")' :label-width="formLabelWidth">
            <el-input v-model="ruleForm.applicationIcon" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item prop="isEnable" :label='$t("application.isEnable.lable")' :label-width="formLabelWidth">
            <el-switch
              v-model="ruleForm.isEnable"
              :on-text='$t("application.isEnable.effective")'
              :off-text='$t("application.isEnable.invalid")'
              on-color="#13ce66"
              off-color="#ff4949"
              on-value="Y"
              off-value="N">
            </el-switch>
          </el-form-item>
          <el-form-item :label='$t("application.applicationDesc.lable")' prop="applicationDesc" :label-width="formLabelWidth" >
            <el-input type="textarea" v-model="ruleForm.applicationDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{$t("button.cancel")}}</el-button>
          <el-button type="primary" @click="onSave">{{$t("button.confirm")}}</el-button>
        </div>
      </el-dialog>

      <el-dialog :title='$t("application.title")' v-model="dialogInfoShow">
        <el-form>
          <el-form-item :label='$t("application.applicationName.lable")' :label-width="formLabelWidth">
            {{ruleForm.applicationName}}
          </el-form-item>
          <el-form-item :label='$t("application.applicationUrl.lable")' :label-width="formLabelWidth">
            {{ruleForm.applicationUrl}}
          </el-form-item>
          <el-form-item :label='$t("application.applicationCode.lable")' :label-width="formLabelWidth">
            {{ruleForm.applicationCode}}
          </el-form-item>
          <el-form-item :label='$t("application.applicationIcon.lable")' :label-width="formLabelWidth">
            {{ruleForm.applicationIcon}}
          </el-form-item>

          <el-form-item :label='$t("application.isEnable.lable")' :label-width="formLabelWidth">
            <el-switch
              v-model="ruleForm.isEnable"
              :on-text='$t("application.isEnable.effective")'
              :off-text='$t("application.isEnable.invalid")'
              on-color="#13ce66"
              off-color="#ff4949"
              on-value="Y"
              off-value="N">
            </el-switch>
          </el-form-item>
          <el-form-item :label='$t("application.applicationDesc.lable")' :label-width="formLabelWidth" >
            {{ruleForm.applicationDesc}}
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </imp-panel>


</template>

<script>
  import index from "./index";
  export default index;
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
