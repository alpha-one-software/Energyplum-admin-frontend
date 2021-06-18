import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  uploadEmit: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  upload() {
    this.uploadEmit.emit(); 
  }
}    