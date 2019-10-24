<template>
  <div class="login-container" v-if="showLogin">
    <div class="choose">
      <header>
        <span @click="close"><i class="fa fa-window-close-o"></i></span>
      </header>
      <div class="main-top">
        <i class="fa fa-user-o" aria-hidden="true"></i>
        <span class="login">登录</span>
        <a href="#" class="login-register" @click="loadPage('login',null)">注册</a>
      </div>
      <div class="main-bot">
        <input class="login-input" @keyup.13="doLogin" v-model="loginForm.loginName" type="text" placeholder="请输入帐号"/>
        <input class="login-input" @keyup.13="doLogin" v-model="loginForm.loginPwd" type="password"
               placeholder="请输入密码"/>
        <div class="image-code-div">
          <input type="text" v-model="loginForm.captchaCode" placeholder="验证码">
          <img v-lazy="imageCode" @click="getImage"/>
        </div>
        <div class="main-password">
          <input id="button" type="checkbox" class="button" @click="rememberMeFn" :checked="rememberMe" value="Bike" title=""/>
          <label for="button" class="remMe">记住我</label>
          <a class="fog" @click="loadPage('ResetPwdEmail',null)">忘记密码?</a>
        </div>
        <button class="login" @click="doLogin">登录</button>
        <div class="other">
          <hr/><p>其他方式登录</p><hr/>
        </div>
        <div class="last">
          <a href="#"><img src="../../assets/login/git1.png" alt=""></a>
          <a href="#"><img src="../../assets/login/git2.png" alt=""></a>
          <a href="#"><img src="../../assets/login/git3.png" alt=""></a>
          <a href="/uac/auth/qq"><img src="../../assets/login/git4.png" alt=""></a>
          <a href="/auth/weixin"><img src="../../assets/login/git5.png" alt=""></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        imageCode: '',
        deviceId: '',
        loginForm: {
          loginName: '',
          loginPwd: '',
          captchaCode: ''
        },
        showLogin:false
      };
    },
    mounted () {
      this.getImage();
    },
    methods: {
      doLogin () {
        let validateResult = this.formValidate();
        if (!validateResult.status) {
          this.$store.dispatch('new_notice', {
            autoClose: true,
            content: validateResult.msg
          });
          return;
        }
        this.login();
      },
      login () {
        let loginName = this.loginForm.loginName;
        let loginPwd = this.loginForm.loginPwd;
        this.$http({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'deviceId': this.deviceId
          },
          url: '/uac/auth/form',
          auth: {
            username: 'paascloud-client-uac',
            password: 'paascloudClientSecret'
          },
          params: {
            username: loginName,
            password: loginPwd,
            imageCode: this.loginForm.captchaCode
          }
        }).then((res) => {
          this.getImage();
          if (res && res.code === 200) {
            this.$store.dispatch('update_auth_token', res.result);
            window.location.href = this.redirectUri;
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
      //获取验证码功能
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
      rememberMeFn() {
        this.$store.dispatch('update_remember_me');
      },
      formValidate () {
        let result = {
          status: false,
          msg: ''
        };
        if (!this.validate(this.loginForm.loginName, 'require')) {
          result.msg = '用户名不能为空';
          return result;
        }
        if (!this.validate(this.loginForm.loginPwd, 'require')) {
          result.msg = '密码不能为空';
          return result;
        }
        if (!this.validate(this.loginForm.captchaCode, 'require')) {
          result.msg = '验证码不能为空';
          return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
      }
    },
    computed: {
      rememberMe() {
        return this.$store.getters.getRememberMe;
      },
      redirectUri() {
        return this.$store.getters.getRedirectUri;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../style/login";
</style>
