import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public isLoading = new BehaviorSubject(false);
  constructor() {}

  showLoader(): void {
    this.isLoading.next(true);
  }

  hideLoader(): void {
    this.isLoading.next(false);
  }
}
