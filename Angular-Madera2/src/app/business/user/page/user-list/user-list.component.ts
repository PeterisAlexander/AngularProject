import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserEntity } from 'src/app/core/entity/user/user.entity';
import { BusinessAPI } from 'src/app/core/api/business/business.api';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  public userList: UserEntity[] = [];

  public isLoading = true;

  private destroy$ = new Subject<void>();

  public constructor( private api: BusinessAPI ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(): void {
    this.isLoading = true;

    this.api.user
      .getAll()
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((u) => (this.userList = u));
  }

}
