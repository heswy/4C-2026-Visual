/**
 * 《木构千年》材分制计算模块
 * 实现《营造法式》材分制的完整计算逻辑
 * 
 * 核心概念：
 * - 1材 = 15份
 * - 材广:材厚 = 3:2
 * - 1材厚 = 10份 = 1斗口
 * - 足材 = 一材一栔 = 21份
 */

// ==================== 常量定义 ====================

const CAI_FEN_CONSTANTS = {
  // 材分制基本比例
  CAI_TO_FEN: 15,           // 1材 = 15份
  CAI_THICK_TO_FEN: 10,     // 1材厚 = 10份
  QI_TO_FEN: 6,             // 1栔 = 6份（高）
  QI_THICK_TO_FEN: 4,       // 1栔厚 = 4份
  ZU_CAI_TO_FEN: 21,        // 足材 = 21份（15+6）
  
  // 材广与材厚比例
  CAI_RATIO: {
    guang: 3,   // 材广（高）
    hou: 2      // 材厚（宽）
  },
  
  // 营造尺长度（毫米）- 唐代标准
  YING_ZAO_CHI: 298,
  
  // 寸到毫米的换算
  CUN_TO_MM: 29.8
};

// ==================== 八等材规格数据 ====================

const CAI_GRADES = {
  // 一等材：殿身9-11间
  1: {
    name: '一等材',
    caiGuang: 9,      // 材广（寸）
    caiHou: 6,        // 材厚（寸）
    fenValue: 6,      // 1份值（分）
    usage: '殿身9-11间',
    description: '最高等级，用于大型宫殿'
  },
  // 二等材：殿身5-7间
  2: {
    name: '二等材',
    caiGuang: 8.25,
    caiHou: 5.5,
    fenValue: 5.5,
    usage: '殿身5-7间',
    description: '大型建筑主材'
  },
  // 三等材：殿身3-5间
  3: {
    name: '三等材',
    caiGuang: 7.5,
    caiHou: 5,
    fenValue: 5,
    usage: '殿身3-5间',
    description: '中型殿宇'
  },
  // 四等材：殿身3间、厅堂7间
  4: {
    name: '四等材',
    caiGuang: 7.2,
    caiHou: 4.8,
    fenValue: 4.8,
    usage: '殿身3间、厅堂7间',
    description: '中小型殿宇'
  },
  // 五等材：殿身3间、厅堂5间
  5: {
    name: '五等材',
    caiGuang: 6.6,
    caiHou: 4.4,
    fenValue: 4.4,
    usage: '殿身3间、厅堂5间',
    description: '一般厅堂'
  },
  // 六等材：亭榭、小厅堂
  6: {
    name: '六等材',
    caiGuang: 6,
    caiHou: 4,
    fenValue: 4,
    usage: '亭榭、小厅堂',
    description: '小型建筑'
  },
  // 七等材：亭榭、小殿
  7: {
    name: '七等材',
    caiGuang: 5.25,
    caiHou: 3.5,
    fenValue: 3.5,
    usage: '亭榭、小殿',
    description: '园林建筑'
  },
  // 八等材：小亭榭、藻井
  8: {
    name: '八等材',
    caiGuang: 4.5,
    caiHou: 3,
    fenValue: 3,
    usage: '小亭榭、藻井',
    description: '装饰性构件'
  }
};

// ==================== 材分制计算类 ====================

class CaiFenSystem {
  /**
   * 创建材分制计算系统
   * @param {number} grade - 材等（1-8）
   * @param {number} yingZaoChi - 营造尺长度（毫米），默认298mm（唐尺）
   */
  constructor(grade = 2, yingZaoChi = 298) {
    this.grade = grade;
    this.yingZaoChi = yingZaoChi;
    this.cunToMm = yingZaoChi / 10;  // 1寸 = 营造尺/10
    
    const gradeData = CAI_GRADES[grade];
    if (!gradeData) {
      throw new Error(`无效的材等：${grade}，应为1-8`);
    }
    
    this.gradeData = gradeData;
    
    // 计算基础数值（毫米）
    this.caiGuangMm = gradeData.caiGuang * this.cunToMm;  // 材广（高）
    this.caiHouMm = gradeData.caiHou * this.cunToMm;      // 材厚（宽）
    this.fenValueMm = gradeData.fenValue * this.cunToMm / 10;  // 1份的毫米值
    
    // 斗口 = 材厚 = 10份
    this.douKouMm = this.caiHouMm;
  }

