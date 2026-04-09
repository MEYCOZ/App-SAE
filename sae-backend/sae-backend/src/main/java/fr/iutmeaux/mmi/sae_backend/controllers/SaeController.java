package fr.iutmeaux.mmi.sae_backend.controllers;

import fr.iutmeaux.mmi.sae_backend.models.Sae;
import fr.iutmeaux.mmi.sae_backend.repositories.SaeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saes")
@CrossOrigin(origins = "*") // Très important : autorise ton app React Native à appeler cette API
public class SaeController {

    @Autowired
    private SaeRepository saeRepository;

    // Route 1 : Récupérer la liste de toutes les SAé
    @GetMapping
    public List<Sae> getAllSaes() {
        return saeRepository.findAll(); // findAll() est fourni magiquement par le Repository
    }

    // Route 2 : Ajouter une nouvelle SAé dans la base de données
    @PostMapping
    public Sae createSae(@RequestBody Sae sae) {
        return saeRepository.save(sae); // save() enregistre la donnée dans MySQL
    }
}