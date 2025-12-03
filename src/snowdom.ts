export type SnowDOMOptions = {
  flakes: number;
};

interface ISnowDOMContainer {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
}

export default class SnowDOM {
  private options: SnowDOMOptions = {
    flakes: 200,
  };

  private dom: ISnowDOMContainer = {
    element: document.body,
    canvas: document.createElement("canvas"),
  };

  private context: CanvasRenderingContext2D | null = null;
  private snowflakes: any[] = [];

  constructor(selector: string, options?: SnowDOMOptions) {
    this.options = { ...this.options, ...options };

    this.setupScene = this.setupScene.bind(this);
    this.render = this.render.bind(this);

    this.setupDOM(selector);
  }

  setupDOM(selector: string) {
    const selectorContainer = document.querySelector<HTMLElement>(selector);

    if (selectorContainer === null) {
      console.warn(
        `There is no matching element in the DOM for the given "selector" ${selector}.`
      );
      return;
    }

    this.dom.element = selectorContainer;
    this.dom.canvas = document.createElement("canvas");
    this.dom.canvas.style.pointerEvents = "none";
    this.dom.canvas.style.position = "absolute";
    this.dom.canvas.style.zIndex = "1000000";
    this.dom.element.appendChild(this.dom.canvas);
    this.context = this.dom.canvas.getContext("2d")!;
    this.setupScene();

    window.addEventListener("resize", this.setupScene);
  }

  setupScene() {
    const box = this.dom.element.getBoundingClientRect();

    this.dom.canvas.style.top = `${box.top}px`;
    this.dom.canvas.style.left = `${box.left}px`;
    this.dom.canvas.width = box.width;
    this.dom.canvas.height = box.height;
    this.initFlakes(box);

    this.renderSnowflakes();

    // requestAnimationFrame(this.render);
  }

  render() {
    this.renderSnowflakes();
    // if (!this.resetScene) requestAnimationFrame(this.render);
    // else this.resetScene = false;
  }

  initFlakes(box: DOMRect) {
    this.snowflakes = [];

    for (var i = 0; i < this.options.flakes; i++) {
      const x = Math.floor(Math.random() * box.width);
      const y = Math.floor(Math.random() * box.height);
      const size = Math.random() * 3 + 2;
      const speed = Math.random() * 1 + 0.5;
      const opacity = Math.random() * 0.5 + 0.3;

      this.snowflakes.push({
        speed: speed,
        velY: speed,
        velX: 0,
        x: x,
        y: y,
        size: size,
        stepSize: Math.random() / 30,
        step: 0,
        angle: 180,
        opacity: opacity,
      });
    }
  }

  renderSnowflakes() {
    if (this.context === null) return;

    this.context.clearRect(0, 0, this.dom.canvas.width, this.dom.canvas.height);

    for (var i = 0; i < this.options.flakes; i++) {
      const flake = this.snowflakes[i];
      const minDist = 150;
      const x2 = flake.x;
      const y2 = flake.y;
      const dist = Math.sqrt(x2 * x2 + y2 * y2);

      if (dist < minDist) {
        const force = minDist / (dist * dist);
        const xcomp = x2 / dist;
        const ycomp = y2 / dist;
        const deltaV = force / 2;

        flake.velX -= deltaV * xcomp;
        flake.velY -= deltaV * ycomp;
      } else {
        flake.velX *= 0.98;
        if (flake.velY <= flake.speed) {
          flake.velY = flake.speed;
        }
        flake.velX += Math.cos((flake.step += 0.05)) * flake.stepSize;
      }

      this.context.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
      flake.y += flake.velY;
      flake.x += flake.velX;

      if (flake.y >= this.dom.canvas.height || flake.y <= 0) {
        this.resetSnowflake(flake);
      }

      if (flake.x >= this.dom.canvas.width || flake.x <= 0) {
        this.resetSnowflake(flake);
      }

      this.context.beginPath();
      this.context.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
      this.context.fill();
    }
  }

  resetSnowflake(flake: any) {
    flake.x = Math.floor(Math.random() * this.dom.canvas.width);
    flake.y = 0;
    flake.size = Math.random() * 3 + 2;
    flake.speed = Math.random() * 1 + 0.5;
    flake.velY = flake.speed;
    flake.velX = 0;
    flake.opacity = Math.random() * 0.5 + 0.3;
  }

  public destroy() {
    window.removeEventListener("resize", this.setupScene);
    this.dom.element.removeChild(this.dom.canvas);
  }
}
