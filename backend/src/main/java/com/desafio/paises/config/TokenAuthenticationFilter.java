package com.desafio.paises.config;

import com.desafio.paises.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {
    
    private final TokenService tokenService;
    
    public TokenAuthenticationFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String token = extrairToken(request);
        
        if (token != null && tokenService.validarToken(token).isPresent()) {
            String login = tokenService.validarToken(token).get();
            boolean isAdmin = tokenService.isAdministrador(token);
            
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(
                    login, 
                    null, 
                    isAdmin ? 
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")) :
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extrairToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
