import { Sprite, Texture, Point } from "pixi.js";
import { eSide } from "./Side";

// ===============================================

export class ClickArea extends Sprite {
  private _opacity = 0.1;
  private _side: eSide;
  private _callback: (side: eSide) => void;

  constructor(
    side: eSide,
    position: Point,
    anchor: Point,
    size: Point,
    callback: (side: eSide) => void
  ) {
    super();
    this._side = side;
    this.texture = Texture.EMPTY;
    this.height = size.y;
    this.width = size.x;
    this.eventMode = "static";
    this.anchor.set(anchor.x, anchor.y);
    this.position.set(position.x, position.y);
    this.alpha = this._opacity;

    this.on("touchstart", this.click);
    this.on("click", this.click);
    this._callback = callback;
  }

  // ===============================================

  private click() {
    this._callback(this._side);
  }
}
