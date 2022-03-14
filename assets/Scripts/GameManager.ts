import { _decorator, Component, Sprite, Prefab, Node, instantiate, PhysicsSystem2D, EPhysics2DDrawFlags } from 'cc'

const { ccclass, property } = _decorator

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
  public canvas: Node = null

  @property({ type: Sprite })
  public spBg: Sprite[] = [null, null]

  @property({ type: Prefab })
  public pipePrefab: Prefab | null = null

  @property({ type: Sprite })
  public spriteGameOver: Sprite | null = null

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
  }

  start() {
    for (let i = 0; i < this._pipe.length; i++) {
      this._pipe[i] = instantiate(this.pipePrefab)
      this.canvas.addChild(this._pipe[i])
      this._pipe[i].getChildByName('PipeDown').setPosition(144 + 26 + 200 * i, 256 + this.getPipePositionY())
      this._pipe[i].getChildByName('PipeUp').setPosition(144 + 26 + 200 * i, -256 + this.getPipePositionY())
    }
  }

  update(deltaTime: number) {
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
    console.log('You loose!')
  }
}
