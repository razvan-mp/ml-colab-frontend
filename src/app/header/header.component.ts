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

  loginUser($event: SubmitEvent, loginForm: HTMLFormElement) {
    $event.preventDefault();

    const formData = Object.fromEntries(new FormData(loginForm as any) as any);
    this.authService
      .login(formData['username'] as string, formData['password'] as string)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.detail,
          });
          return '';
        })
      )
      .subscribe((res: any) => {
        if (res['status'] === 200) {
          AppComponent.loggedIn = true;
          localStorage.setItem('username', formData['username'] as string);
          localStorage.setItem('user_id', res.body['user_id']);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'You have successfully logged in!',
          });
          this.displayModal = false;
        }
        loginForm.reset();
      });
  }

  logoutUser(): void {
    this.authService.logout().subscribe((res: any) => {
      if (res['status'] === 200) {
        AppComponent.loggedIn = false;
        localStorage.removeItem('csrfToken');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You have successfully logged out!',
        });
        this.hideSidebar();
        this.authService.getSession();
      }
    });
  }

  whoAmI(): void {
    this.authService
      .whoami()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong. Please try again.',
          });
          return error;
        })
      )
      .subscribe((res: any) => {
        if (res['status'] === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `You are logged in as ${res.body['username']}`,
          });
          localStorage.setItem('username', res.body['username']);
          localStorage.setItem('user_id', res.body['user_id']);
        }
      });
  }

  registerUser($event: SubmitEvent, registerForm: HTMLFormElement): void {
    $event.preventDefault();

    const passwordInput = document.getElementById(
      'password-input'
    ) as HTMLInputElement;
    const passwordConfirmInput = document.getElementById(
      'password-confirm-input'
    ) as HTMLInputElement;
    const formData = Object.fromEntries(
      new FormData(registerForm as any) as any
    );
    const username = formData['username'] as string;
    const email = formData['email'] as string;

    if (this.password !== this.passwordConfirm) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match. Please try again.',
      });

      passwordInput.classList.add('ng-invalid');
      passwordInput.classList.add('ng-dirty');
      passwordConfirmInput.classList.add('ng-invalid');
      passwordConfirmInput.classList.add('ng-dirty');

      setTimeout(() => {
        passwordInput.classList.remove('ng-invalid');
        passwordInput.classList.remove('ng-dirty');
        passwordConfirmInput.classList.remove('ng-invalid');
        passwordConfirmInput.classList.remove('ng-dirty');
      }, 4500);

      return;
    }

    this.authService
      .register(username, email, this.password)
      .subscribe((res: any) => {
        const status = res['status'];
        let detail = '';
        if (res.body['detail'] !== undefined) {
          detail = res.body['detail'] as string;
        }

        if (status === 200 && detail === 'Successfully registered.') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: detail,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: detail,
          });
        }
      });
  }

  setIndex(index: number): void {
    this.tabViewIndex = index;
  }

  showMenu(): void {
    const menu = document.getElementById('algo-menu');
    menu?.classList.toggle('hidden');
  }

  openSidebar(): void {
    this.displaySidebar = true;
    this.noteService
      .fetchNotes()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching notes',
          });
          return of(error);
        })
      )
      .subscribe((res: any) => {
        this.notes = res;
      });
  }

  createNote($event: SubmitEvent, createNoteForm: HTMLFormElement): void {
    $event.preventDefault();
    const formData = Object.fromEntries(
      new FormData(createNoteForm as any) as any
    );
    if (this.onAlgorithmPage() && this.createNoteCheckbox) {
      const page =
        window.location.pathname.split('/')[
          window.location.pathname.split('/').length - 1
        ];
      switch (page) {
        case 'id3':
          const data = {
            edges: localStorage.getItem('id3Edges') as string,
            nodes: localStorage.getItem('id3Nodes') as string,
          };
          const payload = {
            title: formData['title'] as string,
            content: formData['content'] as string,
            graph_data: JSON.stringify(data),
            page: page,
          };
          this.noteService.createNote(payload).subscribe((res: any) => {
            this.hideCreateNoteModal();
            setTimeout(() => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Successfully created note',
              });
            }, 100);
          });
      }
    } else {
      const payload = {
        title: formData['title'] as string,
        content: formData['content'] as string,
      };
      this.noteService.createNote(payload).subscribe((res: any) => {
        this.hideCreateNoteModal();
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully created note',
          });
        }, 100);
      });
    }
  }

  deleteNoteDiv(noteId: number): void {
    const note = document.getElementById(`note-${noteId}`);
    note?.remove();
  }

  deleteNote(noteId: any): void {
    this.noteService.deleteNote({ id: noteId }).subscribe((res: any) => {
      this.selectedNote = -1;
      this.hideDeleteModal();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully deleted note',
        });
      }, 100);
      this.noteService
        .fetchNotes()
        .pipe(
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error fetching notes',
            });
            return of(error);
          })
        )
        .subscribe((res: any) => {
          this.notes = res;
        });
    });
  }

  editNote($event: SubmitEvent, editNoteForm: HTMLFormElement): void {
    $event.preventDefault();
    const formData = Object.fromEntries(new FormData(editNoteForm as any) as any);
    const selectedNoteObject = this.notes.find((note: Note) => note.id === this.selectedNote)!;
    const payload = {
      id: this.selectedNote,
      title: formData['title'] as string,
      content: formData['content'] as string,
      graph_data: selectedNoteObject.graph_data,
      page: selectedNoteObject.page,
    }
    
    this.noteService.editNote(payload).subscribe((res: any) => {
      this.hideEditNoteModal();
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully edited note',
        });
      }, 100);
      this.noteService
        .fetchNotes()
        .pipe(
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error fetching notes',
            });
            return of(error);
          })
        )
        .subscribe((res: any) => {
          this.notes = res;
        });
    });
  }

  loadNote(): void {
    const selectedNoteObject = this.notes.find((note: Note) => note.id === this.selectedNote)!;
    const page = selectedNoteObject.page;
    let graphData = JSON.parse(selectedNoteObject.graph_data);
    switch (page) {
      case 'id3':
        localStorage.setItem('id3Edges', graphData['edges']);
        localStorage.setItem('id3Nodes', graphData['nodes']);
        window.location.href = '/id3';
    }
  }

  hideSidebar(): void {
    this.displaySidebar = false;
  }

  showCreateNoteModal(): void {
    this.displaySidebar = false;
    this.displayCreateNoteModal = true;
  }

  hideCreateNoteModal(): void {
    this.displayCreateNoteModal = false;
    this.openSidebar();
  }

  getUser(): string {
    return localStorage.getItem('username') as string;
  }

  onAlgorithmPage(): boolean {
    const pathSplit = window.location.pathname.split('/');
    const path = pathSplit[pathSplit.length - 1];
    return ['knn', 'id3', 'kmeans', 'hclustering'].includes(path);
  }

  hideDeleteModal(): void {
    this.displayDeleteModal = false;
    this.selectedNote = -1;
    this.openSidebar();
  }

  showDeleteModal(): void {
    this.displayDeleteModal = true;
    this.hideSidebar();
  }

  showEditNoteModal(): void {
    const selectedNoteObject = this.notes.find((note: Note) => note.id === this.selectedNote)!;
    this.noteTitle = selectedNoteObject.title as string;
    this.noteContent = selectedNoteObject.content as string;
    this.displayEditNoteModal = true;
    this.hideSidebar();
  }

  hideEditNoteModal(): void {
    this.displayEditNoteModal = false;
    this.openSidebar();
  }
}
