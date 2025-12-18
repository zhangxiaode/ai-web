<template>
	<div class="login h-100% flex flex-col justify-between items-normal bg-#141414">
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
				<!-- 验证码登录 -->
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-20px">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" round :bordered="false" :show-button="false" size="large" :value="phone" width="318rpx" height="40rpx" confirmType='done' :showClear="true" placeholder="请输入您的手机号" @focus="" @confirm="" @update:value="handleInputPhone" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-20px pr-0px flex justify-between items-center overflow-hidden">
					<img class="flex-1 h-40px bg-#666 cursor-pointer" :src="captcha_img" @click="getCaptchaData()" />
					<div class="w-1px h-18px bg-#252525"></div>
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" size="large" :value="captcha_code" width="200rpx" height="40rpx" confirmType='done' :showClear="false" placeholder="请输入图形验证码" @focus="" @confirm="" @update:value="handleInputCaptchaCode" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-20px pr-0px flex justify-between items-center">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" size="large" :value="code" width="210rpx" height="40rpx" :maxlength="6" confirmType='done' :showClear="false" placeholder="请输入验证码" @focus="" @confirm="" @update:value="handleInputCode" />
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
				<!-- 密码登录 -->
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" round :bordered="false" :show-button="false" size="large" :value="phone" width="318rpx" height="40rpx" confirmType='done' :showClear="true" placeholder="请输入您的手机号" @focus="" @confirm="" @update:value="handleInputPhone" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px">
					<n-input class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :value="password" round size="large" width="318rpx" height="40rpx" type='password' confirmType='done' :showClear="true" placeholder="请输入密码" @focus="" @confirm="" @update:value="handleInputPassword" />
				</div>
				<div class="w-335px h-18px mx-20px my-6px">
					<span v-if="tips" class="w-350px span-12px c-#666 h-18px">{{ tips }}</span>
				</div>
				<div class="w-335px h-40px leading-40px mt-11px mx-20px bg-#252525 rounded-20px flex justify-center items-center" @click="handleLogin()">
					<span class="font-600 span-16px c-#fff leading-40px cursor-pointer">登录</span>
				</div>
			</div>
			<div v-else-if="loginType == 2" class="login-form flex-col">
				<!-- 注册 -->
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" round size="large" :value="phone" width="318rpx" height="40rpx" confirmType='done' :showClear="true" placeholder="请输入您的手机号" @focus="" @confirm="" @update:value="handleInputPhone" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px pr-0px flex justify-between items-center overflow-hidden">
					<img class="flex-1 h-40px bg-#666 cursor-pointer" :src="captcha_img" @click="getCaptchaData()" />
					<div class="w-1px h-18px bg-#252525"></div>
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" size="large" :value="captcha_code" width="200rpx" height="40rpx" confirmType='done' :showClear="false" placeholder="请输入图形验证码" @focus="" @confirm="" @update:value="handleInputCaptchaCode" />
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px pr-0px flex justify-between items-center">
					<n-input-number class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :bordered="false" :show-button="false" size="large" :value="code" width="422rpx" height="80rpx" :maxlength="6" confirmType='done' :showClear="false" placeholder="请输入验证码" @focus="" @confirm="" @update:value="handleInputCode" />
					<div class="w-1px h-18px bg-#252525"></div>
					<div class="w-108px h-40px leading-40px rounded-20px bg-#252525 flex justify-center items-center" @click="handleSendCode(1)">
						<span v-if="second == 0" class="span-14px c-#fff leading-16px cursor-pointer">获取验证码</span>
						<span v-else class="span-14px c-#fff leading-16px">{{ second }}s</span>
					</div>
				</div>
				<div class="w-335px h-40px mx-20px my-8px bg-#252525 rounded-40px">
					<n-input class="border-1 border-[rgba(255,255,255,0.3)] rounded-20px border-solid bg-[rgba(0,0,0,0.3)] bg-[transparent] text-20px leading-40px active:bg-[rgba(0,0,0,0.3)]" :value="password" round width="318rpx" height="40rpx" size="large" type='password' confirmType='done' :showClear="true" placeholder="请输入密码" @focus="" @confirm="" @update:value="handleInputPassword" />
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
				<span class="span-12px c-#666 mx-4px cursor-pointer" @click="goPage('https://www.chengyaokj.com/data/novel/h5/service_terms.html', '服务协议')">服务协议</span>
				<span class="span-12px c-#999999">，</span>
				<span class="span-12px c-#666 mx-4px cursor-pointer" @click="goPage('https://www.chengyaokj.com/data/novel/h5/privacy_policy.html', '隐私政策')">隐私政策</span>
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
	</div>
</template>

<script lang="ts" setup>
import { validatPhone, validatPassword, validaMsg } from '@/utils/validate'
import { getCaptcha, sendCode, login, loginThird, regist } from '@/apis/index'
import { setToken } from '@/utils/auth'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const dialog = useDialog()
const path: any = ref('')
const loginTypes = ref(['验证码登录', '密码登录', '注册'])
const loginType = ref(0)
const agree = ref(false)
const phone: any = ref(null)
const password = ref('')
const code: any = ref(null)
const tips = ref('')
const second = ref(0)
const stl: any = ref(null)
const captcha_id = ref('')
const captcha_img = ref('')
const captcha_code: any = ref(null)

