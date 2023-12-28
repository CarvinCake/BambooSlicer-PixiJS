import {
  Application,
  Texture,
  Assets,
  Container,
  Point,
  AssetsManifest,
} from "pixi.js";
import "../style.css";
import { BambooTree } from "./Bamboo";
import { ClickArea } from "./ClickArea";
import { Player, IPlayer } from "./Player";
import { eSide } from "./Side";

// ===============================================

export class Game {
  private _app: Application<HTMLCanvasElement>;
  private _gameStarted = false;
  private _manifest: AssetsManifest = { bundles: [] };
  private _gameStage: Container;
  private _appScale: number;

  private _player!: IPlayer;
  private _bambooTree!: BambooTree;
  private _leftClickArea!: ClickArea;
  private _rightClickArea!: ClickArea;

  constructor() {
    this._app = new Application<HTMLCanvasElement>({
      width: 720,
      height: 1280,
      backgroundColor: "#7EA8BE",
      antialias: true,
    });
    document.body.appendChild(this._app.view).setAttribute("id", "app");
    this._appScale = Math.min(
      this._app.screen.width / 360,
      this._app.screen.height / 640
    );
    this._gameStage = new Container();

    this.loadAssets("manifest.json").then(this.start);
    this._app.ticker.add(this.update);
  }

  // ===============================================

  private start = () => {
    this._player = new Player(
      eSide.LEFT,
      this._app.screen.width * 0.5 - 100 * this._appScale,
      this._app.screen.width * 0.5 + 100 * this._appScale,
      Texture.from("redpanda"),
      this._app.screen.height,
      0.1 * this._appScale
    );

    this._bambooTree = new BambooTree(
      0.5 * this._app.screen.width,
      this._app.screen.height,
      3,
      5,
      Texture.from("bamboo"),
      256 * this._appScale
    );

    this._gameStage.addChild(this._bambooTree, this._player as Player);

    this.setupClickAreas();
    this._app.stage = this._gameStage;
    this._gameStarted = true;
  };

  private update() {
    if (!this._gameStarted) return;
  }

  // ===============================================

  private setupClickAreas() {
    const clickCallback = (side: eSide) => {
      const playerSide = this._player.slice(side);
      const bambooSide = this._bambooTree.removeFirst(1);
      this._player.collisionCheck(bambooSide);
    };

    const areaPoseL = new Point(0, this._app.screen.height);
    const areaPoseR = new Point(
      this._app.screen.width,
      this._app.screen.height
    );
    const areaSize = new Point(170 * this._appScale, 500 * this._appScale);
    const areaAnchorL = new Point(0, 1);
    const areaAnchorR = new Point(1, 1);
    this._leftClickArea = new ClickArea(
      eSide.LEFT,
      areaPoseL,
      areaAnchorL,
      areaSize,
      clickCallback
    );
    this._rightClickArea = new ClickArea(
      eSide.RIGHT,
      areaPoseR,
      areaAnchorR,
      areaSize,
      clickCallback
    );

    this._gameStage.addChild(this._leftClickArea, this._rightClickArea);
  }

  // ===============================================

  private async loadAssets(manifestPath: string): Promise<void> {
    this._manifest = await (await fetch(manifestPath)).json();
    if (!this._manifest.bundles.length) throw new Error("Wrong manifest!");
    await Assets.init({ manifest: this._manifest });
    await Assets.loadBundle("game-screen");
  }
}
