import { Component, OnInit } from '@angular/core';
import {Emitters} from "../emitters/emitters";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  authenticated = false;
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get('http://localhost:8000/api/user', {withCredentials: true})
      .subscribe((res:any) => {
          console.log(res);
          this.authenticated = true;
        },
        err => {
          console.log(err);
          this.authenticated = false;
        });
    Emitters.authEmitter.subscribe(
      (auth:boolean)=>{
        this.authenticated = auth;
      }
    )
  }

  logout(): void{
    this.httpClient.post('http://localhost:8000/api/user/logout', {}, {withCredentials: true})
      .subscribe(()=> this.authenticated = false)
  }

}
