/**
 *  In dieser Datei konfigurieren wir einen Express Webserver, der es uns ermöglicht,
 *  verschiedene Routen anzugeben und zu programmieren.
 *  Hier verzichten wir auf die Klassendefinition, da diese nicht nötig ist.
 *
 *  Weiterführende Links:
 *  https://expressjs.com/en/starter/basic-routing.html
 */

import errorHandler from 'errorhandler';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { initDatabase } from './database/sequelize';
import { ApiController } from './api';
import { AuthController } from './auth';
import { Sequelize } from 'sequelize-typescript';
import { DBUser } from './models/user/user.db';
import { EventController } from './events';
import { DBEvent } from './models/event/event.db';
import { LocationController } from './locations';
import { DBLocation } from './models/db.location';
import { injectLogging } from './utils/logger';
import { DBTicket } from './models/db.ticket';
import { TicketController } from './tickets';
import { DBSession } from './models/session/session.db';
import { HCIPalProvider } from './payment/HCIPalProvider';
import { PaymentProviderInterface } from './payment/PaymentProvider';
import { PaymentController } from './payment';
import { DBController } from './database/DBController';
import { DBReview } from './models/db.review';
import { ReviewController } from './review';
import { DBFavorites } from './models/db.favorites';
import { DBHelpful } from './models/db.helpful';

// Express server instanziieren
const app = express();

// Express Konfiguration
app.set('port', 80);

// "JSON" Daten verarbeiten falls der Request zusätzliche Daten im Request hat
app.use(express.json());
// "UrlEncoded" Daten verarbeiten falls in der Request URL zusätzliche Daten stehen (normalerweise nicht nötig für Angular)
app.use(express.urlencoded({ extended: true }));
// Wir erlauben alle "Cross-Origin Requests". Normalerweise ist man hier etwas strikter, aber für den Softwareprojekt Kurs
// erlauben wir alles um eventuelle Fehler zu vermeiden.
app.use(cors({ origin: '*' }));



app.use(injectLogging);


// Cookies lesen und erstellen
app.use(cookieParser());

// Database

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'admin',
  password: 'CHOOSE_A_PASSWORD',
  database: 'postgres',
  models: [DBUser, DBEvent, DBLocation, DBTicket, DBReview, DBSession,DBFavorites,DBHelpful],
  modelMatch: (filename, member): boolean => {
    console.error(filename, member);
    return true;
  },
  port: 5432
});

const testDB = () => {
  DBUser.count();
  DBEvent.count();
  DBLocation.count();
  DBTicket.count();
  DBSession.count();
  DBFavorites.count();
};


const db = DBController.default;

/**
 *  API Routen festlegen
 *  Hier legen wir in dem "Express" Server neue Routen fest. Wir übergeben die Methoden
 *  unseres "ApiControllers", die dann aufgerufen werden sobald jemand die URL aufruft.
 *  Beispiel
 *  app.get('/api', api.getInfo);
 *       ↑     ↑          ↑
 *       |     |     Diese Methode wird aufgerufen, sobald ein Nutzer die angebene
 *       |     |     URL über einen HTTP GET Request aufruft.
 *       |     |
 *       |   Hier definieren sie die "Route", d.h. diese Route
 *       |   ist unter "http://localhost/api" verfügbar
 *       |
 *   Für diese Route erwarten wir einen GET Request.
 *   Auf derselben Route können wir auch einen POST
 *   Request angeben, für den dann eine andere Methode
 *   aufgerufen wird.
 *
 *  Weiterführende Links:
 *  - Übersicht über verschiedene HTTP Request methoden (GET / POST / PUT / DELETE) https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 *  - REST Architektur: https://de.wikipedia.org/wiki/Representational_State_Transfer
 *
 *  Bitte schaut euch das Tutorial zur Backend-Entwicklung an für mehr Infos bzgl. REST
 */
const api = new ApiController();


/**
 * AUTHENTICATION
 */
const auth = new AuthController({salt: 10 , db: db});
app.post('api/login', auth.login.bind(auth));


app.all('/api/*', auth.authorize.bind(auth));                     // authorization middleware - adds request.local.session & request.local.user

