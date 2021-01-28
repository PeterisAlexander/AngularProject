import { Component, Input, OnInit } from '@angular/core';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  @Input()
  public emailModel: LoginModel;

  public constructor() {}

  public ngOnInit(): void {}

  public submitLogIn(): void {
    console.log(this.emailModel);
  }
}
