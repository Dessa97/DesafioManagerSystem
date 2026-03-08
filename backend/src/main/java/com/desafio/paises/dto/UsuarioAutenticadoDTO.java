package com.desafio.paises.dto;

public class UsuarioAutenticadoDTO {
    private String login;
    private String nome;
    private String token;
    private boolean administrador;
    private boolean autenticado;
    
    public UsuarioAutenticadoDTO() {
        this.autenticado = true;
    }
    
    public UsuarioAutenticadoDTO(String login, String nome, String token, boolean administrador) {
        this.login = login;
        this.nome = nome;
        this.token = token;
        this.administrador = administrador;
        this.autenticado = true;
    }
    
    // Getters e Setters
    public String getLogin() {
        return login;
    }
    
    public void setLogin(String login) {
        this.login = login;
    }
    
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public boolean isAdministrador() {
        return administrador;
    }
    
    public void setAdministrador(boolean administrador) {
        this.administrador = administrador;
    }
    
    public boolean isAutenticado() {
        return autenticado;
    }
    
    public void setAutenticado(boolean autenticado) {
        this.autenticado = autenticado;
    }
}
