package com.desafio.paises.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PaisDTO {
    
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    private String nome;
    
    @NotBlank(message = "Sigla é obrigatória")
    @Size(min = 2, max = 2, message = "Sigla deve ter exatamente 2 caracteres")
    private String sigla;
    
    @NotBlank(message = "Gentílico é obrigatório")
    @Size(min = 3, max = 100, message = "Gentílico deve ter entre 3 e 100 caracteres")
    private String gentilico;
    
    public PaisDTO() {}
    
    public PaisDTO(Long id, String nome, String sigla, String gentilico) {
        this.id = id;
        this.nome = nome;
        this.sigla = sigla;
        this.gentilico = gentilico;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public String getSigla() {
        return sigla;
    }
    
    public void setSigla(String sigla) {
        this.sigla = sigla;
    }
    
    public String getGentilico() {
        return gentilico;
    }
    
    public void setGentilico(String gentilico) {
        this.gentilico = gentilico;
    }
}
