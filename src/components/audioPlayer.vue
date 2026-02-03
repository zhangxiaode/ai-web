<template>
  <n-button type="error" size="small" @click="handlePlay()">
    <template #icon>
      <div class="audio flex justify-center items-center rounded-full border-0px border-style-solid bg-transparent border-color-#fff w-12px h-12px">
        <div :class="['bar bar1 bg-#fff w-2px h-3px rounded-2px rounded-tr-3px rounded-br-3px mx-1px', { playing }]"></div>
        <div :class="['bar bar2 bg-#fff w-2px h-6px rounded-2px rounded-tr-6px rounded-br-6px mx-1px', { playing }]"></div>
        <div :class="['bar bar3 bg-#fff w-2px h-9px rounded-2px rounded-tr-9px rounded-br-9px mx-1px', { playing }]"></div>
      </div>
    </template>
    试听
  </n-button>
</template>

<script lang="ts" setup>
const props = defineProps({
  src: { type: String, default: '' },
})
const playing = ref(false)
const audio: any = ref(null)

const handlePlay = () => {
  if(audio.value) {
    audio.value.stop()
  }
  audio.value = new Audio(props.src);
  audio.value.addEventListener('play', () => {
    playing.value = true
  });
  audio.value.addEventListener('ended', () => {
    playing.value = false
  });
  audio.value.play();
}
</script>

<style scoped>
.audio .bar.playing {
  animation: wave-animation 1.5s infinite ease-in-out;
}
.audio .bar.bar1 {
  animation-delay: 0s;  /* 第一条竖杠没有延迟 */
}
.audio .bar.bar2 {
  animation-delay: 0.3s;  /* 第二条竖杠延迟0.3s */
}
.audio .bar.bar3 {
  animation-delay: 0.6s;  /* 第三条竖杠延迟0.6s */
}
@keyframes wave-animation {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>