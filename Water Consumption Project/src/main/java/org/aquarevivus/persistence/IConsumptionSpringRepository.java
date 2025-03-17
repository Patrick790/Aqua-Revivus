package org.aquarevivus.persistence;

import org.aquarevivus.model.Consumption;
import org.aquarevivus.model.Source;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface IConsumptionSpringRepository extends CrudRepository<Consumption, Long> {
    Optional<Consumption> findTopBySourceOrderByUntilAtDesc(Source source);
}
