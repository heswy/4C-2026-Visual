/**
 * 木构千年 - Three.js 主场景
 * 整合所有模块的完整3D可视化应用
 */

// ==================== 全局变量 ====================
let scene, camera, renderer, controls;
let dougong, animator, labelSystem;
let caiFenSystem;

// 模块间通信接口
window.ThreeDModule = null;

// ==================== 初始化函数 ====================
function init() {
    // 获取画布容器
    const container = document.getElementById('canvas-container');
    const canvas = document.getElementById('webgl-canvas');

    // 1. 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.Fog(0x1a1a1a, 5, 30);

    // 2. 创建相机
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(4, 3, 5);
    camera.lookAt(0, 0.5, 0);

    // 3. 创建渲染器
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. 设置灯光
    setupLighting();

    // 5. 创建地面
    createGround();

    // 6. 创建斗栱模型
    createDougong();

    // 7. 创建控制器
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.target.set(0, 0.5, 0);

    // 8. 初始化材分制系统
    caiFenSystem = new CaiFenSystem(1, 298);

    // 9. 设置模块接口
    setupModuleInterface();

    // 10. 监听窗口大小变化
    window.addEventListener('resize', onWindowResize);

    // 11. 开始动画循环
    animate();

    // 12. 隐藏加载指示器
    setTimeout(() => {
        if (window.UIController) {
            window.UIController.hideLoading();
        }
        console.log('🎋 木构千年 - 场景初始化完成');
    }, 1000);
}

// ==================== 灯光设置 ====================
function setupLighting() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 主光源（模拟阳光）
    const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1.2);
    directionalLight.position.set(8, 12, 6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // 补光（蓝色调，模拟天空反射）
    const fillLight = new THREE.DirectionalLight(0x6b8cae, 0.4);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    // 轮廓光（暖色调）
    const rimLight = new THREE.SpotLight(0xffaa77, 0.6);
    rimLight.position.set(0, 6, -6);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);
}

// ==================== 创建地面 ====================
function createGround() {
    // 主地面
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.9,
        metalness: 0.0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 网格辅助线
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x333333);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 中心标记
    const centerGeometry = new THREE.CircleGeometry(0.5, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({
        color: 0xc9a962,
        transparent: true,
        opacity: 0.3
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.rotation.x = -Math.PI / 2;
    center.position.y = 0.02;
    scene.add(center);
}

// ==================== 创建斗栱 ====================
function createDougong() {
    try {
        console.log('创建斗栱模型...');
        
        // 创建斗栱实例
        dougong = new Dougong(scene);
        
        // 创建动画控制器
        animator = new DougongAnimator(dougong);
        
        // 创建标签系统
        labelSystem = new LabelSystem(scene, camera, renderer, dougong);
        
        // 设置标签悬停回调
        labelSystem.setHoverCallback((component) => {
            if (window.UIController) {
                window.UIController.showTip(`构件：${component.name}`);
            }
        });
        
        labelSystem.setLeaveCallback(() => {
            // 恢复默认提示
        });
        
        console.log('斗栱模型创建完成');
    } catch (err) {
        console.error('创建斗栱失败:', err);
        // 创建一个简单的替代模型
        createFallbackModel();
    }
}

// ==================== 创建备用模型 ====================
function createFallbackModel() {
    console.log('创建备用模型...');
    
    const group = new THREE.Group();
    
    // 简单的底座
    const baseGeo = new THREE.BoxGeometry(1, 0.2, 1);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.1;
    group.add(base);
    
    // 简单的柱子
    const pillarGeo = new THREE.BoxGeometry(0.3, 0.8, 0.3);
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 });
    
    for (let i = 0; i < 4; i++) {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        const angle = (i / 4) * Math.PI * 2;
        pillar.position.set(Math.cos(angle) * 0.5, 0.5, Math.sin(angle) * 0.5);
        group.add(pillar);
    }
    
    // 简单的屋顶
    const roofGeo = new THREE.ConeGeometry(0.8, 0.4, 4);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x5D4037 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 1.1;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);
    
    scene.add(group);
    
    // 设置 dougong 对象
    dougong = { group: group, scene: scene };
    animator = { explode: () => {}, assemble: () => {}, setProgress: () => {} };
    labelSystem = { setHoverCallback: () => {}, setLeaveCallback: () => {} };
    
    console.log('备用模型创建完成');
}

