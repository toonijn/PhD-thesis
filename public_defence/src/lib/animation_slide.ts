export default class AnimationSlide {
  active: boolean = false;
  initialized: boolean = false;

  constructor() {}

  initialize(element: HTMLElement) {
    this.initialized = true;
  }

  activate(element: HTMLElement) {
    if (!this.initialized) this.initialize(element);
    this.active = true;
  }
  onFrame() {}
  deactivate() {
    this.active = false;
  }
}
