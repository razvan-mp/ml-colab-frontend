import { Component } from '@angular/core';
import { Note } from '../models/Note';
import { StateManagerService } from '../services/state-manager.service';
import { NoteService } from '../services/note.service';
import { catchError, of } from 'rxjs';
import { User } from '../models/User';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-user-team-view-modals',
  templateUrl: './user-team-view-modals.component.html',
  styleUrls: ['./user-team-view-modals.component.scss'],
})
export class UserTeamViewModalsComponent {
  constructor(
    private state: StateManagerService,
    private noteService: NoteService,
    private teamsService: TeamsService
  ) {}

  get displayDeleteTeamNoteModal() {
    return this.state.displayDeleteTeamNoteModal;
  }

  get selectedTeamNote() {
    return this.state.selectedTeamNote;
  }

  get selectedTeamNotes() {
    return this.state.selectedTeamNotes;
  }

  get displayEditTeamNoteModal() {
    return this.state.displayEditTeamNoteModal;
  }

  get noteTitle() {
    return this.state.noteTitle;
  }

  get noteContent() {
    return this.state.noteContent;
  }

  hideEditNoteModal(): void {
    this.state.noteContent = '';
    this.state.noteTitle = '';
    this.state.displayEditTeamNoteModal = false;
    this.state.displaySidebar = true;
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

  editTeamNote($event: SubmitEvent, editNoteForm: HTMLFormElement): void {
    $event.preventDefault();
    const formData = Object.fromEntries(
      new FormData(editNoteForm as any) as any
    );
    const selectedNoteObject = this.selectedTeamNotes.find(
      (note: Note) => note.id === this.selectedTeamNote
    )!;

    const payload = {
      id: this.selectedTeamNote,
      title: formData['title'] as string,
      content: formData['content'] as string,
      graph_data: selectedNoteObject.graph_data,
      page: selectedNoteObject.page,
      team_id: selectedNoteObject.team,
    };

    this.noteService.editNote(payload).subscribe(() => {
      this.updateView();
      this.hideEditNoteModal();
    });
  }

  hideDeleteNoteModal(): void {
    this.state.displayDeleteTeamNoteModal = false;
    this.state.displaySidebar = true;
  }

  deleteNote(noteId: any): void {
    this.noteService.deleteNote({ id: noteId }).subscribe((res: any) => {
      this.state.selectedTeamNote = -1;
      this.updateView();
      this.hideDeleteNoteModal();
    });
  }
}
