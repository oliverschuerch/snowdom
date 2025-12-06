type Randoms = {
  fillStyle: number;
  x: number;
  y: number;
  size: number;
  velocityX: number;
  velocityY: number;
};

export class SnowDOMFlake {
  stageBox: DOMRect;

  private randoms: Randoms = {
    fillStyle: Math.random() * 0.6 + 0.2, // min 0.2, max 0.8
    x: Math.random() * 1.3 - 0.15, // min -0.15, max 1.15
    y: Math.random(),
    size: Math.random() * 2 + 3, // min 3, max 5
    velocityX: Math.random() * 0.8, // min 0, max 0.8
    velocityY: Math.random() * 0.5 + 0.5, // min 0.5, max 1
  };

  private fillStyle: string = `rgba(255, 255, 255, ${this.randoms.fillStyle})`;
  private size: number;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private xCosinus: number = 0;
  private velocityY: number;
  private velocityXFactor: number;

  private get x(): number {
    return this.randoms.x * this.stageBox.width + this.offsetX;
  }
  private get y(): number {
    return this.randoms.y * this.stageBox.height + this.offsetY;
  }

  private get velocityX(): number {
    const xCosinus = Math.cos((this.xCosinus += Math.random() / 50)) * 0.25;
    return (xCosinus + this.randoms.velocityX) * this.velocityXFactor;
  }

  constructor({
    stageBox,
    sizeFactor,
    velocityXFactor,
    velocityYFactor,
  }: {
    stageBox: DOMRect;
    sizeFactor: number;
    velocityXFactor: number;
    velocityYFactor: number;
  }) {
    this.stageBox = stageBox;
    this.size = this.randoms.size * sizeFactor;
    this.velocityXFactor = velocityXFactor;
    this.velocityY = this.randoms.velocityY * velocityYFactor;
  }

  public set updateStageBox(stageBox: DOMRect) {
    this.stageBox = stageBox;
  }

  public render(context: CanvasRenderingContext2D) {
    this.offsetX += this.velocityX;
    this.offsetY += this.velocityY;

    context.fillStyle = 'rgba(0,0,0,0.05)';
    context.beginPath();
    context.arc(this.x + 1, this.y + 1, this.size, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = this.fillStyle;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();

    if (this.y >= this.stageBox.height) {
      this.reset();
    }
  }

  reset() {
    this.offsetX = 0;
    this.offsetY = (this.randoms.y * this.stageBox.height + this.size) * -1;
  }
}
