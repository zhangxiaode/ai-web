<template>
  <div class="bg-#191919 relative w-100% h-100%">
    <div class="w-100% h-100% origin-top-left">
      <div class="absolute left-10% top-10% z-1 text-left w-80% h-80% flex flex-wrap overflow-auto">
        <div class="font-bold text-40px c-#fff leading-40px tracking-[1px] w-100%">欢迎来到丞尧智芯!</div>
        <div class="text-18px c-#fff leading-20px mt-16px mb-23px w-100%">你的创作核心</div>
        <div class="w-63% h-[calc(100%-100px)] rounded-16px overflow-hidden filter-[hue-rotate(310deg)]">
          <img class="w-100% h-100% object-cover object-[left_center]" src="../assets/login-banner.png" alt="">
        </div>
        <div class="box-border w-36% h-[calc(100%-100px)] ml-1% bg-[url('../assets/login-content-bg.png')] bg-no-repeat bg-center bg-[#292929] bg-[100%_100%] shadow-[0px_0_0px_0px_rgba(92,127,167,0.2)] rounded-16px border-2 border-solid border-[#585858] p-28px flex flex-column ai-normal">
          <div class="box-border w-100% h-auto max-h-384px pr-15px ml-[-20px] flex ai-center">
            <img src="../assets/logo.png" class="w-22px h-22px" />
            <span class="text-14px c-#fff ml-8px">丞尧智芯</span>
          </div>
          <div v-if="tabIndex === 0 || tabIndex === 1" class="text-18px c-#fff mt-12px">欢迎您!</div>
          <div v-if="tabIndex === 0 || tabIndex === 1" class="text-12px c-#fff mt-12px">还没有账号嘛? <span class="c-#fff hover:underline cursor-pointer" @click="handleRegister()">立即注册</span></div>
          <div v-if="tabIndex === 0 || tabIndex === 1" class="my-20px ml-[-20px] flex ai-center">
            <div v-for="(item, index) in tabs" :key="index" :class="['text-12px c-#fff px-20px relative cursor-pointer', { 'after:content-[\'\'] after:absolute after:right-0px after:top-50% after:w-1px after:h-12px after:mt-[-6px] after:bg-#fff': index === 0 }, { 'font-bold before:absolute before:top-20px before:left-50% before:ml-[-13px] before:content-[\'\'] before:w-26px before:h-4px before:bg-#fff before:rounded-2px': tabIndex === item.value }]" @click="handleTab(item.value)">{{ item.label }}</div>
          </div>
          <div v-if="tabIndex === 2" class="text-18px c-#fff mt-12px">开始注册!</div>
          <div v-if="tabIndex === 2" class="text-12px c-#fff mt-12px">已经有一个账号了嘛? <span class="c-#fff hover:underline cursor-pointer" @click="handleLogin()">马上登录</span></div>
          <div v-if="tabIndex === 3" class="text-18px c-#fff mt-12px">修改密码!</div>
          <img v-if="tabIndex === 2 || tabIndex === 3" src="../assets/return.png" class="w-14px h-14px my-16px filter-[hue-rotate(310deg)] cursor-pointer" @click="handleReturn()" />
          <n-form
            ref="loginRef"
            :model="loginForm"
            :rules="loginRules"
            label-width="120px"
            label-align="right"
            label-placement="left"
            size="medium"
            class="login overflow-auto"
          >
            <!-- 密码登录 -->
            <n-form-item v-if="tabIndex === 0" label="登录账号：" path="phone">
              <n-input v-model:value="loginForm.phone" placeholder="请输入登录账号"/>
            </n-form-item>
            <n-form-item v-if="tabIndex === 0" label="登录密码：" path="password">
              <n-input v-model:value="loginForm.password" type="password" placeholder="请输入登录密码"/>
            </n-form-item>
            <div v-if="tabIndex === 0" class="text-right font-500 text-12px c-#fff my-20px hover:underline cursor-pointer" @click="handleForget()">忘记密码</div>
            <!-- 验证码登录 -->
            <n-form-item v-if="tabIndex === 1" label="手机号：" path="phone">
              <n-input v-model:value="loginForm.phone" placeholder="请输入手机号"/>
            </n-form-item>
            <n-form-item v-if="tabIndex === 1" label="图形验证码：" path="captcha_code">
              <n-input v-model:value="loginForm.captcha_code" type="text" placeholder="请输入图形验证码"/>
              <img :src="captcha_img" class="w-98px min-w-98px h-34px ml-12px cursor-pointer bg-#fff" @click="getCaptchaData()" />
            </n-form-item>
            <n-form-item v-if="tabIndex === 1" label="短信验证码：" path="code">
              <n-input v-model:value="loginForm.code" type="text" placeholder="请输入短信验证码"/>
              <n-button v-if="seconds === 0" type="primary" size="medium" class="ml-12px" @click="handleSendCode(0)">发送验证码</n-button>
              <div v-else type="primary" size="medium" class="w-98px min-w-98px h-34px leading-34px ml-12px text-center c-#f80 text-18px font-bold box-border border-1 border-solid border-[#f80] rounded-5px">{{ seconds }}s</div>
            </n-form-item>
            <!-- 注册 -->
            <n-form-item v-if="tabIndex === 2" label="手机号：" path="phone">
              <n-input v-model:value="loginForm.phone" placeholder="请输入手机号"/>
            </n-form-item>
            <n-form-item v-if="tabIndex === 2" label="图形验证码：" path="captcha_code">
              <n-input v-model:value="loginForm.captcha_code" type="text" placeholder="请输入图形验证码"/>
              <img :src="captcha_img" class="w-98px min-w-98px h-34px ml-12px cursor-pointer bg-#fff" @click="getCaptchaData()" />
            </n-form-item>
            <n-form-item v-if="tabIndex === 2" label="短信验证码：" path="code">
              <n-input v-model:value="loginForm.code" type="text" placeholder="请输入短信验证码"/>
              <n-button v-if="seconds === 0" type="primary" size="medium" class="ml-12px" @click="handleSendCode(1)">发送验证码</n-button>
              <div v-else type="primary" size="medium" class="w-98px min-w-98px h-34px leading-34px ml-12px text-center c-#f80 text-18px font-bold box-border border-1 border-solid border-[#f80] rounded-5px">{{ seconds }}s</div>
            </n-form-item>
            <n-form-item v-if="tabIndex === 2" label="登录密码：" path="password">
              <n-input v-model:value="loginForm.password" type="password" placeholder="请输入登录密码"/>
            </n-form-item>
            <!-- 重置密码 -->
            <n-form-item v-if="tabIndex === 3" label="手机号：" path="phone">
              <n-input v-model:value="loginForm.phone" placeholder="请输入手机号"/>
            </n-form-item>
            <n-form-item v-if="tabIndex === 3" label="新密码：" path="password">
              <n-input v-model:value="loginForm.password" type="password" placeholder="请输入新密码"/>
            </n-form-item>
            <n-form-item v-if="tabIndex === 3" label="确认密码：" path="confirmPassword">
              <n-input v-model:value="loginForm.confirmPassword" type="password" placeholder="请输入确认密码"/>
            </n-form-item>
            <n-form-item v-if="tabIndex === 3" label="图形验证码：" path="captcha_code">
              <n-input v-model:value="loginForm.captcha_code" type="text" placeholder="请输入图形验证码"/>
              <img :src="captcha_img" class="w-98px min-w-98px h-34px ml-12px cursor-pointer bg-#fff" @click="getCaptchaData()" />
            </n-form-item>
            <n-form-item v-if="tabIndex === 3" label="短信验证码：" path="code">
              <n-input v-model:value="loginForm.code" type="text" placeholder="请输入短信验证码"/>
              <n-button v-if="seconds === 0" type="primary" size="medium" class="ml-12px" @click="handleSendCode(2)">发送验证码</n-button>
              <div v-else type="primary" size="medium" class="w-98px min-w-98px h-34px leading-34px ml-12px text-center c-#f80 text-18px font-bold box-border border-1 border-solid border-[#f80] rounded-5px">{{ seconds }}s</div>
            </n-form-item>
          </n-form>
          <div label-placement="left" class="w-100% py-16px">
            <n-button v-if="tabIndex === 0 || tabIndex === 1" class="w-100%" type="primary" size="large" @click="debouncing(onLogin, message, 2000)"><span>登录</span></n-button>
            <n-button v-if="tabIndex === 2" type="primary" class="w-100%" size="large" @click="debouncing(onRegister, message, 2000)"><span>注册</span></n-button>
            <n-button v-if="tabIndex === 3" type="primary" class="w-100%" size="large" @click="debouncing(onModify, message, 2000)"><span>保存</span></n-button>
          </div>
          <div class="text-12px c-#fff leading-24px">
            <n-checkbox v-model:checked="agree" class="flex ai-center">
              我已阅读并同意<span class="hover:c-#53d8fe hover:underline cursor-pointer" @click="goPage('https://www.chengyaokj.com/data/ai/h5/privacy_policy.html')">隐私政策</span><span class="link cursor-pointer">，</span><span class="link cursor-pointer" @click="goPage('https://www.chengyaokj.com/data/ai/h5/service_terms.html')">丞尧智芯服务协议</span>
            </n-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FormInst, useMessage } from 'naive-ui';
