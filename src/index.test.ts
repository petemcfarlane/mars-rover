import { forward, Instruction, interpret, Orientation, parseLine, rotateL, rotateR, Rover } from '.';

test('Rotating the Mars Rover', () => {
  const p = { x: 0, y: 0 };
  const start: Rover = { p, o: Orientation.N };

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

  expect(forward({ p, o: Orientation.N })).toEqual({ p: { x: 0, y: 1 }, o: Orientation.N });
  expect(forward({ p, o: Orientation.E })).toEqual({ p: { x: 1, y: 0 }, o: Orientation.E });
  expect(forward({ p, o: Orientation.S })).toEqual({ p: { x: 0, y: -1 }, o: Orientation.S });
  expect(forward({ p, o: Orientation.W })).toEqual({ p: { x: -1, y: 0 }, o: Orientation.W });
});

test('Interpreting instructions', () => {
  const start: Rover = { p: { x: 0, y: 0 }, o: Orientation.N };
  expect(interpret(start, Instruction.F)).toEqual({ p: { x: 0, y: 1 }, o: Orientation.N });
  expect(interpret(start, Instruction.R)).toEqual({ p: { x: 0, y: 0 }, o: Orientation.E });
  expect(interpret(start, Instruction.L)).toEqual({ p: { x: 0, y: 0 }, o: Orientation.W });

  expect(interpret(start, Instruction.F, Instruction.F, Instruction.R, Instruction.F)).toEqual({
    p: { x: 1, y: 2 },
    o: Orientation.E,
  });
});

test('Parse rover line', () => {
  const input = '(2, 3, E) LFRFF';
  const expectedRover: Rover = { p: { x: 2, y: 3 }, o: Orientation.E };
  const instructions = [Instruction.L, Instruction.F, Instruction.R, Instruction.F, Instruction.F];

  expect(parseLine(input)).toEqual([expectedRover, instructions]);
});

test('Lost rover maintains position before it was lost', () => {
  const gridsize = { n: 3, m: 4 };
  // const start =;
});
