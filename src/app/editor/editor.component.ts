import { Component, OnInit } from '@angular/core';
import { ActionSample } from '../action.constant';
import { PositionModel } from './dnd-copy.directive';
import { GenerateMapService } from './generate-map.service';
import { StepPositionModel } from './step-position.model';
import { TransitionPositionModel } from './transition-position.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  CellSize = 200

  Margin = 100

  IconShift = 17

  availableActions = ['Action 1', 'Action 2', 'Action 3']

  positions: StepPositionModel[] = []

  transitions: TransitionPositionModel[] = []

  dragging = false

  selection: ActionModel = null

  constructor(private generateMapService: GenerateMapService) {
  }

  ngOnInit(): void {

    this.positions = this.generateMapService.generateStepPositions(ActionSample.flow)
 console.log("this.positions ", this.positions);

    this.transitions = this.generateMapService.generateTransitions(ActionSample.flow)
 console.log("this.transitions ", this.transitions);
  }

  onDroppedActionMetadata(actionMetadata: ActionMetadataModel, position: PositionModel) {

    const index = position.element.tabIndex;

    this.dragging = false

    const action = zyStudioSdk.services.action.createAction(actionMetadata)

    this.actionFlow.actions = this.insert(this.actionFlow.actions, index, action)
  }

  insert<T>(array: T[], index: number, newItem: T): T[] {

    return [
      // part of the array before the specified index
      ...array.slice(0, index),
      // inserted item
      newItem,
      // part of the array after the specified index
      ...array.slice(index)
    ]
  }

  moveAction(action: ActionModel, newPosition: number) {

    const position = this.actionFlow.actions.indexOf(action)

    // Remove element
    this.actionFlow.actions[position] = undefined

    // Insert it
    this.actionFlow.actions = this.insert(this.actionFlow.actions, newPosition, action)

    // Remove first position
    this.actionFlow.actions = this.actionFlow.actions.filter(a => a !== undefined)
  }

  onMovedAction(action: string, position: PositionModel) {

    const index = position.element!.parentElement!.tabIndex;

    this.dragging = false

    this.moveAction(action, index)
  }

  onDragged() {
    this.dragging = true
  }

  onCancelled() {
    this.dragging = false
  }

  setSelection(event: MouseEvent, action: ActionModel) {

    this.selection = action

    if (this.selection) {
      event.stopPropagation()
    }
  }

  unselect(event: MouseEvent) {
    this.setSelection(event, null)
  }

  deleteAction(action: ActionModel) {

    var index = this.actionFlow.actions.indexOf(action)

    this.actionFlow.actions.splice(index, 1)

    this.selection = null
  }
}
