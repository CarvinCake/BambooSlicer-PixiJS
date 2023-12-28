import { Sprite, Texture } from "pixi.js";
import { eSide } from "./Side";

// ===============================================

export interface IPlayer {
  slice: (side: eSide) => void;
  collisionCheck: (side: eSide) => void;
}

// ===============================================

export class Player extends Sprite implements IPlayer {
  private _side: eSide;
  private _leftPose: number;
  private _rightPose: number;
  private _timer = 0;
  private _score = 0;

  constructor(
    side: eSide,
    leftPose: number,
    rightPose: number,
    texture: Texture,
    y: number,
    scale: number
  ) {
    super();
    this._side = side;
    this._leftPose = leftPose;
    this._rightPose = rightPose;
    this.texture = texture;

    this.anchor.set(0.5, 1);
    this.scale.set(scale);
    this.y = y;

    if (this._side === eSide.LEFT) this.position.x = this._leftPose;
    else this.position.x = this._rightPose;
  }

  // ===============================================

  public collisionCheck = (badSide: eSide) => {
    if (this._side === badSide) this.lose();
    else console.log("success " + this._score);
  };

  public slice = (side: eSide) => {
    if (this._side !== side) this.move(side);
    this._score++;
  };

  private move(side: eSide) {
    const pose = side === eSide.LEFT ? this._leftPose : this._rightPose;
    this.x = pose;
    this._side = side;
  }

  private lose() {
    console.log("fail");
  }
}
