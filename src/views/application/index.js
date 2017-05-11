/**
 * Created by tangaoyu on 2017/5/9.
 */
import panel from "@/components/common/Panel.vue";
import * as api from "@/api/security";
import util from "@/core/util";
import i18n from "./i18n"
export default {
  name: 'application',
  components: {
    'imp-panel': panel,
  },
  //国际化
  i18n:i18n,
  created:function () {
    this.getDataList();
  },
  computed: {
    batchFlag(){
      this.$t("application.title");
      return !this.multipleSelection.length>0;
    }
  },
  data () {
    return {
      applicationList :[],
      formLabelWidth: '100px',
      ruleForm: {
        applicationId: '',
        applicationName: '',
        applicationUrl: '',
        applicationDesc: '',
        applicationIcon: '',
        isEnable: 'Y',
        applicationCode: '',
      },
      rules: {
        applicationName: [
          { required: true, message: this.$t("application.applicationName.rules.requireMsg"), trigger: 'blur' },
          {min: 2, max: 15, message: this.$t("application.commonRules.lenghtMsg",[2,15]), trigger: 'blur'}
        ],
        applicationUrl: [
          { required: true, message: this.$t("application.applicationName.rules.applicationUrl"), trigger: 'blur' },
          {min: 2, max: 15, message: this.$t("application.commonRules.lenghtMsg",[2,15]), trigger: 'blur'}
        ],
        applicationCode: [
          { required: true, message: this.$t("application.applicationName.rules.applicationUrl"), trigger: 'blur' },
          {min: 2, max: 15, message: this.$t("application.commonRules.lenghtMsg",[2,15]), trigger: 'blur'}
        ]
      },

      dialogFormVisible: false,//dialog 隐藏与否
      dialogInfoShow: false,
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
      this.$confirm(this.$t("common.confirmDelete"), this.$t("common.prompt"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: 'warning'
      }).then(() => {
        this.$http.post(api.SYS_APPLICATION_DELETE,ids)
          .then(res => {
            this.$message(this.$t("common.operateSuccess"));
            this.getDataList();
          })
      });
    },
    onAdd(){
      let newForm =  {
        applicationId: '',
          applicationName: '',
          applicationUrl: '',
          applicationDesc: '',
          applicationIcon: '',
          isEnable: 'Y',
          applicationCode: '',
      }
      util.cover(newForm,this.ruleForm);
      this.dialogFormVisible=true;
      /*
      this.$nextTick(() => {
        if(this.$refs["ruleForm"]){
          this.$refs["ruleForm"].resetFields();
        }
      });*/
    },
    onEdit(row){
      /*let doms = $(this.$el).find("#testClass");*/
      let doms = $(this.$el).find("#testClass");
      doms.html("神话");
      util.cover(row,this.ruleForm);
      this.dialogFormVisible = true;
    },
    onSelect(row){
      util.cover(row,this.ruleForm);
      this.dialogInfoShow = true;
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
              this.$message(this.$t("common.operateSuccess"));
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

      this.$http.get(api.SYS_APPLICATION_PAGE,{params:data}).then(response=> {
        this.data = response.data.data.records;
        this.paginations.total = response.data.data.total;
      });
    },
  },
}

