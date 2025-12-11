<template>
  <div :class="['audio flex justify-center items-center rounded-full border-0px border-style-solid bg-transparent', `border-color-${color} w-${size}px`, `h-${size}px`]" @click="handlePlay()">
    <div :class="['bar bar1 bg-#fff', `bg-${color} w-${size / 6}px h-${size / 4}px rounded-${size / 12}px rounded-tr-${size / 4}px rounded-br-${size / 4}px mx-${size / 10}px`, { playing }]"></div>
    <div :class="['bar bar2 bg-#fff', `bg-${color} w-${size / 6}px h-${size * 2 / 4}px rounded-${size / 12}px rounded-tr-${size * 2 / 4}px rounded-br-${size * 2 / 4}px mx-${size / 10}px`, { playing }]"></div>
    <div :class="['bar bar3 bg-#fff', `bg-${color} w-${size / 6}px h-${size * 3 / 4}px rounded-${size / 12}px rounded-tr-${size * 3 / 4}px rounded-br-${size * 3 / 4}px mx-${size / 10}px`, { playing }]"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  size: { type: Number, default: 14 },
  color: { type: String, default: '#ffffff' },
  src: { type: String, default: '' },
})
const playing = ref(false)

const handlePlay = () => {
  const audio = new Audio(props.src);
  audio.addEventListener('play', () => {
    playing.value = true
  });
  audio.addEventListener('ended', () => {
    playing.value = false
  });
  audio.play();
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