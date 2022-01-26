import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: '',
      password:'',
    })
  }

  submit(): void{
    console.log(this.form.getRawValue())
    this.httpClient.post("http://localhost:8000/api/user", this.form.getRawValue())
      .subscribe(res => {
        this.router.navigate(['/login'])
      });
  }

}
