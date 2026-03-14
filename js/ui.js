/**
 * 木构千年 - UI交互逻辑
 * 处理所有用户界面交互事件，预留接口给3D模块
 */

// ==================== 全局状态 ====================
const AppState = {
    currentDynasty: 'tang',
    explodeLevel: 0,
    caifenGrade: 2,
    visibleComponents: {
        dougong: true,
        liang: true,
        zhuzai: true,
        yanwu: true,
        pingban: true,
        jichu: true
    },
    isMobilePanelOpen: false
};

// 材分等级数据（宋代《营造法式》）
const CAIFEN_DATA = {
    1: { name: '一等材', height: 24, width: 16, usage: '殿身九间至十一间' },
    2: { name: '二等材', height: 21, width: 14, usage: '殿身五间至七间' },
    3: { name: '三等材', height: 18, width: 12, usage: '殿身三间至五间' },
    4: { name: '四等材', height: 15, width: 10, usage: '殿身三间' },
    5: { name: '五等材', height: 12, width: 8, usage: '殿小三间' },
    6: { name: '六等材', height: 10, width: 6.6, usage: '亭榭或小厅堂' },
    7: { name: '七等材', height: 8, width: 5.3, usage: '亭榭或小厅堂' },
    8: { name: '八等材', height: 6, width: 4, usage: '小亭榭' }
};

// ==================== DOM 元素缓存 ====================
const DOM = {};

function cacheDOM() {
    DOM.mobileToggle = document.getElementById('mobileToggle');
    DOM.controlPanel = document.getElementById('controlPanel');
    DOM.panelClose = document.getElementById('panelClose');
    DOM.panelOverlay = document.getElementById('panelOverlay');
    
    DOM.dynastyBtns = document.querySelectorAll('.dynasty-btn');
    
    DOM.explodeBtn = document.getElementById('explodeBtn');
    DOM.assembleBtn = document.getElementById('assembleBtn');
    DOM.resetBtn = document.getElementById('resetBtn');
    DOM.explodeSlider = document.getElementById('explodeSlider');
    DOM.explodeValue = document.getElementById('explodeValue');
    DOM.explodeSliderContainer = document.getElementById('explodeSliderContainer');
    
    DOM.caifenSlider = document.getElementById('caifenSlider');
    DOM.caifenGrade = document.getElementById('caifenGrade');
    DOM.caiHeight = document.getElementById('caiHeight');
    DOM.caiWidth = document.getElementById('caiWidth');
    
    DOM.componentToggles = document.querySelectorAll('.toggle-checkbox');
    
    DOM.currentDynasty = document.getElementById('currentDynasty');
    DOM.statusText = document.getElementById('statusText');
    DOM.tipText = document.getElementById('tipText');
    DOM.loadingIndicator = document.getElementById('loadingIndicator');
}

// ==================== 事件处理器 ====================

/**
 * 初始化所有事件监听
 */
function initEventListeners() {
    // 移动端面板切换
    DOM.mobileToggle?.addEventListener('click', toggleMobilePanel);
    DOM.panelClose?.addEventListener('click', closeMobilePanel);
    DOM.panelOverlay?.addEventListener('click', closeMobilePanel);
    
    // 朝代选择
    DOM.dynastyBtns.forEach(btn => {
        btn.addEventListener('click', () => selectDynasty(btn));
    });
    
    // 拆解/组装按钮
    DOM.explodeBtn?.addEventListener('click', handleExplode);
    DOM.assembleBtn?.addEventListener('click', handleAssemble);
    DOM.resetBtn?.addEventListener('click', handleReset);
    
    // 拆解滑块
    DOM.explodeSlider?.addEventListener('input', handleExplodeSlider);
    
    // 材分滑块
    DOM.caifenSlider?.addEventListener('input', handleCaifenSlider);
    
    // 构件开关
    DOM.componentToggles.forEach(toggle => {
        toggle.addEventListener('change', handleComponentToggle);
    });
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboard);
    
    // 窗口大小变化
    window.addEventListener('resize', handleResize);
}

// ==================== 功能函数 ====================

/**
 * 切换移动端面板
 */
function toggleMobilePanel() {
    AppState.isMobilePanelOpen = !AppState.isMobilePanelOpen;
    updateMobilePanelState();
}