import { getCaptcha, sendCode, login, loginThird, regist, settingPassword } from '@/apis/index'
import { debouncing } from '@/utils/index';
import { setToken } from '@/utils/auth'

const redirect_path: any = ref('')
const message = useMessage()
const route = useRoute()
const router = useRouter()
const loginRef = ref<FormInst | null>(null);
const tabs = [
  {
    label: '密码登录',
    value: 0
  },
  {
    label: '验证码登录',
    value: 1
  }
]
const tabIndex = ref(0)
const loginForm = ref({
  phone: "13023672647",
  password: "05cqwsbsy27",
  confirmPassword: "",
  captcha_id: "",
  captcha_code: "",
  code: "",
});
const captcha_img = ref('')
const seconds = ref(Number(localStorage.getItem('msg_countdown')) || 0)
const agree = ref(false)

const loginRules = computed(() => {
  return tabIndex.value === 0 ? {
    phone: {required: true, message: "手机号不能为空", trigger: ['blur', 'change']},
    password: {required: true, message: "密码不能为空", trigger: ['blur', 'change']},
  } : tabIndex.value === 1 ? {
    phone: [
      {required: true, message: "手机号不能为空", trigger: ['blur', 'change']},
      {pattern: /^1[3-9]\d{9}$/, message: "手机号格式有误", trigger: ['blur', 'change']}
    ],
    captcha_code: {min: 1, max: 6, message: "图形验证码有误", trigger: ['blur', 'change']},
    code: {required: true, message: "短信验证码不能为空", trigger: ['blur', 'change']},
  } : tabIndex.value === 2 ? {
    phone: [
      {required: true, message: "手机号不能为空", trigger: ['blur', 'change']},
      {pattern: /^1[3-9]\d{9}$/, message: "手机号格式有误", trigger: ['blur', 'change']}
    ],
    password: {required: true, message: "密码不能为空", trigger: ['blur', 'change']},
    captcha_code: {min: 1, max: 6,message: "图形验证码有误", trigger: ['blur', 'change']},
    code: {required: true, message: "短信验证码不能为空", trigger: ['blur', 'change']},
  } : {
    password: {required: true, message: "密码不能为空", trigger: ['blur', 'change']},
    confirmPassword: {required: true, message: "确认密码不能为空", trigger: ['blur', 'change']},
    phone: [
      {required: true, message: "手机号不能为空", trigger: ['blur', 'change']},
      {pattern: /^1[3-9]\d{9}$/, message: "手机号格式有误", trigger: ['blur', 'change']}
    ],
    captcha_code: {min: 1, max: 6,message: "图形验证码有误", trigger: ['blur', 'change']},
    code: {required: true, message: "短信验证码不能为空", trigger: ['blur', 'change']},
  };
});