app.post('/api/user', auth.createUser.bind(auth));                // Create New User
app.get('/api/user', auth.getUser.bind(auth));                    // Get Current User
app.patch('/api/user/name', auth.updateName.bind(auth));          // Update Current User Names
app.patch('/api/user/address', auth.updateAddress.bind(auth));    // Update Current User Address
app.patch('/api/user/password', auth.updatePassword.bind(auth));  // Update Current User Password

app.get('/api/auth', auth.getAuth.bind(auth));                    // Get Authorization status (true/false)

app.post('/api/session', auth.login.bind(auth));                  // Sign in & Get Session Token
app.delete('/api/session', auth.logout.bind(auth));               // Invalidate Session

/**
 * Events
 */

const events = new EventController(db);

app.get('/api/events', events.list.bind(events));                              // List Events
app.post('/api/events', events.filterUpcoming.bind(events));
app.get('/api/events/:id', events.details.bind(events));                       // Get Details of Event
app.get('/api/events/:id/isFavorite',events.isFavorite);
app.get('/api/events/:id/favorite', events.toggleFavorite);


const tickets = new TicketController();

app.get('/api/tickets/:id', tickets.detail);                              // List Events
app.get('/api/tickets', tickets.list);                              // List Events

const purchase = new PaymentController();
app.post('/api/purchase', purchase.purchase.bind(purchase));

/**
 * Locations
 */

const locations = new LocationController();

app.get('/api/locations', locations.list);                          // List locations
app.get('/api/locations/:name', locations.lookup);                 // lookup location by name
app.get('/api/locations/:name/rating', locations.lookup2);

/**
 * Reviews
 */
const review = new ReviewController();
 app.get('/api/locations/:name/reviews', review.lookup);            // lookup reviews by locationname
 app.post('/api/locations/:name/reviews', review.postReview);       // post review by locationname
 app.patch('/api/helpful/:reviewID', review.toggleHelpful);       // post review by locationname
 app.get('/api/locations/:name/reviews/me', review.mine);                 // lookup user's review by locationname


/**
 * Other Routes
 */
app.get('/api', api.getInfo);
app.get('/api/marius-berner', api.getMariusBerner);
app.get('/api/noah-kamara', api.getNoahKamara);
app.get('/api/emanuel-moell', api.getEmanuelMoell);
app.get('/api/niklas-groene', api.getNiklasGroene);

// Falls ein Fehler auftritt, gib den Stack trace aus
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

/**
 *  Dateien aus dem "public" und "img" Ordner werden direkt herausgegeben.
 *  D.h. falls eine Datei "myFile.txt" in dem "public" Ordner liegt, schickt der Server
 *  diese Datei wenn die "http://localhost/myFile.txt" URL aufgerufen wird.
 *  Dateien, die im 'img' Ordner liegen, können über den Pfad 'http://localhost/img/'
 *  abgerufen werden.
 *
 *  Das 'frontend/' Projekt wurde so konfiguriert, dass der 'build' Befehl (bzw. 'npm run build')
 *  im Frontend Projekt die 'transpilierten' Dateien in den 'public' Ordner des backend Projekt legen.
 *  Das kann nützlich sein, falls das ganze Projekt via Docker laufbar sein soll
 *  (erst nach Aushandeln für Bonuspunkte via User Story!)
 */
app.use('/', express.static('public'));
app.use('/img', express.static('img'));

/**
 *  Hier wird die "default Route" angegeben, d.h. falls der Server nicht weiß wie er auf "/random-request" antworten soll
 *  wird diese Methode aufgerufen. Das Frontend Angular hat selbst ein eigenes Routing, weswegen wir immer die "index" Seite
 *  von Angular schicken müssen. Falls eine der zuvor angegebenen Routen passt, wird diese Methode nicht aufgerufen.
 *  Diese Route funktioniert erst, sobald der 'build' Schritt im Frontend ausgeführt wurde und ist nur von Relevanz, falls
 *  das Projekt via Docker laufbar sein soll (siehe oben).
 */
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

// Wir machen den konfigurierten Express Server für andere Dateien verfügbar, die diese z.B. Testen oder Starten können.






initDatabase(sequelize);
testDB();

export { auth as authCtrl, events as eventCtrl, locations as locationCtrl, tickets as ticketCtrl, purchase as purchaseCtrl};
export default app;
