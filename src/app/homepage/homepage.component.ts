import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NewsItem } from '../models/NewsItem';
import { NewsService } from '../services/news.service';

@Component({
  selector: 'app-homepage',
  providers: [MessageService],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  constructor(
    private messageService: MessageService,
    private newsService: NewsService
  ) {}

  scroll(target: string) {
    const el = document.getElementById(target)!;
    el.scrollIntoView({ behavior: 'smooth' });
  }

  openLink(hyperlink: string): void {
    window.open(hyperlink, '_blank');
  }
}
