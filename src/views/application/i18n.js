/**
 * Created by tangaoyu on 2017/5/9.
 */
export default { // `i18n` option
  messages: {
    ch: {
      application: {
        title: "应用管理",
          applicationName:{
          lable:"应用名称",
            rules :{
            requireMsg:"请输入应用名称",
          },
        },
        applicationCode:{
          lable:"应用编码",
            rules :{
            requireMsg:"请输入应用编码",
          },
        },
        applicationUrl:{
          lable: "应用地址",
            rules :{
            requireMsg:"请输入应用地址",
          },
        },
        applicationIcon:{
          lable: "应用图片",
        },
        createName:{
          lable: "创建人",
            rules :{
            requireMsg:"应用图片",
          },
        },
        createTime:{
          lable: "创建时间",
        },
        isEnable: {
          lable:"应用状态",
            effective:"有效",
            invalid: "无效"
        },
        applicationDesc: {
          lable:"应用描述",
        },
        commonRules:{
          lenghtMsg: "长度在 {0} 到 {1} 个字符"
        }
      }
    }
  }
}
