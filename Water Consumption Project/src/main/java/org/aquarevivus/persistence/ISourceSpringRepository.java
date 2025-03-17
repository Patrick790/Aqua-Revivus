package org.aquarevivus.persistence;

import org.aquarevivus.model.Source;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ISourceSpringRepository extends CrudRepository<Source, Long> {
    List<Source> findByHouseholdId(Long householdId);

}
