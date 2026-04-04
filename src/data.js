// 八卦三爻映射（从下往上）
const TRIGRAM_LINES = {
  '乾': [1,1,1], '坤': [0,0,0], '震': [1,0,0], '巽': [0,1,1],
  '坎': [0,1,0], '离': [1,0,1], '艮': [0,0,1], '兑': [1,1,0]
};

// 八卦能量属性（阳性=暖金，阴性=冷蓝）
// 颜色跟随三爻卦整体属性，不按单爻阴阳区分
const TRIGRAM_ENERGY = {
  '乾': 'warm', '离': 'warm', '震': 'warm', '艮': 'warm',  // 阳性能量
  '坤': 'cold', '坎': 'cold', '兑': 'cold', '巽': 'cold',  // 阴性能量
};

// 获取三爻卦的能量类型
export function getTrigramEnergy(trigramName) {
  return TRIGRAM_ENERGY[trigramName] || 'warm';
}

// 八族定义
export const TRIBES = [
  { id: 1, name: '蓄积', question: '怎么积累？', energy: '向内聚合，尚未释放', color: '#c9a96e', icon: '蓄' },
  { id: 2, name: '扩张', question: '怎么乘势？', energy: '向外释放，持续上升', color: '#d4b878', icon: '扩' },
  { id: 3, name: '受阻', question: '怎么突破？', energy: '向前遇阻，停滞或冲突', color: '#8b7b5a', icon: '阻' },
  { id: 4, name: '重构', question: '怎么重建？', energy: '旧结构瓦解，系统重组', color: '#6a8a7a', icon: '构' },
  { id: 5, name: '连接', question: '怎么协作？', energy: '向外建立关系网络', color: '#7a82a0', icon: '连' },
  { id: 6, name: '收敛', question: '怎么守住？', energy: '主动向内，减少暴露', color: '#6a8a9a', icon: '敛' },
  { id: 7, name: '转折', question: '怎么跨越？', energy: '周期完成，进入临界点', color: '#a0896a', icon: '折' },
  { id: 8, name: '校准', question: '怎么归正？', energy: '回归本质，与规律对齐', color: '#7a9a7a', icon: '准' },
];

