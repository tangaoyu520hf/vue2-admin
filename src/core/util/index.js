/**
 * Created by tangaoyu on 2017/4/23.
 */
export default {
  /**
   * 懒加载 component
   * @param url
   * @param component
   * @returns {function(): *}
   */
  load(component){
    console.info(`../${component}.vue`);
    return () => System.import(`@/${component}.vue`)
  },
  /**
   * 把source上的key从目标对象上获取值
   * @param target
   * @param source
   */
  cover(target,source){
    let targetTemp = {};
    for (let prop in source) {
      if (source.hasOwnProperty(prop)) {
        let value = target[prop];
        if (value !== undefined) {
          targetTemp[prop] = value;
        }
      }
    }
    return targetTemp;
  }
}
