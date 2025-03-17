package org.aquarevivus.persistence;


import org.aquarevivus.model.Feedback;
import org.springframework.data.repository.CrudRepository;

public interface IFeedbackSpringRepository extends CrudRepository<Feedback, Long> {

}
