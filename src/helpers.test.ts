import { parseGrid, parseLine, run } from './helpers';
import { Instruction, Orientation, Rover } from './rover';

const { E } = Orientation;
const { F, R, L } = Instruction;

test('Parse grid size', () => {
  const input = '3 4';
  expect(parseGrid(input)).toEqual([3, 4]);
});

test('Parse rover line', () => {
  const input = '(2, 3, E) LFRFF';
  const expectedRover = new Rover([2, 3], E);
  const instructions = [L, F, R, F, F];

  expect(parseLine(input)).toEqual([expectedRover, instructions]);
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
