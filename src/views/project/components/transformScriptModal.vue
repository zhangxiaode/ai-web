<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 100%;" @update:show="onClose">
    <template #header>
      <slot name="header">转换剧本</slot>
    </template>
    <slot>
      <div class="transform-script flex flex-col items-normal">
        <div class="flex items-center">
          <n-select
            v-model:value="form.model"
            placeholder="请选择AI模型"
            :options="[
              { label: '豆包seedream-4-0', value: 'doubao-seed-1.6' },
              { label: '千问image-plus', value: 'qwen-plus' },
            ]"
            clearable
          />
          <n-select
            v-model:value="form.type"
            placeholder="请选择转换类型"
            :options="[
              { label: '有声书剧本', value: 0 },
              { label: '影视剧本', value: 1 },
            ]"
            class="ml-8px"
            clearable
          />
        </div>
        <div class="w-100% flex justify-between items-normal">
          <n-input v-model:value="form.content" type="textarea" class="flex-1 m-5px h-500px" placeholder="请输入章节内容" />
          <n-input v-if="form.type === 0" v-model:value="form.audio_script" type="textarea" class="flex-1 m-5px h-500px" placeholder="请输入剧本内容" />
          <n-input v-else v-model:value="form.movie_script" type="textarea" class="flex-1 m-5px h-500px" placeholder="请输入剧本内容" />
          <!-- <Editor :value="form.content" class="flex-1 m-5px" :height="500" disabled placeholder="请输入章节内容" @change="val => form.content = val" />
          <Editor :value="form.audio_script" class="flex-1 m-5px" :height="500" placeholder="请输入剧本内容" @change="val => form.script = val" /> -->
        </div>
      </div>
    </slot>
    <template #action>
      <slot name="action">
        <n-button class="btn" size="small" @click="onClose()">取消</n-button>
        <n-button class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onTransform, message, 2000)">转换</n-button>
        <n-button v-if="(form.type === 0 && form.audio_script) || (form.type === 1 && form.movie_script)" class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onSave, message, 2000)">保存</n-button>
      </slot>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { getChapterDetail, postScript, postChapterLanguage } from "@/apis/index";
// import Editor from "@/components/editor.vue"

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('transformScript-modal');
const message = useMessage()

const disabled: any = ref(false)
const form = ref({
  id: null,
  model: 'doubao-seed-1.6',
  type: 0,
  content: '',
  audio_script: '',
  movie_script: '',
});
const onTransform = async () => {
  try {
    disabled.value = true
    const res: any = await postScript({
      model: form.value.model,
      type: form.value.type,
      content: form.value.content
    })
    if(form.value.type === 0) {
      form.value.audio_script = res.data
    } else {
      form.value.movie_script = res.data
    }
    disabled.value = false
  } catch (error) {
    disabled.value = false
  }
}
const onSave = async () => {
  try {
    disabled.value = true
    if((form.value.type === 0 && form.value.audio_script) || (form.value.type === 1 && form.value.movie_script)) {
      const res: any = await postChapterLanguage({
        chapter_id: form.value.id,
        type: form.value.type,
        script: form.value.type === 0 ? form.value.audio_script : form.value.movie_script,
      })
      message.success('剧本保存成功')
    } else {
      message.error('剧本内容不能为空')
    }
    disabled.value = false
  } catch (error) {
    disabled.value = false
  }
}
const onClose = () => {
  hideModal();
}
const getChapterInfo = async () => {
  const res: any = await getChapterDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.content = res.data.content
  const chapter_language = res.data.languages.find((item: any) => item.language === 'zh')
  if(chapter_language) {
    form.value.audio_script = chapter_language.audio_script
    form.value.movie_script = chapter_language.movie_script
  }
}
watch(visible, (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      getChapterInfo()
    }
  } else {
    form.value = {
      id: null,
      model: '',
      type: 0,
      content: '',
      audio_script: '',
      movie_script: '',
    }
  }
});
// ### 角色声音特质说明  
// - **风清扬**：28岁，考古教授，前期声音充满惊恐、愤怒与迷茫，后期逐渐转为坚定；音色中等，略带沙哑（因刚经历异变）。  
// - **赢勾**：古老僵尸至尊，声音沧桑、威严，带金属质感的回响，偶尔透出诡异笑意；音色低沉，语速缓慢。  


