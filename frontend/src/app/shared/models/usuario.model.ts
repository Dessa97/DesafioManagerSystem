export interface Usuario {
  login: string;
  nome: string;
  administrador: boolean;
}

export interface UsuarioAutenticado extends Usuario {
  token: string;
  autenticado: boolean;
}

export interface LoginRequest {
  login: string;
  senha: string;
}
