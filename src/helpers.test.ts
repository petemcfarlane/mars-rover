import { format, parseGrid, parseLine, run } from './helpers';
import { Instruction, Orientation, Rover } from './rover';

test('Parse grid size', () => {
  const input = '3 4';
  expect(parseGrid(input)).toEqual([3, 4]);
});

test('Parse rover line', () => {
  const input = '(2, 3, E) LFRFF';
  const expectedRover = new Rover([2, 3], Orientation.E);
  const instructions = [Instruction.L, Instruction.F, Instruction.R, Instruction.F, Instruction.F];

  expect(parseLine(input)).toEqual([expectedRover, instructions]);
});

test('Format rover to output string', () => {
  const rover = new Rover([1, 2], Orientation.S);
  const lostRover = new Rover([7, 1], Orientation.E, true);

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