// ### 场景一：深山月夜·青石异变  
// **【场景标题：深山老林·子时·阴森痛苦】**  
// **【音效：狼嚎（由远及近，凄厉痛苦，持续5秒后渐弱）→ 古树枝叶摇曳声（沙沙，持续背景音）→ 风声（阴冷，低鸣，贯穿场景）】**  
// **【背景音乐：低沉鼓点（淡入，营造压抑感）】**  

// **旁白**：子时三刻，深山老林阴气席卷，古木参天如狰狞鬼影。青色大石上，一道消瘦身影仰对满月，衣衫褴褛如布条，四颗尖牙在月华下泛着寒光。  

// **风清扬（痛苦嘶吼）**：嗷——！  
// **【音效：嚎叫回声（山谷回荡，叠加鬼哭狼嚎的模糊音效，持续10秒后骤停）】**  

// **旁白**：嚎叫持续半个时辰，终在寂静中停止。身影仰面倒在青石上，狰狞面容褪去，露出棱角分明的脸，一行清泪滑落。  

// **风清扬（空洞沙哑）**：这到底是什么鬼地方……  
// **【内心旁白（迷茫苦涩）】**：我明明在清理秦始皇陵，碰了青铜战马上那颗青色眼珠，怎么就到了这里？  

// **旁白**：他摊开手，青色珠子正散发绿光笼罩全身。嘴里的尖牙、坚硬的皮肤、对月光的莫名亲近……一切都在告诉他，世界已经天翻地覆。  

// **风清扬（愤怒低吼）**：这tm的到底是什么鬼东西？！  
// **【音效：手掌紧握声（指节发白的摩擦音）】**  


// ### 场景二：碎珠惊变·血滴惊魂  
// **【场景标题：青石之上·子时末·暴怒与诡异】**  
// **【音效：石头摩擦声（风清扬从地上捡石块，粗糙摩擦）→ 呼吸粗重声（风清扬愤怒喘息，持续）】**  

// **风清扬（愤怒咆哮）**：就是因为你！害我失去父母、工作！老子今天砸碎你！  
// **【音效：石块砸落声（“啪！”清脆，砸在青石上）→ 珠子碎裂声（“咔擦！”细微裂纹蔓延）】**  

// **旁白**：青色珠子应声而碎，风清扬疯了般扒开碎石，却见碎珠中央，一颗黑黝黝、指甲大小的血滴子静静躺着，入手竟如软玉般温暖。  

// **风清扬（惊疑）**：这是什么？成色……至少五千年？可秦始皇陵才两千多年……  
// **【音效：牙齿轻咬声（“咔嚓”微响）→ 液体吞咽声（“噗嗤”，意外吞咽）】**  

// **风清扬（大惊失色）**：唔！什么东西？！  
// **【音效：身体僵硬声（关节“咔咔”作响，肌肉紧绷）】**  

// **赢勾（沧桑欣喜，声音从虚空传来，带金属回响）**：哦？僵尸血脉？还是尸王血脉！  
// **风清扬（惊恐颤抖）**：谁？谁在说话？！  
// **【音效：透明人影漂浮声（空气轻微扭曲的嗡鸣，渐强）】**  

// **风清扬（摔落青石，声音发颤）**：你……你他妈是什么东西！  
// **【音效：身体摔地声（“砰”，石子滚动）→ 獠牙寒光声（赢勾咧嘴时尖牙摩擦的细微声响）】**  


// ### 场景三：僵尸至尊·传承与消散  
// **【场景标题：青石旁·丑时·诡异与希望】**  
// **【音效：人影扭曲声（透明轮廓波动，带低频嗡鸣）→ 风声突然变急（“呼”，赢勾靠近）】**  

