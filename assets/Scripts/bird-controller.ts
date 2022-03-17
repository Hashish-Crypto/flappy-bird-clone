import { _decorator, Component, Node, RigidBody2D, Vec2, PhysicsSystem2D, Contact2DType, Collider2D } from 'cc'
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

  @property({ type: Component })
  public gameManager: GameManager | null = null

  private _birdAngle: number = 0
  private _body: RigidBody2D | null = null

  start() {
    PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
  }

  update(deltaTime: number) {
    if (this.gameManager.gameState !== GameState.PLAYING) return
    if (this.node.position.y > 256 + 12) {
      this.gameManager.gameOver()
      return
    }

    this._birdAngle -= 1

    if (this._birdAngle <= -90) {
      this._birdAngle = -90
    }

    this.node.angle = this._birdAngle
  }

  onBeginContact(a: Collider2D, b: Collider2D) {
    this.gameManager.gameOver()
  }

  wingFlap() {
    if (!this._body) return

    this._body.applyLinearImpulseToCenter(this.impulse, true)

    if (this._birdAngle + 60 >= 30) {
      this._birdAngle = 30
    } else {
      this._birdAngle += 60
    }
  }

  resetBird() {
    this.node.active = true
    this.node.setPosition(0, 0)
    this.node.angle = 0

    this._body = this.node.getComponent(RigidBody2D)
    this._body.gravityScale = 1
    this._body.linearVelocity = new Vec2(0, 0)
  }
}
