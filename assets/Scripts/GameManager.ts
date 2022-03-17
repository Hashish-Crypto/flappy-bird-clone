import {
  _decorator,
  Component,
  Sprite,
  Prefab,
  Node,
  instantiate,
  PhysicsSystem2D,
  EPhysics2DDrawFlags,
  RigidBody2D,
  Vec2,
} from 'cc'
import { BirdController } from './BirdController'

const { ccclass, property } = _decorator

export enum GameState {
  INIT,
  PLAYING,
  END,
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
  public spriteBackground: Sprite[] | null[] = [null, null]

  @property({ type: Node })
  public pipesPlaceholder: Node | null = null

  @property({ type: Prefab })
  public prefabPipe: Prefab | null = null

  @property({ type: Sprite })
  public spriteGetReady: Sprite | null = null

  @property({ type: Sprite })
  public spriteInstructions: Sprite | null = null

  @property({ type: Sprite })
  public spriteGameOver: Sprite | null = null

  @property({ type: Node })
  public bird: Node | null = null

  public gameState: GameState = GameState.INIT
  private _birdController: BirdController | null = null
  private _pipes: Node[] = [null, null, null]
  private _minY: number = -60
  private _maxY: number = 60

  onLoad() {
    PhysicsSystem2D.instance.debugDrawFlags =
      EPhysics2DDrawFlags.Aabb |
      EPhysics2DDrawFlags.Pair |
      EPhysics2DDrawFlags.CenterOfMass |
      EPhysics2DDrawFlags.Joint |
      EPhysics2DDrawFlags.Shape

    this.spriteGetReady.node.active = true
    this.spriteGameOver.node.active = false
    this.spriteInstructions.node.active = true
    this._birdController = this.bird.getComponent(BirdController)
    this.bird.active = false
    this.canvas.on(Node.EventType.TOUCH_START, this.onTouchScreen, this)
  }

  start() {
    for (let i = 0; i < this._pipes.length; i++) {
      this._pipes[i] = instantiate(this.prefabPipe)
      this.pipesPlaceholder.addChild(this._pipes[i])

      const pipeDown = this._pipes[i].getChildByName('PipeDown')
      const pipeUp = this._pipes[i].getChildByName('PipeUp')

      pipeDown.setPosition(144 + 26 + 200 * i, 256 + this.getPipePositionY())
      pipeUp.setPosition(144 + 26 + 200 * i, -256 + this.getPipePositionY())
    }
  }

  update(deltaTime: number) {
    if (this.gameState !== GameState.PLAYING) return

    for (let i = 0; i < this.spriteBackground.length; i++) {
      this.spriteBackground[i].node.setPosition(
        this.spriteBackground[i].node.position.x - 1,
        this.spriteBackground[i].node.position.y
      )

      if (this.spriteBackground[i].node.position.x <= -288) {
        this.spriteBackground[i].node.setPosition(288, this.spriteBackground[i].node.position.y)
      }
    }

    for (let i = 0; i < this._pipes.length; i++) {
      const pipeDown = this._pipes[i].getChildByName('PipeDown')
      const pipeUp = this._pipes[i].getChildByName('PipeUp')

      if (pipeDown.position.x <= -144 - 26) {
        console.log('pipeDown')
        pipeDown.setPosition(-144 - 26 + 600, 256 + this.getPipePositionY())
      }
      if (pipeUp.position.x <= -144 - 26) {
        console.log('pipeUp')
        pipeUp.setPosition(-144 - 26 + 600, -256 + this.getPipePositionY())
      }
    }
  }

  getPipePositionY() {
    return this._minY + Math.random() * (this._maxY - this._minY)
  }

  gameOver() {
    this.spriteGameOver.node.active = true
    this.spriteInstructions.node.active = true
    this.gameState = GameState.END

    for (let i = 0; i < this._pipes.length; i++) {
      const pipeDown = this._pipes[i].getChildByName('PipeDown')
      const pipeUp = this._pipes[i].getChildByName('PipeUp')

      pipeDown.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)
      pipeUp.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)
    }
  }

  onTouchScreen() {
    if (this.gameState !== GameState.PLAYING) {
      this.gameState = GameState.PLAYING
      this.spriteGetReady.node.active = false
      this.spriteGameOver.node.active = false
      this.spriteInstructions.node.active = false

      for (let i = 0; i < this._pipes.length; i++) {
        const pipeDown = this._pipes[i].getChildByName('PipeDown')
        const pipeUp = this._pipes[i].getChildByName('PipeUp')

        pipeDown.setPosition(144 + 26 + 200 * i, 256 + this.getPipePositionY())
        pipeDown.getComponent(RigidBody2D).linearVelocity = new Vec2(-1.2, 0)
        pipeUp.setPosition(144 + 26 + 200 * i, -256 + this.getPipePositionY())
        pipeUp.getComponent(RigidBody2D).linearVelocity = new Vec2(-1.2, 0)
      }

      this._birdController.resetBird()
    }

    if (this.gameState === GameState.PLAYING) {
      this._birdController.wingFlap()
    }
  }
}
