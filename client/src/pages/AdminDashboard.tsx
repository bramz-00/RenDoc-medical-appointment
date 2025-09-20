import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  UserPlus,
  MoreHorizontal,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react'; 

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon:Home, active: true },
    { name: 'Users', icon: Users },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Products', icon: Package },
    { name: 'Settings', icon: Settings },
  ];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: '$124,532',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'New Users',
      value: '1,429',
      change: '+8.2%',
      changeType: 'increase',
      icon: UserPlus,
      color: 'blue'
    },
    {
      title: 'Orders',
      value: '2,847',
      change: '-2.1%',
      changeType: 'decrease',
      icon: ShoppingCart,
      color: 'amber'
    },
    {
      title: 'Growth Rate',
      value: '18.3%',
      change: '+5.4%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'purple'
    },
  ];

  const recentActivity = [
    { id: 1, user: 'Sarah Johnson', action: 'Placed an order', time: '2 minutes ago', amount: '$299.00' },
    { id: 2, user: 'Mike Chen', action: 'Updated profile', time: '5 minutes ago', amount: null },
    { id: 3, user: 'Emma Wilson', action: 'Cancelled order', time: '10 minutes ago', amount: '$156.00' },
    { id: 4, user: 'David Brown', action: 'Placed an order', time: '15 minutes ago', amount: '$89.00' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);



  return (
    <div className={ ''}>
      <div className="min-h-screen bg-gray-50  transition-colors duration-200">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white
          border-r border-gray-200  transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 ">
              <h1 className="text-xl font-bold text-gray-900 ">AdminPanel</h1>
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.name === activeMenuItem;
                
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveMenuItem(item.name)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700  hover:bg-gray-100 '
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200 ">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500 ">Administrator</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Header */}
          <header className="bg-white  border-b border-gray-200 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 "
                >
                  <Menu className="h-5 w-5" />
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 ">Dashboard</h1>
                  <p className="text-sm text-gray-500 ">Welcome back, John!</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Search - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100  rounded-lg">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm w-40"
                  />
                </div>

             

                <button className="relative p-2 rounded-lg hover:bg-gray-100 ">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-4 lg:p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.changeType === 'increase' ? TrendingUp : TrendingDown;
                
                return (
                  <div key={index} className="bg-white  rounded-xl p-6 border border-gray-200 ">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg `}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <button className="p-1 rounded hover:bg-gray-100 ">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500  mb-1">
                        {stat.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900 ">
                          {stat.value}
                        </span>
                        <div className={`flex items-center gap-1 text-sm ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendIcon className="h-3 w-3" />
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Chart Placeholder */}
              <div className="xl:col-span-2 bg-white rounded-xl p-6 border border-gray-200 ">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 ">Revenue Overview</h2>
                  <select className="text-sm border border-gray-200  rounded-lg px-3 py-1 bg-white ">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                
                {/* Chart Placeholder */}
                <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 ">Chart Component Here</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 ">
                <h2 className="text-lg font-semibold text-gray-900  mb-6">Recent Activity</h2>
                
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100  rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-600 " />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900  truncate">
                          {activity.user}
                        </p>
                        <p className="text-xs text-gray-500 ">
                          {activity.action} • {activity.time}
                        </p>
                      </div>
                      {activity.amount && (
                        <span className="text-sm font-medium text-green-600">
                          {activity.amount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all activity
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}