const handleChangeloginType = (index: number) => {
  loginType.value = index
  getCaptchaData()
}
const handleInputPhone = (e: number) => {
  phone.value = e
  tips.value = !phone.value ? '手机号不能为空' : !validatPhone(phone.value) ? '手机号格式错误' : ''
}
const handleInputPassword = (e: string) => {
  password.value = e
  tips.value = !password.value ? '密码不能为空' : !validatPassword(password.value) ? '密码长度为8到20位数字、字母和特殊字符组合‌' : ''
}
const handleInputCaptchaCode = (e: string) => {
  captcha_code.value = e
  tips.value = !captcha_code.value ? '图形验证码不能为空' : ''
}
const handleInputCode = (e: string) => {
  code.value = e
  tips.value = !code.value ? '短信验证码不能为空' : !validaMsg(code.value) ? '短信验证码为六位数字' : ''
}
const getCaptchaData = async () => {
  try {
    const res: any = await getCaptcha()
    captcha_id.value = res.data.captcha_id
    captcha_img.value = res.data.captcha_img
  } catch (error: any) {
    console.log(error)
  }	
}
const handleSendCode = async (type) => {
  if(!verifyPhone()) return
  if(second.value == 0) {
    try {
      const res: any = await sendCode({
        phone: phone.value,
        type,
        captcha_id: captcha_id.value,
        captcha_code: String(captcha_code.value)
      })
      if(res.code === 200) {
        second.value = 60
        stl.value = setInterval(() => {
          if(second.value > 0) {
            second.value--
          } else {
            clearInterval(stl.value)
          }
        }, 1000)
      }
    } catch (e) {
      console.log(e)
    }
  }
}
const handleCheck = (e: boolean) => {
  agree.value = e
}
const handleLogin = async () => {
  console.log(111)
  if(verifyAgreement() && verifyPhone() && ((loginType.value === 0 && verifyCode()) || (loginType.value === 1 && verifyPassword()))) {
    console.log(222)
    try {
      const res: any = await login({
        loginType: loginType.value, // 0 验证码 1 密码
        phone: phone.value,
        password: password.value,
        code: code.value
      })
      console.log(333, res)
      setToken(res.data.token)
      router.go(-1)
    } catch (err: any) {
      console.log(err)
      message.error(err.msg)
    }
  }
}
const handleRegist = async () => {
  if(verifyAgreement() && verifyPhone() && verifyCode() && verifyPassword()) {
    try {
      const res: any = await regist({
        phone: phone.value,
        code: code.value,
        password: password.value
      })
      setToken(res.data.token)
      router.go(-1)
    } catch (e) {
      console.log(e)
    }
  }
}
const verifyAgreement = () => {
  if(!agree.value) {
    message.warning('为了更好地保障您的合法权益，请您阅读并同意以下协议《服务协议》、《隐私政策》')
    return false
  } else {
    return true
  }
}
const verifyPhone = () => {
  if(!phone.value) {
    message.error('手机号不能为空')
    return false
  } else if(!validatPhone(phone.value)) {
    message.error('手机号格式错误')
    return false
  } else {
    return true
  }
}
const verifyCode = () => {
  if(!code.value) {
    message.error('短信验证码不能为空')
    return false
  } else if(!validaMsg(code.value)) {
    message.error('短信验证码为六位数字')
    return false
  } else {
    return true
  }
}
const verifyPassword = () => {
  if(!password.value) {
    message.error('密码不能为空')
    return false
  } else if(!validatPassword(password.value)) {
    message.error('密码长度为8到20位数字、字母和特殊字符组合')
    return false
  } else {
    return true
  }
}
const loginByWx = () => {
  goLogin({
    provider: 'weixin'
  })
}
const goLogin = ({ provider }) => {
  if(verifyAgreement()) {
    const _ = this
    // uni.login({
    //   provider,
    //   // onlyAuthorize: true, // 微信登录仅请求授权认证
    //   success: (loginRes: any) => {
    //     // 登录成功
    //     uni.getUserInfo({
    //       provider,
    //       success: async (info: any) => {
    //         try {
    //           const res: any = await loginThird({
    //             loginType: 2, // 0 验证码 1 密码 2 微信
    //             platform: provider,
    //             platform_id: info.userInfo?.openId || '',
    //             platform_name: (info.userInfo?.fullName?.familyName + info.userInfo?.fullName?.giveName) || '',
    //             platform_email: info.userInfo?.email || '',
    //             platform_avatar: info.userInfo?.avatarUrl || '',
    //           })
    //           setToken(res.data.token)
    //           router.go(-1)
    //         } catch (error: any) {
    //           dialog.warning({
    //             title: '',
    //             content: () => error.errMsg,
    //             positiveText: '确定',
    //             positiveButtonProps: {type: "primary"},
    //             showIcon: false,
    //             closable: false,
    //           })
    //         }
    //       },
    //       fail(error: any) {
    //         dialog.warning({
    //           title: '',
    //           content: () => error.errMsg,
    //           positiveText: '确定',
    //           positiveButtonProps: {type: "primary"},
    //           showIcon: false,
    //           closable: false,
    //         })
    //       }
    //     })
    //   },
    //   fail(err: any) {
    //     message.warning(err.code == -1001 ? '取消授权' : err.code == -1002 ? '返回值无效' : err.code == -1003 ? '请求未处理' : err.code == -1004 ? '授权失败' : '未知错误')
    //   }
    // });
  }
}
const goPage = (path: string, title: string) => {
  router.push(`/pages/webdiv/index?url=${path}&title=${title}`)
}
onMounted(() => {
  path.value = route.query.path
  getCaptchaData()
})
</script>
<style lang="scss" scoped>
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