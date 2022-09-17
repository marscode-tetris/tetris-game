import { ShapeOptions } from '../model';

export const L: ShapeOptions = {
  type: 'l',
  vectors: {
    0: [
      [1, 0],
      [-1, 0],
      [1, -1],
    ],
    90: [
      [0, 1],
      [0, -1],
      [1, 1],
    ],
    180: [
      [1, 0],
      [-1, 0],
      [-1, 1],
    ],
    270: [
      [0, -1],
      [0, 1],
      [-1, -1],
    ],
  },
};