// 64卦完整数据
export const HEXAGRAMS = [
  // ① 蓄积族 (8卦)
  { num: 3,  name: '屯', pinyin: 'zhūn', fullName: '水雷屯', upper: '坎', lower: '震', tribe: 1, status: 'done', file: 'zhun_03_v1.html', hook: '难，是开始的证据' },
  { num: 4,  name: '蒙', pinyin: 'méng', fullName: '山水蒙', upper: '艮', lower: '坎', tribe: 1, status: 'done', file: 'meng_04_v1.html', hook: '蒙，不是不懂，是躲着不去弄懂' },
  { num: 5,  name: '需', pinyin: 'xū', fullName: '水天需', upper: '坎', lower: '乾', tribe: 1, status: 'done', file: 'xu_05_v1.html', hook: '等不住，才更需要学会等' },
  { num: 8,  name: '比', pinyin: 'bǐ', fullName: '水地比', upper: '坎', lower: '坤', tribe: 1, status: 'done', file: 'bi_08_v1.html', hook: '同欲相憎，同忧相亲' },
  { num: 9,  name: '小畜', pinyin: 'xiǎo xù', fullName: '风天小畜', upper: '巽', lower: '乾', tribe: 1, status: 'done', file: 'xiaoxu_09_v2.html', hook: '一点一点，才是这个阶段的速度' },
  { num: 10, name: '履', pinyin: 'lǚ', fullName: '天泽履', upper: '乾', lower: '兑', tribe: 1, status: 'done', file: 'lv_10_v1.html', hook: '跟不上节奏的那一步，才是真正的积累' },
  { num: 26, name: '大畜', pinyin: 'dà xù', fullName: '山天大畜', upper: '艮', lower: '乾', tribe: 1, status: 'done', file: 'dachu_26_v1.html', hook: '积累始终是为了取用的' },
  { num: 45, name: '萃', pinyin: 'cuì', fullName: '泽地萃', upper: '兑', lower: '坤', tribe: 1, status: 'done', file: 'cui_45_v1.html', hook: '有没有那一天，东西开始往你这里聚' },

  // ② 扩张族 (8卦)
  { num: 1,  name: '乾', pinyin: 'qián', fullName: '乾为天', upper: '乾', lower: '乾', tribe: 2, status: 'done', file: 'qian_01_v2.html', hook: '你的生命力，不需要你推它' },
  { num: 11, name: '泰', pinyin: 'tài', fullName: '地天泰', upper: '坤', lower: '乾', tribe: 2, status: 'done', file: 'tai_11_v1.html', hook: '先恭喜你，做什么都开始顺了' },
  { num: 14, name: '大有', pinyin: 'dà yǒu', fullName: '火天大有', upper: '离', lower: '乾', tribe: 2, status: 'done', file: 'dayu_14_v1.html', hook: '舞台大了，你还好吗' },
  { num: 19, name: '临', pinyin: 'lín', fullName: '地泽临', upper: '坤', lower: '兑', tribe: 2, status: 'done', file: 'lin_19_v1.html', hook: '东西在来的路上，保持觉察' },
  { num: 34, name: '大壮', pinyin: 'dà zhuàng', fullName: '雷天大壮', upper: '震', lower: '乾', tribe: 2, status: 'done', file: 'dazhuang_34_v1.html', hook: '力量够了，别急着用' },
  { num: 35, name: '晋', pinyin: 'jìn', fullName: '火地晋', upper: '离', lower: '坤', tribe: 2, status: 'done', file: 'jin_35_v1.html', hook: '光已经在那里了，你在走过去' },
  { num: 43, name: '夬', pinyin: 'guài', fullName: '泽天夬', upper: '兑', lower: '乾', tribe: 2, status: 'done', file: 'guai_43_v1.html', hook: '心意已决的那一刻' },
  { num: 46, name: '升', pinyin: 'shēng', fullName: '地风升', upper: '坤', lower: '巽', tribe: 2, status: 'done', file: 'sheng_46_v1.html', hook: '没有一棵树是跳着长的' },

  // ③ 受阻族 (8卦)
  { num: 6,  name: '讼', pinyin: 'sòng', fullName: '天水讼', upper: '乾', lower: '坎', tribe: 3, status: 'done', file: 'song_06_v1.html', hook: '对错，是看出来的' },
  { num: 12, name: '否', pinyin: 'pǐ', fullName: '天地否', upper: '乾', lower: '坤', tribe: 3, status: 'done', file: 'pi_12_v1.html', hook: '天地否，是在提醒你找回弄丢的自己' },
  { num: 29, name: '坎', pinyin: 'kǎn', fullName: '坎为水', upper: '坎', lower: '坎', tribe: 3, status: 'done', file: 'kan_29_v1.html', hook: '允许一切发生' },
  { num: 36, name: '明夷', pinyin: 'míng yí', fullName: '地火明夷', upper: '坤', lower: '离', tribe: 3, status: 'done', file: 'mingyi_v3.html', hook: '越证明自己对，消耗越大' },
  { num: 39, name: '蹇', pinyin: 'jiǎn', fullName: '水山蹇', upper: '坎', lower: '艮', tribe: 3, status: 'done', file: 'jian_39_v1.html', hook: '冬天的树也在长根' },
  { num: 40, name: '解', pinyin: 'jiě', fullName: '雷水解', upper: '震', lower: '坎', tribe: 3, status: 'done', file: 'jie_40_v1.html', hook: '松绑的那一刻' },
  { num: 47, name: '困', pinyin: 'kùn', fullName: '泽水困', upper: '兑', lower: '坎', tribe: 3, status: 'done', file: 'kun_47_v1.html', hook: '困住的是形式，不是你' },
  { num: 51, name: '震', pinyin: 'zhèn', fullName: '震为雷', upper: '震', lower: '震', tribe: 3, status: 'pending', file: null, hook: '惊到了，而后知有序' },

  // ④ 重构族 (8卦)
  { num: 18, name: '蛊', pinyin: 'gǔ', fullName: '山风蛊', upper: '艮', lower: '巽', tribe: 4, status: 'pending', file: null, hook: '烂在根上的，要从根治' },
  { num: 21, name: '噬嗑', pinyin: 'shì kè', fullName: '火雷噬嗑', upper: '离', lower: '震', tribe: 4, status: 'pending', file: null, hook: '咬碎障碍，才能通' },
  { num: 28, name: '大过', pinyin: 'dà guò', fullName: '泽风大过', upper: '兑', lower: '巽', tribe: 4, status: 'pending', file: null, hook: '撑不住的，就该放下了' },
  { num: 41, name: '损', pinyin: 'sǔn', fullName: '山泽损', upper: '艮', lower: '兑', tribe: 4, status: 'pending', file: null, hook: '减少，就是另一种增加' },
  { num: 48, name: '井', pinyin: 'jǐng', fullName: '水风井', upper: '坎', lower: '巽', tribe: 4, status: 'pending', file: null, hook: '不枯的源头在深处' },
  { num: 49, name: '革', pinyin: 'gé', fullName: '泽火革', upper: '兑', lower: '离', tribe: 4, status: 'pending', file: null, hook: '该变的时候，别留恋旧皮' },
  { num: 50, name: '鼎', pinyin: 'dǐng', fullName: '火风鼎', upper: '离', lower: '巽', tribe: 4, status: 'done', file: 'ding_50_v2.html', hook: '你以为是新开始，逻辑还是旧的' },
  { num: 59, name: '涣', pinyin: 'huàn', fullName: '风水涣', upper: '巽', lower: '坎', tribe: 4, status: 'pending', file: null, hook: '散开，才能重新聚' },

  // ⑤ 连接族 (8卦)
  { num: 7,  name: '师', pinyin: 'shī', fullName: '地水师', upper: '坤', lower: '坎', tribe: 5, status: 'pending', file: null, hook: '带人走的人，要先自己走过那段路' },
  { num: 13, name: '同人', pinyin: 'tóng rén', fullName: '天火同人', upper: '乾', lower: '离', tribe: 5, status: 'done', file: 'tongren_13_v1.html', hook: '同频的人，在旷野里找' },
  { num: 17, name: '随', pinyin: 'suí', fullName: '泽雷随', upper: '兑', lower: '震', tribe: 5, status: 'pending', file: null, hook: '跟着走，是一种信任的练习' },
  { num: 31, name: '咸', pinyin: 'xián', fullName: '泽山咸', upper: '兑', lower: '艮', tribe: 5, status: 'pending', file: null, hook: '心动了，动的是什么' },
  { num: 37, name: '家人', pinyin: 'jiā rén', fullName: '风火家人', upper: '巽', lower: '离', tribe: 5, status: 'pending', file: null, hook: '最近的人，最真的力量场' },
  { num: 38, name: '睽', pinyin: 'kuí', fullName: '火泽睽', upper: '离', lower: '兑', tribe: 5, status: 'pending', file: null, hook: '分开看，反而看清了' },
  { num: 54, name: '归妹', pinyin: 'guī mèi', fullName: '雷泽归妹', upper: '震', lower: '兑', tribe: 5, status: 'pending', file: null, hook: '非你所选的位置，也有你的课' },
  { num: 58, name: '兑', pinyin: 'duì', fullName: '兑为泽', upper: '兑', lower: '兑', tribe: 5, status: 'pending', file: null, hook: '真正的悦，是给出去的' },

  // ⑥ 收敛族 (8卦)
  { num: 2,  name: '坤', pinyin: 'kūn', fullName: '坤为地', upper: '坤', lower: '坤', tribe: 6, status: 'done', file: 'kun_02_v1.html', hook: '你接住的，都会变成你的根' },
  { num: 15, name: '谦', pinyin: 'qiān', fullName: '地山谦', upper: '坤', lower: '艮', tribe: 6, status: 'done', file: 'qian_15_v2.html', hook: '守住已有的，不是建墙，是扎根' },
  { num: 16, name: '豫', pinyin: 'yù', fullName: '雷地豫', upper: '震', lower: '坤', tribe: 6, status: 'pending', file: null, hook: '预备，是安静时做的动作' },
  { num: 23, name: '剥', pinyin: 'bō', fullName: '山地剥', upper: '艮', lower: '坤', tribe: 6, status: 'pending', file: null, hook: '一层一层被剥掉，直到剩下真的' },
  { num: 33, name: '遁', pinyin: 'dùn', fullName: '天山遁', upper: '乾', lower: '艮', tribe: 6, status: 'pending', file: null, hook: '退，是为了保存火种' },
  { num: 44, name: '姤', pinyin: 'gòu', fullName: '天风姤', upper: '乾', lower: '巽', tribe: 6, status: 'pending', file: null, hook: '不期而遇的试探' },
  { num: 52, name: '艮', pinyin: 'gèn', fullName: '艮为山', upper: '艮', lower: '艮', tribe: 6, status: 'pending', file: null, hook: '该停的时候，停得住吗' },
  { num: 56, name: '旅', pinyin: 'lǚ', fullName: '火山旅', upper: '离', lower: '艮', tribe: 6, status: 'pending', file: null, hook: '在路上的人，轻装才走得远' },

  // ⑦ 转折族 (8卦)
  { num: 25, name: '无妄', pinyin: 'wú wàng', fullName: '天雷无妄', upper: '乾', lower: '震', tribe: 7, status: 'pending', file: null, hook: '没有预设，才接得住真实' },
  { num: 32, name: '恒', pinyin: 'héng', fullName: '雷风恒', upper: '震', lower: '巽', tribe: 7, status: 'pending', file: null, hook: '持久不是重复，是持续地活' },
  { num: 42, name: '益', pinyin: 'yì', fullName: '风雷益', upper: '巽', lower: '震', tribe: 7, status: 'pending', file: null, hook: '真正的增益，是上面给下面' },
  { num: 53, name: '渐', pinyin: 'jiàn', fullName: '风山渐', upper: '巽', lower: '艮', tribe: 7, status: 'pending', file: null, hook: '一步一步，才是到那里的方式' },
  { num: 55, name: '丰', pinyin: 'fēng', fullName: '雷火丰', upper: '震', lower: '离', tribe: 7, status: 'pending', file: null, hook: '满到极致之后呢' },
  { num: 62, name: '小过', pinyin: 'xiǎo guò', fullName: '雷山小过', upper: '震', lower: '艮', tribe: 7, status: 'pending', file: null, hook: '小事上稍微过一点' },
  { num: 63, name: '既济', pinyin: 'jì jì', fullName: '水火既济', upper: '坎', lower: '离', tribe: 7, status: 'pending', file: null, hook: '成了以后，才是真正的开始' },
  { num: 64, name: '未济', pinyin: 'wèi jì', fullName: '火水未济', upper: '离', lower: '坎', tribe: 7, status: 'done', file: 'weiji_64_v1.html', hook: '64卦的最后一句话：继续' },

  // ⑧ 校准族 (8卦)
  { num: 20, name: '观', pinyin: 'guān', fullName: '风地观', upper: '巽', lower: '坤', tribe: 8, status: 'pending', file: null, hook: '站远了，才看见全局' },
  { num: 22, name: '贲', pinyin: 'bì', fullName: '山火贲', upper: '艮', lower: '离', tribe: 8, status: 'pending', file: null, hook: '美，是给真实的一层光' },
  { num: 24, name: '复', pinyin: 'fù', fullName: '地雷复', upper: '坤', lower: '震', tribe: 8, status: 'pending', file: null, hook: '回到起点，但你不一样了' },
  { num: 27, name: '颐', pinyin: 'yí', fullName: '山雷颐', upper: '艮', lower: '震', tribe: 8, status: 'done', file: 'yi_27_v1.html', hook: '喂什么，长成什么' },
  { num: 30, name: '离', pinyin: 'lí', fullName: '离为火', upper: '离', lower: '离', tribe: 8, status: 'pending', file: null, hook: '光要有附着，才照得远' },
  { num: 57, name: '巽', pinyin: 'xùn', fullName: '巽为风', upper: '巽', lower: '巽', tribe: 8, status: 'pending', file: null, hook: '渗透的力量，是不对抗' },
  { num: 60, name: '节', pinyin: 'jié', fullName: '水泽节', upper: '坎', lower: '兑', tribe: 8, status: 'pending', file: null, hook: '节制，不是约束，是知道界限在哪' },
  { num: 61, name: '中孚', pinyin: 'zhōng fú', fullName: '风泽中孚', upper: '巽', lower: '兑', tribe: 8, status: 'done', file: 'zhongfu_61_v1.html', hook: '真诚不难，被信任才难' },
];

