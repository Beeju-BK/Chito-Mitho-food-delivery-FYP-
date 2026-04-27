import { useState, useEffect } from "react";
import { 
  Search, 
  ShieldOff, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  AlertTriangle, 
  ChevronDown, 
  ShoppingBag,
  Loader2 
} from "lucide-react";
import axios from "axios";

const STATUS_OPTIONS = ["All", "Active", "Blocked"];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmId, setConfirmId] = useState(null);
  const [stats, setStats] = useState({});

  // ✅ Fetch real customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:3000/api/admin/customers', { 
        withCredentials: true 
      });
      setCustomers(data.customers || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error('Failed to fetch customers:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle block/unblock
  const toggleBlock = async (customerId) => {
    try {
      console.log('🔄 Toggling customer:', customerId);
      
      const response = await axios.patch(
        `http://localhost:3000/api/admin/customers/${customerId}/toggle-block`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // ✅ Update UI instantly
        setCustomers(prev => prev.map(customer => 
          customer._id === customerId
            ? { 
                ...customer, 
                blocked: response.data.customer.isBlocked,
                isBlocked: response.data.customer.isBlocked 
              }
            : customer
        ));
        console.log('✅ Customer toggled:', response.data.customer);
      }
    } catch (error) {
      console.error('❌ Toggle error:', error.response?.data || error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setConfirmId(null);
    }
  };

  // ✅ Filter customers
  const filtered = customers.filter((customer) => {
    const q = search.toLowerCase();
    const matchSearch =
      customer.name?.toLowerCase().includes(q) ||
      customer.email?.toLowerCase().includes(q) ||
      (customer.address || '')?.toLowerCase().includes(q) ||
      customer.phone?.includes(q);
    
    const isBlocked = customer.blocked || customer.isBlocked || false;
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && !isBlocked) ||
      (statusFilter === "Blocked" && isBlocked);
      
    return matchSearch && matchStatus;
  });

  const totalActive = customers.filter(c => !(c.blocked || c.isBlocked)).length;
  const totalBlocked = customers.filter(c => c.blocked || c.isBlocked).length;

  const confirmingCustomer = customers.find(c => c._id === confirmId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-2" />
        <span>Loading customers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-0 font-sans">
      {/* ── Top bar ── */}
      <div className="pb-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-indigo-500 mb-1">
              Admin Panel
            </p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Customer Management
            </h2>
          </div>
          
          {/* ✅ Real Stats */}
          <div className="flex gap-2 mt-1">
            <div className="text-center px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-lg font-bold text-emerald-700 leading-none">
                {stats.totalActive || totalActive}
              </p>
              <p className="text-[10px] font-medium text-emerald-500 mt-0.5 uppercase tracking-wider">
                Active
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-lg font-bold text-red-600 leading-none">
                {stats.totalBlocked || totalBlocked}
              </p>
              <p className="text-[10px] font-medium text-red-400 mt-0.5 uppercase tracking-wider">
                Blocked
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
              <p className="text-lg font-bold text-gray-700 leading-none">
                {stats.totalCustomers || customers.length}
              </p>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-wider">
                Total
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-700 cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown 
              size={13} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
            />
          </div>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div className="grid grid-cols-[2.5fr_1.5fr_1fr_auto] gap-4 px-4 py-2.5 mt-3 bg-gray-50 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Orders</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
      </div>

      {/* ── Customer rows ── */}
      <div className="space-y-1.5">
        {filtered.length === 0 && !loading && (
          <div className="text-center py-14 text-gray-400">
            <User size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No customers match your filters</p>
          </div>
        )}

        {filtered.map((customer) => {
          const isBlocked = customer.blocked || customer.isBlocked || false;
          return (
            <div
              key={customer._id || customer.id}
              className={`grid grid-cols-[2.5fr_1.5fr_1fr_auto] gap-4 items-center px-4 py-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-sm
                ${isBlocked
                  ? "bg-red-50/60 border-red-100 opacity-75"
                  : "bg-white border-gray-100 hover:border-indigo-200"
                }`}
            >
              {/* Customer info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 font-semibold bg-gradient-to-br ${
                  isBlocked 
                    ? "from-red-100 to-red-200 text-red-400" 
                    : "from-indigo-100 via-blue-100 to-purple-100 text-indigo-600"
                }`}>
                  {customer.avatar || customer.name?.charAt(0)?.toUpperCase() || '👤'}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${
                    isBlocked ? "text-gray-500 line-through" : "text-gray-900"
                  }`}>
                    {customer.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-gray-500 truncate max-w-[140px]">
                      {customer.email} 
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Phone size={10} /> {customer.phone}
                  </span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
                <MapPin size={11} className="text-gray-300 flex-shrink-0" />
                <span className="truncate">{customer.address || 'N/A'}</span>
              </div>

              {/* Order count */}
              <div className="flex items-center gap-1.5">
                <ShoppingBag size={12} className="text-gray-300" />
                <span className="text-sm font-bold text-gray-700">
                  {customer.orderCount || 0}
                </span>
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-2">
                <span className={`hidden sm:inline text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border font-medium ${
                  isBlocked
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {isBlocked ? "Blocked" : "Active"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmId(customer._id || customer.id);
                  }}
                  title={isBlocked ? "Unblock customer" : "Block customer"}
                  className={`p-1.5 rounded-lg border transition-all group hover:shadow-sm ${
                    isBlocked
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300"
                      : "bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600"
                  }`}
                >
                  {isBlocked ? (
                    <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
                  ) : (
                    <ShieldOff size={16} className="group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Confirm modal ── */}
      {confirmId && confirmingCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg ${
              confirmingCustomer.blocked || confirmingCustomer.isBlocked
                ? "bg-emerald-50 border-2 border-emerald-200"
                : "bg-red-50 border-2 border-red-200"
            }`}>
              <AlertTriangle 
                size={24} 
                className={(confirmingCustomer.blocked || confirmingCustomer.isBlocked) 
                  ? "text-emerald-500" 
                  : "text-red-500"
                } 
              />
            </div>
            
            <h3 className="text-center font-bold text-gray-900 text-lg mb-1">
              {(confirmingCustomer.blocked || confirmingCustomer.isBlocked) 
                ? "Unblock Customer?" 
                : "Block Customer?"
              }
            </h3>
            
            <p className="text-center text-sm text-gray-600 leading-relaxed mb-6 px-2">
              {(confirmingCustomer.blocked || confirmingCustomer.isBlocked)
                ? `This will restore ordering access for <strong>${confirmingCustomer.name}</strong>.`
                : `This will prevent <strong>${confirmingCustomer.name}</strong> (${confirmingCustomer.email}) from placing orders.`
              }
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 px-4 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => toggleBlock(confirmId)}
                className={`flex-1 text-white rounded-xl py-3 px-4 text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  (confirmingCustomer.blocked || confirmingCustomer.isBlocked)
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {(confirmingCustomer.blocked || confirmingCustomer.isBlocked) 
                  ? "Yes, Unblock" 
                  : "Yes, Block"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}