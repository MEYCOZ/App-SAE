import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

// Activation de l'animation Layout pour le menu filtre (Android)
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- COMPOSANT CARTE ANIMÉE ---
// Ce sous-composant gère sa propre animation d'apparition pour un effet "cascade"
const AnimatedCard = ({ item, index }: { item: any, index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current; // Commence 50px plus bas

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 150, // Décale l'animation pour chaque carte (effet cascade)
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        tension: 40,
        delay: index * 150,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const imageSource = (item.imagesIllustration && item.imagesIllustration.length > 0)
    ? item.imagesIllustration[0]
    : (item.imageUrl || 'https://via.placeholder.com/400x200');

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY }] }]}>
      <TouchableOpacity activeOpacity={0.85}>
        <Image source={{ uri: imageSource }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.badge}>{item.annee || 'MMI'}</Text>
            <Text style={styles.semestreBadge}>{item.semestre || 'S?'}</Text>
          </View>
          
          <Text style={styles.cardTitle}>{item.titre}</Text>
          
          {/* DESCRIPTION RENDUE BIEN VISIBLE */}
          <Text style={styles.cardDescription} numberOfLines={3}>
            {item.description || "Aucune description fournie pour ce projet. Modifiez la SAé pour en ajouter une."}
          </Text>

          <View style={styles.footer}>
            <View>
               <Text style={styles.noteLabel}>NOTE</Text>
               <Text style={styles.noteValue}>{item.noteObtenue ? `${item.noteObtenue}/20` : '--/20'}</Text>
            </View>
            <Text style={styles.domaineText}>{item.domaine}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
// ------------------------------

export default function HomeScreen() {
  const [saes, setSaes] = useState<any[]>([]);
  const [filteredSaes, setFilteredSaes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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
      const sortedData = [...data].reverse();
      setSaes(sortedData);
      applyMultipleFilters(sortedData, filters);
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

  const applyMultipleFilters = (data: any[], currentFilters: any) => {
    let result = data;
    if (currentFilters.promo !== 'Tous') result = result.filter(s => s.annee === currentFilters.promo);
    if (currentFilters.semestre !== 'Tous') result = result.filter(s => s.semestre === currentFilters.semestre);
    if (currentFilters.domaine !== 'Tous') result = result.filter(s => s.domaine === currentFilters.domaine);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Tableau SAE</Text>
        <TouchableOpacity style={[styles.filterToggleButton, showFilters && styles.filterToggleActive]} onPress={toggleFilters}>
          <Text style={[styles.filterToggleText, showFilters && styles.filterToggleTextActive]}>☰ Filtres</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterMenu}>
          <Text style={styles.filterLabel}>Promotion</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {['Tous', 'MMI2', 'MMI3'].map(p => (
              <TouchableOpacity key={p} onPress={() => updateFilter('promo', p)} style={[styles.miniBtn, filters.promo === p && styles.miniBtnActive]}>
                <Text style={[styles.miniBtnText, filters.promo === p && styles.miniBtnTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Semestre</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {['Tous', 'S3', 'S4', 'S5', 'S6'].map(s => (
              <TouchableOpacity key={s} onPress={() => updateFilter('semestre', s)} style={[styles.miniBtn, filters.semestre === s && styles.miniBtnActive]}>
                <Text style={[styles.miniBtnText, filters.semestre === s && styles.miniBtnTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Domaine</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {['Tous', 'Web', 'Design', 'Audiovisuel', 'Com'].map(d => (
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
          // On appelle notre nouveau composant animé
          renderItem={({ item, index }) => <AnimatedCard item={item} index={index} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun résultat pour ces filtres.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F5' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  mainTitle: { fontSize: 32, fontWeight: '800', color: '#1C1C1E' },
  filterToggleButton: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E5EA', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  filterToggleActive: { backgroundColor: '#1C1C1E', borderColor: '#1C1C1E' },
  filterToggleText: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  filterToggleTextActive: { color: '#FFF' },
  
  filterMenu: { backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 15, borderRadius: 20, padding: 15, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15 },
  filterLabel: { fontSize: 12, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase', marginBottom: 8, marginTop: 10 },
  row: { flexDirection: 'row', marginBottom: 5 },
  miniBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F2F2F7', marginRight: 8, borderWidth: 1, borderColor: '#E5E5EA' },
  miniBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  miniBtnText: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  miniBtnTextActive: { color: '#FFF' },
  resetBtn: { marginTop: 15, padding: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  resetBtnText: { color: '#FF3B30', fontWeight: '600' },

  list: { paddingHorizontal: 20, paddingBottom: 100 },
  
  // --- NOUVEAU STYLE DES CARTES (OMBRES FORTES) ---
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    marginBottom: 25, 
    // Superbes ombres pour le relief :
    elevation: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.15, 
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden' // S'assure que l'image ne déborde pas des coins arrondis
  },
  cardImage: { width: '100%', height: 180 },
  cardContent: { padding: 20 },
  cardHeader: { flexDirection: 'row', marginBottom: 12 },
  badge: { backgroundColor: '#E0F0FF', color: '#007AFF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, fontSize: 11, fontWeight: '800', marginRight: 8 },
  semestreBadge: { backgroundColor: '#F2F2F7', color: '#636366', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, fontSize: 11, fontWeight: '800' },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#1C1C1E', marginBottom: 8 },
  
  // --- NOUVEAU STYLE DESCRIPTION ---
  cardDescription: { 
    fontSize: 15, 
    color: '#48484A', 
    lineHeight: 22, 
    marginBottom: 15 
  },
  
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F2F2F7', paddingTop: 15 },
  domaineText: { color: '#007AFF', fontWeight: '700', fontSize: 13, textTransform: 'uppercase' },
  noteLabel: { fontSize: 10, color: '#8E8E93', fontWeight: '700', marginBottom: 2 },
  noteValue: { fontWeight: '800', color: '#007AFF', fontSize: 18 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#8E8E93' }
});