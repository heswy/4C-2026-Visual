/**
 * 斗栱3D模型类
 * 使用Three.js基本几何体构建斗栱结构
 */

class Dougong {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.group.name = 'dougong';
        
        // 材质定义
        const woodTexture = this.createWoodTexture();
        this.materials = {
            gong: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),      // 栱 - 棕色
            dou: new THREE.MeshLambertMaterial({ color: 0xF5DEB3 }),       // 斗 - 米色
            ang: new THREE.MeshLambertMaterial({ color: 0x5D4037 }),       // 昂 - 深棕色
            wood: new THREE.MeshLambertMaterial(woodTexture ? { 
                color: 0x8B7355,
                map: woodTexture
            } : { color: 0x8B7355 })
        };
        
        // 构件尺寸配置（单位：米）
        this.dimensions = {
            luDou: { width: 0.4, height: 0.25, depth: 0.4 },               // 栌斗
            huaGong: { width: 0.15, height: 0.2, length: 0.8 },            // 华栱
            niDaoGong: { width: 0.8, height: 0.2, depth: 0.15 },           // 泥道栱
            guaZiGong: { width: 0.6, height: 0.18, depth: 0.12 },          // 瓜子栱
            manGong: { width: 1.0, height: 0.18, depth: 0.12 },            // 慢栱
            jiaoHuDou: { width: 0.25, height: 0.2, depth: 0.25 },          // 交互斗
            qiXinDou: { width: 0.25, height: 0.2, depth: 0.25 },           // 齐心斗
            sanDou: { width: 0.2, height: 0.18, depth: 0.2 }               // 散斗
        };
        
        // 存储所有构件引用
        this.components = [];
        
        this.init();
    }
    
    /**
     * 创建木纹纹理
     */
    createWoodTexture() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                console.warn('Canvas 2D context 不可用');
                return null;
            }
            
            // 基础木色
            ctx.fillStyle = '#8B7355';
            ctx.fillRect(0, 0, 512, 512);
            
            // 添加木纹线条
            ctx.strokeStyle = '#6B5344';
            ctx.lineWidth = 2;
            
            for (let i = 0; i < 40; i++) {
                ctx.beginPath();
                const y = Math.random() * 512;
                ctx.moveTo(0, y);
                
                // 波浪形木纹
                for (let x = 0; x <= 512; x += 20) {
                    const waveY = y + Math.sin(x * 0.02 + i) * 10 + (Math.random() - 0.5) * 5;
                    ctx.lineTo(x, waveY);
                }
                ctx.stroke();
            }
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            return texture;
        } catch (err) {
            console.warn('创建木纹纹理失败:', err);
            return null;
        }
    }
    
    /**
     * 创建盒子构件
     */
    createBox(name, width, height, depth, material, position, parent = null) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(position.x, position.y, position.z);
        mesh.name = name;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // 存储原始位置用于动画
        mesh.userData.originalPosition = position.clone();
        mesh.userData.componentType = this.getComponentType(name);
        
        if (parent) {
            parent.add(mesh);
        } else {
            this.group.add(mesh);
        }
        
        this.components.push(mesh);
        return mesh;
    }
    
    /**
     * 获取构件类型
     */
    getComponentType(name) {
        if (name.includes('斗')) return 'dou';
        if (name.includes('栱')) return 'gong';
        if (name.includes('昂')) return 'ang';
        return 'other';
    }
    
    /**
     * 初始化斗栱
     */
    init() {
        this.createLuDou();           // 栌斗（底座）
        this.createHuaGong();         // 华栱（纵向）
        this.createNiDaoGong();       // 泥道栱（横向）
        this.createGuaZiGong();       // 瓜子栱
        this.createManGong();         // 慢栱
        this.createXiaoDou();         // 小斗
        
        this.scene.add(this.group);
    }
    
    /**
     * 创建栌斗 - 底座大斗
     */
    createLuDou() {
        const dim = this.dimensions.luDou;
        this.createBox(
            '栌斗',
            dim.width, dim.height, dim.depth,
            this.materials.dou,
            new THREE.Vector3(0, dim.height / 2, 0)
        );
    }
    
    /**
     * 创建华栱 - 纵向出跳
     */
    createHuaGong() {
        const dim = this.dimensions.huaGong;
        const luDouHeight = this.dimensions.luDou.height;
        
        // 第一跳华栱（向前）
        this.createBox(
            '华栱-第一跳',
            dim.width, dim.height, dim.length,
            this.materials.gong,
            new THREE.Vector3(0, luDouHeight + dim.height / 2, dim.length / 4)
        );
        
        // 第一跳华栱（向后）
        this.createBox(
            '华栱-后尾',
            dim.width, dim.height, dim.length * 0.6,
            this.materials.gong,
            new THREE.Vector3(0, luDouHeight + dim.height / 2, -dim.length * 0.3)
        );
        
        // 第二跳华栱（向前，叠在第一跳上）
        this.createBox(
            '华栱-第二跳',
            dim.width, dim.height, dim.length * 0.9,
            this.materials.gong,
            new THREE.Vector3(0, luDouHeight + dim.height * 1.5, dim.length * 0.35)
        );
    }
    
    /**
     * 创建泥道栱 - 横向，与华栱垂直
     */
    createNiDaoGong() {
        const dim = this.dimensions.niDaoGong;
        const luDouHeight = this.dimensions.luDou.height;
        
        this.createBox(
            '泥道栱',
            dim.width, dim.height, dim.depth,
            this.materials.gong,
            new THREE.Vector3(0, luDouHeight + dim.height / 2, 0)
        );
    }
    
    /**
     * 创建瓜子栱 - 短横向栱
     */
    createGuaZiGong() {
        const dim = this.dimensions.guaZiGong;
        const luDouHeight = this.dimensions.luDou.height;
        const huaGongHeight = this.dimensions.huaGong.height;
        
        // 第一跳瓜子栱
        this.createBox(
            '瓜子栱-第一跳',
            dim.width, dim.height, dim.depth,
            this.materials.gong,
            new THREE.Vector3(0, luDouHeight + huaGongHeight + dim.height / 2, 
                this.dimensions.huaGong.length * 0.4)
        );
        
        // 后尾瓜子栱
        this.createBox(
            '瓜子栱-后尾',
            dim.width * 0.7, dim.height, dim.depth,
            this.materials.gong,
            new THREE.Vector3(0, luDouHeight + huaGongHeight + dim.height / 2, 
                -this.dimensions.huaGong.length * 0.25)
        );
    }
    
    /**
     * 创建慢栱 - 长横向栱
     */
    createManGong() {
        const dim = this.dimensions.manGong;
        const luDouHeight = this.dimensions.luDou.height;
        const huaGongHeight = this.dimensions.huaGong.height;
        
        // 第二跳慢栱
        this.createBox(
            '慢栱',
            dim.width, dim.height, dim.depth,
            this.materials.gong,
            new THREE.Vector3(0, luDouHeight + huaGongHeight * 2 + dim.height / 2, 
                this.dimensions.huaGong.length * 0.5)
        );
    }
    
    /**
     * 创建小斗 - 交互斗、齐心斗、散斗
     */
    createXiaoDou() {
        const luDouHeight = this.dimensions.luDou.height;
        const huaGongHeight = this.dimensions.huaGong.height;
        const guaZiGongHeight = this.dimensions.guaZiGong.height;
        
        // 交互斗 - 在华栱跳头上
        const jiaoHuDim = this.dimensions.jiaoHuDou;
        
        // 第一跳交互斗
        this.createBox(
            '交互斗-第一跳',
            jiaoHuDim.width, jiaoHuDim.height, jiaoHuDim.depth,
            this.materials.dou,
            new THREE.Vector3(0, luDouHeight + huaGongHeight + jiaoHuDim.height / 2, 
                this.dimensions.huaGong.length * 0.6)
        );
        
        // 第二跳交互斗
        this.createBox(
            '交互斗-第二跳',
            jiaoHuDim.width, jiaoHuDim.height, jiaoHuDim.depth,
            this.materials.dou,
            new THREE.Vector3(0, luDouHeight + huaGongHeight * 2 + jiaoHuDim.height / 2, 
                this.dimensions.huaGong.length * 0.7)
        );
        
        // 齐心斗 - 在横栱中心
        const qiXinDim = this.dimensions.qiXinDou;
        this.createBox(
            '齐心斗',
            qiXinDim.width, qiXinDim.height, qiXinDim.depth,
            this.materials.dou,
            new THREE.Vector3(0, luDouHeight + huaGongHeight + qiXinDim.height / 2, 0)
        );
        
        // 散斗 - 在横栱两端
        const sanDim = this.dimensions.sanDou;
        const guaZiY = luDouHeight + huaGongHeight + guaZiGongHeight + sanDim.height / 2;
        
        // 瓜子栱上散斗
        this.createBox(
            '散斗-瓜子左',
            sanDim.width, sanDim.height, sanDim.depth,
            this.materials.dou,
            new THREE.Vector3(-this.dimensions.guaZiGong.width * 0.35, guaZiY, 
                this.dimensions.huaGong.length * 0.4)
        );
        
        this.createBox(
            '散斗-瓜子右',
            sanDim.width, sanDim.height, sanDim.depth,
            this.materials.dou,
            new THREE.Vector3(this.dimensions.guaZiGong.width * 0.35, guaZiY, 
                this.dimensions.huaGong.length * 0.4)
        );
        
        // 慢栱上散斗
        const manY = luDouHeight + huaGongHeight * 2 + this.dimensions.manGong.height + sanDim.height / 2;
        this.createBox(
            '散斗-慢栱左',
            sanDim.width, sanDim.height, sanDim.depth,
            this.materials.dou,
            new THREE.Vector3(-this.dimensions.manGong.width * 0.4, manY, 
                this.dimensions.huaGong.length * 0.5)
        );
        
        this.createBox(
            '散斗-慢栱右',
            sanDim.width, sanDim.height, sanDim.depth,
            this.materials.dou,
            new THREE.Vector3(this.dimensions.manGong.width * 0.4, manY, 
                this.dimensions.huaGong.length * 0.5)
        );
    }
    
    /**
     * 获取所有构件
     */
    getComponents() {
        return this.components;
    }
    
    /**
     * 获取构件分组（按层级）
     */
    getComponentsByLayer() {
        const layers = {
            base: [],      // 栌斗
            layer1: [],    // 第一跳
            layer2: [],    // 第二跳
            top: []        // 顶部
        };
        
        this.components.forEach(comp => {
            const name = comp.name;
            if (name === '栌斗') {
                layers.base.push(comp);
            } else if (name.includes('第一跳') || name === '泥道栱' || name === '齐心斗') {
                layers.layer1.push(comp);
            } else if (name.includes('第二跳') || name === '慢栱' || name.includes('慢栱')) {
                layers.layer2.push(comp);
            } else {
                layers.top.push(comp);
            }
        });
        
        return layers;
    }
    
    /**
     * 重置所有构件位置
     */
    resetPositions() {
        this.components.forEach(comp => {
            comp.position.copy(comp.userData.originalPosition);
            comp.rotation.set(0, 0, 0);
        });
    }
    
    /**
     * 销毁
     */
    destroy() {
        this.components.forEach(comp => {
            comp.geometry.dispose();
        });
        this.scene.remove(this.group);
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dougong;
}
