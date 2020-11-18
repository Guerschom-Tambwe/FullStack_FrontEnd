//import { Role } from './role';

export class User {
    id: number;
    email: string;
    password: string;
    forenames: string;
    surname: string;
    role: string;
    token?: string;
}

export class RegisterUser {
    email: string;
    password: string;
    confirmPassword: string;
    forenames: string;
    surname: string;
}