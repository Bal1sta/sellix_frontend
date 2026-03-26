import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from './components/Pages/MainPage/MainPage';
import CreateShopPage from './components/Pages/createShopPage/CreateShopPage';
import EditingPage from './components/Pages/editingShopPage/EditingPage';
import ElectronicsPage from './components/Pages/machineryAndElectronicsPage/MachineryAndElectronics';

export default function App() {
  return (
    <BrowserRouter>
      <div className="mainWrap">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/create-shop" element={<CreateShopPage />} />
          <Route path="/editing-page" element={<EditingPage />} />
          <Route path="/electronicsShop-page" element={<ElectronicsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
