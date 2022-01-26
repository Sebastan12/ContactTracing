import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: '',
      address: '',
    })
  }

  submit(): void {
    console.log(this.form.getRawValue())
    this.httpClient.post("http://localhost:8000/api/entry", this.form.getRawValue(), {withCredentials: true})
      .subscribe(res => {
        this.router.navigate(['/'])
      });
  }
}
