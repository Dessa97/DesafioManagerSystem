package com.desafio.paises.service;

import com.desafio.paises.model.Token;
import com.desafio.paises.repository.TokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class TokenService {
    
    private static final int TOKEN_EXPIRATION_MINUTES = 5;
    private final TokenRepository tokenRepository;
    
    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    
    public String gerarToken(String login, boolean administrador) {
        // Gerar UUID
        String uuid = UUID.randomUUID().toString();
        
        // Gerar hash SHA-256
        String tokenHash = gerarSHA256(uuid);
        
        // Calcular expiração
        LocalDateTime expiracao = LocalDateTime.now().plusMinutes(TOKEN_EXPIRATION_MINUTES);
        
        // Remover token anterior do usuário (se existir)
        tokenRepository.findByLogin(login).ifPresent(tokenRepository::delete);
        
        // Salvar novo token
        Token token = new Token(tokenHash, login, expiracao, administrador);
        tokenRepository.save(token);
        
        return tokenHash;
    }
    
    public Optional<String> validarToken(String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> !t.estaExpirado())
                .map(Token::getLogin);
    }
    
    public Optional<Token> buscarToken(String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> !t.estaExpirado());
    }
    
    public boolean isAdministrador(String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> !t.estaExpirado())
                .map(Token::isAdministrador)
                .orElse(false);
    }
    
    public void limparTokensExpirados() {
        tokenRepository.deleteTokensExpirados(LocalDateTime.now());
    }
    
    private String gerarSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes());
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash SHA-256", e);
        }
    }
}
