import { StepModel } from "./step.model";

export interface ActionFlowModel {
  
  firstStepId: string

  steps: StepModel[]
}
