import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Alert, TouchableOpacity, Platform, Image, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const [formData, setFormData] = useState({
    titre: '', domaine: '', description: '', annee: '', semestre: '', competences: '',
    ressourcesHumaines: '', dateDebut: '', dateFin: '', noteObtenue: '',
    tauxReussite: '', ueCorrespondante: '', lienSite: '', lienProductions: ''
  });

  const [dateDebutObj, setDateDebutObj] = useState(new Date());
  const [dateFinObj, setDateFinObj] = useState(new Date());
  const [showDebutModal, setShowDebutModal] = useState(false);
  const [showFinModal, setShowFinModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const API_URL = 'http://192.168.1.160:8080/api/saes';

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setImage('data:image/jpeg;base64,' + result.assets[0].base64);
    }
  };

  const handleSubmit = async () => {
    if (!formData.titre || !formData.annee || !formData.semestre) {
      Alert.alert("Champs manquants", "Le titre, l'année et le semestre sont obligatoires.");
      return;
    }

    // Sécurité pour la note : remplace la virgule par un point et le convertit en nombre
    const dataToSend = { 
      ...formData, 
      noteObtenue: formData.noteObtenue ? parseFloat(formData.noteObtenue.replace(',', '.')) : null,
      imagesIllustration: image ? [image] : [] 
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) { 
        Alert.alert("Succès", "SAé enregistrée !"); 
        setImage(null); 
        // Optionnel : tu peux réinitialiser le form ici si tu veux vider la page après l'ajout
      }
    } catch (error) { 
      Alert.alert("Erreur", "Vérifiez votre connexion au serveur."); 
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Ajout SAE</Text>

        {/* --- CARTE IMAGE --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Illustration du projet</Text>
          <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
            {image ? <Image source={{ uri: image }} style={styles.previewImage} /> : 
            <View style={styles.imagePlaceholder}><Text style={styles.imagePlaceholderText}> Ajouter une photo</Text></View>}
          </TouchableOpacity>
        </View>

        {/* --- CARTE IDENTIFICATION & DESCRIPTION --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Détails du projet</Text>
          
          <Text style={styles.fieldHint}>Titre de la SAé</Text>
          <TextInput style={styles.input} value={formData.titre} onChangeText={(t) => handleChange('titre', t)} placeholder="Ex: Développement d'une application" placeholderTextColor="#999" />
          
          <Text style={styles.fieldHint}>Domaine (Web, Design, Comm...)</Text>
          <TextInput style={styles.input} value={formData.domaine} onChangeText={(t) => handleChange('domaine', t)} placeholder="Ex: Développement Web" placeholderTextColor="#999" />

          <Text style={styles.fieldHint}>Description du projet</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={formData.description} 
            onChangeText={(t) => handleChange('description', t)} 
            placeholder="Expliquez brièvement le projet..." 
            placeholderTextColor="#999"
            multiline={true}
            numberOfLines={4}
          />

          <Text style={styles.fieldHint}>Promotion :</Text>
          <View style={styles.rowChoices}>
            {['MMI2', 'MMI3'].map((promo) => (
              <TouchableOpacity key={promo} style={[styles.choiceBtn, formData.annee === promo && styles.choiceBtnActive]} onPress={() => handleChange('annee', promo)}>
                <Text style={[styles.choiceText, formData.annee === promo && styles.choiceTextActive]}>{promo}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.fieldHint, {marginTop: 15}]}>Semestre :</Text>
          <View style={styles.rowChoices}>
            {['S3', 'S4', 'S5', 'S6'].map((sem) => (
              <TouchableOpacity key={sem} style={[styles.choiceBtnSem, formData.semestre === sem && styles.choiceBtnActive]} onPress={() => handleChange('semestre', sem)}>
                <Text style={[styles.choiceText, formData.semestre === sem && styles.choiceTextActive]}>{sem}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* --- CARTE CALENDRIER --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Durée du projet</Text>
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDebutModal(true)}>
            <Text style={styles.dateLabel}>Date de début</Text>
            <Text style={styles.dateValue}>{formData.dateDebut || "Sélectionner..."}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowFinModal(true)}>
            <Text style={styles.dateLabel}>Date de fin</Text>
            <Text style={styles.dateValue}>{formData.dateFin || "Sélectionner..."}</Text>
          </TouchableOpacity>
        </View>

        {/* --- NOUVELLE CARTE ÉVALUATION (NOTES) --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Évaluation</Text>
          <Text style={styles.fieldHint}>Note obtenue (sur 20)</Text>
          <TextInput 
            style={styles.input} 
            value={formData.noteObtenue} 
            onChangeText={(t) => handleChange('noteObtenue', t)} 
            placeholder="Ex: 16.5" 
            placeholderTextColor="#999"
            keyboardType="numeric" // Affiche le clavier avec les chiffres directement
            maxLength={5}
          />
        </View>

        {/* --- MODALS DATES --- */}
        <Modal visible={showDebutModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDebutModal(false)}><Text style={styles.doneBtn}>Annuler</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDebutModal(false)}><Text style={styles.doneBtn}>OK</Text></TouchableOpacity>
              </View>
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={dateDebutObj}
                  mode="date"
                  display="spinner"
                  textColor="#000000"
                  onChange={(e, d) => { if(d){ setDateDebutObj(d); handleChange('dateDebut', d.toISOString().split('T')[0]); } }}
                  style={styles.picker}
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showFinModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowFinModal(false)}><Text style={styles.doneBtn}>Annuler</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setShowFinModal(false)}><Text style={styles.doneBtn}>OK</Text></TouchableOpacity>
              </View>
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={dateFinObj}
                  mode="date"
                  display="spinner"
                  textColor="#000000"
                  onChange={(e, d) => { if(d){ setDateFinObj(d); handleChange('dateFin', d.toISOString().split('T')[0]); } }}
                  style={styles.picker}
                />
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enregistrer la SAé</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#1C1C1E', marginBottom: 20 },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  label: { fontSize: 13, fontWeight: '700', color: '#007AFF', marginBottom: 12, textTransform: 'uppercase' },
  fieldHint: { fontSize: 14, color: '#666', marginBottom: 8 },
  input: { backgroundColor: '#F2F2F7', borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 15, color: '#000' },
  textArea: { height: 100, textAlignVertical: 'top' },
  rowChoices: { flexDirection: 'row', justifyContent: 'space-between' },
  choiceBtn: { flex: 0.48, padding: 12, borderRadius: 12, backgroundColor: '#F2F2F7', alignItems: 'center' },
  choiceBtnSem: { width: '23%', padding: 12, borderRadius: 12, backgroundColor: '#F2F2F7', alignItems: 'center' },
  choiceBtnActive: { backgroundColor: '#007AFF' },
  choiceText: { fontSize: 15, fontWeight: '600', color: '#666' },
  choiceTextActive: { color: '#FFF' },
  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  dateLabel: { fontSize: 16, color: '#1C1C1E' },
  dateValue: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  doneBtn: { fontSize: 17, fontWeight: '600', color: '#007AFF' },
  pickerWrapper: { height: 250, justifyContent: 'center', backgroundColor: '#FFFFFF' },
  picker: { height: 200, width: '100%' },
  imagePickerBtn: { width: '100%', height: 160, borderRadius: 15, backgroundColor: '#F2F2F7', overflow: 'hidden' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { color: '#8E8E93', fontWeight: '600' },
  previewImage: { width: '100%', height: '100%' },
  submitButton: { backgroundColor: '#007AFF', borderRadius: 18, padding: 20, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});