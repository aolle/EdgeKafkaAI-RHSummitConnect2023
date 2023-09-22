import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SseConsumerComponent } from './sse-consumer.component';

const routes: Routes = [
  { path: 'checkout', component: SseConsumerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
