import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Pais } from '../../shared/models/pais.model';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  
  constructor(private apiService: ApiService) {}

  listarTodos(): Observable<Pais[]> {
    return this.apiService.get<Pais[]>('/pais/listar');
  }

  pesquisarPorNome(nome: string): Observable<Pais[]> {
    return this.apiService.get<Pais[]>(`/pais/pesquisar?nome=${nome}`);
  }

  salvar(pais: Pais): Observable<Pais> {
    return this.apiService.post<Pais>('/pais/salvar', pais);
  }

  excluir(id: number): Observable<void> {
    return this.apiService.get<void>(`/pais/excluir?id=${id}`);
  }
}
