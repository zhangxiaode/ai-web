<template>
	<n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog" style="width: 600px;" @update:show="onClose">
		<template #header><slot name="header">修改昵称</slot></template>
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
				<n-form-item label="昵称:" path="nickname">
					<n-input v-model:value="form.nickname" placeholder="请输入昵称" />
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
import { updateNickname } from "@/apis/index";

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('reset-nickname-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
	nickname: ''
});
const rules = {
	nickname: {required: true, message: "昵称不能为空", trigger: ['blur', 'change']}
};
const onSubmit = async () => {
	formRef.value?.validate(async (errors) => {
		if (!errors) {
			disabled.value = true
			let params = {
				nickname: form.value.nickname
			}
			try {
				const res: any = await updateNickname(params)
				if (res.code == 200 || res.code == 0) {
					onClose()
					emit('save', {
						nickname: res?.data?.nickname
					})
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
		form.value.nickname = payload.value.nickname
	} else {
		form.value = {
			nickname: '',
		}
	}
});
</script>

<style lang="scss" scoped>
</style>