// **赢勾（威严中带戏谑）**：什么什么东西？老祖我是僵尸至尊，你的祖宗，懂？  
// **风清扬（倒退两步，冷汗直流）**：僵……僵尸至尊？你把我带到这里的？  
// **赢勾（绕着风清扬漂浮，声音轻快）**：聪明！这里是修真界，你的尸王血脉引动了我的精血，才把你拉来。你吞了我的精血，正好继承我的传承。  

// **风清扬（警惕）**：你真是僵尸？怎么不跳着走路？  
// **赢勾（阴测测诡笑）**：嘿嘿嘿！跳着走的是最低等的跳尸！老祖我可是至尊！  
// **【音效：古卷凭空出现声（纸张翻动的“哗啦”声，带灵力波动音效）】**  

// **赢勾（语气郑重）**：把这本《太阴真经》拿去，僵尸一族无上绝学。  
// **风清扬（颤抖接书）**：这……  
// **【音效：书本入脑声（“嗡”的一声轻鸣，古卷化作流光消失）】**  

// **赢勾（温和提醒）**：别怕，脑海里默念即可。  
// **【内心旁白（风清扬，逐渐平静）】**：跳尸、游尸、黑僵……对应人类修真的炼气、筑基……原来僵尸也能修炼！  

// **风清扬（眼神坚定）**：就算是跳尸，我也要逆天而上！  
// **赢勾（欣慰叹息）**：好好修炼吧……我只是一丝意念，该去找他们了。  
// **风清扬（急切）**：前辈如何称呼？  
// **赢勾（声音渐远，带回响）**：我乃赢勾战将……  
// **【音效：人影消散声（透明轮廓如波纹般淡化，“沙沙”渐弱）→ 风声渐停（背景音淡出）】**  
// **【背景音乐：低沉鼓点（淡出，留一丝余韵）】**  

// **旁白**：赢勾的身影彻底消失在夜空中，只留风清扬站在青石上，紧握双拳，眼中映着残月微光。深山的寂静里，新的命运正悄然展开。






// ### 角色声音特质说明  
// - 风清扬：28岁青年音，前期含惊恐、愤怒，后期逐渐透出坚定；  
// - 赢勾：千年沧桑音，威严中带阴冷，偶有诡笑，语速偏缓。  


// ### 场景一：子时深山·阴寒林地  
// （时间：子时三刻；地点：深山老林；氛围：阴森、诡异）  

// 【音效：狼嚎（凄厉，由远及近，持续3秒后淡出）】  
// 【音效：树枝摇曳声（急促，伴随呜咽风声，持续5秒）】  
// 【背景音乐：低沉弦乐（淡入，持续作为背景音）】  

// 【全知旁白】深山古木参天，山脉如狰狞恶龙盘踞。子时阴气席卷，一声嚎叫划破长空，似恐怖更似痛苦，惊得古树摇曳，鬼哭狼嚎。  

// 【音效：脚步声（轻微，踩碎落叶，由远及近）】  
// 【全知旁白】青色大石上，伫立着消瘦身影——衣衫褴褛如布条，面容扭曲，四颗尖牙在月光下泛着阴寒。  

// 【音效：嚎叫（持续20秒，由高亢渐弱至停止）】  
// 【全知旁白】他仰对满月，月华如光柱笼罩其身。半个时辰后，嚎叫骤停，身影仰面倒在石上，狰狞面容褪去，露出棱角分明的脸，一行清泪滑落。  

// 风清扬（空洞、苦涩）：这到底是什么鬼地方！  

// 【内心旁白：我叫风清扬，前世是考古教授。清理秦始皇陵时，碰了青铜战马上的青色眼珠，就被扯到了这里。】  

// 【音效：珠子摩擦声（轻微，伴随绿光闪烁的“滋滋”声）】  
// 风清扬（愤怒、烦躁）：这tm的到底是什么鬼东西？  

// 【内心旁白：手里的青色珠子冰凉，像颗绿玛瑙。它让我长出獠牙，浑身变硬，脑子里全是嗜血的念头，还对月光有种莫名的亲近……】  

// 【音效：手掌拍击石面声（沉闷，带愤怒力度）】  
// 风清扬（怒吼）：就是因为你！害我失去父母、工作！我tm……  

