import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError, catchError, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Verificar se o token está expirando ANTES de cada requisição
  const usuario = localStorage.getItem('usuario');
  if (usuario) {
    const usuarioObj = JSON.parse(usuario);
    const loginTime = usuarioObj.loginTime;
    const agora = new Date().getTime();
    const expiracao = loginTime + (4 * 60 * 1000); // 4 minutos

    if (agora > expiracao) {
      return renovarTokenERefazer(req, next);
    }
  }

  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Fallback: tentar renovação se verificação falhar
        return renovarTokenERefazer(req, next);
      }
      return throwError(error);
    })
  );
};

function renovarTokenERefazer(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const tokenAtual = localStorage.getItem('token');

  if (!tokenAtual) {
    return throwError(() => new Error('Nenhum token disponível'));
  }

  return new Observable(observer => {
    const renovarReq = new XMLHttpRequest();
    renovarReq.open('POST', 'http://localhost:8080/api/usuario/renovar-ticket');
    renovarReq.setRequestHeader('Content-Type', 'application/json');
    renovarReq.setRequestHeader('Authorization', `Bearer ${tokenAtual}`);

    renovarReq.onload = () => {
      if (renovarReq.status === 200) {
        try {
          const tokenResponse = JSON.parse(renovarReq.responseText);

          // Salvar token e dados do usuário
          localStorage.setItem('token', tokenResponse.token);
          localStorage.setItem('usuario', JSON.stringify({
            ...tokenResponse,
            loginTime: new Date().getTime()
          }));

          // Refazer requisição original com novo token
          const clonedReq = req.clone({
            setHeaders: { Authorization: `Bearer ${tokenResponse.token}` }
          });

          next(clonedReq).subscribe({
            next: (response) => observer.next(response),
            error: (err) => observer.error(err),
            complete: () => observer.complete()
          });

        } catch (e) {
          observer.error(e);
        }
      } else {
        // Se falhar renovação, limpar e redirecionar
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        observer.error(new Error('Falha na renovação do token'));
      }
    };

    renovarReq.onerror = () => {
      observer.error(new Error('Erro na comunicação com servidor'));
    };

    renovarReq.send();
  });
}
