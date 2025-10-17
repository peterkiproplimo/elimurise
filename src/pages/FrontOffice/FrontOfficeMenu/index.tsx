import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lucide from '../../../base-components/Lucide';
import { Menu } from '../../../base-components/Headless';
import { useAuth } from '../../../contexts/Auth';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  permission?: string;
  children?: MenuItem[];
}

const FrontOfficeMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'BarChart3',
      path: '/front-office/dashboard'
    },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: 'MessageSquare',
      path: '/front-office/enquiries',
      permission: 'enquiries',
      children: [
        {
          id: 'enquiry-list',
          label: 'All Enquiries',
          icon: 'List',
          path: '/front-office/enquiries'
        },
        {
          id: 'enquiry-reports',
          label: 'Enquiry Reports',
          icon: 'FileText',
          path: '/front-office/enquiries/reports'
        },
        {
          id: 'conversion-funnel',
          label: 'Conversion Funnel',
          icon: 'TrendingUp',
          path: '/front-office/enquiries/conversion-funnel'
        }
      ]
    },
    {
      id: 'visitors',
      label: 'Visitors',
      icon: 'Users',
      path: '/front-office/visitors',
      permission: 'visitors',
      children: [
        {
          id: 'visitor-list',
          label: 'Visitor Log',
          icon: 'List',
          path: '/front-office/visitors'
        },
        {
          id: 'visitor-reports',
          label: 'Visitor Reports',
          icon: 'BarChart',
          path: '/front-office/visitors/reports'
        },
        {
          id: 'visitor-analytics',
          label: 'Visitor Analytics',
          icon: 'PieChart',
          path: '/front-office/visitors/analytics'
        }
      ]
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: 'AlertTriangle',
      path: '/front-office/complaints',
      permission: 'complaints',
      children: [
        {
          id: 'complaint-list',
          label: 'All Complaints',
          icon: 'List',
          path: '/front-office/complaints'
        },
        {
          id: 'complaint-dashboard',
          label: 'Complaint Dashboard',
          icon: 'Activity',
          path: '/front-office/complaints/dashboard'
        },
        {
          id: 'sla-reports',
          label: 'SLA Reports',
          icon: 'Clock',
          path: '/front-office/complaints/sla-reports'
        }
      ]
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: 'FileText',
      path: '/front-office/online-applications',
      permission: 'applications',
      children: [
        {
          id: 'application-list',
          label: 'All Applications',
          icon: 'List',
          path: '/front-office/online-applications'
        },
        {
          id: 'application-pipeline',
          label: 'Application Pipeline',
          icon: 'Workflow',
          path: '/front-office/online-applications/pipeline'
        },
        {
          id: 'application-reports',
          label: 'Application Reports',
          icon: 'FileBarChart',
          path: '/front-office/online-applications/reports'
        }
      ]
    },
    {
      id: 'phone-calls',
      label: 'Phone Calls',
      icon: 'Phone',
      path: '/front-office/phone-calls',
      permission: 'phone_calls'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'FileBarChart',
      path: '/front-office/reports',
      permission: 'reports',
      children: [
        {
          id: 'enquiry-reports',
          label: 'Enquiry Reports',
          icon: 'MessageSquare',
          path: '/front-office/reports/enquiries'
        },
        {
          id: 'visitor-reports',
          label: 'Visitor Reports',
          icon: 'Users',
          path: '/front-office/reports/visitors'
        },
        {
          id: 'complaint-reports',
          label: 'Complaint Reports',
          icon: 'AlertTriangle',
          path: '/front-office/reports/complaints'
        },
        {
          id: 'application-reports',
          label: 'Application Reports',
          icon: 'FileText',
          path: '/front-office/reports/applications'
        },
        {
          id: 'comprehensive-reports',
          label: 'Comprehensive Reports',
          icon: 'BarChart3',
          path: '/front-office/reports/comprehensive'
        }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const hasChildren = (item: MenuItem) => {
    return item.children && item.children.length > 0;
  };

  const canAccess = (item: MenuItem) => {
    if (!item.permission) return true;
    return hasPermission(item.permission, 'read');
  };

  const handleMenuClick = (item: MenuItem) => {
    if (hasChildren(item)) {
      setActiveDropdown(activeDropdown === item.id ? null : item.id);
    } else {
      navigate(item.path);
    }
  };

  const handleChildClick = (child: MenuItem) => {
    navigate(child.path);
    setActiveDropdown(null);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Front Office</h1>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              if (!canAccess(item)) return null;

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Lucide icon={item.icon} className="w-4 h-4 mr-2" />
                    {item.label}
                    {hasChildren(item) && (
                      <Lucide 
                        icon={activeDropdown === item.id ? 'ChevronUp' : 'ChevronDown'} 
                        className="w-4 h-4 ml-1" 
                      />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {hasChildren(item) && activeDropdown === item.id && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        {item.children?.map((child) => {
                          if (!canAccess(child)) return null;
                          
                          return (
                            <button
                              key={child.id}
                              onClick={() => handleChildClick(child)}
                              className={`flex items-center w-full px-4 py-2 text-sm text-left transition-colors duration-200 ${
                                isActive(child.path)
                                  ? 'text-blue-600 bg-blue-50'
                                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                              }`}
                            >
                              <Lucide icon={child.icon} className="w-4 h-4 mr-3" />
                              {child.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Menu>
              <Menu.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                <Lucide icon="Menu" className="w-6 h-6" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg border border-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  {menuItems.map((item) => {
                    if (!canAccess(item)) return null;

                    return (
                      <div key={item.id}>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleMenuClick(item)}
                              className={`flex items-center w-full px-4 py-2 text-sm text-left transition-colors duration-200 ${
                                active || isActive(item.path)
                                  ? 'text-blue-600 bg-blue-50'
                                  : 'text-gray-700'
                              }`}
                            >
                              <Lucide icon={item.icon} className="w-4 h-4 mr-3" />
                              {item.label}
                              {hasChildren(item) && (
                                <Lucide 
                                  icon={activeDropdown === item.id ? 'ChevronUp' : 'ChevronDown'} 
                                  className="w-4 h-4 ml-auto" 
                                />
                              )}
                            </button>
                          )}
                        </Menu.Item>

                        {/* Mobile Submenu */}
                        {hasChildren(item) && activeDropdown === item.id && (
                          <div className="pl-8">
                            {item.children?.map((child) => {
                              if (!canAccess(child)) return null;
                              
                              return (
                                <Menu.Item key={child.id}>
                                  {({ active }) => (
                                    <button
                                      onClick={() => handleChildClick(child)}
                                      className={`flex items-center w-full px-4 py-2 text-sm text-left transition-colors duration-200 ${
                                        active || isActive(child.path)
                                          ? 'text-blue-600 bg-blue-50'
                                          : 'text-gray-700'
                                      }`}
                                    >
                                      <Lucide icon={child.icon} className="w-4 h-4 mr-3" />
                                      {child.label}
                                    </button>
                                  )}
                                </Menu.Item>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default FrontOfficeMenu;
