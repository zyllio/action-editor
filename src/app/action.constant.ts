import { ActionModel } from "./editor/model/action.model";

export const ActionSample: ActionModel = {
  id: '12',
  flow: {
    firstStepId: '1',
    steps: [{
      id: '1',
      type: 'action',
      transitions: [{
        name: 'complete',
        next: '2'
      }]
    }, {
      id: '2',
      type: 'action',
      transitions: [{
        name: 'complete'
      }]
    }]
  }
}
