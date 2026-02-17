import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { authenticatedRequest } from "../services/api";
import { useAuth } from "./AuthContext";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  modelYear: number;
  currentKm: number;
  licensePlate: string;
}

interface VehicleContextData {
  activeVehicle: Vehicle | null;
  loadingVehicle: boolean;
  loadActiveVehicle: () => Promise<void>;
  setActiveVehicle: (vehicle: Vehicle) => Promise<void>;
  clearVehicle: () => Promise<void>;
}

const VehicleContext = createContext<VehicleContextData>(
  {} as VehicleContextData,
);

export function VehicleProvider({ children }: any) {
  const { token } = useAuth();

  const [activeVehicle, setActiveVehicleState] = useState<Vehicle | null>(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);

  useEffect(() => {
    if (token) {
      loadActiveVehicle();
    } else {
      clearVehicle();
    }
  }, [token]);

  async function loadActiveVehicle() {
    try {
      setLoadingVehicle(true);

      // 1️⃣ tenta pegar do storage
      const storedVehicle = await AsyncStorage.getItem("@active_vehicle");

      if (storedVehicle) {
        setActiveVehicleState(JSON.parse(storedVehicle));
      }

      // 2️⃣ sempre sincroniza com API
      const response = await authenticatedRequest("/api/vehicles/active");

      if (response) {
        setActiveVehicleState(response);
        await AsyncStorage.setItem("@active_vehicle", JSON.stringify(response));
      } else {
        await clearVehicle();
      }
    } catch (error) {
      console.log(error);
      await clearVehicle();
    } finally {
      setLoadingVehicle(false);
    }
  }

  async function setActiveVehicle(vehicle: Vehicle) {
    setActiveVehicleState(vehicle);
    await AsyncStorage.setItem("@active_vehicle", JSON.stringify(vehicle));
  }

  async function clearVehicle() {
    setActiveVehicleState(null);
    await AsyncStorage.removeItem("@active_vehicle");
    setLoadingVehicle(false);
  }

  return (
    <VehicleContext.Provider
      value={{
        activeVehicle,
        loadingVehicle,
        loadActiveVehicle,
        setActiveVehicle,
        clearVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicle() {
  return useContext(VehicleContext);
}
