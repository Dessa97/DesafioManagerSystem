import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, UsuarioAutenticado } from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioLogadoSubject = new BehaviorSubject<UsuarioAutenticado | null>(null);
  public usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.verificarTokenExistente();
  }

  login(loginRequest: LoginRequest): Observable<UsuarioAutenticado> {
    return new Observable(observer => {
      this.apiService.postWithoutAuth<UsuarioAutenticado>('/usuario/autenticar', loginRequest).subscribe({
        next: (response) => {
          this.salvarDadosUsuario(response);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
          observer.complete();
        }
      });
    });
  }

  renovarToken(): Observable<UsuarioAutenticado> {
    return this.apiService.get<UsuarioAutenticado>('/usuario/renovar-ticket');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioLogadoSubject.next(null);
    this.router.navigate(['/login']);
  }

  tokenEstaExpirando(): boolean {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (!token || !usuario) {
      return true;
    }

    const usuarioObj = JSON.parse(usuario);
    const loginTime = usuarioObj.loginTime;

    if (!loginTime) {
      return true;
    }

    const agora = new Date().getTime();
    const expiracao = loginTime + (5 * 60 * 1000); // 5 minutos (sincronizado com backend)

    // Retornar true se faltam menos de 1 minuto para expirar
    return agora > (expiracao - 60 * 1000);
  }

  isAdministrador(): boolean {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      return false;
    }

    const usuarioObj = JSON.parse(usuario);
    return usuarioObj.administrador || false;
  }

  isLogado(): boolean {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    return !!(token && usuario);
  }

  salvarDadosUsuario(usuarioAutenticado: UsuarioAutenticado): void {
    const usuarioComTimestamp = {
      ...usuarioAutenticado,
      loginTime: new Date().getTime()
    };

    localStorage.setItem('token', usuarioAutenticado.token);
    localStorage.setItem('usuario', JSON.stringify(usuarioComTimestamp));
    this.usuarioLogadoSubject.next(usuarioComTimestamp);
  }

  private verificarTokenExistente(): void {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (token && usuario) {
      const usuarioObj = JSON.parse(usuario);
      this.usuarioLogadoSubject.next(usuarioObj);
    }
  }
}
