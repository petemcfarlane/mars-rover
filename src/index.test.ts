import {
  format,
  forward,
  Grid,
  Instruction,
  interpret,
  interpretWithinGrid,
  isLost,
  Orientation,
  parseGrid,
  parseLine,
  rotateL,
  rotateR,
  Rover,
  run,
} from '.';

test('Rotating the Mars Rover', () => {
  const p = { x: 0, y: 0 };
  const start: Rover = { p, o: Orientation.N, isLost: false };

  expect(rotateR(start).o).toEqual(Orientation.E);
  expect(rotateR(rotateR(start)).o).toEqual(Orientation.S);
  expect(rotateR(rotateR(rotateR(start))).o).toEqual(Orientation.W);
  expect(rotateR(rotateR(rotateR(rotateR(start)))).o).toEqual(Orientation.N);

  expect(rotateL(start).o).toEqual(Orientation.W);
  expect(rotateL(rotateL(start)).o).toEqual(Orientation.S);
  expect(rotateL(rotateL(rotateL(start))).o).toEqual(Orientation.E);
  expect(rotateL(rotateL(rotateL(rotateL(start)))).o).toEqual(Orientation.N);
});

test('Moving the Mars Rover', () => {
  const p = { x: 0, y: 0 };

  expect(forward({ p, o: Orientation.N, isLost: false })).toEqual({
    p: { x: 0, y: 1 },
    o: Orientation.N,
    isLost: false,
  });
  expect(forward({ p, o: Orientation.E, isLost: false })).toEqual({
    p: { x: 1, y: 0 },
    o: Orientation.E,
    isLost: false,
  });
  expect(forward({ p, o: Orientation.S, isLost: false })).toEqual({
    p: { x: 0, y: -1 },
    o: Orientation.S,
    isLost: false,
  });
  expect(forward({ p, o: Orientation.W, isLost: false })).toEqual({
    p: { x: -1, y: 0 },
    o: Orientation.W,
    isLost: false,
  });
});

test('Interpreting instructions', () => {
  const start: Rover = { p: { x: 0, y: 0 }, o: Orientation.N, isLost: false };
  expect(interpret(start, Instruction.F)).toEqual({ p: { x: 0, y: 1 }, o: Orientation.N, isLost: false });
  expect(interpret(start, Instruction.R)).toEqual({ p: { x: 0, y: 0 }, o: Orientation.E, isLost: false });
  expect(interpret(start, Instruction.L)).toEqual({ p: { x: 0, y: 0 }, o: Orientation.W, isLost: false });

  expect(interpret(start, Instruction.F, Instruction.F, Instruction.R, Instruction.F)).toEqual({
    p: { x: 1, y: 2 },
    o: Orientation.E,
    isLost: false,
  });
});

test('Lost rover maintains previous position before it was lost', () => {
  const grid: Grid = [3, 2];
  expect(isLost(grid, { x: 4, y: 0 })).toEqual(true);
  expect(isLost(grid, { x: -1, y: 0 })).toEqual(true);
  expect(isLost(grid, { x: 0, y: 0 })).toEqual(false);
  expect(isLost(grid, { x: 1, y: 0 })).toEqual(false);
  expect(isLost(grid, { x: 1, y: -2 })).toEqual(true);
  expect(isLost(grid, { x: 1, y: 4 })).toEqual(true);
  const start: Rover = {
    p: { x: 0, y: 0 },
    o: Orientation.N,
    isLost: false,
  };
  expect(interpretWithinGrid(grid, start, Instruction.F, Instruction.F, Instruction.F, Instruction.F)).toEqual({
    p: { x: 0, y: 2 },
    o: Orientation.N,
    isLost: true,
  });
});

test('Parse rover line', () => {
  const input = '(2, 3, E) LFRFF';
  const expectedRover: Rover = { p: { x: 2, y: 3 }, o: Orientation.E, isLost: false };
  const instructions = [Instruction.L, Instruction.F, Instruction.R, Instruction.F, Instruction.F];

  expect(parseLine(input)).toEqual([expectedRover, instructions]);
});

test('Parse grid size', () => {
  const input = '3 4';
  expect(parseGrid(input)).toEqual([3, 4]);
});

test('Format rover to output string', () => {
  const rover: Rover = { p: { x: 1, y: 2 }, o: Orientation.S, isLost: false };
  const lostRover: Rover = { p: { x: 7, y: 1 }, o: Orientation.E, isLost: true };

  expect(format(rover)).toEqual(`(1, 2, S)`);
  expect(format(lostRover)).toEqual(`(7, 1, E) LOST`);
});

test('Parses an input to expected output', () => {
  const input = `4 8
(2, 3, E) LFRFF
(0, 2, N) FFLFRFF
`;
  const expected = `(4, 4, E)
(0, 4, W) LOST`;

  expect(run(input)).toEqual(expected);

  const input2 = `4 8
(2, 3, N) FLLFR
(1, 0, S) FFRLF
`;
  const expected2 = `(2, 3, W)
(1, 0, S) LOST`;

  expect(run(input2)).toEqual(expected2);
});
