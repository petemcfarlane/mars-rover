import { Grid, Instruction, isLost, Orientation, Pos, Rover } from './rover';

test('Rotating/Moving the Mars Rover', () => {
  const p: Pos = [0, 0];
  const rover = new Rover(p, Orientation.N);
  expect(new Rover(p, Orientation.N).interpret(Instruction.F)).toEqual(new Rover([0, 1], Orientation.N));
  expect(new Rover(p, Orientation.E).interpret(Instruction.F)).toEqual(new Rover([1, 0], Orientation.E));
  expect(new Rover(p, Orientation.S).interpret(Instruction.F)).toEqual(new Rover([0, -1], Orientation.S));
  expect(new Rover(p, Orientation.W).interpret(Instruction.F)).toEqual(new Rover([-1, 0], Orientation.W));

  expect(rover.interpret(Instruction.R)).toEqual(new Rover(p, Orientation.E));
  expect(rover.interpret(Instruction.R).interpret(Instruction.R)).toEqual(new Rover(p, Orientation.S));
  expect(rover.interpret(Instruction.R).interpret(Instruction.R).interpret(Instruction.R)).toEqual(
    new Rover(p, Orientation.W)
  );
  expect(
    rover.interpret(Instruction.R).interpret(Instruction.R).interpret(Instruction.R).interpret(Instruction.R)
  ).toEqual(new Rover(p, Orientation.N));

  expect(rover.interpret(Instruction.L)).toEqual(new Rover(p, Orientation.W));
  expect(rover.interpret(Instruction.L).interpret(Instruction.L)).toEqual(new Rover(p, Orientation.S));
  expect(rover.interpret(Instruction.L).interpret(Instruction.L).interpret(Instruction.L)).toEqual(
    new Rover(p, Orientation.E)
  );
  expect(
    rover.interpret(Instruction.L).interpret(Instruction.L).interpret(Instruction.L).interpret(Instruction.L)
  ).toEqual(new Rover(p, Orientation.N));

  const lostRover = new Rover(p, Orientation.N, true);

  expect(lostRover.interpret(Instruction.F)).toEqual(lostRover);
  expect(lostRover.interpret(Instruction.R)).toEqual(lostRover);
  expect(lostRover.interpret(Instruction.L)).toEqual(lostRover);
});

test('Lost rover maintains previous position before it was lost', () => {
  const grid: Grid = [3, 2];
  expect(isLost(grid, [4, 0])).toEqual(true);
  expect(isLost(grid, [-1, 0])).toEqual(true);
  expect(isLost(grid, [0, 0])).toEqual(false);
  expect(isLost(grid, [1, 0])).toEqual(false);
  expect(isLost(grid, [1, -2])).toEqual(true);
  expect(isLost(grid, [1, 4])).toEqual(true);

  const rover = new Rover([0, 0], Orientation.N);
  expect(rover.interpretWithinGrid(grid, Instruction.F, Instruction.F, Instruction.F, Instruction.F)).toEqual(
    new Rover([0, 2], Orientation.N, true)
  );
});
