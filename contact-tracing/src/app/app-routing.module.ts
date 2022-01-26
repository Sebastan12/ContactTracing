import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {EntryListComponent} from "./entry-list/entry-list.component";
import {AddEntryComponent} from "./add-entry/add-entry.component";
import {SingleEntryComponent} from "./single-entry/single-entry.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'entry', component: EntryListComponent},
  {path: 'entry/add', component: AddEntryComponent},
  {path: 'entry/:id', component: SingleEntryComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
