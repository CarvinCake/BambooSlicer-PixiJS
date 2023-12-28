import { Container, Texture, Sprite } from "pixi.js";
import { eSide } from "./Side";

// ===============================================

export class BambooTree extends Container {
  private _maxLength = 20;
  private _minLength = 8;
  private _pieceHeight: number;
  private _defaultTexure: Texture;
  private _wholeLength = 0;

  constructor(
    x: number,
    y: number,
    minLength: number,
    maxLength: number,
    defaultTexture: Texture,
    pieceHeight: number
  ) {
    super();
    this.x = x;
    this.y = y;
    this._minLength = minLength;
    this._maxLength = maxLength;
    this._pieceHeight = pieceHeight;
    this._defaultTexure = defaultTexture;

    this.grow();
  }

  // ===============================================

  private grow() {
    for (let i = 0; i <= this._maxLength; i++) {
      const sliceTexture = this._defaultTexure;
      const piece = new BambooPiece(
        eSide.NONE,
        sliceTexture,
        this._pieceHeight
      );
      piece.anchor.set(0.5, 1);
      piece.y = this._wholeLength * -piece.height;
      this.addChild(piece);
      this._wholeLength++;
    }
  }

  public removeFirst(amount: number): eSide {
    if (!this.getChildAt(0)) return eSide.NONE;
    const deleted = this.removeChildren(0, amount);
    deleted.forEach((piece) => piece.destroy());
    this.y += this._pieceHeight;
    if (this.children.length < this._minLength) this.grow();
    const piece = this.getChildAt(0) as BambooPiece;
    return piece.badSide;
  }
}

// ===============================================

class BambooPiece extends Sprite {
  private _badSide: eSide;

  constructor(badSide: eSide, texture: Texture, pieceHeight: number) {
    super();
    this.texture = texture;
    this._badSide = badSide;
    this.height = pieceHeight;
  }

  public get badSide() {
    return this._badSide;
  }
}
