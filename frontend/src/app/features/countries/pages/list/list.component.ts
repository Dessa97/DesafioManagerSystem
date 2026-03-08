import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaisService } from '../../../../core/services/pais.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Pais } from '../../../../shared/models/pais.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="paises-container">
      <div class="user-info">
        <span class="user-name">Bem-vindo, {{ usuarioNome }}</span>
        <button (click)="logout()" class="btn-secondary">Sair</button>
      </div>
      <div class="header">
        <h2>Lista de Países</h2>
        <div class="actions">
          <input
            type="text"
            [(ngModel)]="termoBusca"
            (keyup)="buscar()"
            placeholder="Buscar por nome..."
            class="search-input"
          >
          <button
            *ngIf="isAdministrador()"
            (click)="novoPais()"
            class="btn-primary"
          >
            Novo País
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Carregando...</div>

      <div *ngIf="!loading && paises.length === 0" class="no-data">
        Nenhum país encontrado.
      </div>

      <div *ngIf="!loading && paises.length > 0" class="table-container">
        <table class="paises-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Sigla</th>
              <th>Gentílico</th>
              <th *ngIf="isAdministrador()">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let pais of paisesPaginadas">
              <td>{{ pais.id }}</td>
              <td>{{ pais.nome }}</td>
              <td>{{ pais.sigla }}</td>
              <td>{{ pais.gentilico }}</td>
              <td *ngIf="isAdministrador()">
                <button (click)="editar(pais)" class="btn-small btn-edit">Editar</button>
                <button (click)="excluir(pais)" class="btn-small btn-delete">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="totalPaginas > 1" class="pagination">
          <button
            (click)="paginaAnterior()"
            [disabled]="paginaAtual === 1"
            class="btn-pagination"
          >
            Anterior
          </button>
          <span class="page-info">
            Página {{ paginaAtual }} de {{ totalPaginas }}
          </span>
          <button
            (click)="proximaPagina()"
            [disabled]="paginaAtual === totalPaginas"
            class="btn-pagination"
          >
            Próxima
          </button>
        </div>
      </div>

      <div class="back-button-container">
        <button (click)="voltarHome()" class="btn-back">Voltar</button>
      </div>
    </div>
  `,
  styles: [`
    .paises-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .user-info {
      text-align: right;
      margin-bottom: 15px;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #007bff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user-name {
      font-weight: 600;
      color: #333;
      font-size: 16px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .actions {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      min-width: 200px;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .loading {
      text-align: center;
      padding: 40px;
      font-size: 16px;
      color: #666;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      font-size: 16px;
      color: #666;
    }

    .table-container {
      overflow-x: auto;
    }

    .paises-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .paises-table th,
    .paises-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .paises-table th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    .paises-table tbody tr:hover {
      background-color: #f5f5f5;
    }

    .btn-small {
      padding: 4px 8px;
      margin-right: 5px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    }

    .btn-edit {
      background-color: #28a745;
      color: white;
    }

    .btn-edit:hover {
      background-color: #218838;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
    }

    .btn-delete:hover {
      background-color: #c82333;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      margin-top: 20px;
    }

    .btn-pagination {
      padding: 8px 16px;
      border: 1px solid #ddd;
      background-color: white;
      cursor: pointer;
      border-radius: 4px;
    }

    .btn-pagination:hover:not(:disabled) {
      background-color: #f8f9fa;
    }

    .btn-pagination:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 14px;
      color: #666;
    }

    .back-button-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
      padding-right: 20px;
    }

    .btn-back {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .btn-back:hover {
      background-color: #545b62;
    }
  `]
})
export class ListComponent implements OnInit {
  paises: Pais[] = [];
  paisesFiltradas: Pais[] = [];
  paisesPaginadas: Pais[] = [];
  loading = false;
  termoBusca = '';
  paginaAtual = 1;
  itensPorPagina = 10;
  totalPaginas = 1;
  usuarioNome = '';

  constructor(
    private paisService: PaisService,
    public authService: AuthService,
    private router: Router
  ) {
    this.carregarNomeUsuario();
  }

  ngOnInit(): void {
    this.carregarPaises();
  }

  carregarPaises(): void {
    this.loading = true;
    this.paisService.listarTodos().subscribe({
      next: (paises) => {
        this.paises = paises;
        this.paisesFiltradas = paises;
        this.atualizarPaginacao();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Erro ao carregar países. Tente novamente.');
      }
    });
  }

  buscar(): void {
    if (this.termoBusca.trim()) {
      this.loading = true;
      this.paisService.pesquisarPorNome(this.termoBusca).subscribe({
        next: (paises) => {
          this.paisesFiltradas = paises;
          this.paginaAtual = 1;
          this.atualizarPaginacao();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Erro ao buscar países. Tente novamente.');
        }
      });
    } else {
      this.paisesFiltradas = this.paises;
      this.paginaAtual = 1;
      this.atualizarPaginacao();
    }
  }

  novoPais(): void {
    this.router.navigate(['/form']);
  }

  editar(pais: Pais): void {
    this.router.navigate(['/form/' + pais.id]);
  }

  excluir(pais: Pais): void {
    if (confirm(`Tem certeza que deseja excluir o país "${pais.nome}"?`)) {
      this.paisService.excluir(pais.id!).subscribe({
        next: () => {
          this.carregarPaises();
        },
        error: () => {
          alert('Erro ao excluir país. Tente novamente.');
        }
      });
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  voltarHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
  }

  isAdministrador(): boolean {
    return this.authService.isAdministrador();
  }

  carregarNomeUsuario(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioObj = JSON.parse(usuario);
      this.usuarioNome = usuarioObj.nome || 'Usuário';
    }
  }

  private atualizarPaginacao(): void {
    this.totalPaginas = Math.ceil(this.paisesFiltradas.length / this.itensPorPagina);
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.paisesPaginadas = this.paisesFiltradas.slice(inicio, fim);
  }
}
