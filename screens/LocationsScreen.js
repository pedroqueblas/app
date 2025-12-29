import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, ActivityIndicator, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { colors, spacing, typography } from '../theme';
import { HEMOCENTROS } from '../constants/hemocentros';

export default function LocationsScreen() {
  const [location, setLocation] = useState(null);
  const [sortedHemocentros, setSortedHemocentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermissionDenied(true);
          setLoading(false);
          setSortedHemocentros(HEMOCENTROS); // Show default list if permission denied
          Alert.alert('Permissão necessária', 'Precisamos da sua localização para mostrar o Hemocentro mais próximo. A lista será exibida em ordem padrão.');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        calculateDistances(currentLocation.coords);
      } catch (error) {
        console.error("Error getting location:", error);
        setSortedHemocentros(HEMOCENTROS);
        setLoading(false);
      }
    })();
  }, []);

  const calculateDistances = (coords) => {
    const { latitude, longitude } = coords;

    const withDistance = HEMOCENTROS.map(hemo => {
      if (!hemo.latitude || !hemo.longitude) return { ...hemo, distance: Infinity };
      const dist = getDistanceFromLatLonInKm(latitude, longitude, hemo.latitude, hemo.longitude);
      return { ...hemo, distance: dist };
    });

    const sorted = withDistance.sort((a, b) => a.distance - b.distance);
    setSortedHemocentros(sorted);
    setLoading(false);
  };

  // Haversine formula
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const openMaps = (hemo) => {
    if (!hemo.latitude || !hemo.longitude) {
       // Fallback search query if coordinates missing
       const query = encodeURIComponent(`${hemo.nome}, ${hemo.endereco}`);
       const url = Platform.select({
           ios: `maps:0,0?q=${query}`,
           android: `geo:0,0?q=${query}`
       });
       Linking.openURL(url);
       return;
    }

    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${hemo.latitude},${hemo.longitude}`;
    const label = hemo.nome;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  };

  const renderItem = ({ item, index }) => {
    const isNearest = index === 0 && location && !permissionDenied && item.distance !== Infinity;
    
    return (
      <View>
        {isNearest && (
          <View style={styles.nearestHeader}>
            <Text style={styles.nearestHeaderText}>📍 Mais próximo de você</Text>
          </View>
        )}
        {index === 1 && location && !permissionDenied && (
           <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Outros Hemocentros</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.card, isNearest ? styles.nearestCard : null]}
          onPress={() => openMaps(item)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            {item.distance && item.distance !== Infinity && (
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{item.distance.toFixed(1)} km</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardAddress}>{item.endereco}</Text>
          {!!item.fone && <Text style={styles.cardPhone}>📞 {item.fone}</Text>}
          <Text style={styles.tapText}>Toque para abrir no mapa</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Localizando hemocentros...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sortedHemocentros}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  nearestHeader: {
    marginBottom: 10,
  },
  nearestHeaderText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeaderText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  nearestCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#fffafa',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  distanceBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  cardPhone: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: 8,
  },
  cardObs: {
    fontSize: 12,
    color: '#d9534f',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  tapText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'right',
  },
});
