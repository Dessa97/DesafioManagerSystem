package com.desafio.paises.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuarios", uniqueConstraints = {
    @UniqueConstraint(columnNames = "login", name = "uk_usuario_login")
})
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Login é obrigatório")
    @Size(min = 3, max = 50, message = "Login deve ter entre 3 e 50 caracteres")
    @Column(unique = true, nullable = false)
    private String login;
    
    @NotBlank(message = "Senha é obrigatória")
    @Column(nullable = false)
    private String senha;
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    @Column(nullable = false)
    private String nome;
    
    @Column(nullable = false)
    private boolean administrador;
    
    // Construtores
    public Usuario() {}
    
    public Usuario(String login, String senha, String nome, boolean administrador) {
        this.login = login;
        this.senha = senha;
        this.nome = nome;
        this.administrador = administrador;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getLogin() {
        return login;
    }
    
    public void setLogin(String login) {
        this.login = login;
    }
    
    public String getSenha() {
        return senha;
    }
    
    public void setSenha(String senha) {
        this.senha = senha;
    }
    
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public boolean isAdministrador() {
        return administrador;
    }
    
    public void setAdministrador(boolean administrador) {
        this.administrador = administrador;
    }
    
    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", login='" + login + '\'' +
                ", nome='" + nome + '\'' +
                ", administrador=" + administrador +
                '}';
    }
}
