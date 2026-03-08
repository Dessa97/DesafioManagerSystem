import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import {
  Observable,
  throwError,
  catchError,
  switchMap,
  BehaviorSubject
} from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsuarioAutenticado } from '../../shared/models/usuario.model';

// Subject para controlar refresh de token em andamento
let seRefreshando = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  // Adicionar token à requisição se existir
  const token = localStorage.getItem('token');
  if (token) {
    req = adicionarToken(req, token);
  }

  return next(req).pipe(
    catchError((erro: any) => {
      // Se receber 401, tentar renovar o token
      if (erro instanceof HttpErrorResponse && erro.status === 401) {
        return tratarErro401(req, next, http, router);
      }

      return throwError(() => erro);
    })
  );
};

function adicionarToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
  // Não adicionar Authorization apenas a requisições de autenticação inicial
  if (req.url.includes('/usuario/autenticar')) {
    return req;
  }

  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function tratarErro401(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  http: HttpClient,
  router: Router
): Observable<HttpEvent<any>> {
  const tokenAtual = localStorage.getItem('token');

  // Se não tem token, ir para login
  if (!tokenAtual) {
    router.navigate(['/login']);
    return throwError(() => new Error('Sem token disponível'));
  }

  // Se já está tentando renovar, aguardar o resultado
  if (seRefreshando) {
    return refreshTokenSubject.pipe(
      switchMap((novoToken: string | null) => {
        if (novoToken) {
          const reqComNovoToken = adicionarToken(req, novoToken);
          return next(reqComNovoToken);
        } else {
          // Falhou na renovação
          return throwError(() => new Error('Falha na renovação do token'));
        }
      })
    );
  }

  // Marca que está renovando
  seRefreshando = true;

  // Tentar renovar o token
  return renovarToken(tokenAtual, http).pipe(
    switchMap((resposta: UsuarioAutenticado) => {
      seRefreshando = false;

      // Salvar novo token
      localStorage.setItem('token', resposta.token);
      localStorage.setItem('usuario', JSON.stringify({
        ...resposta,
        loginTime: new Date().getTime()
      }));

      // Notificar sucesso
      refreshTokenSubject.next(resposta.token);

      // Refazer requisição original com novo token
      const reqComNovoToken = adicionarToken(req, resposta.token);
      return next(reqComNovoToken);
    }),
    catchError((erro) => {
      seRefreshando = false;

      // Falhou na renovação, deslogar usuário
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      refreshTokenSubject.next(null);

      router.navigate(['/login']);

      return throwError(() => new Error('Falha na autenticação. Faça login novamente.'));
    })
  );
}

function renovarToken(token: string, http: HttpClient): Observable<UsuarioAutenticado> {
  return http.get<UsuarioAutenticado>('http://localhost:8080/api/usuario/renovar-ticket', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}
