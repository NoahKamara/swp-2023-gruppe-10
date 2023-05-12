
export interface User {
    email: string
    password: string
    firstName: string
    lastName: string
}

export interface IDUser extends User {
    id: number
}