import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ValidatorService {

  public usernamePattern: string = "^([A-Za-z0-9]+)$";
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public namePattern: string = "^[a-zA-Zá-ú,.'-]+$";
  public lowerLettersAndNumbers: string = "^[a-z0-9]+$";
  public phoneNumber: string = "^([0-9]{8})|([0-9]{4}-[0-9]{4})$";

  constructor() { }
}
