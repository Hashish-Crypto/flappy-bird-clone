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
  Label,
} from 'cc'
import { BirdController } from './bird-controller'

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
  public bird: Node | null = null

  @property({ type: Node })
  public pipesPlaceholder: Node | null = null

  @property({ type: Prefab })
  public prefabPipe: Prefab | null = null

  @property({ type: Sprite })
  public spriteGround: Sprite[] | null[] = [null, null]

  @property({ type: Sprite })
  public spriteGetReady: Sprite | null = null

  @property({ type: Sprite })
  public spriteGameOver: Sprite | null = null

  @property({ type: Sprite })
  public spriteInstructions: Sprite | null = null

  @property({ type: Label })
  public labelScore: Label | null = null

  public gameState: GameState = GameState.INIT
  private _birdController: BirdController | null = null
  private _pipes: Node[] = [null, null, null]
  private _minY: number = -60
  private _maxY: number = 60
  private _velocity: number = -1.2
  private _gameScore: number = 0
  private _debug: boolean = true

  onLoad() {
    if (this._debug) {
      PhysicsSystem2D.instance.debugDrawFlags =
        EPhysics2DDrawFlags.Aabb |
        EPhysics2DDrawFlags.Pair |
        EPhysics2DDrawFlags.CenterOfMass |
        EPhysics2DDrawFlags.Joint |
        EPhysics2DDrawFlags.Shape
    }

    this.pipesPlaceholder.active = false
    this._birdController = this.bird.getComponent(BirdController)
    this.bird.active = false
    this.spriteGetReady.node.active = true
    this.spriteGameOver.node.active = false
    this.spriteInstructions.node.active = true
    this.canvas.on(Node.EventType.TOUCH_START, this.onTouchScreen, this)
  }

  start() {
    for (let i = 0; i < this._pipes.length; i++) {
      this._pipes[i] = instantiate(this.prefabPipe)
      this.pipesPlaceholder.addChild(this._pipes[i])
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
      const scoreSensor = this._pipes[i].getChildByName('ScoreSensor')

      if (pipeDown.position.x <= -144 - 26) {
        const _pipesGap = this.getPipePositionY()
        pipeDown.setPosition(-144 - 26 + 600, 256 + _pipesGap)
        pipeUp.setPosition(-144 - 26 + 600, -256 + _pipesGap)
        scoreSensor.setPosition(-144 - 26 + 600, _pipesGap)
      }
    }

    for (let i = 0; i < this.spriteGround.length; i++) {
      if (this.spriteGround[i].node.position.x <= -24 - 336) {
        this.spriteGround[i].node.setPosition(-24 + 336, this.spriteGround[i].node.position.y)
      }
    }
  }

  getPipePositionY() {
    return this._minY + Math.random() * (this._maxY - this._minY)
  }

  passedBetweenPipes() {
    this._gameScore += 1
    this.labelScore.string = this._gameScore.toString()
  }

  gameOver() {
    this.gameState = GameState.END
    this.spriteGameOver.node.active = true
    this.spriteInstructions.node.active = true

    for (let i = 0; i < this._pipes.length; i++) {
      const pipeDown = this._pipes[i].getChildByName('PipeDown')
      const pipeUp = this._pipes[i].getChildByName('PipeUp')
      const scoreSensor = this._pipes[i].getChildByName('ScoreSensor')

      pipeDown.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)
      pipeUp.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)
      scoreSensor.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)
    }

    for (let i = 0; i < this.spriteGround.length; i++) {
      this.spriteGround[i].node.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0)
    }
  }

  onTouchScreen() {
    if (this.gameState !== GameState.PLAYING) {
      this.gameState = GameState.PLAYING
      this.pipesPlaceholder.active = true
      this.spriteGetReady.node.active = false
      this.spriteGameOver.node.active = false
      this.spriteInstructions.node.active = false
      this._gameScore = 0
      this.labelScore.string = this._gameScore.toString()

      for (let i = 0; i < this._pipes.length; i++) {
        const pipeDown = this._pipes[i].getChildByName('PipeDown')
        const pipeUp = this._pipes[i].getChildByName('PipeUp')
        const scoreSensor = this._pipes[i].getChildByName('ScoreSensor')

        const _pipesGap = this.getPipePositionY()
        pipeDown.setPosition(144 + 26 + 200 * i, 256 + _pipesGap)
        pipeDown.getComponent(RigidBody2D).linearVelocity = new Vec2(this._velocity, 0)
        pipeUp.setPosition(144 + 26 + 200 * i, -256 + _pipesGap)
        pipeUp.getComponent(RigidBody2D).linearVelocity = new Vec2(this._velocity, 0)
        scoreSensor.setPosition(144 + 26 + 200 * i, _pipesGap)
        scoreSensor.getComponent(RigidBody2D).linearVelocity = new Vec2(this._velocity, 0)
      }

      for (let i = 0; i < this.spriteGround.length; i++) {
        this.spriteGround[i].node.setPosition(24 + 336 * i, -256)
        this.spriteGround[i].node.getComponent(RigidBody2D).linearVelocity = new Vec2(this._velocity, 0)
      }

      this.bird.active = true
      this._birdController.resetBird()
    }

    if (this.gameState === GameState.PLAYING) {
      this._birdController.flapWings()
    }
  }
}
