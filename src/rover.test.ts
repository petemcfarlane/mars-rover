import {
  forward,
  Grid,
  Instruction,
  interpret,
  interpretWithinGrid,
  isLost,
  Orientation,
  Pos,
  rotateL,
  rotateR,
  Rover,
  Rover2,
} from './rover';

test('Rotating the Mars Rover', () => {
  const p: Pos = [0, 0];
  const start: Rover = { p, o: Orientation.N, isLost: false };

  expect(rotateR(start).o).toEqual(Orientation.E);
  expect(rotateR(rotateR(start)).o).toEqual(Orientation.S);
  expect(rotateR(rotateR(rotateR(start))).o).toEqual(Orientation.W);
  expect(rotateR(rotateR(rotateR(rotateR(start)))).o).toEqual(Orientation.N);

  expect(rotateL(start).o).toEqual(Orientation.W);
  expect(rotateL(rotateL(start)).o).toEqual(Orientation.S);
  expect(rotateL(rotateL(rotateL(start))).o).toEqual(Orientation.E);
  expect(rotateL(rotateL(rotateL(rotateL(start)))).o).toEqual(Orientation.N);

  const rover2 = new Rover2([0, 0], Orientation.N);
  const lostRover2 = new Rover2([0, 0], Orientation.N, true);
  expect(rover2.interpret(Instruction.R)).toEqual(new Rover2([0, 0], Orientation.E));
  expect(rover2.interpret(Instruction.R).interpret(Instruction.R)).toEqual(new Rover2([0, 0], Orientation.S));
  expect(rover2.interpret(Instruction.L)).toEqual(new Rover2([0, 0], Orientation.W));
  expect(lostRover2.interpret(Instruction.R)).toEqual(lostRover2);
  expect(lostRover2.interpret(Instruction.L)).toEqual(lostRover2);
});

test('Moving the Mars Rover', () => {
  const rover2 = new Rover2([0, 0], Orientation.N);
  const lostRover2 = new Rover2([0, 0], Orientation.N, true);
  expect(rover2.interpret(Instruction.F)).toEqual(new Rover2([0, 1], Orientation.N));
  expect(lostRover2.interpret(Instruction.F)).toEqual(lostRover2);

  const p: Pos = [0, 0];

  expect(forward({ p, o: Orientation.N, isLost: false })).toEqual({
    p: [0, 1],
    o: Orientation.N,
    isLost: false,
  });
  expect(forward({ p, o: Orientation.E, isLost: false })).toEqual({
    p: [1, 0],
    o: Orientation.E,
    isLost: false,
  });
  expect(forward({ p, o: Orientation.S, isLost: false })).toEqual({
    p: [0, -1],
    o: Orientation.S,
    isLost: false,
  });
  expect(forward({ p, o: Orientation.W, isLost: false })).toEqual({
    p: [-1, 0],
    o: Orientation.W,
    isLost: false,
  });
});

test('Interpreting instructions', () => {
  const start: Rover = { p: [0, 0], o: Orientation.N, isLost: false };
  expect(interpret(start, Instruction.F)).toEqual({ p: [0, 1], o: Orientation.N, isLost: false });
  expect(interpret(start, Instruction.R)).toEqual({ p: [0, 0], o: Orientation.E, isLost: false });
  expect(interpret(start, Instruction.L)).toEqual({ p: [0, 0], o: Orientation.W, isLost: false });

  expect(interpret(start, Instruction.F, Instruction.F, Instruction.R, Instruction.F)).toEqual({
    p: [1, 2],
    o: Orientation.E,
    isLost: false,
  });
});

test('Lost rover maintains previous position before it was lost', () => {
  const grid: Grid = [3, 2];
  expect(isLost(grid, [4, 0])).toEqual(true);
  expect(isLost(grid, [-1, 0])).toEqual(true);
  expect(isLost(grid, [0, 0])).toEqual(false);
  expect(isLost(grid, [1, 0])).toEqual(false);
  expect(isLost(grid, [1, -2])).toEqual(true);
  expect(isLost(grid, [1, 4])).toEqual(true);
  const start: Rover = {
    p: [0, 0],
    o: Orientation.N,
    isLost: false,
  };
  expect(interpretWithinGrid(grid, start, Instruction.F, Instruction.F, Instruction.F, Instruction.F)).toEqual({
    p: [0, 2],
    o: Orientation.N,
    isLost: true,
  });
});
