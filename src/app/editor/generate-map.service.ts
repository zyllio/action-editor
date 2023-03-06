import { Injectable } from '@angular/core';
import { ActionFlowModel } from './model/action-flow.model';
import { StepPositionModel } from './step-position.model';
import { TransitionPositionModel } from './transition-position.model';

@Injectable({
  providedIn: 'root'
})
export class GenerateMapService {

  generateStepPositions(flow: ActionFlowModel): StepPositionModel[] {

    const positions = flow.steps
      .map((step, i) => {
        return {
          stepId: step.id,
          x: i,
          y: 0
        }
      })

    return positions
  }

  generateTransitions(flow: ActionFlowModel): TransitionPositionModel[] {

    // Compute Transition Ids (from, to)[]
    const transitionIds = flow.steps
      .flatMap((step, i) => {

        return step.transitions
          .filter(transition => transition.next !== undefined)
          .map(transition => {
            return {
              fromId: step.id,
              toId: transition.next!
            }
          })
      })

    const stepPositions = this.generateStepPositions(flow)

    return transitionIds.map(({ fromId, toId }) => {

      const fromPosition = stepPositions.find(sp => sp.stepId === fromId)

      const toPosition = stepPositions.find(sp => sp.stepId === toId)

      return {
        fromX: fromPosition!.x,
        toX: toPosition!.x,
        fromY: fromPosition!.y,
        toY: toPosition!.y
      }
    })

  }
}
