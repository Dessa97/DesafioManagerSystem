package com.desafio.paises.controller;

import com.desafio.paises.dto.LoginRequestDTO;
import com.desafio.paises.dto.UsuarioAutenticadoDTO;
import com.desafio.paises.service.AuthenticationService;
import com.desafio.paises.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuario")
@Tag(name = "Autenticação", description = "Endpoints para autenticação de usuários")
public class UsuarioController {
    
    private final AuthenticationService authenticationService;
    private final TokenService tokenService;
    
    public UsuarioController(AuthenticationService authenticationService, 
                           TokenService tokenService) {
        this.authenticationService = authenticationService;
        this.tokenService = tokenService;
    }
    
    @PostMapping("/autenticar")
    @Operation(summary = "Autenticar usuário", description = "Realiza login e gera token de autenticação")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Autenticação bem-sucedida"),
        @ApiResponse(responseCode = "401", description = "Credenciais inválidas"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ResponseEntity<UsuarioAutenticadoDTO> autenticar(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            UsuarioAutenticadoDTO response = authenticationService.autenticar(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    @GetMapping("/renovar-ticket")
    @Operation(summary = "Renovar token", description = "Renova o token de autenticação antes da expiração")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token renovado com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado"),
        @ApiResponse(responseCode = "403", description = "Não autorizado")
    })
    public ResponseEntity<UsuarioAutenticadoDTO> renovarTicket(HttpServletRequest request) {
        String token = extrairToken(request);
        
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            UsuarioAutenticadoDTO response = authenticationService.renovarToken(token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
    private String extrairToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
