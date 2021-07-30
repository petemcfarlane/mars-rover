import { Orientation, rotateL, rotateR, Rover } from '.';

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
