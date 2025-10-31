import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ServicesComponent } from './services.component';
import { ServiceDetailComponent } from './service-detail.component';
import { BookServiceComponent } from './book-service.component';
import { BookingConfirmationComponent } from './booking-confirmation.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { MyBookingsComponent } from './my-bookings.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'services', component: ServicesComponent },
	{ path: 'services/:id', component: ServiceDetailComponent },
	{ path: 'book/:id', component: BookServiceComponent, canActivate: [AuthGuard] },
	{ path: 'booking-confirmation/:id', component: BookingConfirmationComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '' }
];
