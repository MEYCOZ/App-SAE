import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // On cache toujours les textes
        tabBarStyle: styles.tabBar,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <IconSymbol 
                size={24} 
                name="house.fill" 
                // Blanc pur si actif, blanc légèrement transparent si inactif
                color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Ajouter',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <IconSymbol 
                size={24} 
                name="plus.app.fill" 
                color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Galerie',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <IconSymbol 
                size={24} 
                name="photo.fill" 
                color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 30,
    marginHorizontal: 40,   // Garde l'effet "pilule"
    height: 70,
    borderRadius: 35,       
    backgroundColor: '#007AFF', // Le fond BLEU (Bleu standard iOS)
    borderTopWidth: 0,
    elevation: 10,           
    shadowColor: '#007AFF', // L'ombre prend la couleur du bleu pour un effet néon léger
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,     // Ombre un peu plus marquée
    shadowRadius: 15,
    paddingBottom: 0,       
    paddingTop: 0,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,       
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 30 : 0, 
  },
  iconWrapperActive: {
    // Une bulle bleu foncé/transparente autour de l'icône active
    backgroundColor: 'rgba(255, 255, 255, 0.25)', 
  }
});