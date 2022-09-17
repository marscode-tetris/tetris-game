import { ShapeCoordinate } from './ShapeCoordinate';
import { ShapeRotate } from './ShapeRotate';
import { generate } from 'shortid';
import { makeAutoObservable } from 'mobx';

export interface ShapeOptions {
  type: string;
  vectors: Record<ShapeRotate, Array<ShapeCoordinate>>;
}

export class Shape {
  id = generate();

  type: string;

  coordinate: ShapeCoordinate;

  private vectors: ShapeOptions['vectors'];

  private rotate: ShapeRotate = 0;

  get vector() {
    return this.vectors[this.rotate];
  }

  get points() {
    const points: ShapeCoordinate[] = this.vector.map((i) => [i[0] + this.coordinate[0], i[1] + this.coordinate[1]]);
    points.push(this.coordinate);
    return points;
  }

  constructor(private options: ShapeOptions, initialCoordinate: ShapeCoordinate) {
    this.vectors = options.vectors;
    this.type = options.type;
    this.coordinate = initialCoordinate;
    makeAutoObservable(this);
  }

  clockWiseRotate() {
    this.rotate = ((this.rotate + 90) % 360) as ShapeRotate;
    return this;
  }

  moveTo(coordinate: ShapeCoordinate) {
    this.coordinate = coordinate;
  }

  moveDown() {
    this.coordinate[1] += 1;
    return this;
  }

  moveLeft() {
    this.coordinate[0] -= 1;
    return this;
  }

  moveRight() {
    this.coordinate[0] += 1;
    return this;
  }

  clone() {
    const shape = new Shape(this.options, [...this.coordinate]);
    shape.rotate = this.rotate;
    return shape;
  }
}
