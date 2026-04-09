package fr.iutmeaux.mmi.sae_backend.repositories;

import fr.iutmeaux.mmi.sae_backend.models.Sae;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaeRepository extends JpaRepository<Sae, Long> {

}