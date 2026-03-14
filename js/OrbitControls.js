/**
 * OrbitControls - 简化版
 * 用于 Three.js 场景相机控制
 */
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.OrbitControls = factory());
})(this, function() {
  'use strict';

  const _changeEvent = { type: 'change' };
  const _startEvent = { type: 'start' };
  const _endEvent = { type: 'end' };

  class OrbitControls {
    constructor(object, domElement) {
      this.object = object;
      this.domElement = domElement;
      this.enabled = true;
      this.target = new THREE.Vector3();
      this.enableDamping = false;
      this.dampingFactor = 0.05;
      this.minDistance = 0;
      this.maxDistance = Infinity;
      this.minPolarAngle = 0;
      this.maxPolarAngle = Math.PI;
      
      this._spherical = new THREE.Spherical();
      this._sphericalDelta = new THREE.Spherical();
      this._scale = 1;
      this._panOffset = new THREE.Vector3();
      this._isDragging = false;
      this._lastPosition = { x: 0, y: 0 };
      
      this._bindEvents();
      this.update();
    }

    _bindEvents() {
      const el = this.domElement;
      el.addEventListener('mousedown', this._onMouseDown.bind(this));
      el.addEventListener('mousemove', this._onMouseMove.bind(this));
      el.addEventListener('mouseup', this._onMouseUp.bind(this));
      el.addEventListener('wheel', this._onWheel.bind(this));
      el.addEventListener('contextmenu', e => e.preventDefault());
    }

    _onMouseDown(e) {
      if (!this.enabled) return;
      this._isDragging = true;
      this._lastPosition = { x: e.clientX, y: e.clientY };
    }

    _onMouseMove(e) {
      if (!this.enabled || !this._isDragging) return;
      const dx = e.clientX - this._lastPosition.x;
      const dy = e.clientY - this._lastPosition.y;
      this._lastPosition = { x: e.clientX, y: e.clientY };
      
      if (e.buttons === 1) {
        this._sphericalDelta.theta -= dx * 0.01;
        this._sphericalDelta.phi -= dy * 0.01;
      }
    }

    _onMouseUp() {
      this._isDragging = false;
    }

    _onWheel(e) {
      if (!this.enabled) return;
      e.preventDefault();
      this._scale *= e.deltaY > 0 ? 1.1 : 0.9;
    }

    update() {
      const offset = new THREE.Vector3();
      offset.copy(this.object.position).sub(this.target);
      
      this._spherical.setFromVector3(offset);
      this._spherical.theta += this._sphericalDelta.theta;
      this._spherical.phi += this._sphericalDelta.phi;
      this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi));
      this._spherical.radius *= this._scale;
      this._spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this._spherical.radius));
      
      offset.setFromSpherical(this._spherical);
      this.object.position.copy(this.target).add(offset);
      this.object.lookAt(this.target);
      
      if (this.enableDamping) {
        this._sphericalDelta.theta *= (1 - this.dampingFactor);
        this._sphericalDelta.phi *= (1 - this.dampingFactor);
        this._scale = 1 + (this._scale - 1) * (1 - this.dampingFactor);
      } else {
        this._sphericalDelta.set(0, 0, 0);
        this._scale = 1;
      }
      
      return true;
    }

    reset() {
      this._sphericalDelta.set(0, 0, 0);
      this._scale = 1;
      this.update();
    }
  }

  THREE.OrbitControls = OrbitControls;
  return OrbitControls;
});
