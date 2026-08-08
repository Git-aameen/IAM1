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

                    <Route path="/role/all" element={<h2>All Role Page</h2>} />
                    <Route path="/role/add" element={<h2>Add New Role Page</h2>} />
                    <Route path="/asset/all" element={<h2>All Asset Page</h2>} />
                    <Route path="/asset/add" element={<h2>Add New Asset Page</h2>} />
                    <Route path="/training/all" element={<h2>All Training Page</h2>} />
                    <Route path="/training/add" element={<h2>Add New Training Page</h2>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}