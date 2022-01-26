import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error:string = "";

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]],
    })
  }

  get username(){
    return this.form.get('username')!
  }

  get password(){
    return this.form.get('password')!
  }

  submit(): void{
    console.log(this.form.getRawValue())
    this.httpClient.post("http://localhost:8000/api/user/login", this.form.getRawValue(), {withCredentials: true})
      .subscribe(res => {
        this.router.navigate(['/'])
      },
        err =>{
          this.error = err.error.message;
        });
  }

}
