classDiagram
    class User {
        $byID(id: number) : User
        $byEmail(email: string) : User
        $create(data: UserCreationData) : User

        +public : PublicUser 
        +updateName()
        +updateAddress()
        +updatePassword()

        +tickets: Ticket[]
        +createSession() : Session
        +purchaseTicket(eventID: number) : Ticket
    }

    class Session {
        $byID(id: string) : Session

        +user: User
        +user_id: number
        +sessionId: string
    }

    class Event {
        +id: number
        +title: string
        +start_date: Date
        +end_date: Date
        +location: string
        +picture: string
        +price: number
        +description: string
        +description_html: string

        +tickets: Ticket[]

        $upcoming(): Event[]
        $search(term: string): Event[]
    }

    class Ticket {
        +user: User
        +event: Event
    }

    class Location {
        +user: User
        +event: Event
        +id: number
        +name: string
        +coordinates_lat: number
        +coordinates_lng: number
        +picture: string
        +description: string
        +description_html: string
    }

    User "1" <--> "*"  Session
    User "1" <--> "*"  Ticket
    Event "1" <--> "*"  Ticket
    Event "*" <--> "1"  Location