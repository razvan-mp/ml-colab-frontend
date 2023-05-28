import { Component } from '@angular/core';
import { NoteService } from '../services/note.service';
import { MessageService } from 'primeng/api';
import { StateManagerService } from '../services/state-manager.service';
import { catchError, of } from 'rxjs';
import { Note } from '../models/Note';
import { User } from '../models/User';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-user-notes-modals',
  providers: [MessageService],
  templateUrl: './user-notes-modals.component.html',
  styleUrls: ['./user-notes-modals.component.scss'],
})
export class UserNotesModalsComponent {
  constructor(
    private noteService: NoteService,
    private messageService: MessageService,
    private teamsService: TeamsService,
    private state: StateManagerService
  ) {}

  set displaySidebar(value: boolean) {
    this.state.displaySidebar = value;
  }

  get notes(): Note[] {
    return this.state.notes;
  }

  set notes(value: Note[]) {
    this.state.notes = value;
  }

  get displayCreateNoteModal(): boolean {
    return this.state.displayCreateNoteModal;
  }

  get displayDeleteModal(): boolean {
    return this.state.displayDeleteModal;
  }

  get displayEditNoteModal(): boolean {
    return this.state.displayEditNoteModal;
  }

  get createNoteCheckbox(): boolean {
    return this.state.createNoteCheckbox;
  }

  set createNoteCheckbox(value: boolean) {
    this.state.createNoteCheckbox = value;
  }

  get selectedNote(): any {
    return this.state.selectedNote;
  }

  set selectedNote(value: any) {
    this.state.selectedNote = value;
  }

  get noteTitle(): string {
    return this.state.noteTitle;
  }

  get noteContent(): string {
    return this.state.noteContent;
  }

  updateView(): void {
    this.teamsService.getTeams().subscribe((res: any) => {
      this.state.teams = res;
      const team = this.state.teams.find(
        (team) => team.id === this.state.selectedTeam
      );
      if (team) {
        this.state.selectedTeamName = team.name;
        this.state.selectedTeamDescription = team.description as string;
        this.state.selectedTeamUsers = team.users as User[];
        this.state.selectedTeamNotes = team.notes as Note[];
      } else {
        this.state.selectedTeamName = '';
        this.state.selectedTeamDescription = '';
        this.state.selectedTeamUsers = [];
        this.state.selectedTeamNotes = [];
      }
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
      let data = {};
      let payload: any = {};
      switch (page) {
        case 'id3':
          data = {
            graph: localStorage.getItem('id3_data') as string,
          };
          payload = {
            title: formData['title'] as string,
            content: formData['content'] as string,
            graph_data: JSON.stringify(data),
            page: page,
          };
          if (this.state.selectedTeam !== -1) {
            payload.team_id = this.state.selectedTeam;
          }
          this.noteService.createNote(payload).subscribe((res: any) => {
            this.updateView();
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
          payload = {
            title: formData['title'] as string,
            content: formData['content'] as string,
            graph_data: data,
            page: page,
          };
          if (this.state.selectedTeam !== -1) {
            payload.team_id = this.state.selectedTeam;
          }
          this.noteService.createNote(payload).subscribe((res: any) => {
            this.updateView();
            this.hideCreateNoteModal();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully created note',
            });
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
          if (this.state.selectedTeam !== -1) {
            payload.team_id = this.state.selectedTeam;
          }
          this.noteService.createNote(payload).subscribe((res: any) => {
            this.updateView();
            this.hideCreateNoteModal();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully created note',
            });
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
          if (this.state.selectedTeam !== -1) {
            payload.team_id = this.state.selectedTeam;
          }
          this.noteService.createNote(payload).subscribe((res: any) => {
            this.updateView();
            this.hideCreateNoteModal();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully created note',
            });
          });
      }
    } else {
      let payload: any = {
        title: formData['title'] as string,
        content: formData['content'] as string,
      };

      if (this.state.selectedTeam !== -1) {
        payload.team_id = this.state.selectedTeam;
      }

      this.noteService.createNote(payload).subscribe((res: any) => {
        this.updateView();
        this.hideCreateNoteModal();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully created note',
        });
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
    this.state.displayDeleteModal = false;
    this.state.displaySidebar = true;
  }

  hideCreateNoteModal(): void {
    this.state.displayCreateNoteModal = false;
    this.state.displaySidebar = true;
  }

  hideEditNoteModal() {
    this.state.displayEditNoteModal = false;
    this.state.displaySidebar = true;
  }
}
