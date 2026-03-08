package com.desafio.paises.service;

import com.desafio.paises.dto.PaisDTO;
import com.desafio.paises.model.Pais;
import com.desafio.paises.repository.PaisRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaisService {
    
    private final PaisRepository paisRepository;
    private final TokenService tokenService;
    
    public PaisService(PaisRepository paisRepository, TokenService tokenService) {
        this.paisRepository = paisRepository;
        this.tokenService = tokenService;
    }
    
    public List<PaisDTO> listarTodos() {
        return paisRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }
    
    public List<PaisDTO> pesquisarPorNome(String nome) {
        return paisRepository.findByNomeContainingIgnoreCase(nome).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }
    
    public PaisDTO salvar(PaisDTO paisDTO, String token) {
        // Verificar se é administrador
        if (!isAdministrador(token)) {
            throw new RuntimeException("Acesso negado. Apenas administradores podem gerenciar países.");
        }
        
        // Validar unicidade
        validarUnicidade(paisDTO);
        
        Pais pais;
        if (paisDTO.getId() != null) {
            // Atualização
            pais = paisRepository.findById(paisDTO.getId())
                    .orElseThrow(() -> new RuntimeException("País não encontrado"));
        } else {
            // Criação
            pais = new Pais();
        }
        
        pais.setNome(paisDTO.getNome());
        pais.setSigla(paisDTO.getSigla().toUpperCase());
        pais.setGentilico(paisDTO.getGentilico());
        
        Pais paisSalvo = paisRepository.save(pais);
        return converterParaDTO(paisSalvo);
    }
    
    public void excluir(Long id, String token) {
        // Verificar se é administrador
        if (!isAdministrador(token)) {
            throw new RuntimeException("Acesso negado. Apenas administradores podem excluir países.");
        }
        
        Pais pais = paisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("País não encontrado"));
        
        paisRepository.delete(pais);
    }
    
    private void validarUnicidade(PaisDTO paisDTO) {
        // Verificar unicidade do nome
        Optional<Pais> paisExistente = paisRepository.findByNomeIgnoreCase(paisDTO.getNome());
        if (paisExistente.isPresent() && !paisExistente.get().getId().equals(paisDTO.getId())) {
            throw new RuntimeException("Nome do país já existe");
        }
        
        // Verificar unicidade da sigla
        paisExistente = paisRepository.findBySiglaIgnoreCase(paisDTO.getSigla());
        if (paisExistente.isPresent() && !paisExistente.get().getId().equals(paisDTO.getId())) {
            throw new RuntimeException("Sigla do país já existe");
        }
        
        // Verificar unicidade do gentílico
        paisExistente = paisRepository.findByGentilicoIgnoreCase(paisDTO.getGentilico());
        if (paisExistente.isPresent() && !paisExistente.get().getId().equals(paisDTO.getId())) {
            throw new RuntimeException("Gentílico do país já existe");
        }
    }
    
    private boolean isAdministrador(String token) {
        return tokenService.isAdministrador(token);
    }
    
    private PaisDTO converterParaDTO(Pais pais) {
        return new PaisDTO(pais.getId(), pais.getNome(), pais.getSigla(), pais.getGentilico());
    }
}
