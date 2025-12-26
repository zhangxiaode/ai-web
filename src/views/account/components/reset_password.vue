<template>
	<n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog" style="width: 600px;" @update:show="onClose">
		<template #header><slot name="header">重置密码</slot></template>
		<slot>
			<n-form
				class="font-500 rounded-16px my-58px"
				ref="formRef"
				:model="form"
				:rules="rules"
				label-placement="left"
				label-width="150"
				require-mark-placement="right-hanging"
				size="medium"
			>
				<n-form-item label="手机号:" path="phone">
					<n-input v-model:value="form.phone" disabled placeholder="请输入你的手机号" />
				</n-form-item>
				<n-form-item label="图形验证码:">
					<div class="h-40px bg-[rgba(255,255,255,0.1)] rounded-20px flex justify-between items-center overflow-hidden">
						<img class="flex-1 h-40px bg-#666 cursor-pointer" :src="captcha_img" @click="getCaptchaData()" />
						<div class="w-1px h-18px bg-[rgba(255,255,255,0.1)]"></div>
						<n-input-number class="border-1 border-[rgba(255,255,255,0.1)] rounded-20px border-solid bg-[rgba(255,255,255,0.1)] text-20px leading-40px active:bg-[rgba(255,255,255,0.1)]" :bordered="false" :show-button="false" size="large" v-model:value="captcha_code" :showClear="false" placeholder="请输入图形验证码" />
					</div>
				</n-form-item>
				<n-form-item label="短信验证码:" path="code">
					<div class="h-40px bg-[rgba(255,255,255,0.1)] rounded-20px flex justify-between items-center">
						<n-input-number class="border-1 border-[rgba(255,255,255,0.1)] rounded-20px border-solid bg-[rgba(255,255,255,0.1)] text-20px leading-40px active:bg-[rgba(255,255,255,0.1)]" :bordered="false" :show-button="false" size="large" v-model:value="form.code" :max="999999" :showClear="false" placeholder="请输入短信验证码" />
						<div class="w-1px h-18px bg-[rgba(255,255,255,0.1)]"></div>
						<div class="w-108px h-40px leading-40px rounded-20px bg-[rgba(255,255,255,0.1)] flex justify-center items-center" @click="handleSendCode()">
							<span v-if="second == 0" class="span-14px c-#fff leading-40px cursor-pointer">获取短信验证码</span>
							<span v-else class="span-14px c-#fff leading-40px">{{ second }}s</span>
						</div>
					</div>
				</n-form-item>
				<n-form-item label="新密码:" path="password">
					<n-input v-model:value="form.password" type="password" show-password-on="click" placeholder="请输入新密码" />
				</n-form-item>
			</n-form>
		</slot>
		<template #action>
			<slot name="action">
				<n-button class="btn" size="small" @click="onClose()">取消</n-button>
				<n-button class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onSubmit, message, 2000)">保存</n-button>
			</slot>
		</template>
	</n-modal>
</template>
<script lang="ts" setup>
import { FormInst } from 'naive-ui';
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { getCaptcha, sendCode, settingPassword } from "@/apis/index";

const { visible, payload, hideModal } = useModal('reset-password-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
	phone: '',
	password: '',
	code: null,
});
const captcha_id = ref('')
const captcha_img = ref('')
const captcha_code: any = ref(null)
const second = ref(0)
const stl: any = ref(null)
const rules = {
	phone: [
		{required: true, message: "手机号不能为空", trigger: ['blur', 'change']},
		{pattern: /^1[3-9]\d{9}$/, message: "手机号格式错误", trigger: ['blur', 'change']}
	],
	password: [
		{required: true, message: "密码不能为空", trigger: ['blur', 'change']},
		{pattern: /^(?!\d+$)(?![a-zA-Z]+$).{8,20}$/, message: "密码格式错误，限制8-20位，非纯数字或纯字母", trigger: ['blur', 'change']}
	],
	code: [
		{required: true, type: 'number', message: "验证码不能为空", trigger: ['blur', 'change']},
	]
};

const getCaptchaData = async () => {
	try {
		const res: any = await getCaptcha()
		captcha_id.value = res.data.captcha_id
		captcha_img.value = res.data.captcha_img
	} catch (error: any) {
		console.log(error)
	}	
}

const handleSendCode = async () => {
	if(second.value == 0) {
		try {
			const res: any = await sendCode({
				phone: form.value.phone,
				type: 2,
				captcha_id: captcha_id.value,
				captcha_code: String(captcha_code.value)
			})
			if (res.code == 200 || res.code == 0) {
				second.value = 60
				stl.value = setInterval(() => {
					if(second.value > 0) {
						second.value--
					} else {
						clearInterval(stl.value)
					}
				}, 1000)
			} else {
				getCaptchaData()
			}
		} catch (error) {
			getCaptchaData()
		}
	}
}
const onSubmit = async () => {
	formRef.value?.validate(async (errors) => {
		if (!errors) {
			disabled.value = true
			let params = {
				phone: form.value.phone,
				password: form.value.password,
				code: form.value.code
			}
			try {
				const res: any = await settingPassword(params)
				if (res.code == 200 || res.code == 0) {
					onClose()
				}
			} catch (error) {
				console.log(error)
			}
			disabled.value = false
		}
	})
}
const onClose = () => {
	hideModal();
}
watch(visible, (newValue: any) => {
	if(newValue) {
		form.value.phone = payload.value.phone
		getCaptchaData()
	} else {
		form.value = {
			phone: '',
			password: '',
			code: null,
		}
	}
});
</script>

<style lang="scss" scoped>
</style>
