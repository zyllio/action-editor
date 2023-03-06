import { Component, OnInit } from '@angular/core';
import { ActionSample } from '../action.constant';
import { GenerateMapService } from './generate-map.service';
import { StepModel } from './model/step.model';
import { StepPositionModel } from './step-position.model';
import { TransitionPositionModel } from './transition-position.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  positions: StepPositionModel[] = []

  transitions: TransitionPositionModel[] = []

  constructor(private generateMapService: GenerateMapService) {
  }

  ngOnInit(): void {

    this.positions = this.generateMapService.generateStepPositions(ActionSample.flow)

    this.transitions = this.generateMapService.generateTransitions(ActionSample.flow)
  }
}
