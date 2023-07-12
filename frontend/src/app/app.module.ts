import { NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RootComponent } from './pages/root/root.component';
import { AboutComponent } from './pages/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { MapComponent } from './pages/map/map.component';
import { TodoComponent } from './pages/todo/todo.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserInputComponent } from './components/user-input/user-input.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { ExampleComponent } from './components/example/example.component';
import { LoginComponent } from './pages/login/login.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { MariusBernerComponent } from './components/marius-berner/marius-berner.component';
import { NoahKamaraComponent } from './components/noah-kamara/noah-kamara.component';
import { EmanuelMoellComponent } from './components/emanuel-moell/emanuel-moell.component';
import { NiklasGroeneComponent } from './components/niklas-groene/niklas-groene.component';
import { RegisterComponent } from './pages/register/register.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { ValidatedInputComponent } from './components/validated-input/validated-input.component';
import { AuthService } from './services/auth.service';
import { EventsComponent } from './pages/events/events.component';
import { EventListItemComponent } from './components/event-list-item/event-list-item.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { DevProfileComponent } from './components/dev-profile/dev-profile.component';
import { LocationMapComponent } from './components/location-map/location-map.component';
import { LocationDetailComponent } from './pages/location-detail/location-detail.component';
import { EditProfileNameComponent } from './pages/edit-profile-name/edit-profile-name.component';
import { EditProfileAddressComponent } from './pages/edit-profile-address/edit-profile-address.component';
import { EditProfilePasswordComponent } from './pages/edit-profile-password/edit-profile-password.component';
import { Observable, map } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { EventPaymentComponent } from './pages/event-payment/event-payment.component';
import { PaymentProviderBtnComponent } from './components/payment-provider-btn/payment-provider-btn.component';
import { BachelorCardFormComponent } from './components/payment-forms/bachelor-card-form/bachelor-card-form.component';
import { SWPsafeFormComponent } from './components/payment-forms/swpsafe-form/swpsafe-form.component';
import { HCIPalFormComponent } from './components/payment-forms/hcipal-form/hcipal-form.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { TicketListItemComponent } from './components/ticket-list-item/ticket-list-item.component';
import { ButtonComponent } from './components/button/button.component';
import { PaymentErrorMessageComponent } from './components/payment-forms/payment-error-message/payment-error-message.component';
import { MatSliderModule } from '@angular/material/slider';
import { TicketComponent } from './pages/ticket/ticket.component';
import { ReviewComponent } from './pages/review/review.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';

/**
 *  Hier definieren wir eine Funktion, die wir später (Zeile 43ff) dem Router übergeben.
 *  Damit fangen wir ab, falls ein Benutzer nicht eingeloggt ist,
 *      if (!inject(AuthService).isLoggedIn()) {
 *  leiten den Benutzer an die Startseite weiter
 *      inject(Router).navigate(['/login']);
 *  und sagen dem Angular Router, dass die Route geblockt ist
 *      return false;
 *
 *  (Siehe 'canActivate' Attribut bei den 'routes')
 */
const loginGuard = (): Observable<boolean> => {
  const authObservable = inject(AuthService).checkAuth();
  const router = inject(Router);

  authObservable.subscribe({
    next: value => {
      if (value === true) return;

      console.warn('loginGuard: failure - redirecting to login');
      router.navigate(['/login']);
    },
  });

  return authObservable;
};

const antiLoginGuard = (): Observable<boolean> => {
  const authObservable = inject(AuthService).checkAuth();
  const router = inject(Router);

  authObservable.subscribe({
    next: value => {
      if (value === false) return;
      console.info('antiLoginGuard: user already authenticated - redirecting to map');
      router.navigate(['/map']);
    }
  });

  return authObservable.pipe(map(val => !val));
};

/**
 *  Hier können die verschiedenen Routen definiert werden.
 *  Jeder Eintrag ist eine URL, die von Angular selbst kontrolliert wird.
 *  Dazu wird die angebene Komponente in das "<router-outlet>" der "root" Komponente geladen.
 *
 *  Dokumentation: https://angular.io/guide/router
 */
