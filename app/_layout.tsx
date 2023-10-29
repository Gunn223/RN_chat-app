import { Link, Stack } from 'expo-router';

import { TouchableOpacity } from 'react-native';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Ionicons } from '@expo/vector-icons';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
export default function RootLayoutNav() {
  return (
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: 'My Chats',
            headerRight: () => (
              <TouchableOpacity>
                <Link
                  href={'/(modal)/Create'}
                  asChild>
                  <Ionicons
                    name="add"
                    size={32}
                    color="black"></Ionicons>
                </Link>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="(modal)/Create"
          options={{
            headerTitle: 'Create Group',
            presentation: 'modal',
            headerRight: () => (
              <TouchableOpacity>
                <Link href={'/'}>
                  <Ionicons
                    name="close-outline"
                    size={32}
                    color="black"></Ionicons>
                </Link>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="(chat)/[chatid]"
          options={{ headerTitle: '' }}></Stack.Screen>
      </Stack>
    </ConvexProvider>
  );
}
