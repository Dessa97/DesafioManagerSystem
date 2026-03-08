package com.desafio.paises.service;

import com.desafio.paises.dto.UsuarioAutenticadoDTO;
import com.desafio.paises.dto.LoginRequestDTO;
import com.desafio.paises.model.Usuario;
import com.desafio.paises.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthenticationService {
    
    private final UsuarioRepository usuarioRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    
    public AuthenticationService(UsuarioRepository usuarioRepository, 
                                TokenService tokenService, 
                                PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }
    
    public UsuarioAutenticadoDTO autenticar(LoginRequestDTO loginRequest) {
        // Buscar usuário pelo login
        Usuario usuario = usuarioRepository.findByLogin(loginRequest.getLogin())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));
        
        // Verificar senha
        if (!passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }
        
        // Gerar token
        String token = tokenService.gerarToken(usuario.getLogin(), usuario.isAdministrador());
        
        return new UsuarioAutenticadoDTO(
                usuario.getLogin(),
                usuario.getNome(),
                token,
                usuario.isAdministrador()
        );
    }
    
    public UsuarioAutenticadoDTO renovarToken(String tokenAtual) {
        // Validar token atual
        String login = tokenService.validarToken(tokenAtual)
                .orElseThrow(() -> new RuntimeException("Token inválido ou expirado"));
        
        // Buscar usuário
        Usuario usuario = usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Gerar novo token
        String novoToken = tokenService.gerarToken(usuario.getLogin(), usuario.isAdministrador());
        
        return new UsuarioAutenticadoDTO(
                usuario.getLogin(),
                usuario.getNome(),
                novoToken,
                usuario.isAdministrador()
        );
    }
}
