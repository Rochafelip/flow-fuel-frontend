import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { authenticatedRequest } from "../services/api";

export default function SelectVehicle() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      const response = await authenticatedRequest("/api/vehicles");
      setVehicles(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function activateVehicle(id: number) {
    try {
      await authenticatedRequest(`/api/vehicles/${id}/activate`, {
        method: "PATCH",
      });

      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (vehicles.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhum veículo cadastrado</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/vehicles/new")}
        >
          <Text style={styles.buttonText}>Cadastrar Veículo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione um veículo</Text>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => activateVehicle(item.id)}
          >
            <Text style={styles.name}>
              {item.brand} {item.model}
            </Text>
            <Text>Placa: {item.licensePlate}</Text>
            <Text>Ano: {item.modelYear}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  button: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
