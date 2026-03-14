/**
 * 《木构千年》参数化计算模块 - Node.js 示例
 * 
 * 运行方式：node example.js
 */

const { CaiFenSystem, getCaiGrades, createBuildingSystem, convert } = require('./caiFen.js');
const { getBuilding, getBuildingList, generateFoGuangSiParams } = require('./data.js');

console.log('═══════════════════════════════════════════════════════════');
console.log('           《木构千年》参数化计算模块 - 使用示例');
console.log('═══════════════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════
// 示例1：八等材规格
// ═══════════════════════════════════════════════════════════
console.log('【示例1】八等材规格表');
console.log('───────────────────────────────────────────────────────────');

const grades = getCaiGrades();
console.log('材等\t材广(寸)\t材厚(寸)\t1份值(分)\t应用范围');
console.log('───────────────────────────────────────────────────────────');

for (let i = 1; i <= 8; i++) {
  const g = grades[i];
  console.log(`${g.name}\t${g.caiGuang}\t\t${g.caiHou}\t\t${g.fenValue}\t\t${g.usage}`);
}

// ═══════════════════════════════════════════════════════════
// 示例2：创建材分制系统
// ═══════════════════════════════════════════════════════════
console.log('\n\n【示例2】创建材分制系统（佛光寺东大殿 - 一等材）');
console.log('───────────────────────────────────────────────────────────');

const foGuangSiSystem = new CaiFenSystem(1, 298);
const info = foGuangSiSystem.getInfo();

console.log('系统信息：');
console.log(`  - 材等：${info.gradeName}`);
console.log(`  - 营造尺：${info.yingZaoChi}mm`);
console.log(`  - 1寸：${info.cunToMm.toFixed(1)}mm`);
console.log(`  - 材广（高）：${info.caiGuangMm.toFixed(1)}mm`);
console.log(`  - 材厚（宽）：${info.caiHouMm.toFixed(1)}mm`);
console.log(`  - 1份值：${info.fenValueMm.toFixed(1)}mm`);
console.log(`  - 斗口：${info.douKouMm.toFixed(1)}mm`);
console.log(`  - 足材高：${info.zuCaiMm.toFixed(1)}mm`);

// ═══════════════════════════════════════════════════════════
// 示例3：单位换算
// ═══════════════════════════════════════════════════════════
console.log('\n\n【示例3】单位换算');
console.log('───────────────────────────────────────────────────────────');

const system = new CaiFenSystem(1, 298);

console.log('佛光寺东大殿单位换算（一等材，营造尺298mm）：');
console.log(`  240份 = ${system.fenToMm(240).toFixed(1)}mm （明间开间）`);
console.log(`  210份 = ${system.fenToMm(210).toFixed(1)}mm （稍间开间）`);
console.log(`  5040mm = ${system.mmToFen(5040).toFixed(1)}份`);
console.log(`  17寸 = ${system.cunToMillimeter(17).toFixed(1)}mm`);
console.log(`  1材 = ${system.caiToFen(1)}份`);
console.log(`  21份 = ${system.fenToCai(21).toFixed(2)}材（足材）`);

// 使用通用换算函数
console.log('\n通用换算函数 convert()：');
console.log(`  convert(240, 'fen', 'mm', 1, 298) = ${convert(240, 'fen', 'mm', 1, 298).toFixed(1)}mm`);
console.log(`  convert(5040, 'mm', 'fen', 1, 298) = ${convert(5040, 'mm', 'fen', 1, 298).toFixed(1)}份`);

// ═══════════════════════════════════════════════════════════
// 示例4：斗栱构件计算
// ═══════════════════════════════════════════════════════════
console.log('\n\n【示例4】斗栱构件尺寸计算');
console.log('───────────────────────────────────────────────────────────');

// 栌斗
const luDou = system.calcLuDou(false);
console.log('\n1. 栌斗（柱头栌斗）：');
console.log(`   长/广：${luDou.length.fen}份 = ${luDou.length.mm.toFixed(1)}mm`);
console.log(`   高：${luDou.height.fen}份 = ${luDou.height.mm.toFixed(1)}mm`);
console.log(`   （斗耳${luDou.douEr.fen} + 斗平${luDou.douPing.fen} + 斗欹${luDou.douQi.fen}）`);

// 华栱
const huaGong1 = system.calcHuaGong(1, true);
const huaGong2 = system.calcHuaGong(2, true);
console.log('\n2. 华栱：');
console.log(`   第一跳：总长${huaGong1.length.fen}份，出跳${huaGong1.chuTiao.fen}份`);
console.log(`   第二跳：总长${huaGong2.length.fen}份，出跳${huaGong2.chuTiao.fen}份`);

// 横栱
const niDaoGong = system.calcHengGong('niDao');
const manGong = system.calcHengGong('man');
console.log('\n3. 横栱：');
console.log(`   泥道栱：${niDaoGong.length.fen}份`);
console.log(`   慢栱：${manGong.length.fen}份`);

// 小斗
const jiaoHuDou = system.calcXiaoDou('jiaoHu');
console.log('\n4. 小斗：');
console.log(`   交互斗：高${jiaoHuDou.height.fen}份，正面宽${jiaoHuDou.frontWidth.fen}份`);

// 下昂
const xiaAng = system.calcAng(1);
console.log('\n5. 下昂：');
console.log(`   平出：${xiaAng.pingChu.fen}份，抬高：${xiaAng.taiGao.fen}份`);
console.log(`   斜度比：${xiaAng.pingChu.fen}:${xiaAng.taiGao.fen}`);

// ═══════════════════════════════════════════════════════════
// 示例5：柱梁计算
// ═══════════════════════════════════════════════════════════
console.log('\n\n【示例5】柱梁尺寸计算');
console.log('───────────────────────────────────────────────────────────');

const dianZhu = system.calcZhu('dian', 2.5);
console.log(`殿柱直径：${dianZhu.diameter.fen}份（2材2栔）= ${dianZhu.diameter.mm.toFixed(1)}mm`);

const zhuGao = system.calcZhuGao(240);
console.log(`标准柱高：${zhuGao.height.fen}份 = ${zhuGao.height.mm.toFixed(1)}mm`);

const jiaoLiang = system.calcJiaoLiang();
console.log(`大角梁广：${jiaoLiang.guang.fen}份 = ${jiaoLiang.guang.mm.toFixed(1)}mm`);

// ═══════════════════════════════════════════════════════════
// 示例6：屋架举折
// ═══════════════════════════════════════════════════════════
console.log('\n\n【示例6】屋架举折计算');
console.log('───────────────────────────────────────────────────────────');

const juZhe = system.calcJuZhe(231, 5);
console.log(`总举高：${juZhe.totalJu.fen}份 = ${juZhe.totalJu.mm.toFixed(1)}mm`);
console.log('各层折下：');
juZhe.zheValues.forEach(z => {
  console.log(`  第${z.level}折：${z.zhe.fen}份，余${z.remaining.fen}份`);
});

const linJu = system.calcLinJu(7);
console.log(`\n槫距：${linJu.distance.fen}份 = ${linJu.distance.mm.toFixed(1)}mm（7倍材广）`);

// ═══════════════════════════════════════════════════════════
// 示例7：建筑数据
// ═══════════════════════════════════════════════════════════
console.log('\n\n【示例7】建筑数据查询');
console.log('───────────────────────────────────────────────────────────');

console.log('\n建筑列表：');
const buildings = getBuildingList();
buildings.forEach(b => {
  console.log(`  - ${b.name}（${b.dynasty}，${b.year}）- ${b.location}`);
});

console.log('\n佛光寺东大殿信息：');
const foGuangSi = getBuilding('佛光寺东大殿');
console.log(`  建造年代：${foGuangSi.info.dynasty} ${foGuangSi.info.reignTitle}（${foGuangSi.info.buildYear}年）`);
console.log(`  材分制：${foGuangSi.caiFenSystem.grade}等材，1份=${foGuangSi.caiFenSystem.fenValue}mm`);
console.log(`  明间开间：${foGuangSi.plan.mingJian.kaiJian.fen}份`);
console.log(`  总举高：${foGuangSi.roof.zongJu.fen}份`);

// ═══════════════════════════════════════════════════════════
// 示例8：完整参数化数据
// ═══════════════════════════════════════════════════════════
console.log('\n\n【示例8】佛光寺东大殿完整参数化数据');
console.log('───────────────────────────────────────────────────────────');

const params = generateFoGuangSiParams();
console.log(JSON.stringify(params, null, 2));

// ═══════════════════════════════════════════════════════════
// 示例9：获取所有斗栱尺寸
// ═══════════════════════════════════════════════════════════
console.log('\n\n【示例9】获取所有斗栱构件尺寸');
console.log('───────────────────────────────────────────────────────────');

const allDouGong = system.getDouGongSizes();
console.log('斗栱构件清单：');
for (const [key, value] of Object.entries(allDouGong)) {
  if (value.length) {
    console.log(`  ${value.name}：长${value.length.fen}份`);
  } else if (value.diameter) {
    console.log(`  ${value.name}：径${value.diameter.fen}份`);
  }
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log('                      示例运行完成');
console.log('═══════════════════════════════════════════════════════════');
