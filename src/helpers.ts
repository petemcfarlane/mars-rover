import { Grid, Instruction, Orientation, Rover } from './rover';

export const parseLine = (input: string): [Rover, Instruction[]] => {
  const matches = /\((\d+), (\d+), ([NESW])\) ([LRF]+)/.exec(input);
  if (matches === null) {
    throw new Error(`Couldn't parse line ${input}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, x, y, o, instructs] = matches;
  const rover = new Rover([Number(x), Number(y)], Orientation[o as keyof typeof Orientation]);
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

export const format = ({ position: [x, y], orientation, isLost }: Rover): string =>
  `(${x}, ${y}, ${orientation})${isLost ? ' LOST' : ''}`;

export const run = (input: string): string => {
  const [gridInput, ...restInput] = input.trim().split('\n');
  const grid = parseGrid(gridInput);
  return restInput
    .map((line) => {
      const [rover, instructions] = parseLine(line);
      return format(rover.interpretWithinGrid(grid, ...instructions));
    })
    .join('\n');
};
