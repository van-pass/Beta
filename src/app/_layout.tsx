import { Stack } from 'expo-router';

import * as SecureStore from 'expo-secure-store';
import * as TaskManager from 'expo-task-manager';

const DRIVER_LOCATION_TASK = 'DRIVER_LOCATION_TASK';

TaskManager.defineTask(DRIVER_LOCATION_TASK, async ({ data, error }: any) => {
  if (error) {
    console.error('Task error:', error);
    return;
  }

  if (data?.locations?.length > 0) {
    const latestLocation = data.locations[data.locations.length - 1];
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;

      if (!token || !apiUrl) {
        console.log('Missing token or api url.');
        return;
      }

      const response = await fetch(`${apiUrl}/locations/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: latestLocation.coords.latitude,
          longitude: latestLocation.coords.longitude
        })
      });

      console.log('Request Status:', response.status);
    } catch (err) {
      console.error('Error: ', err);
    }
  }
});

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Screen name="driver/home/index" />
    </Stack>
  );
}
