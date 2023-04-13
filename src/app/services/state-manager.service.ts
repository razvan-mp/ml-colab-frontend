import { Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { Team } from '../models/Team';

@Injectable({
  providedIn: 'root',
})
export class StateManagerService {
  public displaySidebar: boolean = true;
  public displayAuthModal: boolean = false;
  public displayCreateNoteModal: boolean = false;
  public displayDeleteModal: boolean = false;
  public displayEditNoteModal: boolean = false;
  public createNoteCheckbox: boolean = false;
  public selectedNote: any = -1;
  public noteTitle: string = '';
  public noteContent: string = '';
  public notes: Note[] = [];
  public teams: Team[] = [];
  public userTeams: Team[] = [];
  public selectedTeam: any = -1;
  public selectedTeamName: string = '';
  public selectedTeamDescription: string = '';
  public displayCreateTeamModal: boolean = false;
  public displayDeleteTeamModal: boolean = false;
  public displayTeamSidebar: boolean = false;
  constructor() {}
}
