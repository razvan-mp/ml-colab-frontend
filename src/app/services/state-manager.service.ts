import { Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { Team } from '../models/Team';

@Injectable({
  providedIn: 'root',
})
export class StateManagerService {
  public displayCreateNoteModal: boolean = false;
  public displayDeleteModal: boolean = false;
  public displayEditNoteModal: boolean = false;
  public createNoteCheckbox: boolean = false;
  public selectedNote: any = -1;
  public noteTitle: string = '';
  public noteContent: string = '';
  public displaySidebar: boolean = true;
  public notes: Note[] = [];
  public teams: Team[] = [];
  public userTeams: Team[] = [];
  constructor() {}
}
