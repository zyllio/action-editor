import { ActionModel } from "./model/action.model";

export const ActionSample: ActionModel = {
  id: '12',
  flow: {
    firstStepId: '1',
    steps: [{
      id: '1',
      type: 'action',
      transitions: [{
        name: 'complete',
        next: 'end'
      }]
    }]
  }
}
