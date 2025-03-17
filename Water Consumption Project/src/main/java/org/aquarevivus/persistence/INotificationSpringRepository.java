package org.aquarevivus.persistence;


import org.aquarevivus.model.Notification;
import org.springframework.data.repository.CrudRepository;

public interface INotificationSpringRepository extends CrudRepository<Notification, Long> {

}
