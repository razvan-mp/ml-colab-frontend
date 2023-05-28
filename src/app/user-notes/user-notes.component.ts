import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NoteService } from '../services/note.service';
import { Note } from '../models/Note';
import { StateManagerService } from '../services/state-manager.service';

@Component({
  selector: 'app-user-notes',
  providers: [MessageService],
  templateUrl: './user-notes.component.html',
  styleUrls: ['./user-notes.component.scss'],
})
export class UserNotesComponent implements OnInit {
  get notes(): Note[] {
    return this.state.notes;
  }

  set notes(value: Note[]) {
    this.state.notes = value;
  }

  set selectedNote(value: any) {
    this.state.selectedNote = value;
  }

  get selectedNote() {
    return this.state.selectedNote;
  }

  set noteTitle(value: string) {
    this.state.noteTitle = value;
  }

  set noteContent(value: string) {
    this.state.noteContent = value;
  }

  constructor(
    private messageService: MessageService,
    private noteService: NoteService,
    private state: StateManagerService
  ) {}

  ngOnInit(): void {
    this.getNotes();
  }

  getNotes(): void {
    this.noteService.fetchNotes().subscribe((notes: Note[]) => {
      this.notes = notes;
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
        localStorage.setItem('id3_data', graphData['graph']);
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

  showCreateNoteModal(): void {
    this.state.displaySidebar = false;
    this.state.displayCreateNoteModal = true;
  }

  showDeleteNoteModal(): void {
    this.state.displaySidebar = false;
    this.state.displayDeleteModal = true;
  }

  showEditNoteModal(): void {
    this.notes.forEach((note: Note) => {
      if (this.selectedNote === note.id) {
        this.noteTitle = note.title as string;
        this.noteContent = note.content as string;
      }
    });
    this.state.displaySidebar = false;
    this.state.displayEditNoteModal = true;
  }

  trimContent(content: any) {
    const maxLength = 75;
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  }
}
