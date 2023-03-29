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
export class HomepageComponent implements OnInit {
  displayModal: boolean = false;

  responsiveOptions: any = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  newsItems: NewsItem[] = [
    {
      title: 'Test',
      hyperlink: 'https://www.google.com',
      image: 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png',
      source: 'Google',
    },
    {
      title: 'Test',
      hyperlink: 'https://www.google.com',
      image: 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png',
      source: 'Google',
    },
    {
      title: 'Test',
      hyperlink: 'https://www.google.com',
      image: 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png',
      source: 'Google',
    }
  ];

  constructor(
    private messageService: MessageService,
    private newsService: NewsService
    ) {}

  ngOnInit(): void {
    this.newsService.fetchNews().subscribe((res: any) => {
      console.log(res);
      this.newsItems = res;
    });
  }

  scroll(target: string) {
    const el = document.getElementById(target)!;
    el.scrollIntoView({ behavior: 'smooth' });
  }

  openLink(hyperlink: string): void {
    window.open(hyperlink, '_blank');
  }
}
