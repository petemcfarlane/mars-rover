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
