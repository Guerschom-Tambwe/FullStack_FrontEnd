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