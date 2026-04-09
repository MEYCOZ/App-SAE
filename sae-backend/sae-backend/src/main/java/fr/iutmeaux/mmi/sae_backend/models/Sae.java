package fr.iutmeaux.mmi.sae_backend.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "sae")
public class Sae {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String annee;

    // --- LE NOUVEAU CHAMP DESCRIPTION ---
    @Column(columnDefinition = "TEXT")
    private String description;

    private String competences;
    private String semestre;
    private String domaine;

    @ElementCollection
    @Column(columnDefinition = "LONGTEXT") // Le champ magique pour les images !
    private List<String> imagesIllustration;

    private String ressourcesHumaines;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double noteObtenue;
    private Double tauxReussite;
    private String ueCorrespondante;
    private String lienSite;
    private String lienProductions;

    // Constructeur vide obligatoire pour Spring
    public Sae() {
    }

    // --- GETTERS ET SETTERS ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getAnnee() {
        return annee;
    }

    public void setAnnee(String annee) {
        this.annee = annee;
    }

    // --- GETTER ET SETTER POUR LA DESCRIPTION ---
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCompetences() {
        return competences;
    }

    public void setCompetences(String competences) {
        this.competences = competences;
    }

    public String getSemestre() {
        return semestre;
    }

    public void setSemestre(String semestre) {
        this.semestre = semestre;
    }

    public String getDomaine() {
        return domaine;
    }

    public void setDomaine(String domaine) {
        this.domaine = domaine;
    }

    public List<String> getImagesIllustration() {
        return imagesIllustration;
    }

    public void setImagesIllustration(List<String> imagesIllustration) {
        this.imagesIllustration = imagesIllustration;
    }

    public String getRessourcesHumaines() {
        return ressourcesHumaines;
    }

    public void setRessourcesHumaines(String ressourcesHumaines) {
        this.ressourcesHumaines = ressourcesHumaines;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Double getNoteObtenue() {
        return noteObtenue;
    }

    public void setNoteObtenue(Double noteObtenue) {
        this.noteObtenue = noteObtenue;
    }

    public Double getTauxReussite() {
        return tauxReussite;
    }

    public void setTauxReussite(Double tauxReussite) {
        this.tauxReussite = tauxReussite;
    }

    public String getUeCorrespondante() {
        return ueCorrespondante;
    }

    public void setUeCorrespondante(String ueCorrespondante) {
        this.ueCorrespondante = ueCorrespondante;
    }

    public String getLienSite() {
        return lienSite;
    }

    public void setLienSite(String lienSite) {
        this.lienSite = lienSite;
    }

    public String getLienProductions() {
        return lienProductions;
    }

    public void setLienProductions(String lienProductions) {
        this.lienProductions = lienProductions;
    }
}