import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';

import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';

const DRIVER_LOCATION_TASK = 'DRIVER_LOCATION_TASK';

export default function HomeDriver() {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  async function checkExistingTask() {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(DRIVER_LOCATION_TASK);
    setIsActive(hasStarted);
    setLoading(false);
  }

  useEffect(() => {
    checkExistingTask();
  }, []);

  async function startTracking() {
    try {
      setLoading(true);

      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();

      if (fgStatus !== 'granted') {
        return Alert.alert(
          'Permissão negada',
          'Precisamos de acesso à localização para continuar acompanhando a van.'
        );
      }

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

      if (bgStatus !== 'granted') {
        return Alert.alert(
          'Aviso',
          'Ative "Permitir o tempo todo" nas configurações do seu celular para continuarmos acompanhando a van com a tela bloqueada.'
        );
      }

      await Location.startLocationUpdatesAsync(DRIVER_LOCATION_TASK, {
        accuracy: Location.Accuracy.High,
        timeInterval: 15000,
        distanceInterval: 10,
        deferredUpdatesInterval: 15000,
        deferredUpdatesDistance: 10,
        foregroundService: {
          notificationTitle: 'VanPass Motorista',
          notificationBody: 'Compartilhando localização com os pais...',
          notificationColor: '#ebc11d'
        },
        pausesUpdatesAutomatically: false
      });

      setIsActive(true);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível iniciar o rastreamento.');
    } finally {
      setLoading(false);
    }
  }

  async function stopTracking() {
    try {
      setLoading(true);
      await Location.stopLocationUpdatesAsync(DRIVER_LOCATION_TASK);
      setIsActive(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await stopTracking();
    await SecureStore.deleteItemAsync('userToken');
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>

      <View style={styles.content}>
        <Pressable
          style={[styles.button, styles.startButton, isActive && styles.buttonDisabled]}
          onPress={startTracking}
          disabled={isActive || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Viagem</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.button, styles.stopButton, !isActive && styles.buttonDisabled]}
          onPress={stopTracking}
          disabled={!isActive || loading}
        >
          <Text style={styles.buttonText}>Finalizar Viagem</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.statusLabel}>
          Status:{' '}
          <Text style={isActive ? styles.statusActive : styles.statusInactive}>
            {isActive ? 'Ativo' : 'Inativo'}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 24,
    justifyContent: 'space-between'
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginTop: 20,
    padding: 10
  },
  logoutText: {
    color: '#dc3545',
    fontWeight: '600'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 16
  },
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  startButton: {
    backgroundColor: '#28a745'
  },
  stopButton: {
    backgroundColor: '#dc3545'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA'
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500'
  },
  statusActive: {
    color: '#28a745',
    fontWeight: '700'
  },
  statusInactive: {
    color: '#dc3545',
    fontWeight: '700'
  }
});
