import {
  _decorator,
  Component,
  Sprite,
  Prefab,
  Node,
  instantiate,
  PhysicsSystem2D,
  EPhysics2DDrawFlags,
  Button,
  RigidBody2D,
  Vec2,
} from 'cc'
import { BirdController } from './BirdController'

const { ccclass, property } = _decorator

export enum GameStatus {
  Game_Ready = 0,
  Game_Playing,
  Game_Over,
}

/**
 * Predefined variables
 * Name = GameManager
 * DateTime = Thu Mar 10 2022 01:12:25 GMT-0300 (Brasilia Standard Time)
 * Author = acquati
 * FileBasename = GameManager.ts
 * FileBasenameNoExtension = GameManager
 * URL = db://assets/Scripts/GameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('GameManager')
export class GameManager extends Component {
  @property({ type: Node })
  public canvas: Node | null = null

  @property({ type: Sprite })
  public spBg: Sprite[] | null[] = [null, null]

  @property({ type: Prefab })
  public pipePrefab: Prefab | null = null

  @property({ type: Sprite })
  public spriteGameOver: Sprite | null = null

  @property({ type: Button })
  public buttonStart: Button | null = null

  @property({ type: Node })
  public bird: Node | null = null

  public gameStatus: GameStatus = GameStatus.Game_Ready
  private _pipe: Node[] = [null, null, null]
  private _minY: number = -60
  private _maxY: number = 60

  onLoad() {
    PhysicsSystem2D.instance.debugDrawFlags =
      EPhysics2DDrawFlags.Aabb |
      EPhysics2DDrawFlags.Pair |
      EPhysics2DDrawFlags.CenterOfMass |
      EPhysics2DDrawFlags.Joint |
      EPhysics2DDrawFlags.Shape

    this.spriteGameOver.node.active = false
    this.buttonStart.node.active = true
    this.buttonStart.node.on(Node.EventType.TOUCH_END, this.onTouchStartButton, this)
  }

  start() {
    for (let i = 0; i < this._pipe.length; i++) {
      this._pipe[i] = instantiate(this.pipePrefab)
      this.canvas.addChild(this._pipe[i])

      const pipeDown = this._pipe[i].getChildByName('PipeDown')
      const pipeUp = this._pipe[i].getChildByName('PipeUp')

      pipeDown.setPosition(144 + 26 + 200 * i, 256 + this.getPipePositionY())
      pipeUp.setPosition(144 + 26 + 200 * i, -256 + this.getPipePositionY())
    }
  }

  update(deltaTime: number) {
    if (this.gameStatus !== GameStatus.Game_Playing) return

    for (let i = 0; i < this.spBg.length; i++) {
      this.spBg[i].node.setPosition(this.spBg[i].node.position.x - 1, this.spBg[i].node.position.y)

      if (this.spBg[i].node.position.x <= -288) {
        this.spBg[i].node.setPosition(288, this.spBg[i].node.position.y)
      }
    }

    for (let i = 0; i < this._pipe.length; i++) {
      const pipeDown = this._pipe[i].getChildByName('PipeDown')
      const pipeUp = this._pipe[i].getChildByName('PipeUp')

      if (pipeDown.position.x <= -144 - 26) {
        pipeDown.setPosition(-144 - 26 + 600, 256 + this.getPipePositionY())
      }
      if (pipeUp.position.x <= -144 - 26) {
        pipeUp.setPosition(-144 - 26 + 600, -256 + this.getPipePositionY())
      }
    }
  }

  getPipePositionY() {
    return this._minY + Math.random() * (this._maxY - this._minY)
  }

  gameOver() {
    this.spriteGameOver.node.active = true
    this.buttonStart.node.active = true
    this.gameStatus = GameStatus.Game_Over

    for (let i = 0; i < this._pipe.length; i++) {
      const pipeDown = this._pipe[i].getChildByName('PipeDown')
      const pipeUp = this._pipe[i].getChildByName('PipeUp')

      pipeDown.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)
      pipeUp.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)
    }
  }

  onTouchStartButton() {
    this.buttonStart.node.active = false
    this.gameStatus = GameStatus.Game_Playing
    this.spriteGameOver.node.active = false

    for (let i = 0; i < this._pipe.length; i++) {
      const pipeDown = this._pipe[i].getChildByName('PipeDown')
      const pipeUp = this._pipe[i].getChildByName('PipeUp')

      pipeDown.setPosition(144 + 26 + 200 * i, 256 + this.getPipePositionY())
      pipeDown.getComponent(RigidBody2D).linearVelocity = new Vec2(-1.2, 0)
      pipeUp.setPosition(144 + 26 + 200 * i, -256 + this.getPipePositionY())
      pipeUp.getComponent(RigidBody2D).linearVelocity = new Vec2(-1.2, 0)
    }

    this.bird.getComponent(BirdController).resetBird()
  }
}
