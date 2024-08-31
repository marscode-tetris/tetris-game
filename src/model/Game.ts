import EventEmitter2 from 'eventemitter2';
import { makeAutoObservable } from 'mobx';
import { Ground } from './Ground';
import { Shape, ShapeOptions } from './Shape';
import { Button } from 'antd';


export class Game {
  private timer?: number;

  get started() {
    return this.timer !== undefined;
  }

  event = new EventEmitter2();

  activeShape: Shape;

  nextShape: Shape;

  constructor(readonly ground: Ground, readonly shapeTypes: ShapeOptions[]) {
    this.activeShape = this.randomCreateShape();
    this.nextShape = this.randomCreateShape();
    makeAutoObservable(this, {
      event: false,
    });
  }

  registerShape(shape: ShapeOptions) {
    this.shapeTypes.push(shape);
  }

  // get groundPoints() {
  //   const ground = this.ground.clone();
  //   this.activeShape?.points.forEach((p) => ground.fillPoint(p, this.activeShape.properties));
  //   return ground.toPoints();
  // }

  randomCreateShape() {
    const index = Math.floor(Math.random() * this.shapeTypes.length);
    const shapeOptions = this.shapeTypes[index];
    const shape = new Shape(shapeOptions, this.ground.initialShapeCoordinate);
    const deltaY = Math.max(...shape.vector.map((i) => i[1]));
    shape.moveTo([shape.coordinate[0], shape.coordinate[1] - deltaY]);
    return shape;
  }

  private end() {
    window.clearInterval(this.timer);
    this.timer = undefined;
    this.event.emit('end');
  }

  moveToBottom() {
    const virtualShape = this.activeShape.clone().moveDown();
    while (this.ground.isShapeDroppable(virtualShape)) {
      this.activeShape.moveDown();
      virtualShape.moveDown();
    }
    this.dropActiveShape();
  }

  private dropActiveShape() {
    this.ground.dropShape(this.activeShape);
    this.ground.clearFilledRow();
    const nextShape = this.nextShape;
    this.nextShape = this.randomCreateShape();
    this.setActiveShape(nextShape);
  }

  private moveDown() {
    const virtualShape = this.activeShape.clone().moveDown();
    const droppable = this.ground.isShapeDroppable(virtualShape);
    if (!droppable && this.ground.isShapeOutOfTop(this.activeShape)) this.end();
    else if (!droppable) this.dropActiveShape();
    else this.activeShape.moveDown();
  }

  private setActiveShape(shape: Shape) {
    this.activeShape = shape;
  }

  private setInterval(interval: number) {
    window.clearInterval(this.timer);
    this.timer = window.setInterval(() => this.moveDown(), interval);
  }

  rotate() {
    const virtualShape = this.activeShape.clone();
    if (!this.ground.isShapeDroppable(virtualShape.clockWiseRotate())) return;
    this.activeShape.clockWiseRotate();
  }

  moveLeft() {
    const virtualShape = this.activeShape.clone().moveLeft();
    if (this.ground.isShapeDroppable(virtualShape)) this.activeShape.moveLeft();
  }

  moveRight() {
    const virtualShape = this.activeShape.clone().moveRight();
    if (this.ground.isShapeDroppable(virtualShape)) this.activeShape.moveRight();
  }

  start() {
    this.setInterval(500);
  }

  speedDown() {
    this.setInterval(500);
  }

  speedUp() {
    this.setInterval(50);
  }

  reset() {
    this.ground.clear();
    this.setActiveShape(this.randomCreateShape());
  }
}
