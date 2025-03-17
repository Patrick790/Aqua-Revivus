package org.aquarevivus.persistence;

import org.aquarevivus.model.PersonType;
import org.springframework.data.repository.CrudRepository;

public interface IPersonTypeSpringRepository extends CrudRepository<PersonType, Long> {

}
