import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../shared/models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Sistema de Gerenciamento de Países</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="login">Login:</label>
            <input 
              id="login" 
              type="text" 
              formControlName="login" 
              class="form-control"
              placeholder="Digite seu login"
            >
            <div *ngIf="loginForm.get('login')?.invalid && loginForm.get('login')?.touched" class="error-message">
              Login é obrigatório
            </div>
          </div>
          
          <div class="form-group">
            <label for="senha">Senha:</label>
            <input 
              id="senha" 
              type="password" 
              formControlName="senha" 
              class="form-control"
              placeholder="Digite sua senha"
            >
            <div *ngIf="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched" class="error-message">
              Senha é obrigatória
            </div>
          </div>
          
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <button type="submit" [disabled]="loginForm.invalid || loading" class="btn-login">
            <span *ngIf="!loading">Entrar</span>
            <span *ngIf="loading">Autenticando...</span>
          </button>
        </form>
        
        <div class="demo-credentials">
          <h4>Credenciais de Demonstração:</h4>
          <p><strong>Usuário Comum - </strong> <span class="blue-text">login</span>: convidado / <span class="blue-text">senha</span>: manager</p>
          <p><strong>Administrador - </strong> <span class="blue-text">login</span>: admin / <span class="blue-text">senha</span>: suporte</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      transform: translateX(-50%);
      position: absolute;
      left: 50%;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #333;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
    
    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .btn-login {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-login:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .btn-login:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .demo-credentials {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #007bff;
    }
    
    .demo-credentials h4 {
      margin: 0 0 0.5rem 0;
      color: #007bff;
    }
    
    .demo-credentials p {
      margin: 0.25rem 0;
      font-size: 0.875rem;
    }
    
    .blue-text {
      color: #007bff;
      font-weight: 500;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      senha: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = this.loginForm.value;

    this.authService.login(loginRequest).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Credenciais inválidas. Tente novamente.';
        this.loading = false;
      }
    });
  }
}
