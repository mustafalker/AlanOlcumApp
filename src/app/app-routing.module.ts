import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingDetailComponent } from './components/drawing-detail/drawing-detail.component';
import { DrawingListComponent } from './components/drawing-list/drawing-list.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { RegisterComponent } from './components/register/register.component';
import { AnaSayfaComponent } from './components/ana-sayfa/ana-sayfa.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'drawings', component: DrawingListComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'ana-sayfa', component: AnaSayfaComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
