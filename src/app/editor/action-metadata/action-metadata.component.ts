import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-action-metadata',
  templateUrl: './action-metadata.component.html',
  styleUrls: ['./action-metadata.component.css']
})
export class ActionMetadataComponent {

  @Input() text = ''
}
