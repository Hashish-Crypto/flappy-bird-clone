import { _decorator, Component, Sprite } from 'cc'

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
  @property(Sprite)
  spBg: Sprite[] = [null, null]

  start() {}

  update(deltaTime: number) {
    for (let i = 0; i < this.spBg.length; i++) {
      this.spBg[i].node.setPosition(this.spBg[i].node.position.x - 1, this.spBg[i].node.position.y)
      if (this.spBg[i].node.position.x <= -288) {
        this.spBg[i].node.setPosition(288, this.spBg[i].node.position.y)
      }
    }
  }
}
