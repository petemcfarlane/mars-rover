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

export const interpret = (rover: Rover, instruction: Instruction): Rover => {
  switch (instruction) {
    case Instruction.F:
      return forward(rover);
    case Instruction.R:
      return rotateR(rover);
    case Instruction.L:
      return rotateL(rover);
  }
};
