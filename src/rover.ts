export enum Orientation {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

export interface Position {
  x: number;
  y: number;
}

export interface Rover {
  readonly p: Position;
  readonly o: Orientation;
  readonly isLost: boolean;
}

export const rotateR = ({ o, ...rest }: Rover): Rover => {
  switch (o) {
    case Orientation.N:
      return { ...rest, o: Orientation.E };
    case Orientation.E:
      return { ...rest, o: Orientation.S };
    case Orientation.S:
      return { ...rest, o: Orientation.W };
    case Orientation.W:
      return { ...rest, o: Orientation.N };
  }
};

export const rotateL = ({ o, ...rest }: Rover): Rover => {
  switch (o) {
    case Orientation.N:
      return { ...rest, o: Orientation.W };
    case Orientation.W:
      return { ...rest, o: Orientation.S };
    case Orientation.S:
      return { ...rest, o: Orientation.E };
    case Orientation.E:
      return { ...rest, o: Orientation.N };
  }
};

export const forward = ({ p: { x, y }, o, ...rest }: Rover): Rover => {
  switch (o) {
    case Orientation.N:
      return { ...rest, p: { x, y: y + 1 }, o };
    case Orientation.E:
      return { ...rest, p: { x: x + 1, y }, o };
    case Orientation.S:
      return { ...rest, p: { x, y: y - 1 }, o };
    case Orientation.W:
      return { ...rest, p: { x: x - 1, y }, o };
  }
};

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

export const interpretWithinGrid = (grid: Grid, start: Rover, ...instructions: Instruction[]): any => {
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
