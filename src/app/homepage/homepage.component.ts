import {Component, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {NewsItem} from '../models/NewsItem';

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
      title: 'News item 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      source: 'https://www.google.com',
      image: 'https://source.unsplash.com/random/1500x300?sig=1',
    },
    {
      title: 'News item 2',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      source: 'https://www.google.com',
      image: 'https://source.unsplash.com/random/1500x300?sig=2',
    },
    {
      title: 'News item 3',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      source: 'https://www.google.com',
      image: 'https://source.unsplash.com/random/1500x300?sig=3',
    },
  ];

  constructor(
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
  }

  scroll(target: string) {
    const el = document.getElementById(target)!;
    el.scrollIntoView({behavior: 'smooth'});
  }
}
