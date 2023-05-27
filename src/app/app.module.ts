import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { MsalModuleService } from './auth/msal-module.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', component: UserComponent, canActivate: [MsalGuard], }
]
const mainModule: NgModule = {
  declarations: [AppComponent, UserComponent],
  imports: [BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule],
  bootstrap: [AppComponent],
  providers: []
}
new MsalModuleService().addMsal(mainModule);
@NgModule({
  declarations: mainModule.declarations,
  imports: mainModule.imports,
  providers: mainModule.providers,
  bootstrap: mainModule.bootstrap
})
export class AppModule { }
