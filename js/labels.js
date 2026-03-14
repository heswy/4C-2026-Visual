/**
 * 标签系统模块
 * 实现鼠标悬停显示构件名称功能
 */

class LabelSystem {
    constructor(scene, camera, renderer, dougong) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.dougong = dougong;
        
        // Raycaster 用于鼠标拾取
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // 当前悬停的构件
        this.hoveredComponent = null;
        
        // 标签DOM元素
        this.labelElement = null;
        this.createLabelElement();
        
        // 高亮材质
        this.highlightMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.5
        });
        
        // 原始材质缓存
        this.originalMaterials = new Map();
        
        // 高亮边框
        this.highlightBox = null;
        
        // 是否启用
        this.enabled = true;
        
        // 绑定事件
        this.bindEvents();
    }
    
    /**
     * 创建标签DOM元素
     */
    createLabelElement() {
        this.labelElement = document.createElement('div');
        this.labelElement.className = 'dougong-label';
        this.labelElement.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
            pointer-events: none;
            display: none;
            z-index: 1000;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: opacity 0.2s ease;
        `;
        
        // 添加箭头
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid rgba(0, 0, 0, 0.8);
        `;
        this.labelElement.appendChild(arrow);
        
        // 添加到渲染器容器
        const container = this.renderer.domElement.parentElement || document.body;
        container.appendChild(this.labelElement);
        container.style.position = 'relative';
    }
    
    /**
     * 绑定鼠标事件
     */
    bindEvents() {
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousemove', (event) => {
            if (!this.enabled) return;
            this.onMouseMove(event);
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.hideLabel();
            this.clearHighlight();
        });
        
        // 支持触摸设备
        canvas.addEventListener('touchstart', (event) => {
            if (!this.enabled) return;
            const touch = event.touches[0];
            this.updateMousePosition(touch.clientX, touch.clientY);
            this.checkIntersection();
        });
    }
    
    /**
     * 更新鼠标位置
     */
    updateMousePosition(clientX, clientY) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    /**
     * 鼠标移动处理
     */
    onMouseMove(event) {
        this.updateMousePosition(event.clientX, event.clientY);
        this.checkIntersection();
    }
    
    /**
     * 检测鼠标与构件的交集
     */
    checkIntersection() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const components = this.dougong.getComponents();
        const intersects = this.raycaster.intersectObjects(components);
        
        if (intersects.length > 0) {
            const component = intersects[0].object;
            
            if (this.hoveredComponent !== component) {
                // 清除之前的高亮
                this.clearHighlight();
                
                // 设置新的高亮
                this.hoveredComponent = component;
                this.highlightComponent(component);
                this.showLabel(component, intersects[0].point);
                
                // 触发悬停回调
                this.onHover(component);
            } else {
                // 更新标签位置
                this.updateLabelPosition(component);
            }
        } else {
            if (this.hoveredComponent) {
                this.clearHighlight();
                this.hideLabel();
                this.hoveredComponent = null;
                
                // 触发离开回调
                this.onLeave();
            }
        }
    }
    
    /**
     * 高亮构件
     */
    highlightComponent(component) {
        // 保存原始材质
        if (!this.originalMaterials.has(component.uuid)) {
            this.originalMaterials.set(component.uuid, component.material);
        }
        
        // 创建高亮材质（复制原材质并调整）
        const originalMaterial = component.material;
        const highlightMaterial = originalMaterial.clone();
        highlightMaterial.emissive = new THREE.Color(0x444444);
        component.material = highlightMaterial;
        
        // 添加高亮边框
        this.addHighlightBox(component);
    }
    
    /**
     * 添加高亮边框
     */
    addHighlightBox(component) {
        // 移除旧的高亮边框
        this.removeHighlightBox();
        
        // 获取构件的包围盒
        const box = new THREE.Box3().setFromObject(component);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // 创建线框
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0xFFD700,
            linewidth: 2
        });
        
        this.highlightBox = new THREE.LineSegments(edges, lineMaterial);
        this.highlightBox.position.copy(center);
        this.highlightBox.rotation.copy(component.rotation);
        this.scene.add(this.highlightBox);
    }
    
    /**
     * 移除高亮边框
     */
    removeHighlightBox() {
        if (this.highlightBox) {
            this.highlightBox.geometry.dispose();
            this.highlightBox.material.dispose();
            this.scene.remove(this.highlightBox);
            this.highlightBox = null;
        }
    }
    
    /**
     * 清除高亮
     */
    clearHighlight() {
        if (this.hoveredComponent) {
            const originalMaterial = this.originalMaterials.get(this.hoveredComponent.uuid);
            if (originalMaterial) {
                this.hoveredComponent.material = originalMaterial;
            }
        }
        this.removeHighlightBox();
    }
    
    /**
     * 显示标签
     */
    showLabel(component, point) {
        const name = component.name;
        const type = this.getComponentDescription(name);
        
        this.labelElement.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">${name}</div>
            <div style="font-size: 12px; color: #ccc;">${type}</div>
        `;
        
        this.labelElement.style.display = 'block';
        this.updateLabelPosition(component);
    }
    
    /**
     * 更新标签位置
     */
    updateLabelPosition(component) {
        // 获取构件在屏幕上的位置
        const box = new THREE.Box3().setFromObject(component);
        const center = box.getCenter(new THREE.Vector3());
        
        // 添加一点偏移，使标签显示在构件上方
        center.y += box.getSize(new THREE.Vector3()).y / 2 + 0.1;
        
        const screenPos = center.clone().project(this.camera);
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = (screenPos.x * 0.5 + 0.5) * rect.width;
        const y = (-screenPos.y * 0.5 + 0.5) * rect.height;
        
        this.labelElement.style.left = `${x}px`;
        this.labelElement.style.top = `${y - 40}px`;
        this.labelElement.style.transform = 'translateX(-50%)';
    }
    
    /**
     * 隐藏标签
     */
    hideLabel() {
        this.labelElement.style.display = 'none';
    }
    
    /**
     * 获取构件描述
     */
    getComponentDescription(name) {
        const descriptions = {
            '栌斗': '底座大斗，承托上部所有构件',
            '华栱': '纵向出跳的弓形构件',
            '泥道栱': '横向栱，与华栱垂直相交',
            '瓜子栱': '短横向栱，形如瓜子',
            '慢栱': '长横向栱，连接散斗',
            '交互斗': '位于华栱跳头上的斗',
            '齐心斗': '位于横栱中心的斗',
            '散斗': '位于横栱两端的斗'
        };
        
        for (const key in descriptions) {
            if (name.includes(key)) {
                return descriptions[key];
            }
        }
        
        return '斗栱构件';
    }
    
    /**
     * 悬停回调 - 可被子类重写
     */
    onHover(component) {
        // 可被子类重写或外部设置
        if (this.onHoverCallback) {
            this.onHoverCallback(component);
        }
    }
    
    /**
     * 离开回调 - 可被子类重写
     */
    onLeave() {
        if (this.onLeaveCallback) {
            this.onLeaveCallback();
        }
    }
    
    /**
     * 设置悬停回调
     */
    setHoverCallback(callback) {
        this.onHoverCallback = callback;
    }
    
    /**
     * 设置离开回调
     */
    setLeaveCallback(callback) {
        this.onLeaveCallback = callback;
    }
    
    /**
     * 启用/禁用标签系统
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.hideLabel();
            this.clearHighlight();
            this.hoveredComponent = null;
        }
    }
    
    /**
     * 销毁
     */
    destroy() {
        this.clearHighlight();
        this.removeHighlightBox();
        
        if (this.labelElement && this.labelElement.parentNode) {
            this.labelElement.parentNode.removeChild(this.labelElement);
        }
        
        this.originalMaterials.clear();
    }
    
    /**
     * 获取当前悬停的构件
     */
    getHoveredComponent() {
        return this.hoveredComponent;
    }
}

/**
 * 信息面板 - 显示选中构件的详细信息
 */
class InfoPanel {
    constructor(container) {
        this.container = container || document.body;
        this.panel = null;
        this.createPanel();
    }
    
    /**
     * 创建信息面板
     */
    createPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'dougong-info-panel';
        this.panel.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            width: 280px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
            display: none;
            z-index: 1000;
        `;
        
        this.container.appendChild(this.panel);
    }
    
    /**
     * 显示构件信息
     */
    show(component) {
        const name = component.name;
        const info = this.getComponentInfo(name);
        
        this.panel.innerHTML = `
            <div style="border-bottom: 2px solid #8B4513; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #8B4513; font-size: 18px;">${name}</h3>
            </div>
            <div style="color: #333; line-height: 1.6;">
                <p><strong>类型：</strong>${info.type}</p>
                <p><strong>功能：</strong>${info.function}</p>
                <p><strong>位置：</strong>${info.position}</p>
                <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; color: #666; font-size: 13px;">
                    ${info.description}
                </p>
            </div>
        `;
        
        this.panel.style.display = 'block';
    }
    
    /**
     * 隐藏面板
     */
    hide() {
        this.panel.style.display = 'none';
    }
    
    /**
     * 获取构件详细信息
     */
    getComponentInfo(name) {
        const infoMap = {
            '栌斗': {
                type: '斗类',
                function: '承重基础',
                position: '斗栱最底部',
                description: '栌斗是斗栱的基础，直接坐在柱头或额枋上，承托上部所有构件。因其体积较大，又称"大斗"。'
            },
            '华栱': {
                type: '栱类',
                function: '纵向出跳',
                position: '纵向前后延伸',
                description: '华栱是纵向出跳的弓形构件，垂直于墙面方向伸出，增加屋檐的出挑深度。'
            },
            '泥道栱': {
                type: '栱类',
                function: '横向连接',
                position: '横向，与华栱垂直',
                description: '泥道栱是横向栱，与华栱垂直相交，位于栌斗口内，是斗栱的基本横向构件。'
            },
            '瓜子栱': {
                type: '栱类',
                function: '短横向栱',
                position: '华栱跳头上',
                description: '瓜子栱是短横向栱，因其形状短小如瓜子而得名，位于华栱跳头交互斗口内。'
            },
            '慢栱': {
                type: '栱类',
                function: '长横向栱',
                position: '最上层横向',
                description: '慢栱是长横向栱，连接散斗，与瓜子栱平行但更长，是斗栱最上层的横向构件。'
            },
            '交互斗': {
                type: '斗类',
                function: '承托上层',
                position: '华栱跳头上',
                description: '交互斗位于华栱跳头上，承托上层的横栱或昂，是纵向与横向构件的连接点。'
            },
            '齐心斗': {
                type: '斗类',
                function: '中心承托',
                position: '横栱中心',
                description: '齐心斗位于横栱中心，正对下方栌斗，是上下层对齐的关键构件。'
            },
            '散斗': {
                type: '斗类',
                function: '分散承托',
                position: '横栱两端',
                description: '散斗位于横栱两端，用于承托上层构件，因其分散布置而得名。'
            }
        };
        
        for (const key in infoMap) {
            if (name.includes(key)) {
                return infoMap[key];
            }
        }
        
        return {
            type: '未知',
            function: '未知',
            position: '未知',
            description: '暂无详细信息'
        };
    }
    
    /**
     * 销毁
     */
    destroy() {
        if (this.panel && this.panel.parentNode) {
            this.panel.parentNode.removeChild(this.panel);
        }
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LabelSystem,
        InfoPanel
    };
}
