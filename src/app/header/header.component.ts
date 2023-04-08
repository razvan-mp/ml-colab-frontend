import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { AppComponent } from '../app.component';
import { Note } from '../models/Note';
import { AuthService } from '../services/auth.service';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-header',
  providers: [MessageService],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  displayModal: boolean = false;
  displayCreateNoteModal: boolean = false;
  displaySidebar: boolean = false;
  displayDeleteModal: boolean = false;
  displayEditNoteModal: boolean = false;
  tabViewIndex: number = 0;
  password: string = '';
  passwordConfirm: string = '';
  isLoggedIn: boolean = false;
  createNoteCheckbox: boolean = false;
  selectedNote: any = -1;

  noteTitle: string = '';
  noteContent: string = '';

  notes: Note[] = [];

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.isLoggedIn = AppComponent.loggedIn;
    });

    window.addEventListener('click', (event) => {
      const menu = document.getElementById('algo-menu');
      const menuToggle = document.getElementById('menu-toggle');
      if (event.target !== menu && event.target !== menuToggle) {
        menu?.classList.add('hidden');
      }
    });
  }

  showMenu(): void {
    const menu = document.getElementById('algo-menu');
    menu?.classList.toggle('hidden');
  }
}
