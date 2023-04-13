import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {StateManagerService} from "../services/state-manager.service";

@Component({
  selector: 'app-user-socials',
  providers: [MessageService],
  templateUrl: './user-socials.component.html',
  styleUrls: ['./user-socials.component.scss'],
})
export class UserSocialsComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private _state: StateManagerService,
  ) {}

  ngOnInit(): void {}
}
