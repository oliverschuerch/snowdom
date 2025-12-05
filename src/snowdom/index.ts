import { SnowDOMFlake } from './snowflake';

type DefaultOptions = {
  flakeCount: number;
  flakeSize: number;
  velocityX: number;
  velocityY: number;
  roofSelector: string;
  debug?: boolean;
};

export type SnowDOMOptions = Partial<DefaultOptions>;

export default class SnowDOM {
  private options: DefaultOptions = {
    flakeCount: 1000,
    flakeSize: 1,
    velocityX: 1,
    velocityY: 1,
    roofSelector: '.snowdom-roof',
  };

  private container: HTMLElement = document.body;
  private stageBox: DOMRect = this.container.getBoundingClientRect();

  private canvas: HTMLCanvasElement = document.createElement('canvas');
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d')!;

  private flakes: SnowDOMFlake[] = [];

  constructor(selector: string, options?: SnowDOMOptions) {
    this.options = { ...this.options, ...options };

    this.updateStage = this.updateStage.bind(this);
    this.render = this.render.bind(this);

    this.setupDOM(selector);
    this.setupFlakes();
    this.updateStage();
    this.render();

    window.addEventListener('resize', this.updateStage);
  }

  setupDOM(selector: string) {
    const selectorContainer = document.querySelector<HTMLElement>(selector);

    if (selectorContainer === null) {
      console.warn(`There is no matching element in the DOM for the given "selector" ${selector}.`);
      return;
    }

    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = '1000000';

    this.container = selectorContainer;
    this.container.appendChild(this.canvas);
  }

  updateStage() {
    this.stageBox = this.container.getBoundingClientRect();

    this.canvas.style.top = `${this.stageBox.top}px`;
    this.canvas.style.left = `${this.stageBox.left}px`;
    this.canvas.width = this.stageBox.width;
    this.canvas.height = this.stageBox.height;

    this.container
      .querySelectorAll<HTMLElement>(this.options.roofSelector)
      .forEach((el: HTMLElement) => {
        const roofBox = el.getBoundingClientRect();

        this.context.fillStyle = this.options.debug ? 'red' : 'transparent';
        this.context.fillRect(
          roofBox.left - this.stageBox.left,
          roofBox.top - this.stageBox.top,
          roofBox.width,
          10,
        );
      });

    this.flakes.forEach((flake: SnowDOMFlake) => {
      flake.updateStageBox = this.stageBox;
    });
  }

  setupFlakes() {
    for (let i = 0; i < this.options.flakeCount; i++) {
      this.flakes.push(
        new SnowDOMFlake({
          stageBox: this.stageBox,
          sizeFactor: this.options.flakeSize,
          velocityXFactor: this.options.velocityX,
          velocityYFactor: this.options.velocityY,
        }),
      );
    }
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.flakes.forEach((flake: SnowDOMFlake) => flake.render(this.context));

    requestAnimationFrame(this.render);
  }

  public destroy() {
    window.removeEventListener('resize', this.updateStage);
    this.container.removeChild(this.canvas);
  }
}
