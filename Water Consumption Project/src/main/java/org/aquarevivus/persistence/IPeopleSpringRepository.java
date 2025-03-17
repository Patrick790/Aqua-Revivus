package org.aquarevivus.persistence;

import org.aquarevivus.model.People;
import org.springframework.data.repository.CrudRepository;

public interface IPeopleSpringRepository extends CrudRepository<People, Long> {

}
