<template>
  <div class="h-100% c-#fff p-24px overflow-auto">
    <Upload ref="uploadRef" accept="images/*" :max="1" :size_max="10" :get_file_path="({ file_name }) => `normal/avatar/${file_name}`" @change="handleUpdateAvatar" />
    <div class="flex flex-wrap">
      <div class="flex justify-between items-center m-12px p-16px w-[calc(50%-58px)] text-14px flex items-center border-1px border-color-#393939 border-style-solid rounded-6px">
        <div>手机号: {{ user_info?.phone || '--' }}</div>
        <div v-if="user_info?.phone" class="cursor-pointer rounded-12px bg-[linear-gradient(to_right,#a855f7,#ec4899)] h-30px leading-30px w-120px text-center c-#fff text-14px font-bold" @click="handleEditPhone()">修改手机号</div>
        <div v-else class="cursor-pointer rounded-12px bg-[linear-gradient(to_right,#a855f7,#ec4899)] h-30px leading-30px w-120px text-center c-#fff text-14px font-bold" @click="handleBindPhone()">绑定手机号</div>
      </div>
      <div class="flex justify-between items-center m-12px p-16px w-[calc(50%-58px)] text-14px flex items-center border-1px border-color-#393939 border-style-solid rounded-6px">
        <div>密码: ******</div>
        <div class="cursor-pointer rounded-12px bg-[linear-gradient(to_right,#a855f7,#ec4899)] h-30px leading-30px w-120px text-center c-#fff text-14px font-bold" @click="handleEditPassword()">重置密码</div>
      </div>
      <div class="flex justify-between items-center m-12px p-16px w-[calc(50%-58px)] text-14px flex items-center border-1px border-color-#393939 border-style-solid rounded-6px">
        <div>昵称: {{ user_info?.nickname || '--' }}</div>
        <div class="cursor-pointer rounded-12px bg-[linear-gradient(to_right,#a855f7,#ec4899)] h-30px leading-30px w-120px text-center c-#fff text-14px font-bold" @click="handleEditNickName()">修改昵称</div>
      </div>
      <div class="flex justify-between items-center m-12px p-16px w-[calc(50%-58px)] text-14px flex items-center border-1px border-color-#393939 border-style-solid rounded-6px">
        <div>剩余尧币: {{ user_info?.coin }}</div>
      </div>
      <div class="flex justify-between items-center m-12px p-16px w-[calc(50%-58px)] text-14px flex items-center border-1px border-color-#393939 border-style-solid rounded-6px">
        <div v-if="user_info?.is_vip">绑定账号: {{ user_info?.platform }}</div>
        <div v-else class="cursor-pointer rounded-12px bg-[linear-gradient(to_right,#a855f7,#ec4899)] h-30px leading-30px w-120px text-center c-#fff text-14px font-bold" @click="bindWechat()">绑定微信</div>
      </div>
      <div class="flex justify-between items-center m-12px p-16px w-[calc(50%-58px)] text-14px flex items-center border-1px border-color-#393939 border-style-solid rounded-6px">
        <div v-if="user_info?.is_vip">VIP: {{ user_info?.vip_limit }}</div>
        <div v-else class="cursor-pointer rounded-12px bg-[linear-gradient(to_right,#a855f7,#ec4899)] h-30px leading-30px w-120px text-center c-#fff text-14px font-bold" @click="goRecharge()">开通会员</div>
      </div>
      <div class="flex justify-between items-center m-12px p-16px w-[calc(50%-58px)] text-14px flex items-center border-1px border-color-#393939 border-style-solid rounded-6px">
        <div>创建时间: {{ user_info?.create_time }}</div>
      </div>
    </div>
    <div class="flex justify-between items-normal">
      <div class="flex-1 m-12px cursor-pointer rounded-12px bg-[linear-gradient(to_right,#a855f7,#ec4899)] h-42px leading-42px w-120px text-center c-#fff text-16px font-bold" @click="goTopup()">充值记录</div>
      <div class="flex-1 m-12px cursor-pointer rounded-12px bg-[linear-gradient(to_right,#a855f7,#ec4899)] h-42px leading-42px w-120px text-center c-#fff text-16px font-bold" @click="goConsume()">消耗记录</div>
    </div>
    <ResetNicknameModal @save="handleResetNicknameComplete" />
    <ResetPhoneModal @save="handleResetPhoneComplete" />
    <BindPhoneModal @save="handleBindPhoneComplete" />
    <ResetPasswordModal />
  </div>
</template>
<script lang="ts" setup>
import { useModal } from "@/hooks";
import { getUser } from "@/utils/auth";
import Upload from '@/components/upload.vue';
import ResetNicknameModal from './components/reset_nickname.vue';
import ResetPhoneModal from './components/reset_phone.vue';
import BindPhoneModal from './components/bind_phone.vue';
import ResetPasswordModal from './components/reset_password.vue';
import { updateAvatar } from "@/apis/index";

const { showModal: showResetNicknameModal } = useModal("reset-nickname-modal");
const { showModal: showResetPhoneModal } = useModal("reset-phone-modal");
const { showModal: showBindPhoneModal } = useModal("bind-phone-modal");
const { showModal: showResetPasswordModal } = useModal("reset-password-modal");
const router = useRouter()
const message = useMessage()
const user_info: any = ref(null)
const uploadRef: any = ref(null)

const getUserInfo = async (is_cookie:boolean = true) => {
  const user: any = await getUser(is_cookie)
  user_info.value = user
  if(user_info.value.avatarurl && user_info.value.signed_avatarurl) {
    uploadRef.value.setResource([{
      original_url: user_info.value.avatarurl,
      sign_path: user_info.value.signed_avatarurl
    }])
  }
}
const handleUpdateAvatar = ({ resource_path }) => {
  user_info.avatarurl = resource_path[0].original_url
  updateAvatar({
    avatarurl: user_info.avatarurl
  })
}
const handleEditNickName = async () => {
  showResetNicknameModal({
    nickname: user_info.value.nickname
  });
}
const handleResetNicknameComplete = () => {
  getUserInfo(false);
  message.success('保存成功')
};
const handleEditPhone = () => {
  showResetPhoneModal({
    phone: user_info.value.phone
  });
}
const handleResetPhoneComplete = () => {
  getUserInfo(false);
  message.success('保存成功')
};
const handleBindPhone = async () => {
  showBindPhoneModal();
}
const handleBindPhoneComplete = () => {
  getUserInfo(false);
  message.success('保存成功')
};
const handleEditPassword = async () => {
  showResetPasswordModal({
    phone: user_info.value.phone
  });
}
const bindWechat = () => {
  router.push('/layout/account/bind_wechat')
};
const goRecharge = () => {
  router.push('/layout/account/recharge')
};
const goTopup = () => {
  router.push('/layout/account/topup')
};
const goConsume = () => {
  router.push('/layout/account/consume')
};
onMounted(() => {
  getUserInfo(false)
})
</script>

<style lang="scss" scoped>
</style>
