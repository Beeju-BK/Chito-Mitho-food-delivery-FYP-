
import React, { useState } from "react";

// Import Layout Components
import Sidebar from "../components/admin/dashboard/Sidebar";
import Topbar from "../components/admin/dashboard/Topbar";

// Import View Components
import Overview from "../components/admin/dashboard/Overview";
import VendorManagement from "../components/admin/dashboard/VendorManagement";
import CustomerManagement from "../components/admin/dashboard/CustomerManagement";
import DeliverymanManagement from "../components/admin/dashboard/DeliverymanManagement"
import AdminOrders from "../components/admin/dashboard/AdminOrders";
import Analytics from "../components/admin/dashboard/Analytics";
import Settings from "../components/admin/dashboard/Settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  // Helper function to decide which view to show
  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <Overview />;
      case "vendor":     return <VendorManagement />;
      case "customer":     return <CustomerManagement />;
      case "deliveryman": return <DeliverymanManagement/>;
      case "orders":   return <AdminOrders />;
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