import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { NewsService } from '../services/news.service';
import { NewsItem } from '../models/NewsItem';
import { catchError } from 'rxjs/operators';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-news',
  providers: [MessageService],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  @ViewChild('p1', { static: false }) firstPaginator: Paginator | undefined;
  @ViewChild('p2', { static: false }) secondPaginator: Paginator | undefined;

  isLoading: boolean = true;
  news: NewsItem[] = [];
  newsChunk: NewsItem[] = [];

  selectedButtonStyleClass: string = 'p-button-rounded bg-indigo-300';
  unselectedButtonStyleClass: string = 'p-button-rounded';
  gridButton: string = this.unselectedButtonStyleClass;
  listButton: string = this.selectedButtonStyleClass;
  newestButton: string = this.selectedButtonStyleClass;
  oldestButton: string = this.unselectedButtonStyleClass;

  constructor(
    private messageService: MessageService,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.newsService
      .fetchAllNews()
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error getting news',
          });
          return error;
        })
      )
      .subscribe((data: any) => {
        this.isLoading = false;
        this.news = data;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'News fetched successfully',
        });
        const newsSort = localStorage.getItem('newsSort');
        this.sortNewsBy(
          newsSort ? newsSort : 'newest',
          document.createEvent('Event')
        );
        const newsView = localStorage.getItem('newsView');
        this.changeViewTo(newsView ? newsView : 'list');
        this.newsChunk = this.news.slice(0, 10);
      });
  }

  redirectTo(url: any): void {
    window.open(url, '_blank');
  }

  sortNewsBy(criteria: string, $event: Event): void {
    if (criteria === 'newest') {
      this.news.sort((a, b) => {
        return b.id! - a.id!;
      });
      this.newestButton = this.selectedButtonStyleClass;
      this.oldestButton = this.unselectedButtonStyleClass;
    } else {
      this.news.sort((a, b) => {
        return a.id! - b.id!;
      });
      this.newestButton = this.unselectedButtonStyleClass;
      this.oldestButton = this.selectedButtonStyleClass;
    }
    localStorage.setItem('newsSort', criteria);
    this.firstPaginator?.changePageToNext($event);
    this.firstPaginator?.changePageToPrev($event);
  }

  changeViewTo(name: string): void {
    const newsContainer = document.getElementById('news-container');
    if (name === 'grid') {
      newsContainer!.classList.remove('news-container');
      newsContainer!.classList.add('news-container-grid');
      this.gridButton = this.selectedButtonStyleClass;
      this.listButton = this.unselectedButtonStyleClass;
    } else {
      newsContainer!.classList.remove('news-container-grid');
      newsContainer!.classList.add('news-container');
      this.gridButton = this.unselectedButtonStyleClass;
      this.listButton = this.selectedButtonStyleClass;
    }
    localStorage.setItem('newsView', name);
  }

  paginate($event: any, paginator: number): void {
    this.newsChunk = this.news.slice($event.first, $event.first + $event.rows);
    if (paginator == 1) {
      this.secondPaginator?.changePage($event.page);
    } else {
      this.firstPaginator?.changePage($event.page);
    }
  }
}
