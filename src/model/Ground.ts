import { makeAutoObservable } from 'mobx';
import { Shape } from './Shape';
import { ShapeCoordinate } from './ShapeCoordinate';

export interface GroundOptions {
  size: [number, number];
  playground?: GroundPoint[][];
}

const EMPTY_POINT = Symbol('empty');
const FILLED_POINT = Symbol('filled');

type EmptyPointType = typeof EMPTY_POINT;
type FilledPointType = typeof FILLED_POINT;

type GroundPoint = FilledPointType | EmptyPointType;

export class Ground {
  size: GroundOptions['size'];

  playground: GroundPoint[][];

  get bottomRow() {
    return this.playground[this.playground.length - 1];
  }

  get initialShapeCoordinate(): ShapeCoordinate {
    return [Math.round(this.size[0] / 2), -1];
  }

  constructor(options: GroundOptions) {
    this.size = options.size;
    this.playground = options.playground ?? this.createGround();
    makeAutoObservable(this);
  }

  /** true if out of ground */
  isPointEmpty(point: ShapeCoordinate) {
    if (this.isPointOutOfSide(point) || this.isPointOutOfTop(point)) return true;
    return this.playground[point[1]][point[0]] === EMPTY_POINT;
  }

  private isRowFilled(row: GroundPoint[]) {
    return row.every((i) => i !== EMPTY_POINT);
  }

  private createRow(): GroundPoint[] {
    return new Array(this.size[0]).fill(EMPTY_POINT);
  }

  private createGround() {
    return new Array(this.size[1]).fill(this.createRow());
  }

  private clearRow(rowIndex: number) {
    this.playground.splice(rowIndex, 1);
    this.playground.unshift(this.createRow());
  }

  clear() {
    this.playground = this.createGround();
  }

  isPointOutOfTop(point: ShapeCoordinate) {
    return point[1] < 0;
  }

  isPointOutOfSide(point: ShapeCoordinate) {
    return point[0] < 0 || point[0] >= this.size[0] || point[1] >= this.size[1];
  }

  isPointOutOfGround(point: ShapeCoordinate) {
    return this.isPointOutOfSide(point) || this.isPointOutOfTop(point);
  }

  fillPoint(coordinate: ShapeCoordinate, point: GroundPoint) {
    if (this.isPointOutOfTop(coordinate) || this.isPointOutOfSide(coordinate)) return;
    this.playground[coordinate[1]][coordinate[0]] = point;
  }

  isShapeDroppable(shape: Shape) {
    return shape.points.every((p) => !this.isPointOutOfSide(p) && this.isPointEmpty(p));
  }

  isShapeOutOfTop(shape: Shape) {
    return shape.points.some((p) => this.isPointOutOfTop(p));
  }

  isShapeOutOfSide(shape: Shape) {
    return shape.points.some((p) => this.isPointOutOfSide(p));
  }

  dropShape(shape: Shape) {
    shape.points.forEach((p) => this.fillPoint(p, FILLED_POINT));
  }

  clearFilledRow() {
    let clearRows = 0;
    this.playground.forEach((row, index) => {
      if (this.isRowFilled(row)) {
        clearRows++;
        this.clearRow(index);
      }
    });
    return clearRows;
  }

  clone() {
    const playground = [...this.playground.map((i) => [...i])];
    return new Ground({ size: this.size, playground });
  }

  toPoints() {
    const points: Array<ShapeCoordinate> = [];
    this.playground.forEach((row, rowIndex) => {
      row.forEach((p, colIndex) => points.push([colIndex, rowIndex]));
    });
    return points;
  }
}
