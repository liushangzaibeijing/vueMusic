<template>

  <div class="login-container" v-if="showRegister">
    <div class="choose">
      <header>
        <span @click="close"><i class="fa fa-window-close-o"></i></span>
      </header>
      <div class="main-top">
        <i class="fa fa-user-o fa-lg"></i>
        <span class="register">注册</span>
        <a href="#" class="zhu" @click="loadPage('login',null)">登录</a>
      </div>
      <div class="main-bot">
        <div class="field-inline">
          <p>登录名</p>
          <input class='main-input' type="text" v-model="registerForm.loginName"/>
        </div>
        <div class="field-inline">
          <p>邮箱</p>
          <input class='main-input' type="text" v-model="registerForm.email"/>
        </div>
        <div class="field-inline">
          <p>密码</p>
          <input class='main-input' type="password" v-model="registerForm.loginPwd"/>
        </div>
        <div class="field-inline">
          <p>确认密码</p>
          <input class='main-input' type="password" v-model="registerForm.confirmPwd"/>
        </div>
        <div class="field-inline">
          <p>手机号</p>
          <input class='main-input' type="text" v-model="registerForm.mobileNo"/>
        </div>
        <div class="register-check-dev" style="width: 132%;display: inline-block;">
          <p>验证码</p>
          <input type="text" v-model="registerForm.imageCode" class="inputMa" placeholder="验证码">
          <img v-lazy="imageCode" @click="getImage" class="check-ma"/>
        </div>
        <button class="register-btn" @click="submit">注册</button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import PcTimerButton from '../../components/auth/timer-button/index.vue';
  export default {
    data () {
      return {
        imageCode: '',
        registerForm: {
          loginName: '',
          mobileNo: '',
          loginPwd: '',
          email: '',
          confirmPwd: '',
          imageCode: '',
          registerSource: 'PC'
        },
        showRegister:false
      };
    },
    created () {
      this.getImage();
    },
    mounted () {
    },
    methods: {
      getImage () {
        this.deviceId = new Date().getTime();
        let that = this;
        that.$http({
          method: 'POST',
          url: '/uac/auth/code/image',
          headers: {
            'deviceId': that.deviceId
          }
        }).then((res) => {
          that.imageCode = 'data:image/jpg;base64,' + res.result;
        });
      },


      register (resolve) {
        this.$http({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'deviceId': this.deviceId
          },
          url: '/uac/auth/register',
          params: this.registerForm
        }).then((res) => {
          this.getImage();
          if (res) {
            resolve(res);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      loadPage(routerName, param) {
        debugger
        if (param) {
          this.$router.push({name: routerName, query: param});
        } else {
          this.$router.push({name: routerName});
        }
      },

      checkCount(resolve, validValue, type) {
        this.ajax({
          url: `/uac/auth/checkValid`,
          isUnMusk: true,
          data: {
            validValue: validValue,
            type: type
          },
          success: resolve
        });
      }
    },
    components: {
      PcTimerButton
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../style/register";
</style>

