import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// function to check if user is authenticated, if not AuthenticatorAssertionResponse, create accout apge must appear instead
function RouteGuard({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth"); // if user is not authenticated and not in the auth screen, we push them to auth page
    } else if (user && inAuthGroup && !isLoadingUser){
      router.replace("/"); // if user is authenticated and in the auth screen, we push them to the home page
    }
  }, [user, segments]);

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <RouteGuard>
            <Stack>
              <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }}
              />
            </Stack>
          </RouteGuard>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>

    // <Stack>
    //   <Stack.Screen 
    //     name="(tabs)" 
    //     options={{ headerShown: false }}
    //   />
    // </Stack>
  );
}
