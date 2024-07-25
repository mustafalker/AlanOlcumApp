import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingListComponent } from './components/drawing-list/drawing-list.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { RegisterComponent } from './components/register/register.component';
import { AnaSayfaComponent } from './components/ana-sayfa/ana-sayfa.component';
import { AuthGuard } from './Auth Services/auth.guard';
import { EditDrawingComponent } from './components/edit-drawing/edit-drawing.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'drawings', component: DrawingListComponent, canActivate: [AuthGuard] },
  { path: 'edit-drawing/:id', component: EditDrawingComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
