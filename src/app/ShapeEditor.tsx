import { FC, useMemo } from 'react';
import { Shape, ShapeCoordinate } from '../model';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Point } from './Point';
import { Button } from 'antd';

class Matrix {
  rows: boolean[][];

  constructor() {
    this.rows = Array.from({ length: 4 }, () => Array(4).fill(false));
    makeAutoObservable(this);
  }

  toggleCell(row: number, col: number) {
    if (row >= 0 && row < 4 && col >= 0 && col < 4) {
      this.rows[row][col] = !this.rows[row][col];
    }
  }

  getCellStatus(row: number, col: number): boolean {
    if (row >= 0 && row < 4 && col >= 0 && col < 4) {
      return this.rows[row][col];
    }
    return false;
  }

  getHighlightedCoordinates(): ShapeCoordinate[] {
    const highlightedCoords: ShapeCoordinate[] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.rows[i][j]) {
          highlightedCoords.push([i, j]);
        }
      }
    }
    return highlightedCoords;
  }
}

export const ShapeEditor: FC = observer(() => {
  const matrix = useMemo(() => new Matrix(), []);
  return (
    <div style={{ position: 'relative', height: 80, width: 80, margin: '0 24px' }}>
      {matrix.rows.map((row, rowIndex) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {row.map((cell, colIndex) => {
              return (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    border: '0.5px solid rgba(0,0,0,.2)',
                    boxSizing: 'border-box',
                    backgroundColor: matrix.getCellStatus(rowIndex, colIndex) ? '#2fad44' : 'transparent',
                  }}
                  onClick={() => matrix.toggleCell(rowIndex, colIndex)}
                  key={`${rowIndex}${colIndex}`}
                />
              );
            })}
          </div>
        );
      })}
      <Button
        onClick={() => {
          const coordinates = matrix.getHighlightedCoordinates();
        }}
      >
        自定义
      </Button>
    </div>
  );
});
