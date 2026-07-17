import React, { useState } from 'react';

import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function LoginParent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (email.length <= 2 || password.length <= 5) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/parents/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const responseParsed = await response.json();

      if (responseParsed.error == 'AUS-LP01' || responseParsed.error == 'AUS-LP02') {
        return Alert.alert('Erro', 'E-mail ou senha incorretos.');
      }

      if (responseParsed?.data?.token) {
        await SecureStore.setItemAsync('userToken', responseParsed.data.token);

        return router.replace('/parent/home');
      }

      Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Acessar conta VanPass - Pai/Mãe</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <View style={styles.actionContainer}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center'
  },
  headerContainer: {
    marginBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  },
  formContainer: {
    gap: 20,
    marginBottom: 32
  },
  inputWrapper: {
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  input: {
    backgroundColor: '#F5F5F7',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5EA'
  },
  actionContainer: {
    gap: 16
  },
  button: {
    backgroundColor: '#ebc11d',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600'
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center'
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500'
  }
});