const handleTab = (value: number) => {
  resetForm()
  tabIndex.value = value
}
const handleRegister = () => {
  resetForm()
  tabIndex.value = 2
}
const handleLogin = () => {
  resetForm()
  tabIndex.value = 0
}
const handleForget = () => {
  resetForm()
  tabIndex.value = 3
}
const handleReturn = () => {
  resetForm()
  tabIndex.value = 0
}
const resetForm = () => {
  loginForm.value = {
    phone: "",
    password: "",
    confirmPassword: "",
    captcha_id: "",
    captcha_code: "",
    code: "",
  }
}
const handleCountdown = () => {
  const stl = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--
      localStorage.setItem('msg_countdown', String(seconds.value))
    } else {
      stl && clearInterval(stl)
    }
  }, 1000)
}
const getCaptchaData = async () => {
  try {
    const res: any = await getCaptcha()
    loginForm.value.captcha_id = res.data.captcha_id
    captcha_img.value = res.data.captcha_img
  } catch (error: any) {
    console.log(error)
  }	
}
const handleSendCode = async (type: number) => {
  // 发送验证码
  try {
    await sendCode({
      phone: loginForm.value.phone,
      type,
      captcha_id: loginForm.value.captcha_id,
      captcha_code: String(loginForm.value.captcha_code)
    })
    seconds.value = 60
    handleCountdown()
  } catch (error) {
    getCaptchaData()
  }
}
const onLogin = async () => {
  loginRef.value?.validate(async (errors: any) => {
    if (!errors) {
      if(!agree.value) {
        message.warning('请先阅读隐私政策和平台使用指南')
        return;
      }
      try {
        const params: any = tabIndex.value === 0 ? {
          loginType: 1, // 0 验证码 1 密码
          phone: loginForm.value.phone,
          password: loginForm.value.password,
          code: loginForm.value.code
        } : {
          loginType: 0, // 0 验证码 1 密码
          phone: loginForm.value.phone,
          code: loginForm.value.code
        }
        const res: any = await login(params) as any
        setToken(res.data.token)
        if(redirect_path.value) {
          router.replace(redirect_path.value)
        } else {
          router.replace('/layout')
        }
      } catch (err: any) {
        console.log(err)
      }
    } else {
      console.log(errors)
    }
  })
};
const onRegister = async () => {
  loginRef.value?.validate(async (errors: any) => {
    if (!errors) {
      if(!agree.value) {
        message.warning('请先阅读隐私政策和平台使用指南')
        return;
      }
      try {
        const res: any = await regist({
          phone: loginForm.value.phone,
          code: loginForm.value.code,
          password: loginForm.value.password,
        }) as any
        if(res.code === 200 || res.code === 0) {
          setToken(res.data.token)
          router.go(-1)
        }
      } catch (err: any) {
        console.log(err)
      }
    } else {
      console.log(errors)
    }
  })
};
const onModify = async () => {
  loginRef.value?.validate(async (errors: any) => {
    if (!errors) {
      if(!agree.value) {
        message.warning('请先阅读隐私政策和平台使用指南')
        return;
      }
      try {
        if(loginForm.value.password !== loginForm.value.confirmPassword) {
          message.error('两次输入密码不一致，请检查输入密码')
          return;
        }
        const res: any = await settingPassword({
          phone: loginForm.value.phone,
          password: loginForm.value.password,
          code: loginForm.value.code,
        }) as any
        if(res.code === 200 || res.code === 0) {
          message.warning('密码修改成功，请继续登录')
          setTimeout(() => {
            location.reload()
          }, 2000)
        }
      } catch (err: any) {
        console.log(err)
      }
    } else {
      console.log(errors)
    }
  })
};
const goPage = (path: string) => {
  window.open(path)
}
onMounted(() => {
  redirect_path.value = route.query.path
  handleCountdown()
  getCaptchaData()
})
</script>
<style lang="scss" scoped>
:deep(.n-form-item-label__text) {
  color: #fff;
  font-weight: normal;
}
:deep(.n-checkbox__label) {
  line-height: 24px;
  color: #fff;
}
:deep(.n-input) {
  background: transparent;
  &:active {
    background: transparent;
  }
}
:deep(.search .n-input:not(.n-input--disabled).n-input--focus) {
  background: transparent !important;
  box-shadow: 0 0 0 2px transparent !important;
}
</style>