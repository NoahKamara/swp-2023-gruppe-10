import { NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RootComponent } from './pages/root/root.component';
import { AboutComponent } from './pages/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

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
import { DevProfileComponent } from './dev-profile/dev-profile.component';
import { LocationMapComponent } from './components/location-map/location-map.component';

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
const loginGuard = (): boolean => {
  console.info('loginGuard', 'testing auth status');

  if (!inject(AuthService).isLoggedIn()) {
    console.warn('loginGuard', 'not authenticated');
    inject(Router).navigate(['/login']);
    return false;
  }
  console.info('loginGuard', 'auth ok');

  return true;
};

/**
 *  Hier können die verschiedenen Routen definiert werden.
 *  Jeder Eintrag ist eine URL, die von Angular selbst kontrolliert wird.
 *  Dazu wird die angebene Komponente in das "<router-outlet>" der "root" Komponente geladen.
 *
 *  Dokumentation: https://angular.io/guide/router
 */
const routes: Routes = [
  // Jede Route, die wir festlegen wollen, braucht eine Komponente,
  // die beim Laden der Route instanziiert und angezeigt wird.
  // Die hier angegebenen Routen sind ein Beispiel; die "TodoComponent"
  // sollten über den Lauf des Projektes ausgetauscht werden
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },

  // Durch 'canActive' können wir festlegen, ob eine Route aktiviert werden kann - z.B. können wir
  // die Route sperren, falls der Benutzer nicht eingeloggt ist.
  { path: 'map', component: MapComponent, canActivate: [loginGuard] },
  { path: 'events', component: EventsComponent}, //canActivate: [loginGuard] },
  { path: 'events/:id', component: EventDetailComponent}, //canActivate: [loginGuard] },
  { path: 'tickets', component: TodoComponent, canActivate: [loginGuard] },

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
      // Ansonsten werden die Pfade geschachtelt - folgende Komponente wird über den Pfad
      // "/profile/edit" geladen.
      { path: 'edit', component: TodoComponent },
      // Alternativ können die Seiten (Komponenten) auch wiederverwendet werden auf mehreren Routen
      { path: 'about', component: AboutComponent },
    ]
  },

  // Je nach Konfiguration können wir auf eine andere Route weiterleiten
  // z.B. wollen wir bei Seitenaufruf (wenn keine 'route' festgelegt ist)
  // sofort auf die Login Route weiterleiten
  { path: '**', redirectTo: '/map' }
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
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    LeafletModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule
  ],
  providers: [
    HttpClientModule
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
