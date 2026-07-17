import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, Text, View, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface LocationState {
  latitude: number;
  longitude: number;
  updatedAt: string;
}

const DEFAULT_COORDS = {
  latitude: -23.55052,
  longitude: -46.633308
};

export default function HomeParent() {
  const [location, setLocation] = useState<LocationState>();
  const timerRef = useRef<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function fetchPolling() {
        try {
          const token = await SecureStore.getItemAsync('userToken');
          const apiUrl = process.env.EXPO_PUBLIC_API_URL;

          if (!token || !apiUrl) {
            console.log('Missing token or api url.');
            return;
          }

          const response = await fetch(`${apiUrl}/locations/list`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const responseParsed = await response.json();

          if (isMounted) {
            setLocation(responseParsed.data);
          }
        } catch (err) {
          console.error('Erro no polling:', err);
        } finally {
          if (isMounted) {
            timerRef.current = setTimeout(fetchPolling, 30000);
          }
        }
      }

      fetchPolling();

      return () => {
        isMounted = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [])
  );

  const currentCoords = {
    latitude: location?.latitude ? Number(location.latitude) : DEFAULT_COORDS.latitude,
    longitude: location?.longitude ? Number(location.longitude) : DEFAULT_COORDS.longitude
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Buscando...';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Disponível';
    }
  };

  const renderMap = () => {
    if (Platform.OS === 'ios') {
      return (
        <AppleMaps.View
          markers={[{ coordinates: currentCoords }]}
          style={styles.map}
          cameraPosition={{
            coordinates: currentCoords,
            zoom: 17.5
          }}
        />
      );
    }

    if (Platform.OS === 'android') {
      return (
        <GoogleMaps.View
          markers={[{ coordinates: currentCoords }]}
          style={styles.map}
          cameraPosition={{
            coordinates: currentCoords,
            zoom: 17.5
          }}
        />
      );
    }

    return <Text style={styles.errorText}>Esta aplicação funciona apenas no iOS e Android</Text>;
  };

  return (
    <View style={styles.container}>
      {renderMap()}

      <View style={styles.card}>
        <View style={styles.indicator} />
        <View>
          <Text style={styles.cardTitle}>Status da Van</Text>
          <Text style={styles.cardSubtitle}>
            Última atualização:{' '}
            <Text style={styles.timeHighlight}>{formatTime(location?.updatedAt)}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  card: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 12
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 2
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666666'
  },
  timeHighlight: {
    fontWeight: '600',
    color: '#ebc11d'
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16
  }
});
