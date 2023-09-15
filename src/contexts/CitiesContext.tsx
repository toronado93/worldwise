import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { CityType, getDefaultCity } from "../components/CountryList";

export type CitiesContextType = {
  cities: CityType[];
  isLoading: boolean;
  currentCity: CityType;
  getCity: (id: string | undefined) => void;
};

type CitiesProviderType = {
  children: ReactNode;
};

// In order to avoid type problem initialize your initial value which will be send over by value property of provider
export const CitiesContext = createContext<CitiesContextType>({
  cities: [],
  isLoading: false,
  currentCity: getDefaultCity(),
  getCity: () => {},
});

export function CitiesProvider({ children }: CitiesProviderType) {
  const [cities, setCities] = useState<CityType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // For marking current city with css we gonna use this state
  const [currentCity, setCurrentCity] = useState(getDefaultCity());

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(" http://localhost:8000/cities");
        const data = await res.json();
        setCities(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id: unknown) {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:8000/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  type ReturnResult = {
    status: "success" | "fail" | "unknown";
    message: string;
    newcity?: string;
  };

  async function deleteCity(id: number): Promise<ReturnResult> {
    // Control is id legit?
    if (!id) return { status: "fail", message: "No city Id found" };

    // delete via id and fetch

    try {
      setIsLoading(true);

      await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
      });

      setCities((cities) => {
        return cities.filter((city) => city.id !== id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity: CityType): Promise<ReturnResult> {
    try {
      setIsLoading(true);

      const res = await fetch("http://localhost:8000/cities", {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      // This state management is really important aspet
      setCities((cities) => [...cities, data]);
      return {
        status: "success",
        message: "New city is created",
        newcity: data.cityName,
      };
    } catch (error) {
      console.log(error);
      return { status: "fail", message: error.message };
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={
        {
          cities,
          isLoading,
          currentCity,
          getCity,
          createCity,
          deleteCity,
        } as unknown as CitiesContextType
      }
    >
      {children}
    </CitiesContext.Provider>
  );
}

// Custom Hooks fetching data for fill the currentcity

// We creating custom hook which will be consumed by consumer components...
// One of the reason we create this is , instead of  creating usecontext hook each consumer component inside , we will do it here in custom hook and send this custom hook away to consumer

// eslint-disable-next-line react-refresh/only-export-components
export function useCitiesCustomHook() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

// function getCity(): (id: string | undefined) => void {
//   throw new Error("Function not implemented.");
// }
// function setIsLoading(arg0: boolean) {
//   throw new Error("Function not implemented.");
// }
// function setCurrentCity(data: any) {
//   throw new Error("Function not implemented.");
// }
