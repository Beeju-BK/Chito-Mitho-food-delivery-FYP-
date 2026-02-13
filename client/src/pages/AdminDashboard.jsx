import React, { useState } from 'react';
import { 
  MdDashboard,
  MdPeople,
  MdRestaurant,
  MdLocalShipping,
  MdInventory,
  MdBarChart,
  MdPayment,
  MdSettings,
  MdSearch,
  MdAdd,
  MdTrendingUp,
  MdTrendingDown,
  MdAccessTime,
  MdAttachMoney,
  MdDownload,
  MdMenu,
  MdClose
} from 'react-icons/md';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { id: 'overview', name: 'Overview', icon: MdDashboard },
    { id: 'customers', name: 'Customers', icon: MdPeople },
    { id: 'restaurants', name: 'Restaurants', icon: MdRestaurant },
    { id: 'delivery', name: 'Delivery Partners', icon: MdLocalShipping },
    { id: 'orders', name: 'Orders', icon: MdInventory },
    { id: 'analytics', name: 'Analytics', icon: MdBarChart },
    { id: 'payments', name: 'Payments', icon: MdPayment },
    { id: 'settings', name: 'Settings', icon: MdSettings },
  ];

  const sectionTitles = {
    overview: 'Dashboard Overview',
    customers: 'Customer Management',
    restaurants: 'Restaurant Management',
    delivery: 'Delivery Partner Management',
    orders: 'Order Management',
    analytics: 'Analytics & Reports',
    payments: 'Payment Management',
    settings: 'Settings'
  };

  const StatCard = ({ label, value, change, icon: Icon, trend = 'up' }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-white font-mono">{value}</h3>
        </div>
        <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-emerald-400' : 'text-slate-400'}`}>
        {trend === 'up' ? <MdTrendingUp className="w-4 h-4" /> : <MdTrendingDown className="w-4 h-4" />}
        <span>{change}</span>
      </div>
    </div>
  );

  const OverviewSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value="0" change="+0% vs last month" icon={MdPeople} />
        <StatCard label="Active Orders" value="0" change="+0% vs last week" icon={MdInventory} />
        <StatCard label="Total Revenue" value="$0" change="+0% vs last month" icon={MdAttachMoney} />
        <StatCard label="Avg Delivery Time" value="0m" change="0% vs target" icon={MdAccessTime} trend="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium">
              View Report
            </button>
          </div>
          <div className="h-80 flex items-center justify-center border border-dashed border-slate-600 rounded-lg">
            <p className="text-slate-500 font-medium">Revenue Chart (Integration Ready)</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
              <MdInventory className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-500">No recent activity</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-2">Restaurants</p>
            <p className="text-2xl font-bold text-white font-mono">0</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-2">Delivery Partners</p>
            <p className="text-2xl font-bold text-white font-mono">0</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-2">Completed Orders</p>
            <p className="text-2xl font-bold text-white font-mono">0</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-2">Pending Payments</p>
            <p className="text-2xl font-bold text-white font-mono">$0</p>
          </div>
        </div>
      </div>
    </div>
  );

  const CustomersSection = () => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Customer Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium">
          <MdAdd className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Customers" value="0" change="+0 this month" icon={MdPeople} />
        <StatCard label="Active Today" value="0" change="+0%" icon={MdTrendingUp} />
        <StatCard label="Average Orders" value="0" change="per customer" icon={MdInventory} trend="neutral" />
        <StatCard label="Lifetime Value" value="$0" change="avg per customer" icon={MdAttachMoney} trend="neutral" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Customer ID</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Name</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Email</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Total Orders</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Total Spent</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Status</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="text-center py-16 text-slate-500">
                No customers found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const RestaurantsSection = () => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Restaurant Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium">
          <MdAdd className="w-4 h-4" />
          Add Restaurant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Restaurants" value="0" change="+0 this month" icon={MdRestaurant} />
        <StatCard label="Active Now" value="0" change="online" icon={MdTrendingUp} trend="neutral" />
        <StatCard label="Total Menu Items" value="0" change="across all" icon={MdInventory} trend="neutral" />
        <StatCard label="Avg Rating" value="0.0" change="★★★★★" icon={MdBarChart} trend="neutral" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Restaurant ID</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Name</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Cuisine</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Orders Today</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Revenue</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Rating</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Status</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" className="text-center py-16 text-slate-500">
                No restaurants found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const DeliverySection = () => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Delivery Partner Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium">
          <MdAdd className="w-4 h-4" />
          Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Partners" value="0" change="+0 this month" icon={MdLocalShipping} />
        <StatCard label="Active Now" value="0" change="on duty" icon={MdTrendingUp} trend="neutral" />
        <StatCard label="Deliveries Today" value="0" change="completed" icon={MdInventory} trend="neutral" />
        <StatCard label="Avg Rating" value="0.0" change="★★★★★" icon={MdBarChart} trend="neutral" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Partner ID</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Name</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Phone</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Vehicle</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Deliveries</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Rating</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Status</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" className="text-center py-16 text-slate-500">
                No delivery partners found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const OrdersSection = () => {
    const [activeTab, setActiveTab] = useState('all');
    const tabs = ['all', 'pending', 'in-progress', 'completed', 'cancelled'];

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Order Management</h2>
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard label="Total Orders" value="0" change="all time" icon={MdInventory} trend="neutral" />
          <StatCard label="Today" value="0" change="orders" icon={MdAccessTime} trend="neutral" />
          <StatCard label="In Progress" value="0" change="active" icon={MdTrendingUp} trend="neutral" />
          <StatCard label="Avg Order Value" value="$0" change="per order" icon={MdAttachMoney} trend="neutral" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Order ID</th>
                <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Customer</th>
                <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Restaurant</th>
                <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Amount</th>
                <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Status</th>
                <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Time</th>
                <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="text-center py-16 text-slate-500">
                  No orders found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const AnalyticsSection = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Performance Analytics</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm">
            <MdDownload className="w-4 h-4" />
            Export Report
          </button>
        </div>
        <div className="h-96 flex items-center justify-center border border-dashed border-slate-600 rounded-lg">
          <p className="text-slate-500 font-medium">Analytics Chart (Integration Ready)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Sales Trends</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-slate-600 rounded-lg">
            <p className="text-slate-500">Sales Trend Chart</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top Performers</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500">No data available</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Revenue Growth" value="0%" change="month over month" icon={MdTrendingUp} trend="neutral" />
        <StatCard label="Customer Retention" value="0%" change="returning customers" icon={MdPeople} trend="neutral" />
        <StatCard label="Peak Hours" value="0" change="orders/hour" icon={MdAccessTime} trend="neutral" />
        <StatCard label="Cancellation Rate" value="0%" change="this month" icon={MdInventory} trend="neutral" />
      </div>
    </div>
  );

  const PaymentsSection = () => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Payment Management</h2>
        <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium">
          Process Payments
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard label="Total Processed" value="$0" change="this month" icon={MdAttachMoney} trend="neutral" />
        <StatCard label="Pending Payouts" value="$0" change="to process" icon={MdAccessTime} trend="neutral" />
        <StatCard label="Commission Earned" value="$0" change="platform fee" icon={MdTrendingUp} trend="neutral" />
        <StatCard label="Failed Payments" value="0" change="this week" icon={MdInventory} trend="neutral" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Transaction ID</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Type</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Amount</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Recipient</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Status</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Date</th>
              <th className="text-left py-4 px-4 text-slate-400 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="text-center py-16 text-slate-500">
                No payment transactions found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const SettingsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Platform Settings</h2>
        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Commission Rate</h3>
            <p className="text-slate-400 text-sm mb-3">Platform commission percentage</p>
            <input
              type="number"
              defaultValue="0"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Delivery Radius</h3>
            <p className="text-slate-400 text-sm mb-3">Maximum delivery distance (km)</p>
            <input
              type="number"
              defaultValue="0"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Minimum Order Value</h3>
            <p className="text-slate-400 text-sm mb-3">Minimum order amount ($)</p>
            <input
              type="number"
              defaultValue="0"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium">
            Save Settings
          </button>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">System Status</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900/50 rounded-lg p-4">
            <span className="text-white">API Status</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
              Operational
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-900/50 rounded-lg p-4">
            <span className="text-white">Database</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
              Connected
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-900/50 rounded-lg p-4">
            <span className="text-white">Payment Gateway</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
              Active
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-900/50 rounded-lg p-4">
            <span className="text-white">SMS Service</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'customers':
        return <CustomersSection />;
      case 'restaurants':
        return <RestaurantsSection />;
      case 'delivery':
        return <DeliverySection />;
      case 'orders':
        return <OrdersSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'payments':
        return <PaymentsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h1 className={`text-2xl font-bold text-white transition-all duration-300 whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
              DeliveryOS
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors flex shrink-0 ml-auto"
            >
              {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  <Icon size={20} className="flex shrink-0" />
                  <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 overflow-hidden'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 backdrop-blur-sm bg-opacity-90">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {sectionTitles[activeSection]}
              </h2>

              <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                  AD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;