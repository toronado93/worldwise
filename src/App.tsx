// Third
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CitiesProvider } from "./contexts/CitiesContext";

// Main-Route pages
import AppLayout from "./pages/AppLayout";
import Homepage from "./pages/Homepage";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Form from "./components/Form";

// Nested Routes
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
// URL Route
import City from "./components/City";
import { AuthProvider } from "./contexts/FakeAuth";
import ProtectedRoute from "./pages/ProtectedRoute";

// Main
function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage></Homepage>}></Route>
            <Route path="/pricing" element={<Pricing></Pricing>}></Route>
            <Route path="/product" element={<Product></Product>}></Route>

            <Route path="/login" element={<Login></Login>}></Route>

            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppLayout></AppLayout>
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate replace to="cities"></Navigate>}
              />
              <Route path="cities" element={<CityList></CityList>} />
              <Route path="countries" element={<CountryList></CountryList>} />
              <Route path="cities/:id" element={<City></City>}></Route>
              <Route path="form" element={<Form></Form>}></Route>
            </Route>
            <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
