import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="paises-container">
      <div class="user-info">
        <span class="user-name">Bem-vindo, {{ usuarioNome }}</span>
        <button (click)="irParaPaises()" class="btn-paises">Países</button>
        <button (click)="logout()" class="btn-secondary">Sair</button>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f8f9fa;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .user-name {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }

    .btn-paises {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;
    }

    .btn-paises:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class HomeComponent implements OnInit {
  usuarioNome = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.carregarNomeUsuario();
  }

  ngOnInit(): void {
  }

  irParaPaises(): void {
    this.router.navigate(['/list']);
  }

  logout(): void {
    this.authService.logout();
  }

  carregarNomeUsuario(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioObj = JSON.parse(usuario);
      this.usuarioNome = usuarioObj.nome || 'Usuário';
    }
  }
}