// 获取卦的六爻（从下往上，1=阳，0=阴）
export function getYaoLines(hexagram) {
  const lower = TRIGRAM_LINES[hexagram.lower];
  const upper = TRIGRAM_LINES[hexagram.upper];
  return [...lower, ...upper]; // bottom to top
}

// 按族获取卦列表
export function getHexagramsByTribe(tribeId) {
  return HEXAGRAMS.filter(h => h.tribe === tribeId);
}

// 获取族信息
export function getTribe(tribeId) {
  return TRIBES.find(t => t.id === tribeId);
}

// 按序号获取卦
export function getHexagram(num) {
  return HEXAGRAMS.find(h => h.num === num);
}

// 获取族完成进度
export function getTribeProgress(tribeId) {
  const hexagrams = getHexagramsByTribe(tribeId);
  const done = hexagrams.filter(h => h.status === 'done').length;
  return { done, total: hexagrams.length };
}

// 随机抽卦（从所有64卦中）
export function getRandomHexagram() {
  return HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)];
}

// 搜索卦
export function searchHexagrams(query) {
  const q = query.toLowerCase().trim();
  if (!q) return HEXAGRAMS;
  return HEXAGRAMS.filter(h =>
    h.name.includes(q) ||
    h.pinyin.toLowerCase().includes(q) ||
    h.fullName.includes(q) ||
    h.hook.includes(q) ||
    String(h.num).padStart(2, '0').includes(q)
  );
}

