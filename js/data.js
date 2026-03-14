/**
 * 《木构千年》建筑数据模块
 * 包含佛光寺东大殿、南禅寺大殿等唐代建筑的参数化数据
 */

// ==================== 佛光寺东大殿数据 ====================

const FO_GUANG_SI = {
  name: '佛光寺东大殿',
  nameEn: 'East Hall of Foguang Temple',
  
  // 基本信息
  info: {
    buildYear: 857,                    // 建造年份
    dynasty: '唐',                      // 朝代
    reignTitle: '大中十一年',           // 年号
    location: '山西省五台县佛光新村',    // 地理位置
    significance: '中国现存规模最大、保存最完整的唐代木构建筑',
    surveyUnit: '山西省古建筑保护研究所（2004年）、清华大学（2005-2006年）',
    surveyTech: '手工测绘 + 三维激光扫描'
  },
  
  // 营造尺复原
  yingZaoChi: {
    length: 298,                       // 营造尺长度（毫米）
    cun: 29.8                          // 1寸（毫米）
  },
  
  // 材分制参数
  caiFenSystem: {
    grade: 1,                          // 一等材
    caiHou: 210,                       // 材厚（毫米）= 7寸
    fenValue: 21,                      // 1份（毫米）
    caiGuang: 315,                     // 材广（毫米）≈15份
    zuCai: 441,                        // 足材高（毫米）= 21份
    ratio: {
      caiGuang: 15,                    // 材广 = 15份
      caiHou: 10,                      // 材厚 = 10份
      qi: 6,                           // 栔高 = 6份
      qiHou: 4                         // 栔厚 = 4份
    }
  },
  
  // 平面尺寸
  plan: {
    mingJian: {                        // 明间
      kaiJian: { mm: 5040, chi: 16.91, fen: 240 },
      note: '约17尺'
    },
    ciJian: {                          // 次间
      kaiJian: { mm: 5040, chi: 16.91, fen: 240 },
      note: '与明间相同'
    },
    shaoJian: {                        // 稍间
      kaiJian: { mm: 4405, chi: 14.77, fen: 210 },
      range: { min: 4400, max: 4410 },
      note: '约14.8尺'
    },
    jinShen: {                         // 进深各间
      kaiJian: { mm: 4400, chi: 14.77, fen: 210 },
      note: '四间'
    },
    tongMianKuo: {                     // 通面阔
      mm: 34000,
      jianCount: 7,
      note: '七间'
    },
    tongJinShen: {                     // 通进深
      mm: 17600,
      jianCount: 4,
      note: '四间'
    }
  },
  
  // 柱高数据
  columns: {
    pingZhu: {                         // 平柱
      height: { mm: 4991.2, chi: 16.74, fen: 238 },
      ideal: { mm: 4987.5, chi: 16.74, fen: 237.5 },
      note: '次间外缝檐柱'
    },
    standard: {                        // 标准柱高
      height: { mm: 5040, chi: 17, fen: 240 },
      note: '与明间开间相等'
    },
    shengQi: {                         // 生起（角柱增高）
      value: 2.5,                      // 份
      mm: 52.5,
      note: '较平柱增高'
    },
    ceJiao: {                          // 侧脚
      value: '约1%',                   // 柱头内收比例
      note: '檐柱侧脚'
    }
  },
  
  // 斗栱尺寸
  douGong: {
    caiHou: { mm: 210, fen: 10 },      // 斗栱材宽 = 7寸 = 10份
    
    // 华栱
    huaGong: {
      firstTiao: {
        totalLength: { fen: 62 },
        chuTiao: { fen: 26, note: '内外跳相同' },
        height: { fen: 15 },
        width: { fen: 10 }
      },
      increment: { fen: 21, note: '每跳增加21份（单侧）' }
    },
    
    // 下昂
    xiaAng: {
      pingChu: { fen: 47, note: '平出' },
      taiGao: { fen: 21, note: '抬高' },
      ratio: '47:21',
      note: '昂制斜度等于总举斜度'
    },
    
    // 外槽双下昂
    waiCaoShuangXiaAng: {
      chuTiao: { fen: 47 }
    },
    
    // 外檐铺作总高
    waiYanPuZuo: {
      height: { mm: 2457, fen: 117 }
    }
  },
  
  // 屋架举折
  roof: {
    zongJu: {                          // 总举高
      mm: 4851,
      fen: 231,
      note: '基本昂制斜度的11倍'
    },
    angRatio: {                        // 昂制比例
      pingChu: 47,
      taiGao: 21,
      beiShu: 11,
      note: '总举 = 昂制斜度 × 11'
    },
    linJu: {                           // 槫距
      mm: 2205,
      fen: 105,
      note: '7倍材广/5倍足材'
    },
    liaoYanLin: {                      // 橑檐槫出跳
      mm: 1974,
      fen: 94
    },
    zhongPingLin: {                    // 中平槫高度
      note: '中平槫到柱头的高度等于总举高',
      height: { fen: 231 }
    }
  },
  
  // 设计规律总结
  designRules: [
    '"昂制"规律：斗栱下昂斜度等于总举斜度，基本斜度为"平出47分，抬高21分"',
    '总举为基本昂制斜度的11倍',
    '中平槫到柱头的高度等于总举高',
    '当心五间开间与标准柱高均为17尺，稍间、进深各间为14.8尺'
  ],
  
  // 材分速查表
  quickReference: {
    mingJianKaiJian: 240,              // 明间开间 = 240份
    ciJianKaiJian: 240,                // 次间开间 = 240份
    shaoJianKaiJian: 210,              // 稍间开间 = 210份
    jinShenJian: 210,                  // 进深各间 = 210份
    pingZhuGao: 238,                   // 平柱高 ≈ 238份
    biaoZhunZhuGao: 240,               // 标准柱高 = 240份
    zongJu: 231,                       // 总举高 = 231份
    waiYanPuZuoGao: 117                // 外檐铺作总高 = 117份
  }
};

