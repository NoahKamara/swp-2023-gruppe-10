import { NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RootComponent } from './pages/root/root.component';
import { AboutComponent } from './pages/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
import { LoginService } from './services/login.service';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { MariusBernerComponent } from './components/marius-berner/marius-berner.component';
import { NoahKamaraComponent } from './components/noah-kamara/noah-kamara.component';
import { EmanuelMoellComponent } from './components/emanuel-moell/emanuel-moell.component';
import { NiklasGroeneComponent } from './components/niklas-groene/niklas-groene.component';
import { ChangeInfoComponent } from './components/change-info/change-info.component';
import { ChangeAdressComponent } from './components/change-adress/change-adress.component';
import { ChangePwComponent } from './components/change-pw/change-pw.component';
import { ProfileUpdateService } from './services/profile-update.service';



/**
 *  Hier definieren wir eine Funktion, die wir später (Zeile 43ff) dem Router übergeben.
 *  Damit fangen wir ab, falls ein Benutzer nicht eingeloggt ist,
 *      if (!inject(LoginService).isLoggedIn()) {
 *  leiten den Benutzer an die Startseite weiter
 *      inject(Router).navigate(['/login']);
 *  und sagen dem Angular Router, dass die Route geblockt ist
 *      return false;
 * 
 *  (Siehe 'canActivate' Attribut bei den 'routes')
 */
const loginGuard = (): boolean => {
    if (!inject(LoginService).isLoggedIn()) {
        inject(Router).navigate(['/login']);
        return false;
    }
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
    { path: 'register', component: TodoComponent },
    { path: 'about', component: AboutComponent },

    // Durch 'canActive' können wir festlegen, ob eine Route aktiviert werden kann - z.B. können wir
    // die Route sperren, falls der Benutzer nicht eingeloggt ist.
    { path: 'map', component: MapComponent, canActivate: [loginGuard] },
    { path: 'events', component: TodoComponent, canActivate: [loginGuard]  },
    { path: 'tickets', component: TodoComponent, canActivate: [loginGuard]  },

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
            { path: 'editname', component: ChangeInfoComponent },
            { path: 'editaddress', component: ChangeAdressComponent },
            { path: 'editpw', component: ChangePwComponent },



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
        ChangeInfoComponent,
        ChangeAdressComponent,
        ChangePwComponent
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
    ],
    providers: [
        HttpClientModule
    ],
    bootstrap: [RootComponent]
})
export class AppModule { }
