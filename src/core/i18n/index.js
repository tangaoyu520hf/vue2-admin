/**
 * Created by tangaoyu on 2017/4/28.
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

const messages = {
  ch: {
    button:{
      query:"查询",
      add:"添加",
      update:"修改",
      delete:"删除选中",
      close:"关闭",
      save:"保存",
      cancel:"取消",
      confirm:"确认"
    },
    common: {
      confirmDelete: "确认删除?",
      prompt: "提示",
      operate: "操作",
      operateSuccess: "操作成功",
      confirm: "确认",
      cancel: "取消"
    }
  }
}
//加载国际化
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'ch', // set locale
  messages, // set locale messages
});
export default i18n
