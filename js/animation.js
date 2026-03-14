/**
 * 动画控制模块
 * 实现斗栱的拆解/组装动画
 */

class DougongAnimator {
    constructor(dougong) {
        this.dougong = dougong;
        this.isAnimating = false;
        this.animationId = null;
        this.currentProgress = 0; // 0 = 组装完成, 1 = 完全拆解
        
        // 动画配置
        this.config = {
            duration: 2000,           // 动画持续时间（毫秒）
            explodeDistance: 2.5,     // 拆解飞散距离
            layerDelay: 0.2,          // 层级延迟系数
            easing: this.easeInOutCubic
        };
        
        // 各层级的拆解方向
        this.layerDirections = {
            base: new THREE.Vector3(0, -0.5, 0),      // 底座向下
            layer1: new THREE.Vector3(0, 0.3, 0.5),   // 第一跳向上前
            layer2: new THREE.Vector3(0, 0.8, 1.0),   // 第二跳更向上前
            top: new THREE.Vector3(0, 1.5, 0)         // 顶部向上
        };
    }
    
    /**
     * 缓动函数 - easeInOutCubic
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    /**
     * 缓动函数 - easeOutElastic
     */
    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
    
    /**
     * 缓动函数 - easeOutBounce
     */
    easeOutBounce(t) {
        const n1 = 7.5625;
        const d1 = 2.75;
        
        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }
    
    /**
     * 获取构件所属层级
     */
    getComponentLayer(component) {
        const name = component.name;
        
        if (name === '栌斗') {
            return 'base';
        } else if (name.includes('第一跳') || name === '泥道栱' || name === '齐心斗') {
            return 'layer1';
        } else if (name.includes('第二跳') || name === '慢栱' || 
                   (name.includes('散斗') && name.includes('慢'))) {
            return 'layer2';
        } else if (name.includes('瓜子') || name.includes('交互') || 
                   (name.includes('散斗') && name.includes('瓜子'))) {
            return 'layer1'; // 瓜子栱在第一层
        } else {
            return 'top';
        }
    }
    
    /**
     * 计算构件的拆解目标位置
     */
    calculateExplodePosition(component, progress) {
        const originalPos = component.userData.originalPosition.clone();
        const layer = this.getComponentLayer(component);
        const direction = this.layerDirections[layer].clone();
        
        // 根据构件类型添加额外的水平偏移
        const name = component.name;
        const horizontalOffset = new THREE.Vector3();
        
        if (name.includes('左')) {
            horizontalOffset.x = -1.5 * progress;
        } else if (name.includes('右')) {
            horizontalOffset.x = 1.5 * progress;
        }
        
        if (name.includes('前') || name.includes('华栱-第一跳')) {
            horizontalOffset.z = 1.5 * progress;
        } else if (name.includes('后')) {
            horizontalOffset.z = -1.5 * progress;
        }
        
        // 计算层级延迟
        const layerIndex = ['base', 'layer1', 'layer2', 'top'].indexOf(layer);
        const layerProgress = Math.max(0, Math.min(1, 
            (progress - layerIndex * this.config.layerDelay) / 
            (1 - 3 * this.config.layerDelay)
        ));
        
        const easedProgress = this.config.easing(layerProgress);
        
        // 基础拆解方向 + 水平偏移
        const explodeOffset = direction.multiplyScalar(this.config.explodeDistance * easedProgress);
        explodeOffset.add(horizontalOffset.multiplyScalar(this.config.explodeDistance));
        
        // 添加旋转效果
        const rotationAmount = easedProgress * Math.PI * 0.1;
        if (layer !== 'base') {
            component.rotation.x = rotationAmount * (layer === 'layer2' ? 1 : 0.5);
            component.rotation.y = rotationAmount * 0.3;
        }
        
        return originalPos.add(explodeOffset);
    }
    
    /**
     * 执行动画帧
     */
    animateFrame(targetProgress, startTime, startProgress) {
        const now = performance.now();
        const elapsed = now - startTime;
        const duration = this.config.duration;
        
        let rawProgress = elapsed / duration;
        
        if (rawProgress >= 1) {
            rawProgress = 1;
            this.isAnimating = false;
        }
        
        // 计算当前进度
        const progressDiff = targetProgress - startProgress;
        this.currentProgress = startProgress + progressDiff * rawProgress;
        
        // 更新所有构件位置
        this.dougong.getComponents().forEach(component => {
            const targetPos = this.calculateExplodePosition(component, this.currentProgress);
            component.position.copy(targetPos);
        });
        
        if (rawProgress < 1) {
            this.animationId = requestAnimationFrame(() => {
                this.animateFrame(targetProgress, startTime, startProgress);
            });
        }
    }
    
