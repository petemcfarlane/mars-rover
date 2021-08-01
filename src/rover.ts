export enum Orientation {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}
const { N, E, S, W } = Orientation;

type Rotation = Record<Orientation, Orientation>;

const rotateR: Rotation = {
  [N]: E,
  [E]: S,
  [S]: W,
  [W]: N,
};

const rotateL: Rotation = {
  [N]: W,
  [W]: S,
  [S]: E,
  [E]: N,
};

export enum Instruction {
  F = 'F',
  R = 'R',
  L = 'L',
}
const { F, R, L } = Instruction;

type Movement = Record<Orientation, (p: Pos) => Pos>;
const moveForward: Movement = {
  [N]: ([x, y]) => [x, y + 1],
  [E]: ([x, y]) => [x + 1, y],
  [S]: ([x, y]) => [x, y - 1],
  [W]: ([x, y]) => [x - 1, y],
};

export type Grid = [number, number];
export type Pos = [number, number];

export class Rover {
  readonly position: Pos;
  readonly orientation: Orientation;
  readonly isLost: boolean;

  constructor(position: Pos, orientation: Orientation, isLost = false) {
    this.position = position;
    this.orientation = orientation;
    this.isLost = isLost;
  }

  interpret(...instructions: Instruction[]): Rover {
    if (this.isLost || instructions.length === 0) {
      return this;
    }

    const [firstInstruction, ...remainingInstructions] = instructions;

    switch (firstInstruction) {
      case R:
        return new Rover(this.position, rotateR[this.orientation]).interpret(...remainingInstructions);
      case L:
        return new Rover(this.position, rotateL[this.orientation]).interpret(...remainingInstructions);
      case F:
        const newPosition = moveForward[this.orientation](this.position);
        return new Rover(newPosition, this.orientation).interpret(...remainingInstructions);
    }
  }

  interpretWithinGrid(grid: Grid, ...instructions: Instruction[]): Rover {
    if (this.isLost || instructions.length === 0) {
      return this;
    }
    const [firstInstruction, ...remainingInstructions] = instructions;
    if (firstInstruction === F) {
      const newPosition = moveForward[this.orientation](this.position);
      if (isLost(grid, newPosition)) {
        return new Rover(this.position, this.orientation, true);
      }
      return new Rover(newPosition, this.orientation).interpretWithinGrid(grid, ...remainingInstructions);
    }
    return this.interpret(firstInstruction).interpretWithinGrid(grid, ...remainingInstructions);
  }

  stringify(): string {
    const [x, y] = this.position;
    return `(${x}, ${y}, ${this.orientation})${this.isLost ? ' LOST' : ''}`;
  }
}

// todo, check, is this inclusive or exclusive?
export const isLost = ([m, n]: Grid, [x, y]: Pos): boolean => x < 0 || x > m || y < 0 || y > n;
