import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Emitters} from "../emitters/emitters";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {
  authenticated = false;
  entries = [];

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient.get('http://localhost:8000/api/entry', {withCredentials: true})
      .subscribe((res: any) => {
          console.log(res);
          this.entries = res;
          this.authenticated = true;
        },
        err => {
          console.log(err);
          this.authenticated = false;
        });
  }

}
