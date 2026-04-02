import { NSpin } from 'naive-ui';
import { createApp, h } from 'vue';

const initLoading = (el: any, isLoading: any) => {
  el.style.position = 'relative'

  // 创建 spin 容器
  const spinContainer = document.createElement('div')
  spinContainer.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    display: none;
  `

  // 创建遮罩层
  const mask = document.createElement('div')
  mask.className = 'custom-loading-mask'
  mask.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    border-radius: inherit;
    display: none;
  `

  el.appendChild(spinContainer)
  el.appendChild(mask)

  // 保存引用
  el._loadingSpin = spinContainer
  el._loadingMask = mask

  if (isLoading) {
    showLoading(el)
  }
}

const showLoading = (el: any) => {
  if (!el._loadingSpin || !el._loadingMask) return

  // 显示遮罩和 spin
  el._loadingMask.style.display = 'block'
  el._loadingSpin.style.display = 'block'

  // 创建 spin 实例
  if (!el._spinInstance) {
    const app = createApp({
      render() {
        return h(NSpin, { size: 'medium' })
      }
    })
    el._spinInstance = app.mount(el._loadingSpin)
  }

  // 禁用交互
  el.style.pointerEvents = 'none'
  el.style.cursor = 'not-allowed'
}

const hideLoading = (el: any) => {
  if (!el._loadingSpin || !el._loadingMask) return

  // 隐藏遮罩和 spin
  el._loadingMask.style.display = 'none'
  el._loadingSpin.style.display = 'none'

  // 恢复交互
  el.style.pointerEvents = 'auto'
  el.style.cursor = 'default'
}

export default {
  key: 'loading',
  value: {
    mounted(el: any, binding: any) {
      initLoading(el, binding.value)
    },
    updated(el: any, binding: any) {
      if (binding.value !== binding.oldValue) {
        if (binding.value) {
          showLoading(el)
        } else {
          hideLoading(el)
        }
      }
    },
    unmounted(el: any) {
      hideLoading(el)
    }
  }
}