import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faTwitter, faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
  @Input('news') news: any = [];
  faTwitter = faTwitter;
  faFacebook = faFacebookSquare;
  faXmark = faXmark;

  activeNews: any = {};
  twitterLink = ''

  constructor(private modalService: NgbModal) {}

  open(news: any, content: any) {
    this.activeNews = news;
    this.modalService.open(content);
  }
  ngOnInit(): void {}
}
