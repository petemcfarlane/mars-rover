export enum Orientation {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

export interface Position {
  readonly x: number;
  readonly y: number;
}

export class Rover2 implements Position {
  readonly x: number;
  readonly y: number;
  readonly orientation: Orientation;
  readonly isLost: boolean;
  constructor(x: number, y: number, orientation: Orientation, isLost = false) {
    this.x = x;
    this.y = y;
    this.orientation = orientation;
    this.isLost = isLost;
  }

  interpret(i: Instruction): Rover2 {
    if (this.isLost) {
      return this;
    }
    switch (i) {
      case Instruction.R:
        return new Rover2(this.x, this.y, rotateR3[this.orientation]);
      case Instruction.L:
        return new Rover2(this.x, this.y, rotateL3[this.orientation]);
      case Instruction.F:
        const newPosition = forward2[this.orientation]({ x: this.x, y: this.y });
        return new Rover2(newPosition.x, newPosition.y, this.orientation);
    }
    return new Rover2(this.x, this.y, this.orientation, this.isLost);
  }
}

export interface Rover {
  readonly p: Position;
  readonly o: Orientation;
  readonly isLost: boolean;
}

export const rotateR = ({ o, ...rest }: Rover): Rover => ({ ...rest, o: rotateR3[o] });
export const rotateL = ({ o, ...rest }: Rover): Rover => ({ ...rest, o: rotateL3[o] });

type Rotation = Record<Orientation, Orientation>;
type Movement = Record<Orientation, (p: Position) => Position>;

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
  [Orientation.N]: ({ x, y }: Position) => ({ x, y: y + 1 }),
  [Orientation.E]: ({ x, y }: Position) => ({ x: x + 1, y }),
  [Orientation.S]: ({ x, y }: Position) => ({ x, y: y - 1 }),
  [Orientation.W]: ({ x, y }: Position) => ({ x: x - 1, y }),
};

export const forward = ({ p, ...rest }: Rover): Rover => ({ ...rest, p: forward2[rest.o](p) });

export enum Instruction {
  F = 'F',
  R = 'R',
  L = 'L',
}

const interpretFunction = (instruction: Instruction) => {
  switch (instruction) {
    case Instruction.F:
      return forward;
    case Instruction.R:
      return rotateR;
    case Instruction.L:
      return rotateL;
  }
};

export const interpret = (start: Rover, ...instructions: Instruction[]): Rover =>
  instructions.reduce((r: Rover, i: Instruction) => interpretFunction(i)(r), start);

export type Grid = [number, number];

// todo, check, is this inclusive or exclusive?
export const isLost = ([m, n]: Grid, { x, y }: Position): boolean => {
  return x < 0 || x > m || y < 0 || y > n;
};

export const interpretWithinGrid = (grid: Grid, start: Rover, ...instructions: Instruction[]): Rover => {
  let r: Rover = start;
  for (const i of instructions) {
    const test = interpretFunction(i)(r);
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

export const parseLine = (input: string): [Rover, Instruction[]] => {
  const matches = /\((\d+), (\d+), ([NESW])\) ([LRF]+)/.exec(input);
  if (matches === null) {
    throw new Error(`Couldn't parse line ${input}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, x, y, o, instructs] = matches;
  const rover: Rover = {
    p: { x: Number(x), y: Number(y) },
    o: Orientation[o as keyof typeof Orientation],
    isLost: false,
  };
  const instructions = instructs.split('').map((i) => Instruction[i as keyof typeof Instruction]);

  return [rover, instructions];
};

export const parseGrid = (input: string): Grid => {
  const matches = /(\d+) (\d+)/.exec(input);
  if (matches === null) {
    throw new Error(`Couldn't parse grid ${input}`);
  }
  return <Grid>matches.slice(1, 3).map(Number);
};

export const format = ({ p, o, isLost }: Rover): string => `(${p.x}, ${p.y}, ${o})${isLost ? ' LOST' : ''}`;

export const run = (input: string): string => {
  const [gridInput, ...restInput] = input.trim().split('\n');
  const grid = parseGrid(gridInput);
  return restInput
    .map((line) => {
      const [rover, instructions] = parseLine(line);
      return format(interpretWithinGrid(grid, rover, ...instructions));
    })
    .join('\n');
};
