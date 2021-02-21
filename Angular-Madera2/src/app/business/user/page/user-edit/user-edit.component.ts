import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEntity } from 'src/app/core/entity/user/user.entity';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public user: UserEntity;

  public constructor(
    public router: Router,
    private activated: ActivatedRoute
  ) {}

  public ngOnInit(): void {
      this.user = this.activated.snapshot.data.user;
  }

}