// 【音效：石块摩擦声（捡起石块，掂量的“咚咚”声）】  
// 风清扬（疯狂）：今天不弄碎你，如何解我心头之恨！  

// 【音效：石块砸击声（清脆，伴随石屑飞溅声）】  
// 【音效：碎裂声（清脆，带玉石破碎质感，持续2秒）】  

// 【全知旁白】青色珠子应声而碎。风清扬在碎石中扒拉，露出一颗黑黝黝、指甲大小的血滴子，入手温暖如软玉。  

// 风清扬（皱眉、疑惑）：这是什么？看成色，只怕有五千年之久……不对，秦始皇至今才两千多年啊！  

// 【音效：牙齿咬碎声（轻微“咔嚓”）】  
// 【音效：吞咽声（急促，伴随液体流动的“咕噜”声）】  

// 风清扬（大惊、慌乱）：噗噗噗！（拼命吐口水）  

// 【音效：身体僵硬声（骨骼摩擦的“咔咔”声）】  

// 赢勾（沧桑、欣喜）：哦？僵尸血脉？还是尸王血脉！  

// 风清扬（惊恐、警惕）：谁？是谁在说话？  

// 赢勾（淡然）：别找了，是我。  

// 【音效：阴风呼啸（突然增强，环绕感，持续2秒后减弱为背景音）】  
// 风清扬（摔落石地，狼狈爬起，声音颤抖）：你……你他妈是什么东西！  

// 【全知旁白】风清扬手指处，一道透明人影漂浮——身穿盔甲，尖牙外露，虽透明却透着嗜血寒光。  

// 赢勾（不满、威严）：什么什么东西？老祖我是僵尸至尊，你的祖宗，能尊敬点吗？  

// 【音效：身影扭曲声（空气波动的“嗡鸣”声）】  
// 风清扬（倒退两步，恐惧）：僵……僵尸至尊？  

// 赢勾（眨眼间飘至风清扬身前，阴测测）：挺聪明。这里是修真界，你天生尸王血脉引动了我的精血，才把你带来。  

// 赢勾（抱臂、诡笑）：本尊等了无数年，总算等到你。不枉你吞了我的精血！  

// 风清扬（警惕）：你真是僵尸？怎么没跳着走路？  

// 赢勾（瞪猩红眼珠，冷笑）：小子，我是僵尸至尊！跳着走的，不过是最低等的跳尸！  

// 【音效：书本破空声（轻微“嗖”声）】  
// 赢勾（语气放缓）：把这本《太阴真经》拿去，僵尸一族无上绝学。  

// 【音效：书本入脑声（柔和“嗡”声，持续1秒）】  
// 风清扬（惊慌失措）：啊！它……它进我脑子里了！  

// 赢勾（提醒）：别怕，脑海里默念即可。  

// 【音效：深呼吸声（风清扬平复情绪，持续3秒）】  
// 【内心旁白：（闭眼默念）开篇写着僵尸等级——跳尸、游尸、黑僵……对应人类修真的炼气、筑基……原来我现在只是只跳尸！】  

// 风清扬（无奈、苦涩）：罢了，变成僵尸就变成僵尸，就算是跳尸，也要逆天而上，走上巅峰！  

// 赢勾（欣慰）：好好修炼吧。这只是本尊一丝意念，挣扎多年，也该去找他们了。  

// 风清扬（不舍）：前辈如何称呼？  

// 赢勾（身影渐淡，声音缥缈）：我乃赢勾战将！  

// 【音效：身影消散声（空气流动的“嘶嘶”声，渐弱）】  
// 【背景音乐：低沉弦乐（淡出，持续5秒后停止）】  
// 【全知旁白】赢勾的身影如透明波浪，在阴冷夜空中缓缓消失。深山恢复寂静，只剩风清扬紧握双拳，眼中燃起决绝之光。
</script>

<style lang="scss" scoped>
.transform-script {
  font-weight: 500;
  border-radius: 16px;
  margin: 58px 0;
}
</style>