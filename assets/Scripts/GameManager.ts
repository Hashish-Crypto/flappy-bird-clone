import { _decorator, Component, Sprite, Prefab, Node, instantiate } from 'cc'

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

  @property(Sprite)
  public spBg: Sprite[] = [null, null]

  @property({ type: Prefab })
  public pipePrefab: Prefab | null = null

  private _pipe: Node[] = [null, null, null]
  private _minY: number = -120
  private _maxY: number = 120

  start() {
    for (let i = 0; i < this._pipe.length; i++) {
      this._pipe[i] = instantiate(this.pipePrefab)
      this.canvas.addChild(this._pipe[i])
      this._pipe[i].setPosition(144 + 26 + 200 * i, this._minY + Math.random() * (this._maxY - this._minY))
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
      this._pipe[i].setPosition(this._pipe[i].position.x - 1, this._pipe[i].position.y)

      if (this._pipe[i].position.x <= -144 - 26) {
        this._pipe[i].setPosition(430, this._minY + Math.random() * (this._maxY - this._minY))
      }
    }
  }
}
