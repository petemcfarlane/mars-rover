import { Grid, Instruction, isLost, Orientation, Pos, Rover } from './rover';

const { N, E, S, W } = Orientation;
const { F, R, L } = Instruction;

test('Rotating/Moving the Mars Rover', () => {
  const p: Pos = [0, 0];
  const rover = new Rover(p, N);

  expect(new Rover(p, N).interpret(F)).toEqual(new Rover([0, 1], N));
  expect(new Rover(p, E).interpret(F)).toEqual(new Rover([1, 0], E));
  expect(new Rover(p, S).interpret(F)).toEqual(new Rover([0, -1], S));
  expect(new Rover(p, W).interpret(F)).toEqual(new Rover([-1, 0], W));

  expect(rover.interpret(R)).toEqual(new Rover(p, E));
  expect(rover.interpret(R, R)).toEqual(new Rover(p, S));
  expect(rover.interpret(R, R, R)).toEqual(new Rover(p, W));
  expect(rover.interpret(R, R, R, R)).toEqual(new Rover(p, N));

  expect(rover.interpret(L)).toEqual(new Rover(p, W));
  expect(rover.interpret(L, L)).toEqual(new Rover(p, S));
  expect(rover.interpret(L, L, L)).toEqual(new Rover(p, E));
  expect(rover.interpret(L, L, L, L)).toEqual(new Rover(p, N));
});

test('Lost rover maintains previous position before it was lost', () => {
  const grid: Grid = [3, 2];
  expect(isLost(grid, [4, 0])).toEqual(true);
  expect(isLost(grid, [-1, 0])).toEqual(true);
  expect(isLost(grid, [0, 0])).toEqual(false);
  expect(isLost(grid, [1, 0])).toEqual(false);
  expect(isLost(grid, [1, -2])).toEqual(true);
  expect(isLost(grid, [1, 4])).toEqual(true);

  const rover = new Rover([0, 0], N);
  expect(rover.interpretWithinGrid(grid, F, F, F, F)).toEqual(new Rover([0, 2], N, true));

  const lostRover = new Rover([0, 0], N, true);

  expect(lostRover.interpret(F)).toEqual(lostRover);
  expect(lostRover.interpret(R)).toEqual(lostRover);
  expect(lostRover.interpret(L)).toEqual(lostRover);
});

test('Format rover to output string', () => {
  const rover = new Rover([1, 2], S);
  const lostRover = new Rover([7, 1], E, true);

  expect(rover.stringify()).toEqual('(1, 2, S)');
  expect(lostRover.stringify()).toEqual('(7, 1, E) LOST');
});
