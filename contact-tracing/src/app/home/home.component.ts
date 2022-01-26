import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message:string = "You are not logged in";
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get('http://localhost:8000/api/user', {withCredentials: true})
      .subscribe((res:any) => {
        console.log(res);
        this.message = `Hi ${res.username}`;
      },
          err => {
            console.log(err);
            this.message = "You are not logged in";
        })
  }

}