// ==================== 南禅寺大殿数据 ====================

const NAN_CHAN_SI = {
  name: '南禅寺大殿',
  nameEn: 'Main Hall of Nanchan Temple',
  
  // 基本信息
  info: {
    buildYear: 782,                    // 建造年份
    dynasty: '唐',                      // 朝代
    reignTitle: '建中三年',             // 年号
    location: '山西省五台县',           // 地理位置
    significance: '中国现存最早木构建筑，比佛光寺早75年',
    surveyTech: '三维扫描切片测量'
  },
  
  // 营造尺复原
  yingZaoChi: {
    length: 300,                       // 营造尺长度（毫米）
    cun: 30                            // 1寸（毫米）
  },
  
  // 材分制参数
  caiFenSystem: {
    grade: 2,                          // 二等材（五寸五分材）
    caiHou: 165,                       // 材厚（毫米）= 5.5寸
    fenValue: 16.5,                    // 1份（毫米）
    caiGuang: 247.5,                   // 材广（毫米）≈15份
    note: '单材材厚165mm'
  },
  
  // 平面尺寸
  plan: {
    mianKuo: { mm: 11750, chi: 39.17 }, // 面阔
    jinShen: { mm: 10000, chi: 33.33 }, // 进深
    jianCount: 3,                       // 三间
    form: '近方形',
    roof: '单檐歇山'
  },
  
  // 开间设计（材分表达）
  kaiJian: {
    mingJian: { fen: 300, chi: 16.5 },  // 明间开间
    ciJian: { fen: 200, chi: 11 },      // 次间开间
    jinShenJian: { fen: 200, chi: 11 }  // 进深各间
  },
  
  // 柱数据
  columns: {
    pingZhuGao: { chi: 13 },            // 平柱高
    zhuJing: { fen: 24 },               // 柱径
    shengQi: { fen: 2 },                // 角柱生起
    ceJiao: true
  },
  
  // 斗栱特点
  douGong: {
    note: '里跳长于外跳，是工匠出于结构稳定性的优化设计',
    
    // 外跳
    waiTiao: {
      firstTiao: { fen: 27 },           // 第一跳华栱
      secondTiao: { fen: 20 }           // 第二跳华栱
    },
    
    // 里跳（前后檐）
    liTiaoQianHou: {
      firstTiao: { fen: 32 }
    },
    
    // 里跳（山面）
    liTiaoShanMian: {
      firstTiao: { fen: 35 },
      secondTiao: { fen: 22 }
    }
  }
};

