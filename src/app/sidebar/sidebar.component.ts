import {Component} from '@angular/core';
import {catchError, of} from "rxjs";
import {Note} from "../models/Note";
import {MessageService} from "primeng/api";
import {NoteService} from "../services/note.service";
import {AppComponent} from "../app.component";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  displaySidebar: boolean = false;
  displayCreateNoteModal: boolean = false;
  displayDeleteModal: boolean = false;
  displayEditNoteModal: boolean = false;
  createNoteCheckbox: boolean = false;
  selectedNote: any = -1;
  noteTitle: string = '';
  noteContent: string = '';

  notes: Note[] = [];

  constructor(private messageService: MessageService,
              private noteService: NoteService,
              private authService: AuthService) {
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
    const selectedNoteObject = this.notes.find(
      (note: Note) => note.id === this.selectedNote
    )!;
    this.noteTitle = selectedNoteObject.title as string;
    this.noteContent = selectedNoteObject.content as string;
    this.displayEditNoteModal = true;
    this.hideSidebar();
  }
  hideSidebar(): void {
    this.displaySidebar = false;
  }
  hideEditNoteModal(): void {
    this.displayEditNoteModal = false;
    this.openSidebar();
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
      let data = {};
      let payload = {};
      switch (page) {
        case 'id3':
          data = {
            edges: localStorage.getItem('id3Edges') as string,
            nodes: localStorage.getItem('id3Nodes') as string,
          };
          payload = {
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
          break;
        case 'knn':
          data = localStorage.getItem('knn') as string;
          console.log(data);
          payload = {
            title: formData['title'] as string,
            content: formData['content'] as string,
            graph_data: data,
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
          break;
        case 'hclustering':
          data = localStorage.getItem('hclustering') as string;
          payload = {
            title: formData['title'] as string,
            content: formData['content'] as string,
            graph_data: data,
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
          break;
        case 'kmeans':
          data = localStorage.getItem('kmeans') as string;
          payload = {
            title: formData['title'] as string,
            content: formData['content'] as string,
            graph_data: data,
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
    const formData = Object.fromEntries(
      new FormData(editNoteForm as any) as any
    );
    const selectedNoteObject = this.notes.find(
      (note: Note) => note.id === this.selectedNote
    )!;
    const payload = {
      id: this.selectedNote,
      title: formData['title'] as string,
      content: formData['content'] as string,
      graph_data: selectedNoteObject.graph_data,
      page: selectedNoteObject.page,
    };

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
    const selectedNoteObject = this.notes.find(
      (note: Note) => note.id === this.selectedNote
    )!;
    const page = selectedNoteObject.page;
    let graphData = JSON.parse(selectedNoteObject.graph_data);
    switch (page) {
      case 'id3':
        localStorage.setItem('id3Edges', graphData['edges']);
        localStorage.setItem('id3Nodes', graphData['nodes']);
        window.location.href = '/id3';
        break;
      case 'knn':
        localStorage.setItem('knn', JSON.stringify(graphData));
        window.location.href = '/knn';
        break;
      case 'hclustering':
        localStorage.setItem('hclustering', JSON.stringify(graphData));
        window.location.href = '/hclustering';
        break;
      case 'kmeans':
        localStorage.setItem('kmeans', JSON.stringify(graphData));
        window.location.href = '/kmeans';
        break;
    }
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

}