// ==================== 设置模块接口 ====================
function setupModuleInterface() {
    window.ThreeDModule = {
        // 朝代切换
        loadDynasty: function(dynasty) {
            console.log('[3D] 加载朝代:', dynasty);
            
            // 根据朝代调整斗栱参数
            const dynastyConfig = {
                tang: { scale: 1.0, color: 0x8B4513 },
                song: { scale: 0.85, color: 0x7B3F00 },
                mingqing: { scale: 0.6, color: 0x654321 }
            };
            
            const config = dynastyConfig[dynasty] || dynastyConfig.tang;
            
            // 更新斗栱缩放
            if (dougong && dougong.group) {
                dougong.group.scale.setScalar(config.scale);
            }
            
            // 更新材分系统
            const gradeMap = { tang: 1, song: 3, mingqing: 6 };
            caiFenSystem = new CaiFenSystem(gradeMap[dynasty] || 1, 298);
            
            return true;
        },
        
        // 拆解动画
        explode: function(level = 1) {
            console.log('[3D] 拆解斗栱');
            if (animator) {
                animator.explode();
            }
        },
        
        // 组装动画
        assemble: function() {
            console.log('[3D] 组装斗栱');
            if (animator) {
                animator.assemble();
            }
        },
        
        // 设置拆解程度
        setExplodeLevel: function(level) {
            console.log('[3D] 设置拆解程度:', level);
            if (animator) {
                animator.setProgress(level);
            }
        },
        
        // 重置
        reset: function() {
            console.log('[3D] 重置场景');
            if (animator) {
                animator.reset();
            }
            if (controls) {
                controls.reset();
                controls.target.set(0, 0.5, 0);
            }
        },
        
        // 设置材分等级
        setCaifenGrade: function(grade) {
            console.log('[3D] 设置材分等级:', grade);
            
            // 更新材分系统
            caiFenSystem = new CaiFenSystem(grade, 298);
            
            // 根据材等调整模型缩放
            const scaleMap = {
                1: 1.0, 2: 0.9, 3: 0.8, 4: 0.7,
                5: 0.6, 6: 0.5, 7: 0.4, 8: 0.3
            };
            
            if (dougong && dougong.group) {
                const baseScale = scaleMap[grade] || 1.0;
                dougong.group.scale.setScalar(baseScale);
            }
        },
        
        // 切换构件显示
        toggleComponent: function(component, isVisible) {
            console.log('[3D] 切换构件显示:', component, isVisible);
            
            if (component === 'dougong' && dougong && dougong.group) {
                dougong.group.visible = isVisible;
            }
        },
        
        // 处理窗口大小变化
        handleResize: function() {
            onWindowResize();
        },
        
        // 获取当前状态
        getState: function() {
            return {
                dougong: dougong,
                animator: animator,
                caiFenSystem: caiFenSystem
            };
        }
    };
}

// ==================== 窗口大小变化处理 ====================
function onWindowResize() {
    const container = document.getElementById('canvas-container');
    if (!container || !camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// ==================== 动画循环 ====================
function animate() {
    requestAnimationFrame(animate);

    // 更新控制器
    if (controls) {
        controls.update();
    }

    // 渲染场景
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// ==================== DOM加载完成后初始化 ====================
function checkDependencies() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js 未加载');
        return false;
    }
    if (typeof Dougong === 'undefined') {
        console.error('Dougong 类未加载');
        return false;
    }
    if (typeof DougongAnimator === 'undefined') {
        console.error('DougongAnimator 类未加载');
        return false;
    }
    if (typeof LabelSystem === 'undefined') {
        console.error('LabelSystem 类未加载');
        return false;
    }
    if (typeof CaiFenSystem === 'undefined') {
        console.error('CaiFenSystem 类未加载');
        return false;
    }
    return true;
}

function safeInit() {
    console.log('开始初始化...');
    
    if (!checkDependencies()) {
        console.error('依赖项检查失败，延迟重试...');
        setTimeout(safeInit, 500);
        return;
    }
    
    try {
        init();
        console.log('初始化成功');
    } catch (err) {
        console.error('初始化失败:', err);
        document.getElementById('loadingIndicator').innerHTML = 
            '<span style="color: #ff6b6b;">加载失败: ' + err.message + '</span>';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
} else {
    safeInit();
}
