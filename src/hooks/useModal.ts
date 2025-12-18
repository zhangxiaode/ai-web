import { tryOnScopeDispose } from "@vueuse/core";
import { runtimeId } from "../utils/index";

const modalStack: any = reactive([]);

export function useModal(initModalKey: string) {

  const modalKey = initModalKey || `modal-${runtimeId()}`;

  const visible = computed(() => {
    const modal: any = modalStack.find((it: any) => it.key === modalKey);
    return !!modal;
  });

  const payload = computed(() => {
    const modal: any = modalStack.find((it: any) => it.key === modalKey);
    return modal ? modal.payload : null;
  });

  const showModal = (payload: any = null): any => {
    const modal: any = modalStack.find((it: any) => it.key === modalKey);

    if (!modal) {
      modalStack.push({
        key: modalKey,
        payload,
      });
    } else {
      console.warn(
        "[useModal]：showModal 失败，当前弹窗已存在 modalKey =",
        modalKey
      );
    }
  };

  const hideModal = () => {
    const modalIdx = modalStack.findIndex((it: any) => it.key === modalKey);

    if (modalIdx > -1) {
      modalStack.splice(modalIdx, 1);
    }
  };

  tryOnScopeDispose(() => hideModal());

  return { visible, payload, showModal, hideModal };
}
