import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { BusinessAPI } from 'src/app/core/api/business/business.api';
import { UserEntity } from 'src/app/core/entity/user/user.entity';
import { UserEnum } from 'src/app/lib/enum/user-enum.enum';

interface UserFormModel {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  type: string;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
    @Output()
    public completed = new EventEmitter<UserEntity>();

    public typeEnum = UserEnum;

    public form = new FormGroup({
      email: new FormControl(),
      nom: new FormControl(),
      prenom: new FormControl(),
      telephone: new FormControl(),
      type: new FormControl(),
  });

  public get isUpdate(): boolean {
      return this.user != null;
  }
  
  @Input()
  public user: UserEntity;
  private destroy$ = new Subject<void>();
  
  public constructor(private api: BusinessAPI) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  public ngOnInit(): void {
    this.initForm();
  }
  
  public submit(): void {
    const value: UserFormModel = this.form.value;
    
    const request = this.isUpdate
      ? this.api.user.update({ ...value, id: this.user.id })
      : this.api.user.add(value);
      
    this.form.disable();
    
    request
      .pipe(
        finalize(() => this.form.enable()),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.completed.emit());
  }
  
  private initForm(): void {
    if (!this.isUpdate) {
      return;
    }
    
    this.form.patchValue(this.user);
  }
}
