import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {
  form!: FormGroup;
  error:string = "";

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [
        Validators.required
      ]],
      address: ['', [
        Validators.required
      ]],
    })
  }

  get name(){
    return this.form.get('name')!
  }

  get address(){
    return this.form.get('address')!
  }

  submit(): void {
    console.log(this.form.getRawValue())
    this.httpClient.post("http://localhost:8000/api/entry", this.form.getRawValue(), {withCredentials: true})
      .subscribe(res => {
        this.router.navigate(['/'])
      },
        err =>{
          this.error = err.error.message;
        });
  }
}
