export enum Orientation {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

type Rotation = Record<Orientation, Orientation>;

const rotateR: Rotation = {
  [Orientation.N]: Orientation.E,
  [Orientation.E]: Orientation.S,
  [Orientation.S]: Orientation.W,
  [Orientation.W]: Orientation.N,
};

const rotateL: Rotation = {
  [Orientation.N]: Orientation.W,
  [Orientation.W]: Orientation.S,
  [Orientation.S]: Orientation.E,
  [Orientation.E]: Orientation.N,
};

export enum Instruction {
  F = 'F',
  R = 'R',
  L = 'L',
}

type Movement = Record<Orientation, (p: Pos) => Pos>;
const moveForward: Movement = {
  [Orientation.N]: ([x, y]) => [x, y + 1],
  [Orientation.E]: ([x, y]) => [x + 1, y],
  [Orientation.S]: ([x, y]) => [x, y - 1],
  [Orientation.W]: ([x, y]) => [x - 1, y],
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
      case Instruction.R:
        return new Rover(this.position, rotateR[this.orientation]).interpret(...remainingInstructions);
      case Instruction.L:
        return new Rover(this.position, rotateL[this.orientation]).interpret(...remainingInstructions);
      case Instruction.F:
        const newPosition = moveForward[this.orientation](this.position);
        return new Rover(newPosition, this.orientation).interpret(...remainingInstructions);
    }
  }

  interpretWithinGrid(grid: Grid, ...instructions: Instruction[]): Rover {
    if (this.isLost || instructions.length === 0) {
      return this;
    }
    const [firstInstruction, ...remainingInstructions] = instructions;
    if (firstInstruction === Instruction.F) {
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
export const isLost = ([m, n]: Grid, [x, y]: Pos): boolean => {
  return x < 0 || x > m || y < 0 || y > n;
};
