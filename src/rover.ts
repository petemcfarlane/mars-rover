export enum Orientation {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

export type Pos = [number, number];

export class Rover2 {
  readonly position: Pos;
  readonly orientation: Orientation;
  readonly isLost: boolean;
  constructor(position: Pos, orientation: Orientation, isLost = false) {
    this.position = position;
    this.orientation = orientation;
    this.isLost = isLost;
  }

  interpret(i: Instruction): Rover2 {
    if (this.isLost) {
      return this;
    }
    switch (i) {
      case Instruction.R:
        return new Rover2(this.position, rotateR3[this.orientation]);
      case Instruction.L:
        return new Rover2(this.position, rotateL3[this.orientation]);
      case Instruction.F:
        const newPosition = forward2[this.orientation](this.position);
        return new Rover2(newPosition, this.orientation);
    }
  }
}

export interface Rover {
  readonly p: Pos;
  readonly o: Orientation;
  readonly isLost: boolean;
}

export const rotateR = ({ o, ...rest }: Rover): Rover => ({ ...rest, o: rotateR3[o] });
export const rotateL = ({ o, ...rest }: Rover): Rover => ({ ...rest, o: rotateL3[o] });

type Rotation = Record<Orientation, Orientation>;
type Movement = Record<Orientation, (p: Pos) => Pos>;

const rotateR3: Rotation = {
  [Orientation.N]: Orientation.E,
  [Orientation.E]: Orientation.S,
  [Orientation.S]: Orientation.W,
  [Orientation.W]: Orientation.N,
};
const rotateL3: Rotation = {
  [Orientation.N]: Orientation.W,
  [Orientation.W]: Orientation.S,
  [Orientation.S]: Orientation.E,
  [Orientation.E]: Orientation.N,
};

const forward2: Movement = {
  [Orientation.N]: ([x, y]) => [x, y + 1],
  [Orientation.E]: ([x, y]) => [x + 1, y],
  [Orientation.S]: ([x, y]) => [x, y - 1],
  [Orientation.W]: ([x, y]) => [x - 1, y],
};

export const forward = ({ p, ...rest }: Rover): Rover => ({ ...rest, p: forward2[rest.o](p) });

export enum Instruction {
  F = 'F',
  R = 'R',
  L = 'L',
}

const instructionLookup: Record<Instruction, (r: Rover) => Rover> = {
  [Instruction.F]: forward,
  [Instruction.R]: rotateR,
  [Instruction.L]: rotateL,
};

export const interpret = (start: Rover, ...instructions: Instruction[]): Rover =>
  instructions.reduce((r: Rover, i: Instruction) => instructionLookup[i](r), start);

export type Grid = [number, number];

// todo, check, is this inclusive or exclusive?
export const isLost = ([m, n]: Grid, [x, y]: Pos): boolean => {
  return x < 0 || x > m || y < 0 || y > n;
};

export const interpretWithinGrid = (grid: Grid, start: Rover, ...instructions: Instruction[]): Rover => {
  let r: Rover = start;
  for (const i of instructions) {
    const test = instructionLookup[i](r);
    const lost = isLost(grid, test.p);
    if (lost) {
      return {
        ...r,
        isLost: true,
      };
    }
    r = test;
  }
  return r;
};
