import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
//import './index.css';

import MainLayout from './MainLayout';

// import page overview
import POverview from './pages/POverview';
import PProfile from './pages/PProfile';
import PCredential from './pages/PCredential';

// import page employee
import PEmployeeAll from './pages/PEmployeeAll';
import PEmployeeAdd from './pages/PEmployeeAdd';

// import page employee
import PRoleAll from './pages/PRoleAll';
import PRoleAdd from './pages/PRoleAdd';

// import page training
import PTrainingAll from './pages/PTrainingAll';
import PTrainingAdd from './pages/PTrainingAdd';

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <BrowserRouter>
            <Routes>
                {/* page Login */}
                <Route path="/" element={<App />} />

                {/* MainLayout */}
                <Route element={<MainLayout />}>
                    {/* Route Overview */}
                    <Route path="/overview" element={<POverview />} />
                    <Route path="/profile" element={<PProfile />} />
                    <Route path="/credential" element={<PCredential />} />

                    {/* Routes Employee*/}
                    <Route path="/employee/all" element={<PEmployeeAll/>} />
                    <Route path="/employee/add" element={<PEmployeeAdd />} />

                    <Route path="/role/all" element={<PRoleAll />} />
                    <Route path="/role/add" element={<PRoleAdd />} />
                    <Route path="/asset/all" element={<h2>All Asset Page</h2>} />
                    <Route path="/asset/add" element={<h2>Add New Asset Page</h2>} />
                    <Route path="/training/all" element={<PTrainingAll />} />
                    <Route path="/training/add" element={<PTrainingAdd />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}