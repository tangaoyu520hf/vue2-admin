/**
 * Created by tangaoyu on 2017/4/20.
 */

const menuModule = {
  state:{ cardMenuList:[] },
  mutations:{
    addCardMenu(state,cardMenu){
      let isExist = state.cardMenuList.filter(obj => obj.menuName==cardMenu.menuName);
      if(isExist.length<1){
        state.cardMenuList.push(cardMenu);
      }
    },
    removeCardMenu(state,menuUrl){
      let tempList = state.cardMenuList.filter(obj=> {
        return obj.menuUrl!==menuUrl
      });
      state.cardMenuList = tempList;
    }
  }
}
export default menuModule
