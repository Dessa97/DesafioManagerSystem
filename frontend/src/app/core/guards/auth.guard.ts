import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Verificar se está logado
    if (!this.authService.isLogado()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar se token está expirando (com margem de 1 minuto)
    if (this.authService.tokenEstaExpirando()) {
      // Tentar renovar o token antes de permitir acesso
      return this.authService.renovarToken().pipe(
        map((usuarioRenovado) => {
          // Token renovado com sucesso
          this.authService.salvarDadosUsuario(usuarioRenovado);
          return true;
        }),
        catchError(() => {
          // Falha na renovação, ir para login
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    }

    return true;
  }
}
