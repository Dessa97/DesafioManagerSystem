import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaisService } from '../../../../core/services/pais.service';
import { Pais } from '../../../../shared/models/pais.model';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="manage-container">
      <div class="header">
        <h2>{{ isEdicao ? 'Editar País' : 'Novo País' }}</h2>
        <div class="actions">
          <button (click)="voltar()" class="btn-secondary">
            Voltar
          </button>
          <button (click)="logout()" class="btn-secondary">
            Sair
          </button>
        </div>
      </div>
      
      <div *ngIf="loading" class="loading">Carregando...</div>
      
      <form *ngIf="!loading" [formGroup]="paisForm" (ngSubmit)="salvar()" class="pais-form">
        <div class="form-group">
          <label for="nome">Nome:</label>
          <input 
            id="nome" 
            type="text" 
            formControlName="nome" 
            class="form-control"
            placeholder="Digite o nome do país"
          >
          <div *ngIf="paisForm.get('nome')?.invalid && paisForm.get('nome')?.touched" class="error-message">
            Nome é obrigatório e deve ter entre 3 e 100 caracteres
          </div>
        </div>
        
        <div class="form-group">
          <label for="sigla">Sigla:</label>
          <input 
            id="sigla" 
            type="text" 
            formControlName="sigla" 
            class="form-control"
            placeholder="Digite a sigla (2 caracteres)"
            maxlength="2"
            style="text-transform: uppercase;"
          >
          <div *ngIf="paisForm.get('sigla')?.invalid && paisForm.get('sigla')?.touched" class="error-message">
            Sigla é obrigatória e deve ter exatamente 2 caracteres
          </div>
        </div>
        
        <div class="form-group">
          <label for="gentilico">Gentílico:</label>
          <input 
            id="gentilico" 
            type="text" 
            formControlName="gentilico" 
            class="form-control"
            placeholder="Digite o gentílico"
          >
          <div *ngIf="paisForm.get('gentilico')?.invalid && paisForm.get('gentilico')?.touched" class="error-message">
            Gentílico é obrigatório e deve ter entre 3 e 100 caracteres
          </div>
        </div>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        
        <div class="form-actions">
          <button type="submit" [disabled]="paisForm.invalid || saving" class="btn-primary">
            <span *ngIf="!saving">Salvar</span>
            <span *ngIf="saving">Salvando...</span>
          </button>
          <button type="button" (click)="limpar()" class="btn-secondary">
            Limpar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .manage-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .actions {
      display: flex;
      gap: 10px;
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
    
    .pais-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
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
    
    .success-message {
      color: #28a745;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      padding: 0.5rem;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 2rem;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  `]
})
export class ManageComponent implements OnInit {
  paisForm: FormGroup;
  loading = false;
  saving = false;
  isEdicao = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private paisService: PaisService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paisForm = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      sigla: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      gentilico: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.isEdicao = true;
      this.carregarPais(parseInt(id));
    }
  }

  carregarPais(id: number): void {
    this.loading = true;
    this.paisService.listarTodos().subscribe({
      next: (paises) => {
        const pais = paises.find(p => p.id === id);
        if (pais) {
          this.paisForm.patchValue(pais);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erro ao carregar país.';
      }
    });
  }

  salvar(): void {
    if (this.paisForm.invalid) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const pais: Pais = this.paisForm.value;

    this.paisService.salvar(pais).subscribe({
      next: () => {
        this.successMessage = 'País salvo com sucesso!';
        this.saving = false;
        
        setTimeout(() => {
          this.voltar();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao salvar país. Tente novamente.';
        this.saving = false;
      }
    });
  }

  limpar(): void {
    this.paisForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  voltar(): void {
    this.router.navigate(['/paises']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