/**
 * 关闭移动端面板
 */
function closeMobilePanel() {
    AppState.isMobilePanelOpen = false;
    updateMobilePanelState();
}

/**
 * 更新移动端面板状态
 */
function updateMobilePanelState() {
    if (AppState.isMobilePanelOpen) {
        DOM.controlPanel?.classList.add('open');
        DOM.panelOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        DOM.controlPanel?.classList.remove('open');
        DOM.panelOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * 选择朝代
 */
function selectDynasty(btn) {
    const dynasty = btn.dataset.dynasty;
    const name = btn.dataset.name;
    
    // 更新UI状态
    DOM.dynastyBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // 更新状态
    AppState.currentDynasty = dynasty;
    
    // 更新信息面板
    if (DOM.currentDynasty) {
        DOM.currentDynasty.textContent = name;
    }
    
    // 更新提示
    updateTip(`已切换至${name}建筑风格`);
    
    // 调用3D模块接口
    if (window.ThreeDModule) {
        window.ThreeDModule.loadDynasty(dynasty);
    } else {
        console.log('[UI] 朝代切换:', dynasty, name);
    }
}

/**
 * 拆解按钮处理
 */
function handleExplode() {
    const targetValue = 100;
    animateSlider(DOM.explodeSlider, targetValue, 500);
    updateTip('正在拆解建筑结构...');
    
    if (window.ThreeDModule) {
        window.ThreeDModule.explode(targetValue / 100);
    }
}

/**
 * 组装按钮处理
 */
function handleAssemble() {
    const targetValue = 0;
    animateSlider(DOM.explodeSlider, targetValue, 500);
    updateTip('正在组装建筑结构...');
    
    if (window.ThreeDModule) {
        window.ThreeDModule.assemble();
    }
}

/**
 * 重置按钮处理
 */
function handleReset() {
    // 重置滑块
    DOM.explodeSlider.value = 0;
    DOM.explodeValue.textContent = '0%';
    AppState.explodeLevel = 0;
    
    // 重置材分
    DOM.caifenSlider.value = 2;
    handleCaifenSlider({ target: DOM.caifenSlider });
    
    // 重置构件显示
    DOM.componentToggles.forEach(toggle => {
        toggle.checked = true;
        const component = toggle.dataset.component;
        AppState.visibleComponents[component] = true;
    });
    
    updateTip('已重置所有设置');
    
    if (window.ThreeDModule) {
        window.ThreeDModule.reset();
    }
}

/**
 * 拆解滑块处理
 */
function handleExplodeSlider(e) {
    const value = parseInt(e.target.value);
    AppState.explodeLevel = value;
    DOM.explodeValue.textContent = value + '%';
    
    if (window.ThreeDModule) {
        window.ThreeDModule.setExplodeLevel(value / 100);
    }
}

/**
 * 材分滑块处理
 */
function handleCaifenSlider(e) {
    const grade = parseInt(e.target.value);
    AppState.caifenGrade = grade;
    
    const data = CAIFEN_DATA[grade];
    if (data) {
        DOM.caifenGrade.textContent = data.name;
        DOM.caiHeight.textContent = data.height + ' 寸';
        DOM.caiWidth.textContent = data.width + ' 寸';
        
        updateTip(`${data.name}：${data.usage}`);
    }
    
    if (window.ThreeDModule) {
        window.ThreeDModule.setCaifenGrade(grade);
    }
}

/**
 * 构件开关处理
 */
function handleComponentToggle(e) {
    const toggle = e.target;
    const component = toggle.dataset.component;
    const isVisible = toggle.checked;
    
    AppState.visibleComponents[component] = isVisible;
    
    const componentNames = {
        dougong: '斗栱',
        liang: '梁架',
        zhuzai: '柱网',
        yanwu: '檐屋',
        pingban: '平闇/平棊',
        jichu: '台基'
    };
    
    updateTip(`${componentNames[component]}已${isVisible ? '显示' : '隐藏'}`);
    
    if (window.ThreeDModule) {
        window.ThreeDModule.toggleComponent(component, isVisible);
    }
}

/**
 * 键盘快捷键处理
 */
function handleKeyboard(e) {
    // ESC 关闭移动端面板
    if (e.key === 'Escape' && AppState.isMobilePanelOpen) {
        closeMobilePanel();
    }
    
    // 空格键切换拆解/组装
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (AppState.explodeLevel > 50) {
            handleAssemble();
        } else {
            handleExplode();
        }
    }
    
    // R 键重置
    if (e.key === 'r' || e.key === 'R') {
        if (e.target.tagName !== 'INPUT') {
            handleReset();
        }
    }
}

/**
 * 窗口大小变化处理
 */
function handleResize() {
    // 如果是从移动端切换到桌面端，确保面板状态正确
    if (window.innerWidth > 1024 && AppState.isMobilePanelOpen) {
        closeMobilePanel();
    }
    
    // 通知3D模块调整画布大小
    if (window.ThreeDModule) {
        window.ThreeDModule.handleResize();
    }
}

// ==================== 工具函数 ====================

/**
 * 滑块动画
 */
function animateSlider(slider, targetValue, duration) {
    if (!slider) return;
    
    const startValue = parseInt(slider.value);
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (targetValue - startValue) * easeProgress;
        
        slider.value = currentValue;
        
        // 触发input事件
        slider.dispatchEvent(new Event('input'));
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * 更新底部提示文字
 */
function updateTip(text) {
    if (DOM.tipText) {
        DOM.tipText.textContent = `💡 ${text}`;
        
        // 3秒后恢复默认提示
        setTimeout(() => {
            if (DOM.tipText.textContent === `💡 ${text}`) {
                DOM.tipText.textContent = '💡 提示：使用鼠标与3D模型交互';
            }
        }, 3000);
    }
}

/**
 * 更新状态文字
 */
function updateStatus(text, type = 'online') {
    if (DOM.statusText) {
        DOM.statusText.textContent = text;
    }
    
    // 更新状态指示器
    const indicator = document.querySelector('.status-indicator');
    if (indicator) {
        indicator.className = 'status-indicator ' + type;
    }
}

/**
 * 隐藏加载指示器
 */
function hideLoading() {
    if (DOM.loadingIndicator) {
        DOM.loadingIndicator.classList.add('hidden');
    }
    updateStatus('模型加载完成', 'online');
}

/**
 * 显示加载指示器
 */
function showLoading(text = '正在加载...') {
    if (DOM.loadingIndicator) {
        DOM.loadingIndicator.classList.remove('hidden');
        DOM.loadingIndicator.querySelector('span').textContent = text;
    }
    updateStatus('加载中...', 'loading');
}

// ==================== 3D模块接口 ====================

/**
 * 提供给3D模块的接口对象
 * 3D模块可以通过 window.ThreeDModule 访问这些回调
 */
window.UIController = {
    /**
     * 获取当前状态
     */
    getState() {
        return { ...AppState };
    },
    
    /**
     * 更新状态
     */
    updateState(updates) {
        Object.assign(AppState, updates);
    },
    
    /**
     * 设置拆解程度
     */
    setExplodeLevel(level) {
        const value = Math.round(level * 100);
        if (DOM.explodeSlider) {
            DOM.explodeSlider.value = value;
            DOM.explodeValue.textContent = value + '%';
        }
        AppState.explodeLevel = value;
    },
    
    /**
     * 更新提示
     */
    showTip: updateTip,
    
    /**
     * 更新状态
     */
    showStatus: updateStatus,
    
    /**
     * 显示/隐藏加载
     */
    showLoading,
    hideLoading,
    
    /**
     * 获取构件可见性状态
     */
    getComponentVisibility() {
        return { ...AppState.visibleComponents };
    }
};

// ==================== 初始化 ====================

/**
 * 初始化UI
 */
function init() {
    cacheDOM();
    initEventListeners();
    
    // 初始化材分显示
    handleCaifenSlider({ target: DOM.caifenSlider });
    
    // 初始化完成
    console.log('[UI] 木构千年 UI 初始化完成');
    updateStatus('系统就绪', 'online');
    
    // 模拟加载完成（实际项目中由3D模块调用）
    setTimeout(() => {
        hideLoading();
    }, 1500);
}

// DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ==================== 导出（用于模块化）====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, CAIFEN_DATA, UIController: window.UIController };
}
