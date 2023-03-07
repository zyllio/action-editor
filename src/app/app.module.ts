import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { ActionComponent } from './editor/action/action.component';
import { DecisionPointComponent } from './editor/decision-point/decision-point.component';
import { TransitionComponent } from './editor/transition/transition.component';
import { ActionMetadataComponent } from './editor/action-metadata/action-metadata.component';
import { DndCopyDirective } from './editor/dnd-copy.directive';
import { DrophereComponent } from './editor/drophere/drophere.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ActionComponent,
    DecisionPointComponent,
    TransitionComponent,
    ActionMetadataComponent,
    DndCopyDirective,
    DrophereComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
