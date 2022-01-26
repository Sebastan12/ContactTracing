import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {Emitters} from "../emitters/emitters";

@Component({
  selector: 'app-single-entry',
  templateUrl: './single-entry.component.html',
  styleUrls: ['./single-entry.component.scss']
})
export class SingleEntryComponent implements OnInit {
  id:string = "";
  parent_id:string = "";
  name:string = "";
  address:string = "";
  qrInfo:string = "";

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    let param = this.route.snapshot.paramMap.get('id');
    if(param){
      this.id = param;
    }

    this.httpClient.get(`http://localhost:8000/api/entry/${this.id}`, {withCredentials: true})
      .subscribe((res:any) => {
          console.log(res);
          this.name = res.name;
          this.address = res.address;
          this.parent_id = res.parent_id;
          this.qrInfo = `http://localhost:8000/api/entry/${this.id}`
        },
        err => {
          console.log(err);
          this.name = "";
          this.address = "";
          this.parent_id = "";
          this.qrInfo = "";
        })
  }

}