// ==================== 应县木塔数据 ====================

const YING_XIAN_MU_TA = {
  name: '应县木塔',
  nameEn: 'Wooden Pagoda of Ying County',
  fullName: '佛宫寺释迦塔',
  
  // 基本信息
  info: {
    buildYear: 1056,                   // 建造年份
    dynasty: '辽',                      // 朝代
    reignTitle: '清宁二年',             // 年号
    location: '山西省应县',             // 地理位置
    significance: '现存最高木构建筑',
    height: 65.84,                     // 塔高（米）
    externalLayers: 5,                 // 外观层数
    internalLayers: 9                  // 内部层数（含4个暗层）
  },
  
  // 结构特点
  structure: {
    form: '八角形',
    baseDiameter: 30.27,               // 底层直径（米）
    caiGrade: 2,                       // 二等材
    caiGuang: 260,                     // 材广（毫米）
    caiHou: 170,                       // 材厚（毫米）
    douGongTypes: 54,                  // 斗栱种类
    douGongCount: 480,                 // 斗栱总数
    
    features: [
      '双层套筒：外槽+内槽柱网',
      '暗层加固：4个暗层设斜撑，形成桁架',
      '柔性结构：斗栱节点可耗能减震',
      '自振频率：0.635Hz（第1振型）'
    ]
  }
};

// ==================== 晋祠圣母殿数据 ====================

const JIN_CI_SHENG_MU_DIAN = {
  name: '晋祠圣母殿',
  nameEn: 'Hall of Saintly Mother, Jinci Temple',
  
  // 基本信息
  info: {
    buildYear: '1023-1032',            // 建造年份
    dynasty: '宋',                      // 朝代
    location: '山西省太原市',           // 地理位置
    significance: '宋式美学代表'
  },
  
  // 材分制
  caiFenSystem: {
    grade: 3,                          // 三等材
    note: '材广4-5寸'
  }
};

// ==================== 故宫太和殿数据 ====================

const GU_GONG_TAI_HE_DIAN = {
  name: '故宫太和殿',
  nameEn: 'Hall of Supreme Harmony',
  
  // 基本信息
  info: {
    buildYear: 1420,                   // 建造年份（重建）
    dynasty: '明',                      // 朝代
    location: '北京',                   // 地理位置
    significance: '明清官式最高等级'
  },
  
  // 平面尺寸
  plan: {
    mianKuoJian: 11,                   // 面阔11间
    jinShenJian: 5,                    // 进深5间
    tongMianKuo: 63.96,                // 通面阔（米）
    tongJinShen: 37.17                 // 通进深（米）
  },
  
  // 材分制（清式斗口制）
  caiFenSystem: {
    grade: 8,                          // 相当于宋式八等材
    douKou: 4,                         // 斗口约4寸
    note: '清式斗口制取代材分制'
  },
  
  // 屋顶
  roof: {
    form: '重檐庑殿',
    level: '最高等级'
  }
};

// ==================== 历代建筑对比数据 ====================

