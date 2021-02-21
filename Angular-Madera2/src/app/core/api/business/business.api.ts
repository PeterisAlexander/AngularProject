import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserResource } from './end-point/user/user.ressource';

const BASE = 'http://localhost:4201/api';

@Injectable({
  providedIn: 'root'
})
export class BusinessAPI {

  public user = new UserResource(this.http, `${BASE}/user`);

  public constructor(private http: HttpClient) {}

}