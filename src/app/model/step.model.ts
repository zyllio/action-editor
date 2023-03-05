import { StepType } from "./step-type.type"
import { TransitionModel } from "./transition.model"

export type StepModel {

  id: string

  type:StepType

  transitions: TransitionModel[]
}

export interface ActionStepModel extends StepModel {
  type: 'action'
  actionId: string
}

export interface DecisionPointStepModel extends StepModel {
  id: string
  type: 'decision-point'
}