const DYNASTY_COMPARISON = {
  tang: {
    dynasty: '唐代',
    style: '雄浑大气',
    roofSlope: '平缓',
    chuYan: '深远',
    douGongScale: '硕大（柱高1/2）',
    douGongFunction: '结构为主',
    columns: '粗壮，有侧脚生起',
    doorsWindows: '板门、直棂窗',
    paintings: '简洁（朱白为主）',
    caiFenSystem: '材分制成熟',
    caiGrade: '一等至二等',
    examples: ['佛光寺东大殿', '南禅寺大殿']
  },
  
  song: {
    dynasty: '宋代',
    style: '柔和秀丽',
    roofSlope: '逐渐加高',
    chuYan: '适中',
    douGongScale: '中等（柱高1/3）',
    douGongFunction: '结构+装饰',
    columns: '较细，侧脚生起明显',
    doorsWindows: '格扇门、格子窗',
    paintings: '丰富（五彩遍装）',
    caiFenSystem: '《营造法式》规范',
    caiGrade: '二等至四等',
    examples: ['晋祠圣母殿']
  },
  
  mingQing: {
    dynasty: '明代/清代',
    style: '严谨稳重',
    roofSlope: '较陡',
    chuYan: '较浅',
    douGongScale: '小（柱高1/5-1/6）',
    douGongFunction: '装饰为主',
    columns: '规整，侧脚较小',
    doorsWindows: '隔扇、槛窗',
    paintings: '华丽（和玺、旋子）',
    caiFenSystem: '斗口制取代材分制',
    caiGrade: '相当于五等以下',
    examples: ['故宫太和殿']
  }
};

// ==================== 材分演变数据 ====================

const CAI_FEN_EVOLUTION = [
  {
    period: '唐（佛光寺）',
    caiHou: 210,
    caiGrade: '一等材',
    trend: '用材硕大'
  },
  {
    period: '唐（南禅寺）',
    caiHou: 165,
    caiGrade: '二等材',
    trend: '-'
  },
  {
    period: '辽（应县木塔）',
    caiHou: 170,
    caiGrade: '二等材',
    trend: '延续唐风'
  },
  {
    period: '宋（晋祠）',
    caiHou: 150,
    caiGrade: '三等材',
    trend: '开始减小'
  },
  {
    period: '明初（太和殿）',
    caiHou: 128,
    caiGrade: '八等材',
    trend: '急剧缩小'
  },
  {
    period: '明（武当山紫霄宫）',
    caiHou: 80,
    caiGrade: '等外材',
    trend: '-'
  },
  {
    period: '清（中和殿）',
    caiHou: 80,
    caiGrade: '等外材',
    trend: '最小'
  }
];

// ==================== 建筑列表 ====================

const BUILDINGS = {
  foGuangSi: FO_GUANG_SI,
  nanChanSi: NAN_CHAN_SI,
  yingXianMuTa: YING_XIAN_MU_TA,
  jinCiShengMuDian: JIN_CI_SHENG_MU_DIAN,
  guGongTaiHeDian: GU_GONG_TAI_HE_DIAN
};

// ==================== 工具函数 ====================

/**
 * 获取建筑数据
 * @param {string} name - 建筑名称（中文或英文key）
 * @returns {Object} 建筑数据
 */
function getBuilding(name) {
  const nameMap = {
    '佛光寺东大殿': 'foGuangSi',
    '佛光寺': 'foGuangSi',
    '南禅寺大殿': 'nanChanSi',
    '南禅寺': 'nanChanSi',
    '应县木塔': 'yingXianMuTa',
    '木塔': 'yingXianMuTa',
    '晋祠圣母殿': 'jinCiShengMuDian',
    '晋祠': 'jinCiShengMuDian',
    '故宫太和殿': 'guGongTaiHeDian',
    '太和殿': 'guGongTaiHeDian'
  };
  
  const key = nameMap[name] || name;
  return BUILDINGS[key] || null;
}

/**
 * 获取所有建筑列表
 * @returns {Array} 建筑列表
 */
function getBuildingList() {
  return Object.values(BUILDINGS).map(b => ({
    name: b.name,
    nameEn: b.nameEn,
    dynasty: b.info.dynasty,
    year: b.info.buildYear,
    location: b.info.location
  }));
}

/**
 * 按朝代获取建筑
 * @param {string} dynasty - 朝代（唐/宋/辽/明/清）
 * @returns {Array} 建筑列表
 */
function getBuildingsByDynasty(dynasty) {
  return Object.values(BUILDINGS).filter(b => 
    b.info.dynasty === dynasty
  );
}

