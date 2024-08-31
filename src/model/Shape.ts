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

  /**
   * 定义一个私有变量 vectors，用于存储 ShapeOptions 接口中的 vectors 属性。
   * 这里使用 private 关键字表示该变量只能在当前类的内部访问。
   */
  private vectors: ShapeOptions['vectors'];

  private rotate: ShapeRotate = 0;

  get vector() {
    return this.vectors[this.rotate];
  }

  /**
   * 获取 Points（点）的属性。该属性表示 Shape（形状）对象的所有顶点坐标。
   *
   * @description
   * 该方法使用 map() 函数遍历 this.vectors 数组中的每个元素，并创建一个新的数组 points。新数组中的每个元素都是一个二维数组，它包含原始元素的索引值加 coordinate（坐标）数组中的第一个值，以及原始元素的值加 coordinate（坐标）数组中的第二个值。这样做实际上是将 vectors 数组中的每个向量的起点移动到了 Shape 实例的当前位置。然后，this.coordinate 被添加到 points 数组的末尾，代表 Shape 实例的当前位置。最终，points 数组被返回，它包含了 Shape 实例的所有顶点坐标，包括当前位置。
   *
   * @returns {ShapeCoordinate[]} 一个数组，包含 Shape（形状）对象的所有顶点坐标。
   */
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
    return this;
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