    /**
     * 拆解动画
     */
    explode() {
        if (this.isAnimating) {
            this.stop();
        }
        
        this.isAnimating = true;
        const startProgress = this.currentProgress;
        const startTime = performance.now();
        
        this.animateFrame(1, startTime, startProgress);
    }
    
    /**
     * 组装动画
     */
    assemble() {
        if (this.isAnimating) {
            this.stop();
        }
        
        this.isAnimating = true;
        const startProgress = this.currentProgress;
        const startTime = performance.now();
        
        this.animateFrame(0, startTime, startProgress);
    }
    
    /**
     * 切换状态
     */
    toggle() {
        if (this.currentProgress > 0.5) {
            this.assemble();
        } else {
            this.explode();
        }
    }
    
    /**
     * 设置进度（0-1）
     */
    setProgress(progress) {
        this.stop();
        this.currentProgress = Math.max(0, Math.min(1, progress));
        
        this.dougong.getComponents().forEach(component => {
            const targetPos = this.calculateExplodePosition(component, this.currentProgress);
            component.position.copy(targetPos);
        });
    }
    
    /**
     * 停止动画
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isAnimating = false;
    }
    
    /**
     * 重置
     */
    reset() {
        this.stop();
        this.currentProgress = 0;
        this.dougong.resetPositions();
    }
    
    /**
     * 设置动画速度
     */
    setSpeed(duration) {
        this.config.duration = duration;
    }
    
    /**
     * 设置拆解距离
     */
    setExplodeDistance(distance) {
        this.config.explodeDistance = distance;
    }
    
    /**
     * 逐步拆解 - 按层级
     */
    explodeByStep(step) {
        const steps = [0, 0.33, 0.66, 1];
        const targetProgress = steps[Math.min(step, steps.length - 1)];
        
        if (this.isAnimating) {
            this.stop();
        }
        
        this.isAnimating = true;
        const startProgress = this.currentProgress;
        const startTime = performance.now();
        
        this.animateFrame(targetProgress, startTime, startProgress);
    }
    
    /**
     * 获取当前状态
     */
    getState() {
        return {
            isAnimating: this.isAnimating,
            progress: this.currentProgress,
            isExploded: this.currentProgress > 0.5
        };
    }
}

/**
 * 自动演示控制器
 */
class AutoDemoController {
    constructor(animator) {
        this.animator = animator;
        this.isRunning = false;
        this.intervalId = null;
        this.stepIndex = 0;
        
        this.config = {
            explodeDelay: 3000,    // 拆解后等待时间
            assembleDelay: 2000,   // 组装后等待时间
            stepDelay: 2000        // 逐步拆解间隔
        };
    }
    
    /**
     * 开始循环演示
     */
    startLoop() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.runLoop();
    }
    
    /**
     * 运行循环
     */
    runLoop() {
        if (!this.isRunning) return;
        
        // 拆解
        this.animator.explode();
        
        setTimeout(() => {
            if (!this.isRunning) return;
            
            // 组装
            this.animator.assemble();
            
            setTimeout(() => {
                if (this.isRunning) {
                    this.runLoop();
                }
            }, this.config.assembleDelay + this.animator.config.duration);
        }, this.config.explodeDelay + this.animator.config.duration);
    }
    
    /**
     * 开始逐步演示
     */
    startStepByStep() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.stepIndex = 0;
        this.runStepByStep();
    }
    
    /**
     * 运行逐步演示
     */
    runStepByStep() {
        if (!this.isRunning) return;
        
        const maxSteps = 4;
        
        if (this.stepIndex < maxSteps) {
            this.animator.explodeByStep(this.stepIndex);
            this.stepIndex++;
            
            setTimeout(() => {
                this.runStepByStep();
            }, this.config.stepDelay + this.animator.config.duration);
        } else {
            // 完成后重置
            setTimeout(() => {
                this.animator.assemble();
                this.stepIndex = 0;
                
                setTimeout(() => {
                    if (this.isRunning) {
                        this.runStepByStep();
                    }
                }, this.config.assembleDelay + this.animator.config.duration);
            }, this.config.stepDelay);
        }
    }
    
    /**
     * 停止演示
     */
    stop() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    /**
     * 设置延迟
     */
    setDelays(delays) {
        Object.assign(this.config, delays);
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DougongAnimator,
        AutoDemoController
    };
}
