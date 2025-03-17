package org.aquarevivus.persistence;

import org.aquarevivus.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface IUserSpringRepository extends CrudRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