// 按传统序号排序的64卦
export function getAllHexagramsSorted() {
  return [...HEXAGRAMS].sort((a, b) => a.num - b.num);
}

// ============================================
// 综卦·错卦·互卦 计算
// ============================================

// 反向查找：从三爻数组找到卦名
const TRIGRAM_REVERSE = {};
for (const [name, lines] of Object.entries(TRIGRAM_LINES)) {
  TRIGRAM_REVERSE[lines.join('')] = name;
}

// 从六爻数组找到对应的卦
function findHexagramByLines(sixLines) {
  const lowerKey = sixLines.slice(0, 3).join('');
  const upperKey = sixLines.slice(3, 6).join('');
  const lowerName = TRIGRAM_REVERSE[lowerKey];
  const upperName = TRIGRAM_REVERSE[upperKey];
  if (!lowerName || !upperName) return null;
  return HEXAGRAMS.find(h => h.lower === lowerName && h.upper === upperName) || null;
}

// 综卦：上下翻转（整个六爻倒序）
export function getZongGua(hexagram) {
  const yao = getYaoLines(hexagram);
  const reversed = [...yao].reverse();
  const result = findHexagramByLines(reversed);
  const isSelf = result && result.num === hexagram.num;
  return { hexagram: result, isSelf, label: '综卦', desc: '翻转视角 · 同一处境的另一面' };
}

