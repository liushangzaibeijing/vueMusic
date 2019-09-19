import Vue from 'vue'
import {MessageBox} from 'element-ui';
Vue.prototype.$alert = MessageBox.alert
const errmsg =  function open(status){
  if(status === 401){
    Vue.prototype.$alert('登录过期请重新登录', '提示', {
      confirmButtonText: '确定',
      type: 'warning',
      callback: () => {
        window.location.hash ='#/login'
      }
    });
  }
}
export default errmsg