  // ==================== 基础换算方法 ====================
  
  /**
   * 份转毫米
   * @param {number} fen - 份数
   * @returns {number} 毫米值
   */
  fenToMm(fen) {
    return fen * this.fenValueMm;
  }
  
  /**
   * 毫米转份
   * @param {number} mm - 毫米值
   * @returns {number} 份数
   */
  mmToFen(mm) {
    return mm / this.fenValueMm;
  }
  
  /**
   * 寸转毫米
   * @param {number} cun - 寸数
   * @returns {number} 毫米值
   */
  cunToMillimeter(cun) {
    return cun * this.cunToMm;
  }
  
  /**
   * 毫米转寸
   * @param {number} mm - 毫米值
   * @returns {number} 寸数
   */
  mmToCun(mm) {
    return mm / this.cunToMm;
  }
  
  /**
   * 份转材
   * @param {number} fen - 份数
   * @returns {number} 材数
   */
  fenToCai(fen) {
    return fen / CAI_FEN_CONSTANTS.CAI_TO_FEN;
  }
  
  /**
   * 材转份
   * @param {number} cai - 材数
   * @returns {number} 份数
   */
  caiToFen(cai) {
    return cai * CAI_FEN_CONSTANTS.CAI_TO_FEN;
  }
  
  /**
   * 计算足材（一材一栔）
   * @returns {number} 足材高度（份）
   */
  getZuCaiFen() {
    return CAI_FEN_CONSTANTS.ZU_CAI_TO_FEN;
  }
  
  /**
   * 计算足材（毫米）
   * @returns {number} 足材高度（毫米）
   */
  getZuCaiMm() {
    return this.fenToMm(CAI_FEN_CONSTANTS.ZU_CAI_TO_FEN);
  }

  // ==================== 斗栱构件尺寸计算 ====================
  
  /**
   * 计算栌斗（坐斗）尺寸
   * @param {boolean} isCorner - 是否为角柱栌斗
   * @returns {Object} 栌斗尺寸
   */
  calcLuDou(isCorner = false) {
    const length = isCorner ? 36 : 32;  // 长与广
    const height = 20;  // 总高
    const douEr = 8;    // 斗耳
    const douPing = 4;  // 斗平
    const douQi = 8;    // 斗欹
    const kouWidth = 10;  // 开口宽度（斗口）
    const kouDepth = 8;   // 开口深度
    
    return {
      name: isCorner ? '角柱栌斗' : '柱头栌斗',
      length: { fen: length, mm: this.fenToMm(length) },      // 长
      width: { fen: length, mm: this.fenToMm(length) },       // 广（宽）
      height: { fen: height, mm: this.fenToMm(height) },      // 总高
      douEr: { fen: douEr, mm: this.fenToMm(douEr) },         // 斗耳
      douPing: { fen: douPing, mm: this.fenToMm(douPing) },   // 斗平
      douQi: { fen: douQi, mm: this.fenToMm(douQi) },         // 斗欹
      kouWidth: { fen: kouWidth, mm: this.fenToMm(kouWidth) }, // 开口宽
      kouDepth: { fen: kouDepth, mm: this.fenToMm(kouDepth) }, // 开口深
      isCorner
    };
  }
  
