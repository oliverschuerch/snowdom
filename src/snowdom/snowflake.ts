type Randoms = {
  fillStyle: number;
  x: number;
  y: number;
  size: number;
  velocityX: number;
  velocityY: number;
};

type Offset = {
  x: number;
  y: number;
  cosX: number;
};

export class SnowDOMFlake {
  stageBox: DOMRect;

  private randoms: Randoms = {
    fillStyle: Math.max(0.2, Math.min(0.8, Math.random())), // min 0.2, max 0.8
    x: Math.random() * 1.3 - 0.15, // min -0.15, max 1.15
    y: Math.random(),
    size: Math.max(2, Math.random() * 3), // min 2, max 3
    velocityX: Math.min(0.8, Math.random()), // min 0, max 0.8
    velocityY: Math.max(0.5, Math.random()), // min 0.5, max 1
  };

  private fillStyle: string = `rgba(255, 255, 255, ${this.randoms.fillStyle})`;
  private size: number;
  private offset: Offset = {
    x: 0,
    y: 0,
    cosX: 0,
  };
  private velocityXFactor: number;
  private velocityY: number;

  get x(): number {
    return this.randoms.x * this.stageBox.width + this.offset.x;
  }

  get y(): number {
    return this.randoms.y * this.stageBox.height + this.offset.y;
  }

  get velocityX(): number {
    const cosX = Math.cos((this.offset.cosX += Math.random() / 50)) * 0.25;
    // * X should be a user-option factor with a default value
    return (cosX + this.randoms.velocityX) * this.velocityXFactor;
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
    this.offset.x += this.velocityX;
    this.offset.y += this.velocityY;

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
    this.offset.x = 0;
    this.offset.y = (this.randoms.y * this.stageBox.height + this.size) * -1;
  }
}

/*
initFlakes(box: DOMRect) {
  this.flakes = [];
  for (var i = 0; i < this.options.flakeCount; i++) {
    const x = Math.floor(Math.random() * box.width);
    const y = Math.floor(Math.random() * box.height);
    const size = Math.random() * 3 + 2;
    const speed = Math.random() * 1 + 0.5;
    const opacity = Math.random() * 0.5 + 0.3;
    this.flakes.push({
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
*/

// renderSnowflakes() {
//   this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

//   for (var i = 0; i < this.options.flakeCount; i++) {
//     const flake = this.flakes[i];
//     const minDist = 150;
//     const x2 = flake.x;
//     const y2 = flake.y;
//     const dist = Math.sqrt(x2 * x2 + y2 * y2);

//     if (dist < minDist) {
//       const force = minDist / (dist * dist);
//       const xcomp = x2 / dist;
//       const ycomp = y2 / dist;
//       const deltaV = force / 2;

//       flake.velX -= deltaV * xcomp;
//       flake.velY -= deltaV * ycomp;
//     } else {
//       flake.velX *= 0.98;
//       if (flake.velY <= flake.speed) {
//         flake.velY = flake.speed;
//       }
//       flake.velX += Math.cos((flake.step += 0.05)) * flake.stepSize;
//     }

//     this.context.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
//     flake.y += flake.velY;
//     flake.x += flake.velX;

//     if (flake.y >= this.canvas.height || flake.y <= 0) {
//       this.resetSnowflake(flake);
//     }

//     if (flake.x >= this.canvas.width || flake.x <= 0) {
//       this.resetSnowflake(flake);
//     }

//     this.context.beginPath();
//     this.context.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
//     this.context.fill();
//   }
// }

/*
resetSnowflake(flake: any) {
  flake.x = Math.floor(Math.random() * this.canvas.width);
  flake.y = 0;
  flake.size = Math.random() * 3 + 2;
  flake.speed = Math.random() * 1 + 0.5;
  flake.velY = flake.speed;
  flake.velX = 0;
  flake.opacity = Math.random() * 0.5 + 0.3;
}
*/