/**
 * 获取材分演变数据
 * @returns {Array} 演变数据
 */
function getCaiFenEvolution() {
  return CAI_FEN_EVOLUTION;
}

/**
 * 获取历代对比数据
 * @returns {Object} 对比数据
 */
function getDynastyComparison() {
  return DYNASTY_COMPARISON;
}

/**
 * 生成佛光寺东大殿的完整参数化数据
 * @returns {Object} 完整参数化数据
 */
function generateFoGuangSiParams() {
  const data = FO_GUANG_SI;
  const cf = data.caiFenSystem;
  
  return {
    name: data.name,
    info: data.info,
    
    // 材分系统
    caiFenSystem: {
      grade: cf.grade,
      fenValue: cf.fenValue,
      caiGuang: cf.caiGuang,
      caiHou: cf.caiHou,
      zuCai: cf.zuCai,
      ratio: cf.ratio
    },
    
    // 平面参数
    plan: {
      mingJian: data.plan.mingJian.kaiJian.fen,
      ciJian: data.plan.ciJian.kaiJian.fen,
      shaoJian: data.plan.shaoJian.kaiJian.fen,
      jinShen: data.plan.jinShen.kaiJian.fen,
      tongMianKuo: data.plan.tongMianKuo.mm,
      tongJinShen: data.plan.tongJinShen.mm
    },
    
    // 柱参数
    columns: {
      pingZhuGao: data.columns.pingZhu.height.fen,
      biaoZhunZhuGao: data.columns.standard.height.fen,
      shengQi: data.columns.shengQi.value,
      ceJiao: data.columns.ceJiao.value
    },
    
    // 斗栱参数
    douGong: {
      caiHou: data.douGong.caiHou.fen,
      huaGongFirstTiao: data.douGong.huaGong.firstTiao.totalLength.fen,
      huaGongChuTiao: data.douGong.huaGong.firstTiao.chuTiao.fen,
      xiaAngPingChu: data.douGong.xiaAng.pingChu.fen,
      xiaAngTaiGao: data.douGong.xiaAng.taiGao.fen,
      waiYanPuZuoGao: data.douGong.waiYanPuZuo.height.fen
    },
    
    // 屋架参数
    roof: {
      zongJu: data.roof.zongJu.fen,
      linJu: data.roof.linJu.fen,
      liaoYanLin: data.roof.liaoYanLin.fen
    },
    
    // 设计规律
    designRules: data.designRules
  };
}

// ==================== 导出 ====================

if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = {
    FO_GUANG_SI,
    NAN_CHAN_SI,
    YING_XIAN_MU_TA,
    JIN_CI_SHENG_MU_DIAN,
    GU_GONG_TAI_HE_DIAN,
    BUILDINGS,
    DYNASTY_COMPARISON,
    CAI_FEN_EVOLUTION,
    getBuilding,
    getBuildingList,
    getBuildingsByDynasty,
    getCaiFenEvolution,
    getDynastyComparison,
    generateFoGuangSiParams
  };
} else {
  // 浏览器环境
  window.FO_GUANG_SI = FO_GUANG_SI;
  window.NAN_CHAN_SI = NAN_CHAN_SI;
  window.YING_XIAN_MU_TA = YING_XIAN_MU_TA;
  window.JIN_CI_SHENG_MU_DIAN = JIN_CI_SHENG_MU_DIAN;
  window.GU_GONG_TAI_HE_DIAN = GU_GONG_TAI_HE_DIAN;
  window.BUILDINGS = BUILDINGS;
  window.DYNASTY_COMPARISON = DYNASTY_COMPARISON;
  window.CAI_FEN_EVOLUTION = CAI_FEN_EVOLUTION;
  window.getBuilding = getBuilding;
  window.getBuildingList = getBuildingList;
  window.getBuildingsByDynasty = getBuildingsByDynasty;
  window.getCaiFenEvolution = getCaiFenEvolution;
  window.getDynastyComparison = getDynastyComparison;
  window.generateFoGuangSiParams = generateFoGuangSiParams;
}