  /**
   * 计算华栱（跳栱）尺寸
   * @param {number} tiaoCount - 跳数
   * @param {boolean} isZuCai - 是否为足材华栱
   * @returns {Object} 华栱尺寸
   */
  calcHuaGong(tiaoCount = 1, isZuCai = true) {
    // 每跳出跳30份（心不过30份）
    const chuTiao = 30;
    // 第一跳华栱总长62份，之后每跳增加
    const baseLength = 62;
    const incrementPerTiao = 21;  // 每跳增加21份（单侧）
    
    const length = baseLength + (tiaoCount - 1) * incrementPerTiao * 2;
    const height = isZuCai ? 21 : 15;  // 足材21份，单材15份
    const width = 10;  // 华栱宽 = 材厚 = 10份
    const chuTiaoFen = tiaoCount * chuTiao;
    
    return {
      name: `华栱（${tiaoCount}跳）`,
      tiaoCount,
      length: { fen: length, mm: this.fenToMm(length) },
      width: { fen: width, mm: this.fenToMm(width) },
      height: { fen: height, mm: this.fenToMm(height) },
      chuTiao: { fen: chuTiaoFen, mm: this.fenToMm(chuTiaoFen) },
      isZuCai
    };
  }
  
  /**
   * 计算横栱尺寸
   * @param {string} type - 横栱类型：'niDao'（泥道栱）|'guaZi'（瓜子栱）|'ling'（令栱）|'man'（慢栱）
   * @returns {Object} 横栱尺寸
   */
  calcHengGong(type = 'niDao') {
    const typeMap = {
      niDao: { name: '泥道栱', length: 62 },
      guaZi: { name: '瓜子栱', length: 62 },
      ling: { name: '令栱', length: 72 },
      man: { name: '慢栱', length: 92 }
    };
    
    const config = typeMap[type];
    if (!config) {
      throw new Error(`无效的横栱类型：${type}`);
    }
    
    const height = 15;  // 单材高
    const width = 10;   // 材厚
    
    return {
      name: config.name,
      type,
      length: { fen: config.length, mm: this.fenToMm(config.length) },
      width: { fen: width, mm: this.fenToMm(width) },
      height: { fen: height, mm: this.fenToMm(height) }
    };
  }
  
  /**
   * 计算小斗尺寸
   * @param {string} type - 小斗类型：'jiaoHu'（交互斗）|'qiXin'（齐心斗）|'san'（散斗）
   * @returns {Object} 小斗尺寸
   */
  calcXiaoDou(type = 'jiaoHu') {
    const typeMap = {
      jiaoHu: { name: '交互斗', frontWidth: 18, sideWidth: 16 },
      qiXin: { name: '齐心斗', frontWidth: 16, sideWidth: 16 },
      san: { name: '散斗', frontWidth: 14, sideWidth: 16 }
    };
    
    const config = typeMap[type];
    if (!config) {
      throw new Error(`无效的小斗类型：${type}`);
    }
    
    const height = 10;
    
    return {
      name: config.name,
      type,
      height: { fen: height, mm: this.fenToMm(height) },
      frontWidth: { fen: config.frontWidth, mm: this.fenToMm(config.frontWidth) },
      sideWidth: { fen: config.sideWidth, mm: this.fenToMm(config.sideWidth) }
    };
  }
  
  /**
   * 计算昂（下昂）尺寸
   * @param {number} tiaoCount - 跳数
   * @returns {Object} 昂尺寸
   */
  calcAng(tiaoCount = 1) {
    // 下昂斜度：平出47份，抬高21份
    const pingChu = 47 * tiaoCount;
    const taiGao = 21 * tiaoCount;
    const length = Math.sqrt(pingChu * pingChu + taiGao * taiGao);  // 斜长
    const height = 15;  // 单材高
    const width = 10;   // 材厚
    
    return {
      name: `下昂（${tiaoCount}跳）`,
      tiaoCount,
      pingChu: { fen: pingChu, mm: this.fenToMm(pingChu) },
      taiGao: { fen: taiGao, mm: this.fenToMm(taiGao) },
      length: { fen: Math.round(length), mm: this.fenToMm(length) },
      width: { fen: width, mm: this.fenToMm(width) },
      height: { fen: height, mm: this.fenToMm(height) }
    };
  }

  // ==================== 柱梁尺寸计算 ====================
  
