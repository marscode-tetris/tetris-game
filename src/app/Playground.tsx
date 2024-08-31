import { Component } from 'react';
import { observer } from 'mobx-react';
import { Game, Ground } from '../model';
import { J, O, T, I, Z, L, S } from '../shapes';
import { Button } from 'antd';

const shapes = [J, O, T, I, Z, L, S];

export interface GameProps {
  groundSize: [number, number];
  pointSize: number;
}

export const Playground = observer(
  class Playground extends Component<GameProps> {
    game = new Game(new Ground({ size: this.props.groundSize }), shapes);

    handleKeyDown = (e: KeyboardEvent) => {
      const game = this.game;
      // if (e.code === 'Space') game.start();
      if (!game.started) return;
      if (e.code === 'ArrowLeft') game.moveLeft();
      if (e.code === 'ArrowRight') game.moveRight();
      if (e.code === 'ArrowDown' && !e.repeat) game.speedUp();
      if (e.code === 'ArrowUp') game.rotate();
      if (e.code === 'KeyD') game.moveToBottom();
    };

    handleKeyUp = (e: KeyboardEvent) => {
      const game = this.game;
      if (!game.started) return;
      if (e.code === 'ArrowDown') game.speedDown();
    };

    handleGameEnd = () => {
      window.alert('game end');
      this.game.reset();
    };

    componentDidMount() {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
      this.game.event.on('end', this.handleGameEnd);
    }

    renderActiveShape() {
      const activeShape = this.game.activeShape;
      if (!activeShape) return;
      const pointsInGround = activeShape.points.filter((p) => !this.game.ground.isPointOutOfGround(p));
      const pointSize = this.props.pointSize;
      return pointsInGround.map((p) => (
        <div
          key={`${p[0]}${p[1]}`}
          style={{
            position: 'absolute',
            width: pointSize,
            height: pointSize,
            left: p[0] * pointSize,
            top: p[1] * pointSize,
            background: '#2fad44',
            border: '1px solid rgba(255, 255, 255, .2)',
            boxSizing: 'border-box',
          }}
        ></div>
      ));
    }

    renderFilledPoint() {
      const ground = this.game.ground.clone();
      const points = ground.toPoints().filter((p) => !ground.isPointEmpty(p));
      const pointSize = this.props.pointSize;
      return points.map((p) => (
        <div
          key={`${p[0]}${p[1]}`}
          style={{
            position: 'absolute',
            width: pointSize,
            height: pointSize,
            left: p[0] * pointSize,
            top: p[1] * pointSize,
            background: '#f3904f',
            border: '1px solid rgba(255, 255, 255, .2)',
            boxSizing: 'border-box',
          }}
        ></div>
      ));
    }

    render() {
      const width = this.props.groundSize[0] * this.props.pointSize + 2;
      const height = this.props.groundSize[1] * this.props.pointSize + 2;
      return (
        <>
          <div
            style={{
              position: 'relative',
              margin: '48px auto 0',
              width,
              height,
              border: '1px solid rgba(23, 26, 29, 0.16)',
              boxSizing: 'border-box',
            }}
          >
            {this.renderActiveShape()}
            {this.renderFilledPoint()}
          </div>
          {!this.game.started && (
            <Button
              style={{
                position: 'relative',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              onClick={() => {
                this.game.start();
              }}
              type="primary"
            >
              点击开始游戏
            </Button>
          )}
        </>
      );
    }
  }
);
