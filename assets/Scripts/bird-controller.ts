import {
  _decorator,
  Component,
  Node,
  RigidBody2D,
  Vec2,
  PhysicsSystem2D,
  Contact2DType,
  Collider2D,
  Vec3,
  CCInteger,
  Animation,
} from 'cc'
import { GameManager, GameState } from './game-manager'

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

  @property({ type: CCInteger })
  public upwardTorque: number | null = null

  @property({ type: CCInteger })
  public downwardTorque: number | null = null

  @property({ type: Component })
  public gameManager: GameManager | null = null

  private _body: RigidBody2D | null = null
  private _animation: Animation | null = null

  onLoad() {
    this._body = this.node.getComponent(RigidBody2D)
    this._animation = this.node.getComponent(Animation)
  }

  start() {
    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
  }

  update(deltaTime: number) {
    if (this.gameManager.gameState !== GameState.PLAYING) return

    if (this.node.position.y > 256 + 12) {
      this.gameManager.gameOver()
      return
    }

    if (this.node.eulerAngles.z >= 40) {
      this._body.angularVelocity = 0
      this.node.setRotationFromEuler(new Vec3(0, 0, 40))
      this._body.applyTorque(this.downwardTorque, true)
    }
    if (this.node.eulerAngles.z <= -85) {
      this._body.angularVelocity = 0
      this.node.setRotationFromEuler(new Vec3(0, 0, -85))
    }

    this.node.setPosition(0, this.node.position.y)
  }

  onBeginContact(a: Collider2D, b: Collider2D) {
    if (a.tag === 0) {
      this.gameManager.gameOver()
    } else if (a.tag === 1) {
      this.gameManager.passedBetweenPipes()
    }
  }

  flapWings() {
    if (!this._body) return

    this._animation.play('BirdFlapWingsAnim')
    this._body.applyLinearImpulseToCenter(this.impulse, true)
    this._body.applyTorque(this.upwardTorque, true)
  }

  resetBird() {
    this.node.setPosition(0, 0)
    this.node.setRotationFromEuler(new Vec3(0, 0, 0))
    this._body.gravityScale = 1
    this._body.angularVelocity = 0
    this._body.linearVelocity = new Vec2(0, 0)
  }
}