  /**
   * 计算柱径
   * @param {string} type - 柱类型：'dian'（殿柱）|'tingTang'（厅堂柱）
   * @param {number} caiCount - 材数（2.5材 = 2材2栔）
   * @returns {Object} 柱尺寸
   */
  calcZhu(type = 'dian', caiCount = 2.5) {
    const typeMap = {
      dian: { name: '殿柱', range: '2材2栔至3材' },
      tingTang: { name: '厅堂柱', range: '2材1栔' }
    };
    
    const config = typeMap[type];
    const diameter = this.caiToFen(caiCount);
    
    return {
      name: config.name,
      type,
      diameter: { fen: diameter, mm: this.fenToMm(diameter) },
      range: config.range
    };
  }
  
  /**
   * 计算柱高
   * @param {number} kaiJianFen - 开间宽度（份）
   * @returns {Object} 柱高
   */
  calcZhuGao(kaiJianFen = 240) {
    // 柱高一般与明间开间相等
    return {
      name: '柱高',
      height: { fen: kaiJianFen, mm: this.fenToMm(kaiJianFen) },
      note: '一般与明间开间相等'
    };
  }
  
  /**
   * 计算角梁尺寸
   * @returns {Object} 角梁尺寸
   */
  calcJiaoLiang() {
    const guang = 28;  // 广28份
    const height = 20; // 高约20份
    
    return {
      name: '大角梁',
      guang: { fen: guang, mm: this.fenToMm(guang) },
      height: { fen: height, mm: this.fenToMm(height) }
    };
  }

  // ==================== 屋架举折计算 ====================
  
  /**
   * 计算举折
   * @param {number} totalJu - 总举高（份）
   * @param {number} zheCount - 折数
   * @returns {Object} 举折数据
   */
  calcJuZhe(totalJu = 231, zheCount = 5) {
    // 唐式举折：先定总举，然后分层折下
    const zheValues = [];
    let remaining = totalJu;
    
    // 简化算法：每层递减
    for (let i = 0; i < zheCount; i++) {
      const zhe = Math.round(remaining * 0.1);
      remaining -= zhe;
      zheValues.push({
        level: i + 1,
        zhe: { fen: zhe, mm: this.fenToMm(zhe) },
        remaining: { fen: remaining, mm: this.fenToMm(remaining) }
      });
    }
    
    return {
      name: '举折',
      totalJu: { fen: totalJu, mm: this.fenToMm(totalJu) },
      zheCount,
      zheValues,
      finalHeight: { fen: remaining, mm: this.fenToMm(remaining) }
    };
  }
  
  /**
   * 计算槫距
   * @param {number} beiShu - 倍数（7倍材广或5倍足材）
   * @returns {Object} 槫距
   */
  calcLinJu(beiShu = 7) {
    // 槫距 = 7倍材广 = 7 * 15 = 105份
    // 或 = 5倍足材 = 5 * 21 = 105份
    const distance = beiShu === 7 ? 105 : beiShu * 21;
    
    return {
      name: '槫距',
      distance: { fen: distance, mm: this.fenToMm(distance) },
      beiShu,
      note: beiShu === 7 ? '7倍材广' : `${beiShu}倍足材`
    };
  }

  // ==================== 信息获取 ====================
  
  /**
   * 获取系统信息
   * @returns {Object} 系统信息
   */
  getInfo() {
    return {
      grade: this.grade,
      gradeName: this.gradeData.name,
      yingZaoChi: this.yingZaoChi,
      cunToMm: this.cunToMm,
      caiGuangMm: this.caiGuangMm,
      caiHouMm: this.caiHouMm,
      fenValueMm: this.fenValueMm,
      douKouMm: this.douKouMm,
      zuCaiMm: this.getZuCaiMm(),
      description: this.gradeData.description,
      usage: this.gradeData.usage
    };
  }
  
