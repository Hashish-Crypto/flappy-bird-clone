import { _decorator, Component, Node, find, EventTouch } from 'cc'

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
  private _speed: number = 0

  onLoad() {
    find('Canvas').on(Node.EventType.TOUCH_START, this.onTouchStart, this)
  }

  start() {}

  update(deltaTime: number) {
    this._speed -= 0.05
    this.node.setPosition(this.node.position.x, this.node.position.y + this._speed)
  }

  onTouchStart(event: EventTouch) {
    this._speed = 2
  }
}
