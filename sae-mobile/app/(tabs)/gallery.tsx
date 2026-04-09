import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

// Activation de l'animation sur Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function GalleryScreen() {
  const [saes, setSaes] = useState<any[]>([]);
  const [filteredSaes, setFilteredSaes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // État pour les filtres multiples (cumulatifs)
  const [filters, setFilters] = useState({
    promo: 'Tous',
    semestre: 'Tous',
    domaine: 'Tous'
  });

  const API_URL = 'http://192.168.1.160:8080/api/saes';

  const fetchSaes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      // On garde le tri par défaut de l'API pour la galerie
      setSaes(data);
      applyMultipleFilters(data, filters);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSaes();
    }, [filters])
  );

  // Logique de filtrage cumulatif (exactement comme le Tableau de Bord)
  const applyMultipleFilters = (data: any[], currentFilters: any) => {
    let result = data;

    if (currentFilters.promo !== 'Tous') {
      result = result.filter(s => s.annee === currentFilters.promo);
    }
    if (currentFilters.semestre !== 'Tous') {
      result = result.filter(s => s.semestre === currentFilters.semestre);
    }
    if (currentFilters.domaine !== 'Tous') {
      result = result.filter(s => s.domaine === currentFilters.domaine);
    }

    setFilteredSaes(result);
  };

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters(!showFilters);
  };

  const updateFilter = (type: string, value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    applyMultipleFilters(saes, newFilters);
  };

  const renderItem = ({ item }: any) => {
    // Gestion de l'image (priorité imagesIllustration[0])
    const imageSource = (item.imagesIllustration && item.imagesIllustration.length > 0)
      ? item.imagesIllustration[0]
      : (item.imageUrl || 'https://via.placeholder.com/300');

    return (
      <View style={styles.galleryCard}>
        <Image source={{ uri: imageSource }} style={styles.galleryImage} resizeMode="cover" />
        
        {/* Overlay pour le titre (plus discret) */}
        <View style={styles.overlay}>
          <Text style={styles.overlayText} numberOfLines={1}>{item.titre}</Text>
          <View style={styles.domainTag}>
            <Text style={styles.domainTagText}>{item.domaine || "MMI"}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER AVEC BOUTON FILTRE TEXTUEL */}
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Galerie Photo</Text>
        <TouchableOpacity 
          style={[styles.filterToggleButton, showFilters && styles.filterToggleActive]} 
          onPress={toggleFilters}
        >
          <Text style={[styles.filterToggleText, showFilters && styles.filterToggleTextActive]}>☰ Filtres</Text>
        </TouchableOpacity>
      </View>

      {/* DIV ANIMÉE DES FILTRES (CUMULABLES) */}
      {showFilters && (
        <View style={styles.filterMenu}>
          {/* Section Promotion */}
          <Text style={styles.filterLabel}>Promotion</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {['Tous', 'MMI2', 'MMI3'].map(p => (
              <TouchableOpacity key={p} onPress={() => updateFilter('promo', p)} style={[styles.miniBtn, filters.promo === p && styles.miniBtnActive]}>
                <Text style={[styles.miniBtnText, filters.promo === p && styles.miniBtnTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Section Semestre */}
          <Text style={styles.filterLabel}>Semestre</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {['Tous', 'S3', 'S4', 'S5', 'S6'].map(s => (
              <TouchableOpacity key={s} onPress={() => updateFilter('semestre', s)} style={[styles.miniBtn, filters.semestre === s && styles.miniBtnActive]}>
                <Text style={[styles.miniBtnText, filters.semestre === s && styles.miniBtnTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Section Domaine */}
          <Text style={styles.filterLabel}>Domaine</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {['Tous', 'Web', 'Design', 'Audiovisuel', '3D'].map(d => (
              <TouchableOpacity key={d} onPress={() => updateFilter('domaine', d)} style={[styles.miniBtn, filters.domaine === d && styles.miniBtnActive]}>
                <Text style={[styles.miniBtnText, filters.domaine === d && styles.miniBtnTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.resetBtn} onPress={() => {
            const r = {promo:'Tous', semestre:'Tous', domaine:'Tous'};
            setFilters(r);
            applyMultipleFilters(saes, r);
          }}>
            <Text style={styles.resetBtnText}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredSaes}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderItem}
          numColumns={2} // Grille à 2 colonnes pour la galerie
          contentContainerStyle={styles.gridList}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune image pour ces filtres.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  mainTitle: { fontSize: 30, fontWeight: '800', color: '#1C1C1E' },
  filterToggleButton: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, backgroundColor: '#F2F2F7', borderWidth: 1, borderColor: '#E5E5EA' },
  filterToggleActive: { backgroundColor: '#1C1C1E', borderColor: '#1C1C1E' },
  filterToggleText: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  filterToggleTextActive: { color: '#FFF' },
  
  // MENU FILTRE
  filterMenu: { backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 15, borderRadius: 20, padding: 15, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  filterLabel: { fontSize: 12, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', marginBottom: 8, marginTop: 10 },
  row: { flexDirection: 'row', marginBottom: 5 },
  miniBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F2F2F7', marginRight: 8, borderWidth: 1, borderColor: '#E5E5EA' },
  miniBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  miniBtnText: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  miniBtnTextActive: { color: '#FFF' },
  resetBtn: { marginTop: 15, padding: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  resetBtnText: { color: '#FF3B30', fontWeight: '600' },

  // GRILLE DE LA GALERIE
  gridList: { paddingHorizontal: 15, paddingBottom: 100 },
  galleryCard: { flex: 0.5, margin: 8, aspectRatio: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#F2F2F7' },
  galleryImage: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10 },
  overlayText: { color: '#FFF', fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 5 },
  domainTag: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'center' },
  domainTagText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#8E8E93' }
});