  /**
   * 获取完整的斗栱构件尺寸
   * @returns {Object} 所有斗栱构件尺寸
   */
  getDouGongSizes() {
    return {
      luDou: this.calcLuDou(false),
      jiaoLuDou: this.calcLuDou(true),
      huaGong1: this.calcHuaGong(1, true),
      huaGong2: this.calcHuaGong(2, true),
      niDaoGong: this.calcHengGong('niDao'),
      guaZiGong: this.calcHengGong('guaZi'),
      lingGong: this.calcHengGong('ling'),
      manGong: this.calcHengGong('man'),
      jiaoHuDou: this.calcXiaoDou('jiaoHu'),
      qiXinDou: this.calcXiaoDou('qiXin'),
      sanDou: this.calcXiaoDou('san'),
      xiaAng: this.calcAng(1)
    };
  }
}

// ==================== 静态工具函数 ====================

/**
 * 获取所有材等规格
 * @returns {Object} 八等材规格
 */
function getCaiGrades() {
  return CAI_GRADES;
}

/**
 * 创建特定建筑的材分制系统
 * @param {string} buildingName - 建筑名称
 * @returns {CaiFenSystem} 材分制系统实例
 */
function createBuildingSystem(buildingName) {
  const buildingConfigs = {
    // 佛光寺东大殿：一等材，营造尺298mm
    '佛光寺东大殿': { grade: 1, yingZaoChi: 298, fenValue: 21 },
    // 南禅寺大殿：二等材，营造尺300mm
    '南禅寺大殿': { grade: 2, yingZaoChi: 300, fenValue: 16.5 },
    // 应县木塔：二等材
    '应县木塔': { grade: 2, yingZaoChi: 300, fenValue: 16.5 },
    // 晋祠圣母殿：三等材
    '晋祠圣母殿': { grade: 3, yingZaoChi: 300, fenValue: 15 },
    // 故宫太和殿：八等材（相当于）
    '故宫太和殿': { grade: 8, yingZaoChi: 320, fenValue: 9.6 }
  };
  
  const config = buildingConfigs[buildingName];
  if (!config) {
    throw new Error(`未知建筑：${buildingName}`);
  }
  
  return new CaiFenSystem(config.grade, config.yingZaoChi);
}

/**
 * 材分换算器
 * @param {number} value - 数值
 * @param {string} fromUnit - 源单位：'fen'|'cai'|'cun'|'mm'
 * @param {string} toUnit - 目标单位：'fen'|'cai'|'cun'|'mm'
 * @param {number} grade - 材等
 * @param {number} yingZaoChi - 营造尺
 * @returns {number} 换算结果
 */
function convert(value, fromUnit, toUnit, grade = 2, yingZaoChi = 298) {
  const system = new CaiFenSystem(grade, yingZaoChi);
  
  // 先转为毫米
  let mm;
  switch (fromUnit) {
    case 'fen':
      mm = system.fenToMm(value);
      break;
    case 'cai':
      mm = system.fenToMm(system.caiToFen(value));
      break;
    case 'cun':
      mm = system.cunToMm(value);
      break;
    case 'mm':
      mm = value;
      break;
    default:
      throw new Error(`无效的单位：${fromUnit}`);
  }
  
  // 再转为目标单位
  switch (toUnit) {
    case 'fen':
      return system.mmToFen(mm);
    case 'cai':
      return system.fenToCai(system.mmToFen(mm));
    case 'cun':
      return system.mmToCun(mm);
    case 'mm':
      return mm;
    default:
      throw new Error(`无效的单位：${toUnit}`);
  }
}

// ==================== 导出 ====================

if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = {
    CaiFenSystem,
    CAI_GRADES,
    CAI_FEN_CONSTANTS,
    getCaiGrades,
    createBuildingSystem,
    convert
  };
} else {
  // 浏览器环境
  window.CaiFenSystem = CaiFenSystem;
  window.CAI_GRADES = CAI_GRADES;
  window.CAI_FEN_CONSTANTS = CAI_FEN_CONSTANTS;
  window.getCaiGrades = getCaiGrades;
  window.createBuildingSystem = createBuildingSystem;
  window.convert = convert;
}