// 错卦：每爻取反（阴阳互换）
export function getCuoGua(hexagram) {
  const yao = getYaoLines(hexagram);
  const inverted = yao.map(y => y === 1 ? 0 : 1);
  const result = findHexagramByLines(inverted);
  const isSelf = result && result.num === hexagram.num;
  return { hexagram: result, isSelf, label: '错卦', desc: '阴阳相反 · 你的盲区与影子' };
}

// 互卦：2-3-4爻做下卦，3-4-5爻做上卦
export function getHuGua(hexagram) {
  const yao = getYaoLines(hexagram); // [初, 二, 三, 四, 五, 上] 0-indexed
  const huLines = [yao[1], yao[2], yao[3], yao[2], yao[3], yao[4]];
  const result = findHexagramByLines(huLines);
  const isSelf = result && result.num === hexagram.num;
  return { hexagram: result, isSelf, label: '互卦', desc: '中爻重组 · 隐藏的内在动态' };
}

// ============================================
// 杂卦传定义（一句话精义）
// ============================================
const ZA_GUA = {
  1: '刚', 2: '柔', 3: '见而不失其居', 4: '杂而著',
  5: '不进也', 6: '不亲也', 7: '忧', 8: '乐',
  9: '寡也', 10: '不处也', 11: '通也', 12: '否之匪人',
  13: '亲也', 14: '众也', 15: '轻也', 16: '怠也',
  17: '无故也', 18: '饭也', 19: '与也', 20: '求也',
  21: '食也', 22: '无色也', 23: '烂也', 24: '反也',
  25: '灾也', 26: '时也', 27: '养正也', 28: '颠也',
  29: '险也', 30: '丽也', 31: '速也', 32: '久也',
  33: '退也', 34: '则止', 35: '昔也', 36: '诛也',
  37: '内也', 38: '外也', 39: '难也', 40: '缓也',
  41: '衰之始', 42: '盛之始', 43: '决也', 44: '遇也',
  45: '聚也', 46: '不来也', 47: '相遇也', 48: '通也',
  49: '去故也', 50: '取新也', 51: '起也', 52: '止也',
  53: '女归待男行', 54: '女之终也', 55: '多故也', 56: '亲寡',
  57: '伏也', 58: '见也', 59: '离也', 60: '止也',
  61: '信也', 62: '过也', 63: '定也', 64: '男之穷也'
};

