import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { TechnicianGuard } from './technician.guard';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'services', loadComponent: () => import('./services.component').then(m => m.ServicesComponent) },
	{ path: 'services/:id', loadComponent: () => import('./service-detail.component').then(m => m.ServiceDetailComponent) },
	{ path: 'book/:id', loadComponent: () => import('./book-service.component').then(m => m.BookServiceComponent), canActivate: [AuthGuard] },
	{ path: 'booking-confirmation/:id', loadComponent: () => import('./booking-confirmation.component').then(m => m.BookingConfirmationComponent), canActivate: [AuthGuard] },
	{ path: 'dashboard', loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
	{ path: 'my-bookings', loadComponent: () => import('./my-bookings.component').then(m => m.MyBookingsComponent), canActivate: [AuthGuard] },
	{ path: 'admin', loadComponent: () => import('./admin-page.component').then(m => m.AdminPageComponent), canActivate: [AuthGuard, AdminGuard] },
	{ path: 'technician', loadComponent: () => import('./technician-page.component').then(m => m.TechnicianPageComponent), canActivate: [AuthGuard, TechnicianGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '**', redirectTo: '' }
];
