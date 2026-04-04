import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sellerAPI from "../../services/sellerAPI";
import adminPhoto from "../../assets/logo2.jpeg";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sellerRequests, setSellerRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState("shops"); // Track current section
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalCount: 0
  });

  useEffect(() => {
    // Check if user is logged in as admin
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      navigate("/login");
      return;
    }
    setIsAdmin(true);

    // Fetch seller requests from API
    fetchSellerRequests();
    fetchSellerStats();
  }, []);

  useEffect(() => {
    filterRequests(sellerRequests, searchTerm);
  }, [searchTerm, sellerRequests]);

  useEffect(() => {
    // Fetch customers when section changes to customers
    if (currentSection === "customers") {
      fetchCustomers();
    }
  }, [currentSection]);

  useEffect(() => {
    // Re-filter customers when search term or customers list changes
    filterCustomersData(customers, customerSearchTerm);
  }, [customerSearchTerm, customers]);

  const fetchSellerRequests = async () => {
    try {
      setLoading(true);
      // Don't filter by status - seller_requests table doesn't have status field
      // All records in seller_requests are pending awaiting approval
      const response = await sellerAPI.getAllSellers(0, 100, null, searchTerm);
      setSellerRequests(response.data || []);
      filterRequests(response.data || [], searchTerm);
    } catch (error) {
      console.error("Error fetching seller requests:", error);
      alert("Failed to fetch seller requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerStats = async () => {
    try {
      const response = await sellerAPI.getSellerStats();
      // Map backend response to frontend format
      setStats({
        pendingCount: response.pending || 0,
        approvedCount: response.approved || 0,
        rejectedCount: 0, // Not tracked separately anymore
        totalCount: response.total || 0
      });
    } catch (error) {
      console.error("Error fetching seller statistics:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const filterRequests = (requests, search) => {
    // All requests in seller_requests table are pending (no status field)
    let filtered = requests;
    
    if (search) {
      filtered = filtered.filter(req =>
        req.shopName.toLowerCase().includes(search.toLowerCase()) ||
        req.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredRequests(filtered);
  };

  const handleApprove = async (id) => {
    try {
      setLoading(true);
      const response = await sellerAPI.approveSeller(id);
      console.log("Approval response:", response);
      
      alert("Seller approved successfully!");
      
      // Refresh the data
      await fetchSellerRequests();
      await fetchSellerStats();
      setShowModal(false);
    } catch (error) {
      console.error("Error approving seller:", error);
      alert("Failed to approve seller: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = window.prompt("Enter new password for this seller:");
    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      setLoading(true);
      await sellerAPI.resetSellerPassword(id, newPassword);
      alert(`Password reset successfully! New password: ${newPassword}`);
      setShowModal(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    // All seller_requests records are pending (no status field exists)
    // Show "Pending" badge for all records
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Pending</span>;
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      let token = localStorage.getItem('accessToken');
      
      if (!token) {
        // Try to get current user token
        const currentUser = localStorage.getItem('user');
        if (!currentUser) {
          throw new Error('No authentication token found. Please log in again.');
        }
        throw new Error('Authentication token expired. Please log in again.');
      }

      console.log('Fetching customers with token...');
      const response = await fetch('http://localhost:8080/api/v1/auth/all-users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch' }));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Customers data received:', data);
      setCustomers(Array.isArray(data) ? data : []);
      filterCustomersData(Array.isArray(data) ? data : [], customerSearchTerm);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to fetch customers: " + error.message);
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomersData = (cusData, search) => {
    let filtered = cusData;
    
    if (search) {
      filtered = filtered.filter(customer =>
        customer.username?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase()) ||
        customer.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        customer.lastName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    setFilteredCustomers(filtered);
  };

  useEffect(() => {
    filterCustomersData(customers, customerSearchTerm);
  }, [customerSearchTerm, customers]);

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:8080/api/v1/auth/users/${customerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      alert('Customer deleted successfully!');
      await fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer({
      ...customer
    });
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleSaveCustomer = async () => {
    if (!editingCustomer) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:8080/api/v1/auth/users/${editingCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: editingCustomer.firstName,
          lastName: editingCustomer.lastName,
          bodyType: editingCustomer.bodyType,
          skinTone: editingCustomer.skinTone,
          stylePreference: editingCustomer.stylePreference,
          height: editingCustomer.height,
          weight: editingCustomer.weight,
          chest: editingCustomer.chest,
          waist: editingCustomer.waist,
          hip: editingCustomer.hip,
          sleeveLength: editingCustomer.sleeveLength,
          inseam: editingCustomer.inseam
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      alert('Customer updated successfully!');
      setShowCustomerModal(false);
      setEditingCustomer(null);
      await fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  const menuItems = [
    { id: "analytics", label: "Analytics" },
    { id: "customers", label: "Customers" },
    { id: "shops", label: "Shops" },
    { id: "orders", label: "Orders" },
    { id: "notifications", label: "Notifications" }
  ];

  const adminDisplayName = "Admin";
  const adminInitial = adminDisplayName.charAt(0).toUpperCase();

  const analyticsCards = [
    { label: "Total Revenue", value: "$128.4K", delta: "+12.6%" },
    { label: "Active Customers", value: "5,284", delta: "+8.2%" },
    { label: "Conversion Rate", value: "4.83%", delta: "+0.9%" },
    { label: "Avg. Order Value", value: "$74.20", delta: "+3.1%" }
  ];

  const monthlyRevenueBars = [46, 54, 49, 63, 58, 72, 76, 69, 84, 88, 81, 93];

  const sampleOrders = [
    { id: "ORD-2418", customer: "Amara Lewis", total: "$182.40", status: "Processing", date: "2026-04-02" },
    { id: "ORD-2419", customer: "Noah Ahmed", total: "$96.00", status: "Shipped", date: "2026-04-02" },
    { id: "ORD-2420", customer: "Priya Sen", total: "$245.20", status: "Delivered", date: "2026-04-01" },
    { id: "ORD-2421", customer: "Lucas Kim", total: "$131.50", status: "Pending", date: "2026-04-01" }
  ];

  const notificationsData = [
    { title: "Low Inventory Alert", message: "Denim Jacket stock has dropped below 20 units.", time: "5 min ago", level: "High" },
    { title: "Seller Verification", message: "3 new seller applications are ready for review.", time: "22 min ago", level: "Medium" },
    { title: "Checkout Performance", message: "Payment success rate improved by 2.4% today.", time: "1 hour ago", level: "Info" },
    { title: "Support Queue", message: "12 customer tickets remain unresolved.", time: "2 hours ago", level: "Medium" }
  ];
  const pieSegments = [
    { label: "Organic Search", value: 42, color: "#3B82F6" },
    { label: "Direct", value: 28, color: "#10B981" },
    { label: "Social", value: 18, color: "#F59E0B" },
    { label: "Referral", value: 12, color: "#EF4444" }
  ];

  let pieOffset = 0;
  const pieGradient = `conic-gradient(${pieSegments
    .map((segment) => {
      const start = pieOffset;
      pieOffset += segment.value;
      return `${segment.color} ${start}% ${pieOffset}%`;
    })
    .join(", ")})`;

  return (
    <div className="admin-dashboard min-h-screen flex">
      <style>{`
        .admin-dashboard {
          font-family: "Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif;
          background:
            radial-gradient(1100px 520px at -6% -6%, rgba(201, 162, 39, 0.16) 0%, transparent 52%),
            radial-gradient(940px 460px at 100% 0%, rgba(255, 255, 255, 0.72) 0%, transparent 58%),
            linear-gradient(150deg, #f8f8f8 0%, #ffffff 45%, #f1f1f1 100%);
          color: #171717;
        }
        .admin-sidebar {
          width: 16rem;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.58) 100%);
          border-right: 1px solid rgba(201, 162, 39, 0.26);
          box-shadow: 10px 0 26px rgba(15, 23, 42, 0.1);
          color: #111827;
          position: relative;
          backdrop-filter: blur(14px);
        }
        .admin-sidebar-header {
          border-bottom: 1px solid rgba(201, 162, 39, 0.2);
        }
        .admin-nav-btn {
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255, 255, 255, 0.48);
          color: #111827;
        }
        .admin-nav-btn:hover {
          background: rgba(255, 255, 255, 0.82);
          border-color: rgba(201, 162, 39, 0.42);
          transform: translateX(2px);
        }
        .admin-nav-btn.active {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.9) 0%, rgba(224, 192, 88, 0.92) 100%);
          color: #0f172a;
          border-color: rgba(201, 162, 39, 0.8);
          box-shadow: 0 10px 20px rgba(201, 162, 39, 0.26);
        }
        .admin-logout {
          border: 1px solid rgba(15, 23, 42, 0.14);
          background: rgba(255, 255, 255, 0.54);
          color: #111827;
        }
        .admin-logout:hover {
          background: rgba(248, 113, 113, 0.2);
          border-color: rgba(239, 68, 68, 0.45);
        }
        .admin-topbar {
          background: linear-gradient(120deg, rgba(255, 255, 255, 0.82) 0%, rgba(248, 244, 233, 0.78) 100%);
          color: #111827;
          border-bottom: 1px solid rgba(201, 162, 39, 0.36);
          box-shadow: 0 16px 28px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(12px);
        }
        .admin-topbar-analytics {
          width: calc(100% - 52px);
          margin-left: 26px;
          margin-top: 12px;
          border: 1px solid rgba(201, 162, 39, 0.34);
          border-radius: 18px;
        }
        .admin-topbar p {
          color: rgba(17, 24, 39, 0.66);
        }
        .admin-dashboard .bg-white {
          background: rgba(255, 255, 255, 0.72) !important;
          border: 1px solid rgba(201, 162, 39, 0.2) !important;
          backdrop-filter: blur(12px);
        }
        .admin-dashboard .bg-gray-100 {
          background: rgba(255, 255, 255, 0.78) !important;
        }
        .admin-dashboard .text-gray-500,
        .admin-dashboard .text-gray-600,
        .admin-dashboard .text-gray-700,
        .admin-dashboard .text-gray-800 {
          color: rgba(17, 24, 39, 0.86) !important;
        }
        .admin-dashboard .border-gray-200,
        .admin-dashboard .border-gray-300 {
          border-color: rgba(17, 24, 39, 0.12) !important;
        }
        .admin-dashboard .border-t,
        .admin-dashboard .border-b-2 {
          border-color: rgba(17, 24, 39, 0.14) !important;
        }
        .admin-dashboard input,
        .admin-dashboard select {
          background: rgba(255, 255, 255, 0.9) !important;
          border-color: rgba(17, 24, 39, 0.16) !important;
          color: #111827 !important;
        }
        .admin-dashboard input::placeholder {
          color: rgba(17, 24, 39, 0.5);
        }
        .admin-dashboard input:focus,
        .admin-dashboard select:focus {
          border-color: rgba(201, 162, 39, 0.72) !important;
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.2) !important;
        }
        .admin-dashboard label {
          color: rgba(17, 24, 39, 0.9) !important;
        }
        .admin-dashboard table thead {
          background: rgba(255, 255, 255, 0.84) !important;
        }
        .admin-dashboard table tbody tr:hover {
          background: rgba(201, 162, 39, 0.1) !important;
        }
        .admin-dashboard .admin-table-action {
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.95) 0%, rgba(224, 192, 88, 0.95) 100%);
          color: #111827;
          border: 1px solid rgba(201, 162, 39, 0.9);
        }
        .admin-dashboard .admin-table-action:hover {
          filter: brightness(1.05);
          box-shadow: 0 10px 20px rgba(201, 162, 39, 0.3);
        }
        .admin-overlay {
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(4px);
        }
        .admin-dashboard .admin-modal-header {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 244, 233, 0.9) 100%);
          color: #111827;
          border-bottom: 1px solid rgba(201, 162, 39, 0.36);
        }
        .admin-dashboard h1,
        .admin-dashboard h2,
        .admin-dashboard h3,
        .admin-dashboard th {
          font-family: "Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif;
          letter-spacing: 0.2px;
        }
        .admin-profile-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(17, 24, 39, 0.12);
          background: rgba(255, 255, 255, 0.78);
        }
        .admin-avatar {
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.9) 0%, rgba(224, 192, 88, 0.95) 100%);
          border: 1px solid rgba(201, 162, 39, 0.95);
          overflow: hidden;
        }
        .admin-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .analytics-metric {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(201, 162, 39, 0.28);
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
        }
        .analytics-bars {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          gap: 14px;
          align-items: end;
          height: 220px;
        }
        .analytics-bar {
          width: 8px;
          margin: 0 auto;
          border-radius: 10px 10px 4px 4px;
          background: linear-gradient(180deg, rgba(201, 162, 39, 0.34) 0%, rgba(179, 141, 45, 0.2) 100%);
          border: 1px solid rgba(201, 162, 39, 0.28);
          box-shadow: 0 2px 8px rgba(201, 162, 39, 0.1);
          backdrop-filter: blur(2px);
        }
        .pie-shell {
          width: 168px;
          height: 168px;
          margin: 0 auto;
          border-radius: 9999px;
          position: relative;
          box-shadow: 0 14px 26px rgba(15, 23, 42, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(6px);
        }
        .pie-shell::after {
          content: "";
          position: absolute;
          width: 68px;
          height: 68px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.72);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(17, 24, 39, 0.08);
          backdrop-filter: blur(8px);
        }
        .pie-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          text-align: center;
        }
        .pie-center-value {
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }
        .pie-center-label {
          font-size: 9px;
          color: rgba(31, 41, 55, 0.7);
          margin-top: 4px;
        }
        .notification-card {
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(201, 162, 39, 0.2);
          border-radius: 14px;
          padding: 16px;
        }
      `}</style>
      {/* Sidebar */}
      <div className="admin-sidebar">
        {/* Sidebar Header */}
        <div className="admin-sidebar-header p-6">
          <h2 className="text-2xl font-bold">Admin</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(17, 24, 39, 0.7)' }}>Dashboard</p>
        </div>

        {/* Navigation Menu */}
        <nav className="py-6 space-y-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              className={`admin-nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left font-semibold ${
                currentSection === item.id
                  ? "active"
                  : ""
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-64 px-4 py-4 border-t" style={{ borderColor: 'rgba(17, 24, 39, 0.1)' }}>
          <button
            onClick={handleLogout}
            className="admin-logout w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-semibold"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="admin-topbar admin-topbar-analytics py-6 px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {currentSection === "shops" && "Seller Requests Management"}
                {currentSection === "customers" && "Customers Management"}
                {currentSection === "analytics" && "Analytics"}
                {currentSection === "orders" && "Orders"}
                {currentSection === "notifications" && "Notifications"}
              </h1>
              <p className="mt-1">
                {currentSection === "shops" && "Review and manage seller registration requests"}
                {currentSection === "customers" && "View all registered customers in the system"}
                {currentSection === "analytics" && "View system analytics and insights"}
                {currentSection === "orders" && "Manage all orders"}
                {currentSection === "notifications" && "View system notifications"}
              </p>
            </div>

            <div className="admin-profile-chip self-start sm:self-auto">
              <div className="admin-avatar">
                <img src={adminPhoto} alt="Admin" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">Hi! Admin</p>
                <p className="text-xs text-gray-500 leading-tight">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="py-8 px-8">
          {/* SHOPS SECTION */}
          {currentSection === "shops" && (
            <>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{stats.approvedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-400">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">{stats.rejectedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Requests</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalCount}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              {["PENDING", "APPROVED", "REJECTED"].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    statusFilter === status
                      ? "bg-[#7a5a34] text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search by shop name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34] w-full md:w-64"
            />
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Shop Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => (
                    <tr key={request.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{request.shopName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{request.category}</td>
                      <td className="px-6 py-4 text-sm">{getStatusBadge(request.status)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          className="admin-table-action px-3 py-1 rounded-lg text-sm transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No requests found</p>
            </div>
          )}
        </div>
        </>
          )}

          {/* CUSTOMERS SECTION */}
          {currentSection === "customers" && (
            <>
              {/* Search Bar */}
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <input
                  type="text"
                  placeholder="Search by username, email, or name..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                />
              </div>

              {/* Customers Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-lg">Loading customers...</p>
                  </div>
                ) : filteredCustomers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Username</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">First Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Last Name</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Body Type</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Skin Tone</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Style Preference</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer, index) => (
                          <tr key={customer.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{customer.username}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{customer.firstName || "-"}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{customer.lastName || "-"}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{customer.bodyType || "-"}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{customer.skinTone || "-"}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{customer.stylePreference || "-"}</td>
                            <td className="px-6 py-4 text-center space-x-2">
                              <button
                                onClick={() => handleEditCustomer(customer)}
                                className="admin-table-action px-3 py-1 rounded-lg text-sm transition"
                                title="Edit customer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                                title="Delete customer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p className="text-lg">No customers found</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ANALYTICS SECTION */}
          {currentSection === "analytics" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {analyticsCards.map((card) => (
                  <div key={card.label} className="analytics-metric rounded-xl p-5">
                    <p className="text-sm text-gray-600">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                    <p className="text-xs font-semibold text-emerald-600 mt-2">{card.delta} vs last month</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-6 xl:col-span-2">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">Monthly Revenue</h3>
                    <p className="text-xs text-gray-500">Last 12 months</p>
                  </div>
                  <div className="analytics-bars">
                    {monthlyRevenueBars.map((height, index) => (
                      <div
                        key={index}
                        className="analytics-bar"
                        style={{ height: `${height}%` }}
                        title={`Month ${index + 1}: ${height}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">Channel Distribution</h3>
                    <p className="text-xs text-gray-500">Pie chart</p>
                  </div>
                  <div className="pie-shell" style={{ background: pieGradient }}>
                    <div className="pie-center">
                      <p className="pie-center-value">100%</p>
                      <p className="pie-center-label">Traffic</p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    {pieSegments.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                          <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-xs text-gray-600 font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600">
                    <p>Top source: Organic Search (42%)</p>
                    <p className="mt-1">Audience growth this week: +6.4%</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ORDERS SECTION */}
          {currentSection === "orders" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="analytics-metric rounded-xl p-5">
                  <p className="text-sm text-gray-600">Today Orders</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">148</p>
                </div>
                <div className="analytics-metric rounded-xl p-5">
                  <p className="text-sm text-gray-600">Pending Shipment</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">37</p>
                </div>
                <div className="analytics-metric rounded-xl p-5">
                  <p className="text-sm text-gray-600">On-time Delivery</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">96.2%</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{order.total}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{order.status}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* NOTIFICATIONS SECTION */}
          {currentSection === "notifications" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {notificationsData.map((notice, index) => (
                  <div key={`${notice.title}-${index}`} className="notification-card">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{notice.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notice.message}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">{notice.level}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">{notice.time}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Customer Modal - Full Profile */}
      {showCustomerModal && editingCustomer && (
        <div className="admin-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="admin-modal-header p-6 flex justify-between items-center sticky top-0">
              <div>
                <h2 className="text-2xl font-bold">Customer Profile</h2>
                <p className="text-sm opacity-90">ID: {editingCustomer.id} | {editingCustomer.username}</p>
              </div>
              <button
                onClick={() => {
                  setShowCustomerModal(false);
                  setEditingCustomer(null);
                }}
                className="text-3xl hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSaveCustomer(); }}>
              
              {/* Account Information Section */}
              <div>
                <h3 className="text-lg font-bold text-[#B68D2A] mb-4 border-b-2 pb-2">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username (Read-only)</label>
                    <input
                      type="text"
                      value={editingCustomer.username || ''}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role (Read-only)</label>
                    <input
                      type="text"
                      value={editingCustomer.role || ''}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Read-only)</label>
                    <input
                      type="email"
                      value={editingCustomer.email || ''}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-bold text-[#B68D2A] mb-4 border-b-2 pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={editingCustomer.firstName || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, firstName: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={editingCustomer.lastName || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, lastName: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture URL</label>
                    <input
                      type="url"
                      value={editingCustomer.profilePictureUrl || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, profilePictureUrl: e.target.value })}
                      placeholder="https://example.com/profile.jpg"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                </div>
              </div>

              {/* Fashion Preferences Section */}
              <div>
                <h3 className="text-lg font-bold text-[#B68D2A] mb-4 border-b-2 pb-2">Fashion Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Body Type</label>
                    <select
                      value={editingCustomer.bodyType || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, bodyType: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    >
                      <option value="">Select Body Type</option>
                      <option value="slim">Slim</option>
                      <option value="athletic">Athletic</option>
                      <option value="average">Average</option>
                      <option value="curvy">Curvy</option>
                      <option value="plus">Plus Size</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Skin Tone</label>
                    <select
                      value={editingCustomer.skinTone || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, skinTone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    >
                      <option value="">Select Skin Tone</option>
                      <option value="fair">Fair</option>
                      <option value="light">Light</option>
                      <option value="medium">Medium</option>
                      <option value="olive">Olive</option>
                      <option value="tan">Tan</option>
                      <option value="deep">Deep</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Style Preference</label>
                    <select
                      value={editingCustomer.stylePreference || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, stylePreference: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    >
                      <option value="">Select Style Preference</option>
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                      <option value="sporty">Sporty</option>
                      <option value="elegant">Elegant</option>
                      <option value="bohemian">Bohemian</option>
                      <option value="minimalist">Minimalist</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Measurements Section */}
              <div>
                <h3 className="text-lg font-bold text-[#B68D2A] mb-4 border-b-2 pb-2">Body Measurements</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingCustomer.height || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, height: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g., 165"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingCustomer.weight || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, weight: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g., 60"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Chest (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingCustomer.chest || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, chest: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g., 88"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Waist (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingCustomer.waist || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, waist: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g., 72"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hip (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingCustomer.hip || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, hip: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g., 95"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sleeve Length (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingCustomer.sleeveLength || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, sleeveLength: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g., 58"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Inseam/Pants Length (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingCustomer.inseam || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, inseam: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g., 80"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#7a5a34]"
                    />
                  </div>
                </div>
              </div>

              {/* Account Status Section */}
              <div>
                <h3 className="text-lg font-bold text-[#B68D2A] mb-4 border-b-2 pb-2">Account Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={editingCustomer.enabled || false}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, enabled: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="enabled" className="ml-3 text-sm font-semibold text-gray-700">Account Enabled</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="nonLocked"
                      checked={editingCustomer.accountNonLocked || false}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, accountNonLocked: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="nonLocked" className="ml-3 text-sm font-semibold text-gray-700">Account Not Locked</label>
                  </div>
                </div>
              </div>

              {/* Timestamps Section */}
              <div>
                <h3 className="text-lg font-bold text-[#B68D2A] mb-4 border-b-2 pb-2">Activity Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Created:</span>
                    <p className="text-gray-600">{editingCustomer.createdAt ? new Date(editingCustomer.createdAt).toLocaleString() : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Last Updated:</span>
                    <p className="text-gray-600">{editingCustomer.updatedAt ? new Date(editingCustomer.updatedAt).toLocaleString() : 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-700">Last Login:</span>
                    <p className="text-gray-600">{editingCustomer.lastLogin ? new Date(editingCustomer.lastLogin).toLocaleString() : 'Never logged in'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomerModal(false);
                    setEditingCustomer(null);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && selectedRequest && (
        <div className="admin-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="admin-modal-header sticky top-0 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedRequest.shopName}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Shop Info */}
              <div>
                <h3 className="text-lg font-bold text-[#B68D2A] mb-3">Shop Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold">Category:</span> {selectedRequest.category}</div>
                  <div><span className="font-semibold">Business Type:</span> {selectedRequest.businessType}</div>
                  <div><span className="font-semibold">Description:</span> {selectedRequest.shopDescription}</div>
                  <div><span className="font-semibold">Price Range:</span> {selectedRequest.averagePriceRange}</div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-bold text-[#B68D2A] mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold">Email:</span> {selectedRequest.email}</div>
                  <div><span className="font-semibold">Phone:</span> {selectedRequest.phone}</div>
                  <div><span className="font-semibold">Address:</span> {selectedRequest.address}</div>
                  <div><span className="font-semibold">City:</span> {selectedRequest.city}, {selectedRequest.state} {selectedRequest.zipCode}</div>
                </div>
              </div>

              {/* Bank Info */}
              <div>
                <h3 className="text-lg font-bold text-[#B68D2A] mb-3">Bank Account</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold">Account Name:</span> {selectedRequest.bankAccountName}</div>
                  <div><span className="font-semibold">IFSC:</span> {selectedRequest.bankIFSC}</div>
                </div>
              </div>

              {/* Social Media */}
              {selectedRequest.website && (
                <div>
                  <h3 className="text-lg font-bold text-[#B68D2A] mb-3">Social Media</h3>
                  <div className="text-sm space-y-1">
                    {selectedRequest.website && <div><span className="font-semibold">Website:</span> {selectedRequest.website}</div>}
                    {selectedRequest.instagram && <div><span className="font-semibold">Instagram:</span> @{selectedRequest.instagram}</div>}
                    {selectedRequest.facebook && <div><span className="font-semibold">Facebook:</span> {selectedRequest.facebook}</div>}
                  </div>
                </div>
              )}

              {/* Status Info */}
              <div className="border-t pt-4">
                <p className="text-sm"><span className="font-semibold">Status:</span> {getStatusBadge(selectedRequest.status)}</p>
                {selectedRequest.approvedAt && <p className="text-sm text-green-600">Approved on: {selectedRequest.approvedAt}</p>}
                {selectedRequest.rejectedAt && <p className="text-sm text-red-600">Rejected on: {selectedRequest.rejectedAt}</p>}
                {selectedRequest.rejectionReason && <p className="text-sm text-red-600">Reason: {selectedRequest.rejectionReason}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            {selectedRequest.id && (
              <div className="bg-gray-100 px-6 py-4 flex gap-3">
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reject and delete this seller request?")) {
                      handleReject(selectedRequest.id);
                    }
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
                >
                  Reject and Delete
                </button>
                <button
                  onClick={() => handleResetPassword(selectedRequest.id)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
                  title="Reset seller password"
                >
                  Reset Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
