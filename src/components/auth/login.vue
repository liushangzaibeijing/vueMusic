<template>
  <div>
    <div class="login-container" v-show="showLogin">
      <div class="choose">
        <header>
          <span @click="close"><i class="fa fa-window-close-o"></i></span>
        </header>
        <div class="main-top">
          <i class="fa fa-user-o" aria-hidden="true"></i>
          <span class="login">登录</span>
          <a href="#" class="login-register" @click="loadPage('register')">注册</a>
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
            <a class="fog" @click="loadPage('ResetPwdEmail')">忘记密码?</a>
          </div>
          <button class="login" @click="doLogin">登录</button>
          <div class="other">
            <hr/><p>其他方式登录</p><hr/>
          </div>
          <div class="last">
            <a href="#"><img src="../../assets/login/git1.png" alt=""></a>
            <a href="#"><img src="../../assets/login/git2.png" alt=""></a>
            <a href="#"><img src="../../assets/login/git3.png" alt=""></a>
            <a onclick="qqLogin"><img src="../../assets/login/git4.png" alt=""></a>
            <a href="/auth/weixin"><img src="../../assets/login/git5.png" alt=""></a>
          </div>
        </div>
      </div>
    </div>
    <div class="register-container" v-show="showRegister">
      <div class="choose">
        <header>
          <span @click="close"><i class="fa fa-window-close-o"></i></span>
        </header>
        <div class="main-top">
          <i class="fa fa-user-o fa-lg"></i>
          <span class="register">注册</span>
          <a href="#" class="zhu" @click="loadPage('login')">登录</a>
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
  </div>

</template>
<script type="text/ecmascript-6">
  import PcTimerButton from '../../components/auth/timer-button/index.vue';
  export default {
    data () {
      return {
        imageCode: '',
        deviceId: '',
        //登录表单
        loginForm: {
          loginName: '',
          loginPwd: '',
          captchaCode: ''
        },
        //注册表单
        registerForm: {
          loginName: '',
          mobileNo: '',
          loginPwd: '',
          email: '',
          confirmPwd: '',
          imageCode: '',
          registerSource: 'PC'
        },
        showLogin:true,
        showRegister:false,
      };
    },
    mounted () {
      this.getImage();
    },
    methods: {
      /**
       * 封装一个居中打开新窗口的方法
       */
      openWindow(url, width, height)
      {
        width = width || 600;
        height = height || 400;
        var left = (window.screen.width - width) / 2;
        var top = (window.screen.height - height) / 2;
        window.open(url, "_blank", "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, left="+left+", top="+top+", width="+width+", height="+height);
      },

    qqLogin()
      {
        var qqAppId = '101810237'; // 上面申请得到的appid
        var qqAuthPath = 'http://49.232.47.236:8035/utopia/login/logincallBack'; // 前面设置的回调地址
        var state = 'fjdslfjsdlkfd'; // 防止CSRF攻击的随机参数，必传，登录成功之后会回传，最好后台自己生成然后校验合法性
        this.openWindow(`https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=${qqAppId}&redirect_uri=${encodeURIComponent(qqAuthPath)}&state=${state}`);
      },
      doLogin () {
        let validateResult = this.loginFormValidate();
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
      submit () {
        let validateResult = this.registerFormValidate();
        // 验证成功
        if (validateResult.status) {
          this.register(() => {
            this.$store.dispatch('new_notice', {
              autoClose: true,
              content: '注册成功, 请登录邮箱激活用户'
            });
            this.loadPage('login');
          });
        } else {
          this.$store.dispatch('new_notice', {
            autoClose: true,
            content: validateResult.msg
          });
        }
      },
      loadPage(routerName) {
        if(routerName=="login"){
          this.showLogin = true;
          this.showRegister =false;
        }
        if(routerName=="register"){
          this.showLogin = false;
          this.showRegister =true;
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
      //登录页面校验
      loginFormValidate () {
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
      },
      close() {
           this.showLogin = false;
           this.showRegister = false;
      }
    },
    //注册表单校验
    registerFormValidate () {
      let result = {
        status: false,
        msg: ''
      };
      // 验证用户名是否为空
      if (!this.validate(this.registerForm.loginName, 'require')) {
        result.msg = '用户名不能为空';
        return result;
      }

      // 校验登录名是否存在
//        this.checkCount((res) => {
//          if (!res.result) {
//            result.status = false;
//            result.msg = '用户名已存在';
//            return result;
//          }
//        }, this.registerForm.loginName, 'loginName');
      // 验证邮箱
      if (!this.validate(this.registerForm.email, 'require')) {
        result.msg = '邮箱不能为空';
        return result;
      }

      // 验证邮箱正则
      if (!this.validate(this.registerForm.email, 'email')) {
        result.msg = '邮箱格式不正确';
        return result;
      }

      // 校验邮箱是否存在
//        this.checkCount((res) => {
//          if (!res.result) {
//            result.status = false;
//            result.msg = '邮箱已存在';
//            return result;
//          }
//        }, this.registerForm.email, 'email');
      // 验证 密码
      if (!this.validate(this.registerForm.loginPwd, 'require')) {
        result.msg = '密码不能为空';
        return result;
      }
      // 验证 密码
      if (!this.validate(this.registerForm.confirmPwd, 'require')) {
        result.msg = '确认密码不能为空';
        return result;
      }
      if (!this.validate(this.registerForm.loginPwd, 'pwd')) {
        result.msg = '密码格式不正确';
        return result;
      }
      if (!this.validate(this.registerForm.confirmPwd, 'pwd')) {
        result.msg = '确认密码格式不正确';
        return result;
      }
      // 验证两次输入的密码是否一致
      if (this.registerForm.loginPwd !== this.registerForm.confirmPwd) {
        result.msg = '两次输入的密码不一致';
        return result;
      }

      if (!this.validate(this.registerForm.mobileNo, 'require')) {
        result.msg = '手机号码不能为空';
        return result;
      }

      // 验证手机号
      if (!this.validate(this.registerForm.mobileNo, 'phone')) {
        result.msg = '手机号格式不正确';
        return result;
      }

//        this.checkCount((res) => {
//          if (!res.result) {
//            result.status = false;
//            result.msg = '手机号码已存在';
//            return result;
//          }
//        }, this.registerForm.mobileNo, 'mobileNo');

      if (!this.validate(this.registerForm.imageCode, 'require')) {
        result.msg = '验证码不能为空';
        return result;
      }

      // 通过验证，返回正确提示
      result.status = true;
      result.msg = '验证通过';
      return result;
    },

    computed: {
      rememberMe() {
        return this.$store.getters.getRememberMe;
      },
      redirectUri() {
        return this.$store.getters.getRedirectUri;
      }
    },
    components: {
      PcTimerButton
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../style/login";
</style>
