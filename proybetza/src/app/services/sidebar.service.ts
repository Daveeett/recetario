import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  readonly isOpen = signal(false);

  toggle() {
    this.isOpen.update(open => !open);
  }

  close() {
    this.isOpen.set(false);
  }

  open() {
    this.isOpen.set(true);
  }
}
