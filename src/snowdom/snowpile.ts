type PileFlake = {
  x: number;
  y: number;
  size: number;
};

export class SnowDOMPile {
  #pileBox: DOMRect;
  pile: PileFlake[] = [];

  constructor({ pileBox }: { pileBox: DOMRect }) {
    this.#pileBox = pileBox;

    this.createPile();
  }

  createPile() {
    const flakeSize = 10;
    const center = this.#pileBox.left + this.#pileBox.width * 0.5;
    const half = this.#pileBox.width * 0.45;

    for (let i = 0; i < this.#pileBox.width; i++) {
      const random = Math.random() * 2 - 1;
      const random2 = Math.random() * 1 - 0.5;
      const distanceFromCenter = random * half;
      const size = flakeSize - Math.abs(random) * flakeSize * 0.33 + random2;

      this.pile.push({
        x: center + distanceFromCenter,
        y: this.#pileBox.top + flakeSize * 0.75 - size * 1.5,
        size: size,
      });
    }
  }

  public render(context: CanvasRenderingContext2D) {
    context.fillStyle = 'rgba(250,250,250,1)';
    context.beginPath();
    this.pile.forEach((flake: PileFlake) => {
      context.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
    });
    context.fill();
  }
}
