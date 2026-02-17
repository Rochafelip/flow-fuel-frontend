import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { VehicleProvider, useVehicle } from "../context/VehicleContext";

function AppContent() {
  const { token, loading } = useAuth();
  const { activeVehicle, loadingVehicle } = useVehicle();
  const router = useRouter();

  useEffect(() => {
    if (loading || loadingVehicle) return;

    if (!token) {
      router.replace("/login");
    } else if (!activeVehicle) {
      router.replace("/select-vehicle");
    } else {
      router.replace("/"); 
    }
  }, [token, activeVehicle, loading, loadingVehicle]);


  if (loading || loadingVehicle) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <VehicleProvider>
        <AppContent />
      </VehicleProvider>
    </AuthProvider>
  );
}
