package com.desafio.paises.repository;

import com.desafio.paises.model.Pais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Long> {
    
    boolean existsByNome(String nome);
    
    boolean existsBySigla(String sigla);
    
    boolean existsByGentilico(String gentilico);
    
    @Query("SELECT p FROM Pais p WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Pais> findByNomeContainingIgnoreCase(@Param("nome") String nome);
    
    Optional<Pais> findByNomeIgnoreCase(String nome);
    
    Optional<Pais> findBySiglaIgnoreCase(String sigla);
    
    Optional<Pais> findByGentilicoIgnoreCase(String gentilico);
}
