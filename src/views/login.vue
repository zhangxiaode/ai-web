<template>
  <div class="loginPage">
    <div class="loginMain">
      <div class="loginWrapper flex flex-wrap overflow-auto">
        <div class="title w-100">欢迎来到丞尧智芯!</div>
        <div class="subtitle w-100">你的创作核心</div>
        <div class="left">
          <img src="../assets/login-banner.png" alt="">
        </div>
        <div class="login-content flex flex-column ai-normal">
          <div class="logo flex ai-center">
            <img src="../assets/logo.png" class="icon" />
            <span class="logo-tit">丞尧智芯</span>
          </div>
          <div v-if="tabIndex === 0 || tabIndex === 1" class="welcome">欢迎您!</div>
          <div v-if="tabIndex === 0 || tabIndex === 1" class="go-register">还没有账号嘛? <span class="register-btn cursor-pointer" @click="handleRegister()">立即注册</span></div>
          <div v-if="tabIndex === 0 || tabIndex === 1" class="tabs flex ai-center">
            <div v-for="(item, index) in tabs" :key="index" :class="['tab relative cursor-pointer', { 'actived': tabIndex === item.value }]" @click="handleTab(item.value)">{{ item.label }}</div>
          </div>
          <div v-if="tabIndex === 2" class="welcome">开始注册!</div>
          <div v-if="tabIndex === 2" class="go-register">已经有一个账号了嘛? <span class="register-btn cursor-pointer" @click="handleLogin()">马上登录</span></div>
          <div v-if="tabIndex === 3" class="welcome">修改密码!</div>
          <img v-if="tabIndex === 2 || tabIndex === 3" src="../assets/return.png" class="return cursor-pointer" @click="handleReturn()" />
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
            <div v-if="tabIndex === 0" class="forget cursor-pointer" @click="handleForget()">忘记密码</div>
            <!-- 验证码登录 -->
            <n-form-item v-if="tabIndex === 1" label="手机号：" path="phone">
              <n-input v-model:value="loginForm.phone" placeholder="请输入手机号"/>
            </n-form-item>
            <n-form-item v-if="tabIndex === 1" label="图形验证码：" path="captcha_code">
              <n-input v-model:value="loginForm.captcha_code" type="text" placeholder="请输入图形验证码"/>
              <img :src="captcha_img" class="captcha_code cursor-pointer" @click="getCaptchaData()" />
            </n-form-item>
            <n-form-item v-if="tabIndex === 1" label="短信验证码：" path="code">
              <n-input v-model:value="loginForm.code" type="text" placeholder="请输入短信验证码"/>
              <n-button v-if="seconds === 0" type="primary" size="medium" class="send-code" @click="handleSendCode(0)">发送验证码</n-button>
              <div v-else type="primary" size="medium" class="msg-seconds">{{ seconds }}s</div>
            </n-form-item>
            <!-- 注册 -->
            <n-form-item v-if="tabIndex === 2" label="手机号：" path="phone">
              <n-input v-model:value="loginForm.phone" placeholder="请输入手机号"/>
            </n-form-item>
            <n-form-item v-if="tabIndex === 2" label="图形验证码：" path="captcha_code">
              <n-input v-model:value="loginForm.captcha_code" type="text" placeholder="请输入图形验证码"/>
              <img :src="captcha_img" class="captcha_code cursor-pointer" @click="getCaptchaData()" />
            </n-form-item>
            <n-form-item v-if="tabIndex === 2" label="短信验证码：" path="code">
              <n-input v-model:value="loginForm.code" type="text" placeholder="请输入短信验证码"/>
              <n-button v-if="seconds === 0" type="primary" size="medium" class="send-code" @click="handleSendCode(1)">发送验证码</n-button>
              <div v-else type="primary" size="medium" class="msg-seconds">{{ seconds }}s</div>
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
              <img :src="captcha_img" class="captcha_code cursor-pointer" @click="getCaptchaData()" />
            </n-form-item>
            <n-form-item v-if="tabIndex === 3" label="短信验证码：" path="code">
              <n-input v-model:value="loginForm.code" type="text" placeholder="请输入短信验证码"/>
              <n-button v-if="seconds === 0" type="primary" size="medium" class="send-code" @click="handleSendCode(2)">发送验证码</n-button>
              <div v-else type="primary" size="medium" class="msg-seconds">{{ seconds }}s</div>
            </n-form-item>
          </n-form>
          <div label-placement="left" class="btns">
            <n-button v-if="tabIndex === 0 || tabIndex === 1" type="primary" size="large" @click="debouncing(onLogin, message, 2000)"><span>登录</span></n-button>
            <n-button v-if="tabIndex === 2" type="primary" size="large" @click="debouncing(onRegister, message, 2000)"><span>注册</span></n-button>
            <n-button v-if="tabIndex === 3" type="primary" size="large" @click="debouncing(onModify, message, 2000)"><span>保存</span></n-button>
          </div>
          <div class="terms">
            <n-checkbox v-model:checked="agree" class="flex ai-center">
              我已阅读并同意<span class="link cursor-pointer" @click="goPage('https://www.chengyaokj.com/data/ai/h5/privacy_policy.html')">隐私政策</span><span class="link cursor-pointer">，</span><span class="link cursor-pointer" @click="goPage('https://www.chengyaokj.com/data/ai/h5/service_terms.html')">丞尧智芯服务协议</span>
            </n-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>

	<!-- <div class="login h-100% flex flex-col justify-between items-normal bg-#141414">
		<div class="login-top flex flex-col items-center">
			<img class="h-100px w-100px mt-12px" src="../assets/logo.png" />
			<div class="my-12px">
				<span class="font-800 span-24px c-#333">丞尧智芯</span>
			</div>
		</div>
		<div class="flex-1 login-center flex flex-col justify-start items-center">
			<div class="m-12px h-30px rounded-15px flex justify-center items-center border-1px border-color-#333 border-style-solid">
				<div v-for="(item, index) in loginTypes" :key="index" :class="['tab flex justify-center items-center w-100px h-30px rounded-15px px-12px cursor-pointer', { 'bg-#252525': loginType == index }]" @click="handleChangeloginType(index)">
					<span :class="['span-14px c-#666', { 'c-#fff': loginType == index }]">{{ item }}</span>
				</div>
			</div>
			<div v-if="loginType == 0" class="login-form flex-col">
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-20px">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" round :bordered="false" :show-button="false" size="large" v-model:value="phone" width="318rpx" height="40rpx" :showClear="true" placeholder="请输入您的手机号" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-20px pr-0px flex justify-between items-center overflow-hidden">
					<img class="flex-1 h-40px bg-#666 cursor-pointer" :src="captcha_img" @click="getCaptchaData()" />
					<div class="w-1px h-18px bg-#252525"></div>
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" size="large" v-model:value="captcha_code" width="200rpx" height="40rpx" :showClear="false" placeholder="请输入图形验证码" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-20px pr-0px flex justify-between items-center">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" size="large" v-model:value="code" width="210rpx" height="40rpx" :maxlength="6" :showClear="false" placeholder="请输入验证码" />
					<div class="w-1px h-18px bg-#252525"></div>
					<div class="w-108px h-40px leading-40px rounded-20px bg-#252525 flex justify-center items-center" @click="handleSendCode(0)">
						<span v-if="second == 0" class="span-14px c-#fff leading-40px cursor-pointer">获取验证码</span>
						<span v-else class="span-14px c-#fff leading-40px">{{ second }}s</span>
					</div>
				</div>
				<div class="w-335px h-18px mx-20px my-6px">
					<span v-if="tips" class="w-350px span-12px c-#666 h-18px">{{ tips }}</span>
				</div>
				<div class="w-335px h-40px leading-40px mt-11px mx-20px bg-#252525 rounded-20px flex justify-center items-center" @click="handleLogin()">
					<span class="font-600 span-16px c-#fff leading-40px cursor-pointer">登录</span>
				</div>
			</div>
			<div v-else-if="loginType == 1" class="login-form flex-col">
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" round :bordered="false" :show-button="false" size="large" v-model:value="phone" width="318rpx" height="40rpx" :showClear="true" placeholder="请输入您的手机号" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px">
					<n-input class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" v-model:value="password" round size="large" width="318rpx" height="40rpx" type='password' show-password-on="click" :showClear="true" placeholder="请输入密码" />
				</div>
				<div class="w-335px h-18px mx-20px my-6px">
					<span v-if="tips" class="w-350px span-12px c-#666 h-18px">{{ tips }}</span>
				</div>
				<div class="w-335px h-40px leading-40px mt-11px mx-20px bg-#252525 rounded-20px flex justify-center items-center" @click="handleLogin()">
					<span class="font-600 span-16px c-#fff leading-40px cursor-pointer">登录</span>
				</div>
			</div>
			<div v-else-if="loginType == 2" class="login-form flex-col">
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" round size="large" v-model:value="phone" width="318rpx" height="40rpx" :showClear="true" placeholder="请输入您的手机号" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px pr-0px flex justify-between items-center overflow-hidden">
					<img class="flex-1 h-40px bg-#666 cursor-pointer" :src="captcha_img" @click="getCaptchaData()" />
					<div class="w-1px h-18px bg-#252525"></div>
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" size="large" v-model:value="captcha_code" width="200rpx" height="40rpx" :showClear="false" placeholder="请输入图形验证码" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px pr-0px flex justify-between items-center">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" size="large" v-model:value="code" width="422rpx" height="80rpx" :maxlength="6" :showClear="false" placeholder="请输入验证码" />
					<div class="w-1px h-18px bg-#252525"></div>
					<div class="w-108px h-40px leading-40px rounded-20px bg-#252525 flex justify-center items-center" @click="handleSendCode(1)">
						<span v-if="second == 0" class="span-14px c-#fff leading-16px cursor-pointer">获取验证码</span>
						<span v-else class="span-14px c-#fff leading-16px">{{ second }}s</span>
					</div>
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px">
					<n-input class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" v-model:value="password" round width="318rpx" height="40rpx" size="large" type='password' :showClear="true" placeholder="请输入密码" />
				</div>
				<div class="w-335px h-18px mx-20px my-6px">
					<span v-if="tips" class="w-350px span-12px c-#666 h-18px">{{ tips }}</span>
				</div>
				<div class="w-335px h-40px leading-40px mt-11px mx-20px bg-#252525 rounded-20px flex justify-center items-center" @click="handleRegist()">
					<span class="font-600 span-16px c-#fff leading-40px cursor-pointer">注册</span>
				</div>
			</div>
			<div class="my-16px flex justify-center items-center">
				<img v-if="agree" class="w-18px h-18px mx-4px cursor-pointer" src="../assets/checked.png" @click="handleCheck(false)" />
				<img v-else class="w-18px h-18px mx-4px cursor-pointer" src="../assets/check.png" @click="handleCheck(true)">
				<span class="span-12px c-#999999 cursor-pointer">我已阅读并同意</span>
				<span class="span-12px c-#666 mx-4px cursor-pointer" @click="goPage('https://www.chengyaokj.com/data/ai/h5/service_terms.html', '服务协议')">服务协议</span>
				<span class="span-12px c-#999999">，</span>
				<span class="span-12px c-#666 mx-4px cursor-pointer" @click="goPage('https://www.chengyaokj.com/data/ai/h5/privacy_policy.html', '隐私政策')">隐私政策</span>
			</div>
		</div>
		<div class="mb-12px w-375px flex-col mx-auto">
			<div class="mx-16px my-8px flex justify-center items-center">
				<div class="h-1px rounded-1px bg-#252525 flex-1"></div>
				<div class="span-14px c-#8a8a8a mx-8px">其他登录方式</div>
				<div class="h-1px rounded-1px bg-#252525 flex-1"></div>
			</div>
			<div class="loginType flex justify-center items-center">
				<div class="w-44px h-44px mx-10px my-5px flex flex-col items-center cursor-pointer" @click="loginByWx()">
					<img class="w-44px h-44px rounded-12px" src="../assets/wx.png" />
					<span class="span-12px c-#333 leading-20px flex-1 span-align-center">微信</span>
				</div>
			</div>
		</div>
	</div> -->
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
  phone: "",
  password: "",
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
    captcha_code: {min: 3, max: 5,message: "图形验证码有误", trigger: ['blur', 'change']},
    code: {required: true, message: "短信验证码不能为空", trigger: ['blur', 'change']},
  } : tabIndex.value === 2 ? {
    phone: [
      {required: true, message: "手机号不能为空", trigger: ['blur', 'change']},
      {pattern: /^1[3-9]\d{9}$/, message: "手机号格式有误", trigger: ['blur', 'change']}
    ],
    password: {required: true, message: "密码不能为空", trigger: ['blur', 'change']},
    captcha_code: {min: 3, max: 5,message: "图形验证码有误", trigger: ['blur', 'change']},
    code: {required: true, message: "短信验证码不能为空", trigger: ['blur', 'change']},
  } : {
    password: {required: true, message: "密码不能为空", trigger: ['blur', 'change']},
    confirmPassword: {required: true, message: "确认密码不能为空", trigger: ['blur', 'change']},
    phone: [
      {required: true, message: "手机号不能为空", trigger: ['blur', 'change']},
      {pattern: /^1[3-9]\d{9}$/, message: "手机号格式有误", trigger: ['blur', 'change']}
    ],
    captcha_code: {min: 3, max: 5,message: "图形验证码有误", trigger: ['blur', 'change']},
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
handleCountdown()
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
        router.go(-1)
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
  getCaptchaData()
})

