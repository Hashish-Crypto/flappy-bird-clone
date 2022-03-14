import {
  _decorator,
  Component,
  Node,
  EventTouch,
  RigidBody2D,
  Vec2,
  PhysicsSystem2D,
  Contact2DType,
  Collider2D,
} from 'cc'
import { GameManager, GameStatus } from './GameManager'

const { ccclass, property } = _decorator

/**
 * Predefined variables
 * Name = BirdController
 * DateTime = Thu Mar 10 2022 15:42:01 GMT-0300 (Brasilia Standard Time)
 * Author = acquati
 * FileBasename = BirdController.ts
 * FileBasenameNoExtension = BirdController
 * URL = db://assets/Scripts/BirdController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass('BirdController')
export class BirdController extends Component {
  @property({ type: Node })
  public canvas: Node | null = null

  @property({ type: Vec2 })
  public impulse = new Vec2()

  @property({ type: Component })
  public gameManager: GameManager | null = null

  private _flapWing: number = 0
  private _body: RigidBody2D | null = null
  private _isBirdControlEnabled: boolean = true

  onLoad() {
    this.canvas.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
  }

  start() {
    this._body = this.node.getComponent(RigidBody2D)

    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
  }

  update(deltaTime: number) {
    if (this.gameManager.gameStatus !== GameStatus.Game_Playing) return

    this._flapWing -= 1

    if (this._flapWing <= -90) {
      this._flapWing = -90
    }

    this.node.angle = this._flapWing
  }

  onTouchStart(event: EventTouch) {
    if (this._isBirdControlEnabled) {
      if (!this._body) return

      this._body.applyLinearImpulseToCenter(this.impulse, true)

      if (this._flapWing + 60 >= 30) {
        this._flapWing = 30
      } else {
        this._flapWing += 60
      }
    }
  }

  onBeginContact(a: Collider2D, b: Collider2D) {
    this._isBirdControlEnabled = false
    this.gameManager.gameOver()
  }

  resetBird() {
    this.node.setPosition(0, 0)
    this.node.angle = 0
    this._body.gravityScale = 1
    this._body.linearVelocity = new Vec2(0, 0)
    this._body.applyLinearImpulseToCenter(new Vec2(0, 0), true)
    this._isBirdControlEnabled = true
  }
}
