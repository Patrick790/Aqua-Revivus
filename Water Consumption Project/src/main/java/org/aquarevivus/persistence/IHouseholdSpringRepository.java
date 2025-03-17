package org.aquarevivus.persistence;

import org.aquarevivus.model.Household;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IHouseholdSpringRepository extends CrudRepository<Household, Long> {

    @Query("SELECT h FROM Household h WHERE h.user.id = :userId")
    List<Household> findByUserId(@Param("userId") Long userId);
}

