import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authenticatedRequest } from "../../../services/api";

export default function NewVehicle() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [currentKm, setCurrentKm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreateVehicle() {
    if (!brand || !model || !modelYear || !licensePlate || !currentKm) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      const response = await authenticatedRequest("/api/vehicles", {
        method: "POST",
        body: JSON.stringify({
          brand,
          model,
          modelYear: parseInt(modelYear),
          licensePlate,
          currentKm: parseInt(currentKm),
        }),
      });

      if (response) {
        // Ativar o veículo criado
        await authenticatedRequest(`/api/vehicles/${response.id}/activate`, {
          method: "PUT",
        });

        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar veículo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Veículo</Text>

      <TextInput
        style={styles.input}
        placeholder="Marca"
        placeholderTextColor="#6c757d"
        value={brand}
        onChangeText={setBrand}
      />

      <TextInput
        style={styles.input}
        placeholder="Modelo"
        placeholderTextColor="#6c757d"
        value={model}
        onChangeText={setModel}
      />

      <TextInput
        style={styles.input}
        placeholder="Ano"
        placeholderTextColor="#6c757d"
        value={modelYear}
        onChangeText={setModelYear}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Placa"
        placeholderTextColor="#6c757d"
        value={licensePlate}
        onChangeText={setLicensePlate}
        autoCapitalize="characters"
      />

      <TextInput
        style={styles.input}
        placeholder="Km Atual"
        placeholderTextColor="#6c757d"
        value={currentKm}
        onChangeText={setCurrentKm}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateVehicle}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#212529",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#0d6efd",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    color: "#0d6efd",
    fontSize: 14,
  },
});
