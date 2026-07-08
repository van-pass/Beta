import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.section}>
          <Image
            style={styles.image}
            source={require('@/assets/images/logo.png')}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => router.navigate('/auth/driver')}
          >
            <Text style={styles.buttonText}>Sou Motorista</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonSecondary,
              pressed && styles.buttonPressed
            ]}
            onPress={() => router.navigate('/auth/parent')}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Sou Pai/Mãe</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24
  },
  image: {
    width: 256,
    height: 256,
    resizeMode: 'contain'
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32
  },
  section: {
    alignItems: 'center'
  },

  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 16
  },
  button: {
    backgroundColor: '#ebc11d',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ebc11d',
    shadowOpacity: 0,
    elevation: 0
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  buttonTextSecondary: {
    color: '#ebc11d'
  }
});