// import { getCaptcha, sendCode, login, loginThird, regist } from '@/apis/index'

// const router = useRouter()
// const route = useRoute()
// const message = useMessage()
// const dialog = useDialog()

// const redirect_path: any = ref('')
// const loginForm = ref({

// })
// const loginType = ref(0)
// const loginTypes = ref(['验证码登录', '密码登录', '注册'])

// const agree = ref(false)
// const phone: any = ref(null)
// const password = ref('')
// const code: any = ref(null)
// const tips = ref('')
// const second = ref(0)
// const stl: any = ref(null)
// const captcha_id = ref('')
// const captcha_img = ref('')
// const captcha_code: any = ref(null)

// const handleChangeloginType = (index: number) => {
//   loginType.value = index
//   getCaptchaData()
// }
// const getCaptchaData = async () => {
//   try {
//     const res: any = await getCaptcha()
//     captcha_id.value = res.data.captcha_id
//     captcha_img.value = res.data.captcha_img
//   } catch (error: any) {
//     console.log(error)
//   }	
// }
// const handleSendCode = async (type: number) => {
//   if(!verifyPhone()) return
//   if(second.value == 0) {
//     try {
//       const res: any = await sendCode({
//         phone: phone.value,
//         type,
//         captcha_id: captcha_id.value,
//         captcha_code: String(captcha_code.value)
//       })
//       if(res.code === 200) {
//         second.value = 60
//         stl.value = setInterval(() => {
//           if(second.value > 0) {
//             second.value--
//           } else {
//             clearInterval(stl.value)
//           }
//         }, 1000)
//       }
//     } catch (e) {
//       console.log(e)
//     }
//   }
// }
// const handleCheck = (e: boolean) => {
//   agree.value = e
// }
// const handleLogin = async () => {
//   if(verifyAgreement() && verifyPhone() && ((loginType.value === 0 && verifyCode()) || (loginType.value === 1 && verifyPassword()))) {
//     try {
//       const res: any = await login({
//         loginType: loginType.value, // 0 验证码 1 密码
//         phone: phone.value,
//         password: password.value,
//         code: code.value
//       })
//       setToken(res.data.token)
//       router.go(-1)
//     } catch (err: any) {
//       message.error(err.msg)
//     }
//   }
// }
// const handleRegist = async () => {
//   if(verifyAgreement() && verifyPhone() && verifyCode() && verifyPassword()) {
//     try {
//       const res: any = await regist({
//         phone: phone.value,
//         code: code.value,
//         password: password.value
//       })
//       setToken(res.data.token)
//       router.go(-1)
//     } catch (e) {
//       console.log(e)
//     }
//   }
// }
// const verifyAgreement = () => {
//   if(!agree.value) {
//     message.warning('为了更好地保障您的合法权益，请您阅读并同意以下协议《服务协议》、《隐私政策》')
//     return false
//   } else {
//     return true
//   }
// }
// const loginByWx = () => {
//   goLogin({
//     provider: 'weixin'
//   })
// }
// const goLogin = ({ provider }) => {
//   if(verifyAgreement()) {
//     const _ = this
//     // uni.login({
//     //   provider,
//     //   // onlyAuthorize: true, // 微信登录仅请求授权认证
//     //   success: (loginRes: any) => {
//     //     // 登录成功
//     //     uni.getUserInfo({
//     //       provider,
//     //       success: async (info: any) => {
//     //         try {
//     //           const res: any = await loginThird({
//     //             loginType: 2, // 0 验证码 1 密码 2 微信
//     //             platform: provider,
//     //             platform_id: info.userInfo?.openId || '',
//     //             platform_name: (info.userInfo?.fullName?.familyName + info.userInfo?.fullName?.giveName) || '',
//     //             platform_email: info.userInfo?.email || '',
//     //             platform_avatar: info.userInfo?.avatarUrl || '',
//     //           })
//     //           setToken(res.data.token)
//     //           router.go(-1)
//     //         } catch (error: any) {
//     //           dialog.warning({
//     //             title: '',
//     //             content: () => error.errMsg,
//     //             positiveText: '确定',
//     //             positiveButtonProps: {type: "primary"},
//     //             showIcon: false,
//     //             closable: false,
//     //           })
//     //         }
//     //       },
//     //       fail(error: any) {
//     //         dialog.warning({
//     //           title: '',
//     //           content: () => error.errMsg,
//     //           positiveText: '确定',
//     //           positiveButtonProps: {type: "primary"},
//     //           showIcon: false,
//     //           closable: false,
//     //         })
//     //       }
//     //     })
//     //   },
//     //   fail(err: any) {
//     //     message.warning(err.code == -1001 ? '取消授权' : err.code == -1002 ? '返回值无效' : err.code == -1003 ? '请求未处理' : err.code == -1004 ? '授权失败' : '未知错误')
//     //   }
//     // });
//   }
// }
// const goPage = (path: string, title: string) => {
//   router.push(`/pages/webdiv/index?url=${path}&title=${title}`)
// }
// onMounted(() => {
//   redirect_path.value = route.query.path
//   getCaptchaData()
// })
</script>
<style lang="scss" scoped>
.loginPage {
  background: #fff;
  position: relative;
  width: 100%;
  height: 100%;
  .loginMain {
    width: 100%;
    height: 100%;
    transform-origin: left top;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

.loginWrapper {
  display: flex;
  position: absolute;
  left: 10%;
  top: 10%;
  z-index: 1;
  text-align: left;
  width: 80%;
  height: 80%;

  .title {
    font-weight: bold;
    font-size: 40px;
    color: #182A85;
    line-height: 40px;
    letter-spacing: 1px;
  }
  .subtitle {
    font-size: 18px;
    color: #3D4C98;
    line-height: 20px;
    margin: 16px 0 23px;
  }

  .left {
    width: 63%;
    height: calc(100% - 100px);
    border-radius: 16px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: left center;
    }
  }

  .login-content {
    box-sizing: border-box;
    width: 36%;
    height: calc(100% - 100px);
    margin-left: 1%;
    background: url(../assets/login-content-bg.png) no-repeat center center #fff;
    background-size: 100% 100%;
    box-shadow: 0px 0 0px 0px rgba(92,127,167,0.2);
    border-radius: 16px;
    border: solid 2px #ffffff;
    padding: 28px;
    .login {
      box-sizing: border-box;
      width: 100%;
      height: auto;
      // max-height: 20vw;
      max-height: 384px;
      padding-right: 15px;
      :deep(.n-form-item-label__text) {
        color: #182A85;
        font-weight: normal;
      }
    }
    .logo {
      // margin-left: -1vw;
      margin-left: -20px;
      .icon {
        width: 22px;
        height: 22px;
      }
      .logo-tit {
        font-size: 14px;
        color: #001061;
        margin-left: 8px;
      }
    }
    .welcome {
      font-size: 18px;
      color: #182A85;
      margin: 12px 0 0;
    }
    .go-register {
      font-size: 12px;
      color: #6A6E85;
      margin: 12px 0 0;
      .register-btn {
        color: #182A85;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .tabs {
      margin: 20px 0 20px -20px;
      .tab {
        font-size: 12px;
        color: #182A85;
        padding: 0 20px;
        &:first-child {
          &::after {
            position: absolute;
            right: 0;
            top: 50%;
            width: 1px;
            height: 12px;
            margin-top: -6px;
            content: "";
            background: #182A85;
          }
        }
      }
      .actived {
        font-weight: bold;
        &:before {
          position: absolute;
          top: 20px;
          left: 50%;
          margin-left: -13px;
          content: "";
          width: 26px;
          height: 4px;
          background: #2E50FF;
          border-radius: 2px;
        }
      }
    }
    .imgcode {
      width: 98px;
      min-width: 98px;
      height: 34px;
      margin-left: 12px;
    }
    .send-code {
      margin-left: 12px;
    }
    .msg-seconds {
      width: 98px;
      min-width: 98px;
      height: 34px;
      line-height: 30px;
      margin-left: 12px;
      text-align: center;
      color: #f40;
      font-size: 18px;
      font-weight: bold;
      box-sizing: border-box;
      border: solid 1px #f40;
      border-radius: 5px;
    }
    .return {
      width: 14px;
      height: 14px;
      margin: 16px 0;
    }
    .forget {
      text-align: right;
      font-weight: 500;
      font-size: 12px;
      color: #182A85;
      margin: 20px 0;
      &:hover {
        text-decoration: underline;
      }
    }
    .btns {
      width: 100%;
      padding: 16px 0;
      .n-button {
        width: 100%;
      }
    }
    .terms {
      font-size: 12px;
      color: #666666;
      line-height: 24px;
      :deep(.n-checkbox__label) {
        line-height: 24px;
      }
      .link {
        color: #000000;
        &:hover {
          color: #2F51FF;
          text-decoration: underline;
        }
      }
    }
  }

}
.login-mobile {
  .left {
    width: 100%;
    height: auto;
  }
  .loginWrapper {
    left: 5%;
    top: 5%;
    width: 90%;
    height: 90%;
  }
  .login-content {
    width: 100%;
    height: auto;
    margin-top: 12px;
    margin-left: 0;
    .login {
      max-height: 9999px;
    }
  }
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