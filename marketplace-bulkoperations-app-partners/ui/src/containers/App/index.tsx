/* Import React modules */
import React from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
/* Import other node modules */
/* Import our modules */
import ErrorBoundary from "../../components/ErrorBoundary";
import DashboardWidget from "../DashboardWidget";
import FindReplace from "../DashboardWidget/FindReplace";
import Entry from "../DashboardWidget/Entry";
import Asset from "../DashboardWidget/Asset";
import Release from "../DashboardWidget/Release";
import ConfigScreen from "../ConfigScreen";
/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
/* Import our CSS */
import "./styles.scss";

const HomeRedirectHandler = function () {
  if (window?.location?.pathname !== "/") {
    return <Navigate to={{ pathname: window.location.pathname }} />;
  }
  return null;
};

const App: React.FC = function () {
  return (
    <div className="app">
      <ErrorBoundary>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomeRedirectHandler />} />
            <Route path="/dashboard-widget" element={<DashboardWidget />} />
            <Route path="/find-replace" element={<FindReplace />} />
            <Route path="/entry" element={<Entry />} />
            <Route path="/asset" element={<Asset />} />
            <Route path="/release" element={<Release />} />
            <Route path="/config" element={<ConfigScreen />} />
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </div>
  );
};

export default App;
