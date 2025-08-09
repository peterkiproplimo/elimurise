import React from 'react';
import Card from '../../base-components/Card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartWidgetProps {
  title: string;
  data: any[];
  type: 'line' | 'bar' | 'pie';
  dataKey: string;
  color?: string;
  height?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  data,
  type,
  dataKey,
  color = '#8884d8',
  height = 300
}) => {
  const renderChart = (): React.ReactElement => {
    switch (type) {
      case 'pie':
        return (
          <PieChart data={data} />
        );
      case 'bar':
        return (
          <BarChart data={data} />
        );
      case 'line':
        return (
          <LineChart data={data} />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500">No chart data</span>
          </div>
        );
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  subtitle
}) => (
  <Card>
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-xs px-2 py-1 rounded ${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-muted-foreground ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  </Card>
);

interface ActivityFeedProps {
  activities: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
    user?: string;
  }>;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return '👤';
      case 'assessment':
        return '📝';
      case 'payment':
        return '💰';
      case 'attendance':
        return '📅';
      case 'message':
        return '💬';
      default:
        return '📌';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'enrollment':
        return 'bg-green-100 text-green-600';
      case 'assessment':
        return 'bg-blue-100 text-blue-600';
      case 'payment':
        return 'bg-purple-100 text-purple-600';
      case 'attendance':
        return 'bg-orange-100 text-orange-600';
      case 'message':
        return 'bg-indigo-100 text-indigo-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {activity.user && (
                    <span className="text-xs text-muted-foreground">{activity.user}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

interface QuickActionsProps {
  actions: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => (
  <Card>
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {action.icon}
            </div>
            <div className="text-left">
              <p className="font-medium">{action.title}</p>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  </Card>
);

interface AlertWidgetProps {
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: string;
  }>;
}

export const AlertWidget: React.FC<AlertWidgetProps> = ({ alerts }) => {
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Alerts & Notifications</h3>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm mt-1">{alert.message}</p>
                  <p className="text-xs mt-2 opacity-75">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

interface ProgressWidgetProps {
  title: string;
  items: Array<{
    label: string;
    value: number;
    target: number;
    color: string;
  }>;
}

export const ProgressWidget: React.FC<ProgressWidgetProps> = ({ title, items }) => (
  <Card>
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-sm text-muted-foreground">
                {item.value}/{item.target}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${Math.min((item.value / item.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
); 