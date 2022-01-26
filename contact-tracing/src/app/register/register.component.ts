import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import validate = WebAssembly.validate;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  error:string = "";

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8)
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
    this.httpClient.post("http://localhost:8000/api/user", this.form.getRawValue())
      .subscribe(res => {
        this.router.navigate(['/login'])
      },
        err =>{
        this.error = err.error.message;
        });
  }

}
