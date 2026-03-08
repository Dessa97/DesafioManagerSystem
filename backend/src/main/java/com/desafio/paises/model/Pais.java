package com.desafio.paises.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "paises", uniqueConstraints = {
    @UniqueConstraint(columnNames = "nome", name = "uk_pais_nome"),
    @UniqueConstraint(columnNames = "sigla", name = "uk_pais_sigla"),
    @UniqueConstraint(columnNames = "gentilico", name = "uk_pais_gentilico")
})
public class Pais {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
    @Column(nullable = false, unique = true)
    private String nome;
    
    @NotBlank(message = "Sigla é obrigatória")
    @Size(min = 2, max = 2, message = "Sigla deve ter exatamente 2 caracteres")
    @Column(nullable = false, unique = true, length = 2)
    private String sigla;
    
    @NotBlank(message = "Gentílico é obrigatório")
    @Size(min = 3, max = 100, message = "Gentílico deve ter entre 3 e 100 caracteres")
    @Column(nullable = false, unique = true)
    private String gentilico;
    
    // Construtores
    public Pais() {}
    
    public Pais(String nome, String sigla, String gentilico) {
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
    
    @Override
    public String toString() {
        return "Pais{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", sigla='" + sigla + '\'' +
                ", gentilico='" + gentilico + '\'' +
                '}';
    }
}
