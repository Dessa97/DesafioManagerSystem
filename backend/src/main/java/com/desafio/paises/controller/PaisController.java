package com.desafio.paises.controller;

import com.desafio.paises.dto.PaisDTO;
import com.desafio.paises.service.PaisService;
import com.desafio.paises.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pais")
@Tag(name = "Países", description = "Endpoints para gerenciamento de países")
@SecurityRequirement(name = "bearerAuth")
public class PaisController {
    
    private final PaisService paisService;
    private final TokenService tokenService;
    
    public PaisController(PaisService paisService, TokenService tokenService) {
        this.paisService = paisService;
        this.tokenService = tokenService;
    }
    
    @GetMapping("/listar")
    @Operation(summary = "Listar todos os países", description = "Retorna a lista de todos os países cadastrados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de países retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    public ResponseEntity<List<PaisDTO>> listarTodos(HttpServletRequest request) {
        String token = extrairToken(request);
        if (token == null || tokenService.validarToken(token).isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<PaisDTO> paises = paisService.listarTodos();
        return ResponseEntity.ok(paises);
    }
    
    @GetMapping("/pesquisar")
    @Operation(summary = "Pesquisar países por nome", description = "Busca países que contenham o nome informado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Países encontrados"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    public ResponseEntity<List<PaisDTO>> pesquisarPorNome(
            @Parameter(description = "Nome para pesquisa") @RequestParam String nome,
            HttpServletRequest request) {
        String token = extrairToken(request);
        if (token == null || tokenService.validarToken(token).isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<PaisDTO> paises = paisService.pesquisarPorNome(nome);
        return ResponseEntity.ok(paises);
    }
    
    @PostMapping("/salvar")
    @Operation(summary = "Salvar país", description = "Cria um novo país ou atualiza um existente (apenas administradores)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "País salvo com sucesso"),
        @ApiResponse(responseCode = "401", description = "Não autenticado"),
        @ApiResponse(responseCode = "403", description = "Acesso negado (apenas administradores)"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ResponseEntity<PaisDTO> salvar(@Valid @RequestBody PaisDTO paisDTO, 
                                         HttpServletRequest request) {
        String token = extrairToken(request);
        if (token == null || tokenService.validarToken(token).isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        if (!tokenService.isAdministrador(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            PaisDTO paisSalvo = paisService.salvar(paisDTO, token);
            return ResponseEntity.ok(paisSalvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/excluir")
    @Operation(summary = "Excluir país", description = "Exclui um país pelo ID (apenas administradores)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "País excluído com sucesso"),
        @ApiResponse(responseCode = "401", description = "Não autenticado"),
        @ApiResponse(responseCode = "403", description = "Acesso negado (apenas administradores)"),
        @ApiResponse(responseCode = "404", description = "País não encontrado")
    })
    public ResponseEntity<Void> excluir(
            @Parameter(description = "ID do país a ser excluído") @RequestParam Long id,
            HttpServletRequest request) {
        String token = extrairToken(request);
        if (token == null || tokenService.validarToken(token).isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        if (!tokenService.isAdministrador(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        try {
            paisService.excluir(id, token);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
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
