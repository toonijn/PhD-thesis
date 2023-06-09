export default class AnimationSlide {
  constructor() {
    this.active = false;
    this.initialized = false;
  }
  initialize(element) {
    this.initialized = true;
  }

  activate(element) {
    if (!this.initialized) this.initialize(element);
    this.active = true;
  }
  onFrame() {}
  deactivate() {
    this.active = false;
  }
}
