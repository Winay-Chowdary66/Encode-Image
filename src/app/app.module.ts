import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragAndDropDirective } from './directives/dradanddrop.directive';
import { UploadImageComponent } from './upload-image/upload-image.component';

@NgModule({
  declarations: [AppComponent, UploadImageComponent, DragAndDropDirective],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  providers: [UploadImageComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
