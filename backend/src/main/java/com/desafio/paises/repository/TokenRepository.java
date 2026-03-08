package com.desafio.paises.repository;

import com.desafio.paises.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    
    Optional<Token> findByToken(String token);
    
    Optional<Token> findByLogin(String login);
    
    @Modifying
    @Query("DELETE FROM Token t WHERE t.expiracao < :agora")
    void deleteTokensExpirados(@Param("agora") LocalDateTime agora);
    
    boolean existsByToken(String token);
}
