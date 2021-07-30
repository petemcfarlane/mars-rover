import { forward, Instruction, interpret, Orientation, parseLine, rotateL, rotateR, Rover } from '.';

test('Rotating the Mars Rover', () => {
  const p = { x: 0, y: 0 };
  const start: Rover = [p, Orientation.N];

  expect(rotateR(start)).toEqual([p, Orientation.E]);
  expect(rotateR(rotateR(start))).toEqual([p, Orientation.S]);
  expect(rotateR(rotateR(rotateR(start)))).toEqual([p, Orientation.W]);
  expect(rotateR(rotateR(rotateR(rotateR(start))))).toEqual([p, Orientation.N]);

  expect(rotateL(start)).toEqual([p, Orientation.W]);
  expect(rotateL(rotateL(start))).toEqual([p, Orientation.S]);
  expect(rotateL(rotateL(rotateL(start)))).toEqual([p, Orientation.E]);
  expect(rotateL(rotateL(rotateL(rotateL(start))))).toEqual([p, Orientation.N]);
});

test('Moving the Mars Rover', () => {
  const p = { x: 0, y: 0 };

  expect(forward([p, Orientation.N])).toEqual([{ x: 0, y: 1 }, Orientation.N]);
  expect(forward([p, Orientation.E])).toEqual([{ x: 1, y: 0 }, Orientation.E]);
  expect(forward([p, Orientation.S])).toEqual([{ x: 0, y: -1 }, Orientation.S]);
  expect(forward([p, Orientation.W])).toEqual([{ x: -1, y: 0 }, Orientation.W]);
});

test('Interpreting instructions', () => {
  const start: Rover = [{ x: 0, y: 0 }, Orientation.N];
  expect(interpret(start, Instruction.F)).toEqual([{ x: 0, y: 1 }, Orientation.N]);
  expect(interpret(start, Instruction.R)).toEqual([{ x: 0, y: 0 }, Orientation.E]);
  expect(interpret(start, Instruction.L)).toEqual([{ x: 0, y: 0 }, Orientation.W]);

  expect(interpret(start, Instruction.F, Instruction.F, Instruction.R, Instruction.F)).toEqual([
    { x: 1, y: 2 },
    Orientation.E,
  ]);
});

test('Parse rover line', () => {
  const input = '(2, 3, E) LFRFF';
  const expectedRover: Rover = [{ x: 2, y: 3 }, Orientation.E];
  const instructions = [Instruction.L, Instruction.F, Instruction.R, Instruction.F, Instruction.F];

  expect(parseLine(input)).toEqual([expectedRover, instructions]);
});
