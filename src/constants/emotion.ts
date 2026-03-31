export const emotion_options = [
	{ label: '开心', value: 'happy' },
	{ label: '悲伤', value: 'sad' },
	{ label: '生气', value: 'angry' },
	{ label: '惊讶', value: 'surprised' },
	{ label: '恐惧', value: 'fear' },
	{ label: '厌恶', value: 'hate' },
	{ label: '激动', value: 'excited' },
	{ label: '冷漠', value: 'coldness' },
	{ label: '中性', value: 'neutral' },
	{ label: '沮丧', value: 'depressed' },
	{ label: '撒娇', value: 'lovey-dovey' },
	{ label: '害羞', value: 'shy' },
	{ label: '安慰鼓励', value: 'comfort' },
	{ label: '咆哮/焦急', value: 'tension' },
	{ label: '温柔', value: 'tender' },
	{ label: '讲故事/自然讲述', value: 'storytelling' },
	{ label: '情感电台', value: 'radio' },
	{ label: '磁性', value: 'magnetic' },
	{ label: '广告营销', value: 'advertising' },
	{ label: '气泡音', value: 'vocal-fry' },
	{ label: '低语', value: 'ASMR' },
	{ label: '新闻播报', value: 'news' },
	{ label: '娱乐八卦', value: 'entertainment' },
	{ label: '方言', value: 'dialect' },
]
export const getEmotion = (val: string) => {
	const emotion = emotion_options.find(emo => emo.value === val)
	return emotion ? emotion.label : null
}