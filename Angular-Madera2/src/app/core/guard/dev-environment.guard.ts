import { Injectable, isDevMode } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * Route guard bloquant la route si on n'est pas en dev
 */
@Injectable()
export class DevEnvironmentGuard implements CanActivate {
  public constructor(private router: Router) {}

  public canActivate(): boolean | Promise<boolean> {
    return isDevMode() ? true : this.router.navigate(['']);
  }
}
