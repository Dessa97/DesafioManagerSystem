package com.desafio.paises.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "tokens")
public class Token {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Token é obrigatório")
    @Column(nullable = false, unique = true, length = 64)
    private String token;
    
    @NotBlank(message = "Login é obrigatório")
    @Column(nullable = false)
    private String login;
    
    @NotNull(message = "Data de expiração é obrigatória")
    @Column(nullable = false)
    private LocalDateTime expiracao;
    
    @Column(nullable = false)
    private boolean administrador;
    
    // Construtores
    public Token() {}
    
    public Token(String token, String login, LocalDateTime expiracao, boolean administrador) {
        this.token = token;
        this.login = login;
        this.expiracao = expiracao;
        this.administrador = administrador;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getLogin() {
        return login;
    }
    
    public void setLogin(String login) {
        this.login = login;
    }
    
    public LocalDateTime getExpiracao() {
        return expiracao;
    }
    
    public void setExpiracao(LocalDateTime expiracao) {
        this.expiracao = expiracao;
    }
    
    public boolean isAdministrador() {
        return administrador;
    }
    
    public void setAdministrador(boolean administrador) {
        this.administrador = administrador;
    }
    
    public boolean estaExpirado() {
        return LocalDateTime.now().isAfter(expiracao);
    }
    
    @Override
    public String toString() {
        return "Token{" +
                "id=" + id +
                ", token='" + token + '\'' +
                ", login='" + login + '\'' +
                ", expiracao=" + expiracao +
                ", administrador=" + administrador +
                '}';
    }
}
