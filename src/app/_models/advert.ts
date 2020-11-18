export class Advert {
    advertId: number;
    headline: string;
    province: string;
    city: number; 
    advertDetails: string; 
    price: number;
    userId: number;
}

export class DisplayAdvert {
    advertId: number;
    headline: string;
    province: string;
    city: number; 
    advertDetails: string; 
    price: number;
    userId: number;
    publishedDate: Date;
    advertStatus: string;
}