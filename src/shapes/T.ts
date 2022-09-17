import { ShapeOptions } from '../model';

export const T: ShapeOptions = {
  type: 't',
  vectors: {
    0: [
      [1, 0],
      [-1, 0],
      [0, -1],
    ],
    90: [
      [1, 0],
      [0, 1],
      [0, -1],
    ],
    180: [
      [1, 0],
      [-1, 0],
      [0, 1],
    ],
    270: [
      [0, -1],
      [-1, 0],
      [0, 1],
    ],
  },
};
