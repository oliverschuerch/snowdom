import { SnowDOMPile } from './snowpile';
import { SnowDOMFlake } from './snowflake';

type DefaultOptions = {
  flakeCount: number;
  flakeSize: number;
  velocityX: number;
  velocityY: number;
  pileSelector: string;
  debug?: boolean;
};

export type SnowDOMOptions = Partial<DefaultOptions>;

export default class SnowDOM {
  private options: DefaultOptions = {
    flakeCount: 3000,
    flakeSize: 1,
    velocityX: 1,
    velocityY: 1,
    pileSelector: '.snowdom-pile',
  };

  private container: HTMLElement = document.body;
  private stageBox: DOMRect = this.container.getBoundingClientRect();

  private canvas: HTMLCanvasElement = document.createElement('canvas');
  private context: CanvasRenderingContext2D = this.canvas.getContext('2d')!;

  private piles: SnowDOMPile[] = [];
  private flakes: SnowDOMFlake[] = [];

  constructor(selector: string, options?: SnowDOMOptions) {
    this.options = { ...this.options, ...options };

    this.updateStage = this.updateStage.bind(this);
    this.render = this.render.bind(this);

    this.setupDOM(selector);
    this.createPiles();
    this.createFlakes();
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

  createPiles() {
    this.piles = [];

    this.container
      .querySelectorAll<HTMLElement>(this.options.pileSelector)
      .forEach((el: HTMLElement) => {
        this.piles.push(
          new SnowDOMPile({
            pileBox: el.getBoundingClientRect(),
          }),
        );
      });
  }

  createFlakes() {
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

  updateStage() {
    this.stageBox = this.container.getBoundingClientRect();

    this.canvas.style.top = `${this.stageBox.top}px`;
    this.canvas.style.left = `${this.stageBox.left}px`;
    this.canvas.width = this.stageBox.width;
    this.canvas.height = this.stageBox.height;

    this.createPiles();

    this.flakes.forEach((flake: SnowDOMFlake) => {
      flake.stageBox = this.stageBox;
    });
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.beginPath();
    this.context.fillStyle = 'rgba(24, 48, 110, 0.1)';
    this.context.rect(0, 0, this.stageBox.width, this.stageBox.height);
    this.context.fill();
    this.piles.forEach((pile: SnowDOMPile) => pile.render(this.context));
    this.flakes.forEach((flake: SnowDOMFlake) => flake.render(this.context));

    requestAnimationFrame(this.render);
  }

  public destroy() {
    window.removeEventListener('resize', this.updateStage);
    this.container.removeChild(this.canvas);
  }
}
