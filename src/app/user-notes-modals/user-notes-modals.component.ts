import {Component} from '@angular/core';
import {NoteService} from "../services/note.service";
import {MessageService} from "primeng/api";
import {StateManagerService} from "../services/state-manager.service";
import {catchError, of} from "rxjs";
import {Note} from "../models/Note";

@Component({
  selector: 'app-user-notes-modals',
  providers: [MessageService],
  templateUrl: './user-notes-modals.component.html',
  styleUrls: ['./user-notes-modals.component.scss']
})
export class UserNotesModalsComponent {
  constructor(
    private noteService: NoteService,
    private messageService: MessageService,
    private _state: StateManagerService
  ) {
  }

  set displaySidebar(value: boolean) {
    this._state.displaySidebar = value;
  }

  get notes(): Note[] {
    return this._state.notes;
  }

  set notes(value: Note[]) {
    this._state.notes = value;
  }

  get displayCreateNoteModal(): boolean {
    return this._state.displayCreateNoteModal;
  }

  set displayCreateNoteModal(value: boolean) {
    this._state.displayCreateNoteModal = value;
  }

  get displayDeleteModal(): boolean {
    return this._state.displayDeleteModal;
  }

  set displayDeleteModal(value: boolean) {
    this._state.displayDeleteModal = value;
  }

  get displayEditNoteModal(): boolean {
    return this._state.displayEditNoteModal;
  }

  set displayEditNoteModal(value: boolean) {
    this._state.displayEditNoteModal = value;
  }

  get createNoteCheckbox(): boolean {
    return this._state.createNoteCheckbox;
  }

  set createNoteCheckbox(value: boolean) {
    this._state.createNoteCheckbox = value;
  }

  get selectedNote(): any {
    return this._state.selectedNote;
  }

  set selectedNote(value: any) {
    this._state.selectedNote = value;
  }

  get noteTitle(): string {
    return this._state.noteTitle;
  }

  set noteTitle(value: string) {
    this._state.noteTitle = value;
  }

  get noteContent(): string {
    return this._state.noteContent;
  }

  set noteContent(value: string) {
    this._state.noteContent = value;
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
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully created note',
            });
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

  deleteNote(noteId: any): void {
    this.noteService.deleteNote({ id: noteId }).subscribe((res: any) => {
      this.selectedNote = -1;
      this.hideDeleteNoteModal();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully deleted note',
      });
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
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully edited note',
      });
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

  onAlgorithmPage(): boolean {
    const pathSplit = window.location.pathname.split('/');
    const path = pathSplit[pathSplit.length - 1];
    return ['knn', 'id3', 'kmeans', 'hclustering'].includes(path);
  }

  hideDeleteNoteModal(): void {
    this._state.displayDeleteModal = false;
    this._state.displaySidebar = true;
  }


  hideCreateNoteModal(): void {
    this._state.displayCreateNoteModal = false;
    this._state.displaySidebar = true;
  }


  hideEditNoteModal() {
    this._state.displayEditNoteModal = false;
    this._state.displaySidebar = true;
  }
}
