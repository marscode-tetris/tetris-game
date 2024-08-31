import { FC } from 'react';
import { ShapeCoordinate } from '../model';

export const Point: FC<{ pointSize: number; coordinate: ShapeCoordinate; background: string }> = (props) => {
  const { pointSize, coordinate, background } = props;
  return (
    <div
      style={{
        position: 'absolute',
        width: pointSize,
        height: pointSize,
        left: coordinate[0] * pointSize,
        top: coordinate[1] * pointSize,
        background,
        border: '1px solid rgba(255, 255, 255, .2)',
        boxSizing: 'border-box',
      }}
    ></div>
  );
};
