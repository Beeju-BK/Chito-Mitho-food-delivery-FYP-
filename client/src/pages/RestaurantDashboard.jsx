
import React, { useState } from "react";

// Import Layout Components
import Sidebar from "../components/restaurant/dashboard/Sidebar";
import Topbar from "../components/restaurant/dashboard/Topbar";

// Import View Components
import Overview from "../components/restaurant/dashboard/Overview";
import MenuManagement from "../components/restaurant/dashboard/MenuManagement";
import Orders from "../components/restaurant/dashboard/Orders";
import Analytics from "../components/restaurant/dashboard/Analytics";
import Settings from "../components/restaurant/dashboard/Settings";

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  // Helper function to decide which view to show
  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <Overview />;
      case "menu":     return <MenuManagement />;
      case "orders":   return <Orders />;
      case "analytics": return <Analytics/>
      case "settings": return <Settings />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>Component for {activeTab} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* 1. Sidebar Component */}
      <Sidebar 
        active={activeTab} 
        onNav={setActiveTab} 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 2. Topbar Component */}
        <Topbar page={activeTab} />
        
        {/* 3. Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}