export function getZaGuaDef(num) {
  return ZA_GUA[num] ? `「${ZA_GUA[num]}」` : null;
}

// ============================================
// 京房八宫
// ============================================
const PALACES = [
  { name: '乾宫', base: 1,  members: [1, 44, 33, 12, 20, 23, 35, 14] },
  { name: '坎宫', base: 29, members: [29, 60, 3, 63, 49, 55, 36, 7] },
  { name: '艮宫', base: 52, members: [52, 22, 26, 41, 38, 10, 61, 53] },
  { name: '震宫', base: 51, members: [51, 16, 40, 32, 46, 48, 28, 17] },
  { name: '巽宫', base: 57, members: [57, 9, 37, 42, 25, 21, 27, 18] },
  { name: '离宫', base: 30, members: [30, 56, 50, 64, 4, 59, 6, 13] },
  { name: '坤宫', base: 2,  members: [2, 24, 19, 11, 34, 43, 5, 8] },
  { name: '兑宫', base: 58, members: [58, 47, 45, 31, 39, 15, 62, 54] },
];

const PALACE_ROLES = ['本宫卦', '一世卦', '二世卦', '三世卦', '四世卦', '五世卦', '游魂卦', '归魂卦'];

export function getPalace(hexagramNum) {
  for (const palace of PALACES) {
    const idx = palace.members.indexOf(hexagramNum);
    if (idx !== -1) {
      return {
        name: palace.name,
        baseNum: palace.base,
        role: PALACE_ROLES[idx],
        members: palace.members,
        index: idx
      };
    }
  }
  return null;
}

// ============================================
// 序卦传（前后卦脉络）
// ============================================
const XU_GUA = {
  2: '有天地然后万物生焉',
  3: '盈天地之间者唯万物',
  4: '物生必蒙',
  5: '蒙者物之稚也，物稚不可不养',
  6: '饮食必有讼',
  7: '讼必有众起',
  8: '众必有所比',
  9: '比必有所畜',
  10: '物畜然后有礼',
  11: '履而泰',
  12: '泰者通也，物不可以终通',
  13: '物不可以终否',
  14: '与人同者物必归焉',
  15: '有大者不可以盈',
  16: '有大而能谦必豫',
  17: '豫必有随',
  18: '以喜随人者必有事',
  19: '蛇然后可大',
  20: '物大然后可观',
  21: '可观而后有所合',
  22: '物不可以苟合而已',
  23: '贲穷则反',
  24: '物不可以终尽，剥穷上反下',
  25: '复则不妄',
  26: '有无妄然后可畜',
  27: '物畜然后可养',
  28: '不养则不可动',
  29: '物不可以终过',
  30: '陷必有所丽',
  31: '有天地然后有万物，有万物然后有男女',
  32: '夫妇之道不可以不久',
  33: '物不可以久居其所',
  34: '物不可以终遁',
  35: '物不可以终壮',
  36: '进必有所伤',
  37: '伤乎外者必反乎家',
  38: '家道穷必乖',
  39: '乖必有难',
  40: '物不可以终难',
  41: '解者缓也，缓必有所失',
  42: '损而不已必益',
  43: '益而不已必决',
  44: '决必有所遇',
  45: '妖之相遇后聚',
  46: '聚而上者谓之升',
  47: '升而不已必困',
  48: '困乎上者必反下',
  49: '井道不可不革',
  50: '革物者莫若鼎',
  51: '主器者莫若长子',
  52: '物不可以终动',
  53: '物不可以终止',
  54: '进必有所归',
  55: '得其所归者必大',
  56: '穷大者必失其居',
  57: '旅而无所容',
  58: '入而后说之',
  59: '说而后散之',
  60: '物不可以终离',
  61: '节而信之',
  62: '有其信者必行之',
  63: '有过物者必济',
  64: '物不可穷也'
};

export function getSequenceContext(hexagramNum) {
  const prevNum = hexagramNum > 1 ? hexagramNum - 1 : null;
  const nextNum = hexagramNum < 64 ? hexagramNum + 1 : null;
  return {
    prev: prevNum ? { hexagram: getHexagram(prevNum), xuGuaText: XU_GUA[hexagramNum] || null } : null,
    next: nextNum ? { hexagram: getHexagram(nextNum), xuGuaText: XU_GUA[nextNum] || null } : null,
  };
}
