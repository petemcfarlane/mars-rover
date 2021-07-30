export enum Orientation {
  N,
  E,
  S,
  W,
}

export interface Position {
  x: number;
  y: number;
}

export type Rover = [Position, Orientation];

export const rotateR = ([p, o]: Rover): Rover => {
  switch (o) {
    case Orientation.N:
      return [p, Orientation.E];
    case Orientation.E:
      return [p, Orientation.S];
    case Orientation.S:
      return [p, Orientation.W];
    case Orientation.W:
      return [p, Orientation.N];
  }
};

export const rotateL = ([p, o]: Rover): Rover => {
  switch (o) {
    case Orientation.N:
      return [p, Orientation.W];
    case Orientation.W:
      return [p, Orientation.S];
    case Orientation.S:
      return [p, Orientation.E];
    case Orientation.E:
      return [p, Orientation.N];
  }
};

export const forward = ([{ x, y }, o]: Rover): Rover => {
  switch (o) {
    case Orientation.N:
      return [{ x, y: y + 1 }, o];
    case Orientation.E:
      return [{ x: x + 1, y }, o];
    case Orientation.S:
      return [{ x, y: y - 1 }, o];
    case Orientation.W:
      return [{ x: x - 1, y }, o];
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

export const parseLine = (input: string): [Rover, Instruction[]] => {
  const matches = /\((\d+), (\d+), ([NESW])\) ([LRF]+)/.exec(input);
  if (matches === null) {
    throw new Error(`Couldn't parse line ${input}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, x, y, o, instructs] = matches;
  const rover: Rover = [{ x: Number(x), y: Number(y) }, Orientation[o as keyof typeof Orientation]];
  const instructions = instructs.split('').map((i) => Instruction[i as keyof typeof Instruction]);

  return [rover, instructions];
};
