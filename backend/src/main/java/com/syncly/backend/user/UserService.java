package com.syncly.backend.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String email, String rawPassword, String fullName) {
        if (repo.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        String encoded = passwordEncoder.encode(rawPassword);
        User u = new User(email, encoded, fullName);
        return repo.save(u);
    }

    public Optional<User> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = repo.findByEmail(username).orElseThrow(() ->
            new UsernameNotFoundException("User not found: " + username)
        );
        return new org.springframework.security.core.userdetails.User(
            u.getEmail(),
            u.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}