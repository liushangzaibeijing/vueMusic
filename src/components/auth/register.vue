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
        showRegister:true
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
      submit () {
        let validateResult = this.formValidate();
        // 验证成功
        if (validateResult.status) {
          this.register(() => {
            this.$store.dispatch('new_notice', {
              autoClose: true,
              content: '注册成功, 请登录邮箱激活用户'
            });
            this.loadPage('login',null);
          });
        } else {
          this.$store.dispatch('new_notice', {
            autoClose: true,
            content: validateResult.msg
          });
        }
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
      formValidate () {
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

