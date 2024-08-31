import { FC } from 'react';
import { Shape } from '../model';
import { Point } from './Point';

export const ShapePreview: FC<{ shape: Shape; pointSize: number }> = (props) => {
  const { shape, pointSize } = props;
  const points = shape.vector;
  // 计算所有坐标点的x和y的最小和最大值
  const minX = Math.min(...points.map((coord) => coord[0]));
  const minY = Math.min(...points.map((coord) => coord[1]));
  const maxX = Math.max(...points.map((coord) => coord[0]));
  const maxY = Math.max(...points.map((coord) => coord[1]));
  // 计算容器的宽高
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  // 计算渲染原点的x和y坐标，使图形居中
  const originX = -minX;
  const originY = -minY;
  const previewShape = shape.clone().moveTo([originX, originY]);

  return (
    <div
      style={{
        position: 'relative',
        width: width * 20,
        height: height * 20,
        boxSizing: 'border-box',
        flex: 'none',
      }}
    >
      {previewShape.points.map((point) => (
        <Point pointSize={pointSize} coordinate={point} background="#2fad44" />
      ))}
    </div>
  );
};
