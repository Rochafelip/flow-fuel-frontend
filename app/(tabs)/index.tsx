import { StyleSheet, Text, View } from "react-native";
import { useVehicle } from "../../context/VehicleContext";

export default function Home() {
  const { activeVehicle } = useVehicle();

  if (!activeVehicle) {
    return (
      <View style={styles.center}>
        <Text>Nenhum veículo ativo encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Veículo Ativo</Text>

      <Text>Marca: {activeVehicle.brand}</Text>
      <Text>Modelo: {activeVehicle.model}</Text>
      <Text>Ano: {activeVehicle.modelYear}</Text>
      <Text>Km Atual: {activeVehicle.currentKm}</Text>
      <Text>Placa: {activeVehicle.licensePlate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
