<template>
    <div class="video-player flex flex-column jc-center">
        <div v-show="src" id="videoPlayer"></div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue';
import Player, { Events } from 'xgplayer';
import HlsPlugin from 'xgplayer-hls'
import 'xgplayer/dist/index.min.css';

const props = defineProps({
    src: { type: String, default: '' },
})
const emit = defineEmits([
    'canplaythrough',
    'waiting',
    'play',
    'pause',
    'timeupdate',
    'ended',
    'error'
])

let player: any = null
const handleCanplaythrough = (e: any) => {
    // console.log('视频准备播放', e)
    emit('canplaythrough', e)
}
const handleWaiting = (e: any) => {
    // console.log('视频等待播放', e)
    emit('waiting', e)
}
const handlePlay = () => {
    // console.log('视频开始播放')
    emit('play')
}
const handlePause = () => {
    // console.log('视频暂停播放')
    emit('pause')
}
const handleTimeupdate = (e: any) => {
    // console.log('视频播放中')
    emit('timeupdate', e)
}
const handleEnded = () => {
    // console.log('视频播放结束')
    emit('ended')
}
const handleError = (e: any) => {
    // console.log('视频播放出错', e)
    emit('error')
}
const handleFullscreenChange = (e: any) => {
    // console.log('handleFullscreenChange', e)
    // if(e) {
    //   // player.exitFullscreen()
    //   setTimeout(() => {
    //     document.documentElement.requestFullscreen();
    //   }, 500)
    // } else {
    //   document.exitFullscreen();
    // }
}

onMounted(() => {
    try {
        if (props.src) {
            player = new Player({
                id: 'videoPlayer',
                loop: true,
                ignores: ['cssfullscreen'],
                url: props.src,
                plugins: [ HlsPlugin ],
                autoplay: true,
                autoplayMuted: true,
                closeVideoClick: true,
                closeVideoDblclick: true,
                enableContextmenu: false,
                fluid: true,
                controls: false,
                width: '100%',
                height: '100vh'
            })
            player.on(Events.CANPLAY_THROUGH, handleCanplaythrough)
            player.on(Events.WAITING, handleWaiting)
            player.on(Events.PLAY, handlePlay)
            player.on(Events.PAUSE, handlePause)
            player.on(Events.TIME_UPDATE, handleTimeupdate)
            player.on(Events.ENDED, handleEnded)
            player.on(Events.ERROR, handleError)
            player.on(Events.FULLSCREEN_CHANGE, handleFullscreenChange)
            player.play()
        }
    } catch (error) {
        console.log(error)
    }
})

onBeforeUnmount(() => {
    if (player) {
        player.destroy()
        player = null
    }
})
</script>

<style lang="scss">
.video-player {
    width: 100%;
    height: 100vh;
    #videoPlayer {
        width: 100%;
        height: 100% !important;
        padding-top: 0 !important;
        video {
            object-fit: cover;
        }
        .xgplayer-start, .xg-mini-layer, .xgplayer-replay, .xgplayer-loading, .xgplayer-enter {
            opacity: 0;
        }
    }
}
</style>