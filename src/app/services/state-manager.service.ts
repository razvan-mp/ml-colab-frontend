import { Injectable } from '@angular/core';
import { Note } from '../models/Note';
import { Team } from '../models/Team';
import { FriendRequest } from '../models/FriendRequest';
import { User } from '../models/User';
import { Friend } from '../models/Friend';

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
  public selectedTeamUsers: User[] = [];
  public selectedTeam: any = -1;
  public selectedTeamName: string = '';
  public selectedTeamDescription: string = '';
  public displayManageTeamModal: boolean = false;
  public displayCreateTeamModal: boolean = false;
  public displayRemoveUserModal: boolean = false;
  public selectedTeamUser: any = null;
  public displayDeleteTeamModal: boolean = false;
  public displayTeamSidebar: boolean = false;

  public friendRequests: FriendRequest[] = [];
  public users: User[] = [];
  public friends: Friend[] = [];
  public selectedFriend: string = '';
  public displayDeleteFriendModal: boolean = false;
  public displayCancelRequestModal: boolean = false;

  constructor() {}
}