const routes: Routes = [
  // Authentication
  { path: 'login', component: LoginComponent, canActivate: [antiLoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [antiLoginGuard] },

  // About
  { path: 'about', component: AboutComponent },

  // Map & Locations
  {
    path: 'map',
    canActivate: [loginGuard],
    children: [
      { path: '', component: MapComponent },
      {
        path: ':name', children: [
          { path: '', component: LocationDetailComponent },
          { path: 'reviews', component: ReviewComponent },
        ]
      }
    ]
  },




  // Events
  {
    path: 'events',
    canActivate: [loginGuard],
    children: [
      { path: '', component: EventsComponent },
      {
        path: ':id',
        children: [
          { path: '', component: EventDetailComponent },
          {
            path: 'payment', children: [
              { path: '', component: EventPaymentComponent },
              { path: 'success', component: EventPaymentComponent }
            ]
          }
        ]
      }
    ]
  },
  {
    path: 'tickets',
    canActivate: [loginGuard],
    children: [
      { path: '', component: TicketsComponent },
      { path: ':id', component: TicketComponent }
    ]
  },

  // Routen können auch geschachtelt werden, indem der "Child" Eigenschaft der
  // Route nochmals ein paar Routen übergeben werden.
  // Falls Routen geschachtelt werden muss die "Hauptkomponente" der Schachtelung
  // auch eine <router-outlet> Komponente anbieten, in die "Unterkomponenten" hereingeladen
  // werden können (siehe auch RootComponent)
  {
    path: 'profile',
    canActivate: [loginGuard],
    children: [
      // Falls kein Pfad angegeben ist, wird diese Komponente automatisch geladen
      // (z.B. bei Aufruf von /profile/ )
      { path: '', component: ProfileComponent },
      { path: 'name', component: EditProfileNameComponent },
      { path: 'address', component: EditProfileAddressComponent },
      { path: 'password', component: EditProfilePasswordComponent },
      { path: 'about', component: AboutComponent },
    ]
  },

  // Je nach Konfiguration können wir auf eine andere Route weiterleiten
  // z.B. wollen wir bei Seitenaufruf (wenn keine 'route' festgelegt ist)
  // sofort auf die Login Route weiterleiten
  // { path: '**', redirectTo: '/map' }
];


/**
 *  Hier werden Komponente für Angular "registriert".
 *  Damit Komponenten in HTML verwendet werden können, müssen eigene Komponenten in
 *  "Declarations" eingetragen werden (bei Verwendung von Addons kann das automatisch passieren)
 *  sowie third-party Bibliotheken (bspw. Angular-Material) in die "imports".
 */
@NgModule({
  declarations: [
    RootComponent,
    AboutComponent,
    NavigationBarComponent,
    MapComponent,
    TodoComponent,
    ProfileComponent,
    UserInputComponent,
    ExampleComponent,
    LoginComponent,
    BackButtonComponent,
    MariusBernerComponent,
    NoahKamaraComponent,
    EmanuelMoellComponent,
    NiklasGroeneComponent,
    RegisterComponent,
    TopBarComponent,
    ValidatedInputComponent,
    EventsComponent,
    EventListItemComponent,
    EventDetailComponent,
    DevProfileComponent,
    LocationMapComponent,
    LocationDetailComponent,
    EditProfileNameComponent,
    EditProfileAddressComponent,
    EditProfilePasswordComponent,
    EditDialogComponent,
    EventPaymentComponent,
    PaymentProviderBtnComponent,
    BachelorCardFormComponent,
    SWPsafeFormComponent,
    HCIPalFormComponent,
    TicketsComponent,
    TicketListItemComponent,
<<<<<<< HEAD
    ReviewComponent,
    ReviewComponent,
=======
    ButtonComponent,
    PaymentErrorMessageComponent,
    TicketComponent,
    ReviewComponent,
    ReviewCardComponent
>>>>>>> 2cc9d8ce493ea1943275964cb195de5d9c2317b5
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    LeafletModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatDialogModule,
    MatSliderModule
  ],
  providers: [
    HttpClientModule
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
