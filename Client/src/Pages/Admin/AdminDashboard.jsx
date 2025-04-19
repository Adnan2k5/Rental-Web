import {
  ChevronDown,
  DollarSign,
  UserPlus,
  ShoppingBag,
  Activity,
  ArrowUp,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../Components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../Components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useState, useEffect } from 'react';
import { getStats } from '../../api/admin.api';
import { set } from 'date-fns';

export default function AdminDashboard() {

  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    totalUsers: 0,
    userGrowth: 0,
    newUsers: 0,
    totalItems: 0,
    newItems: 0,
    activeItems: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStats();
        console.log(response);
        setDashboardData({
          totalRevenue: 1248,
          revenueGrowth: 12,
          totalUsers: response.stats.totalUsers,
          userGrowth: (response.userGrowth[6].count / response.stats.totalUsers) * 100,
          newUsers: response.userGrowth[6].count,
          totalItems: response.stats.totalItems,
          newItems: response.stats.totalItems - response.stats.activeItems,
          activeItems: response.stats.activeItems,
        });
        setRevenueData(response.userGrowth.map((item) => ({
          month: item.month,
          users: item.count,
        })));

        setCategoryData(
          response.itemsByCategory.map((item) => ({
            name: item.categoryName,
            value: (item.itemCount/response.stats.totalItems) * 100,
          }))
        );

        setRecentUsers(
          response.recentUsers
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // Rental Color Palette
  const colors = {
    primary: '#4D39EE', // Coral
    secondary: '#191B24', // Amber
    accent: '#4FC3F7', // Light Blue
    light: '#FAFAFA', // Almost White
    dark: '#455A64', // Blue Grey
  };

  // Sample admin data
  const admin = {
    name: 'Sarah Johnson',
    role: 'Super Admin',
    avatar: '/placeholder.svg?height=40&width=40',
  };

  const COLORS = [
    colors.primary,
    colors.secondary,
    colors.accent,
    '#9575CD',
    '#4DB6AC',
  ];

  const pageTransition = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/10 to-secondary/10"
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0.1, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format number with commas
  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <motion.div
      className="min-h-screen bg-light flex"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      {/* Content */}
      <main className="flex-1 p-6 overflow-auto relative">
        <Particles />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <motion.h1
                className="text-2xl font-bold text-dark mb-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Dashboard
              </motion.h1>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome back, {admin.name}. Here's what's happening today.
              </motion.p>
            </div>

            <motion.div
              className="flex items-center space-x-3 mt-4 md:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                className="relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                <motion.span
                  className="absolute inset-0 bg-white/20 rounded-md"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 0.3 }}
                  transition={{ duration: 0.6 }}
                />
                <Calendar className="h-4 w-4 mr-2" />
                <span className="relative">Export Report</span>
              </Button>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={itemFadeIn}
          >
            <motion.div
              className="bg-white rounded-lg p-6 border border-gray-100 relative overflow-hidden"
              whileHover={{
                y: -5,
                boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full" />
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-600 border-green-200 flex items-center"
                  >
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {dashboardData.revenueGrowth}%
                  </Badge>
                </div>
              </div>
              <div className="text-muted-foreground text-sm mb-1">
                Total Revenue
              </div>
              <div className="text-2xl font-bold text-dark">
                {formatCurrency(dashboardData.totalRevenue)}
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-6 border border-gray-100 relative overflow-hidden"
              whileHover={{
                y: -5,
                boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full" />
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-600 border-green-200 flex items-center"
                  >
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {dashboardData.userGrowth}%
                  </Badge>
                </div>
              </div>
              <div className="text-muted-foreground text-sm mb-1">
                Total Users
              </div>
              <div className="text-2xl font-bold text-dark">
                {formatNumber(dashboardData.totalUsers)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                +{dashboardData.newUsers} new users this month
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-6 border border-gray-100 relative overflow-hidden"
              whileHover={{
                y: -5,
                boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full" />
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="text-muted-foreground text-sm mb-1">
                Total Items
              </div>
              <div className="text-2xl font-bold text-dark">
                {formatNumber(dashboardData.totalItems)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                +{dashboardData.newItems} new items this month
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-lg p-6 border border-gray-100 relative overflow-hidden"
              whileHover={{
                y: -5,
                boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full" />
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-muted-foreground text-sm mb-1">
                Active Items
              </div>
              <div className="text-2xl font-bold text-dark">
                {formatNumber(dashboardData.activeItems)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(
                  (dashboardData.activeItems / dashboardData.totalItems) * 100
                )}
                % of total items
              </div>
            </motion.div>
          </motion.div>

          {/* Analytics Section */}
          <motion.div className="space-y-6" variants={itemFadeIn}>
            <Tabs defaultValue="revenue" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="bg-white border border-gray-200">
                  <TabsTrigger
                    value="revenue"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    Revenue
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    Users
                  </TabsTrigger>
                  <TabsTrigger
                    value="items"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    Items
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="revenue" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>
                      Monthly revenue trends for the current year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={revenueData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis dataKey="month" />
                          <YAxis
                            tickFormatter={(value) => `$${value / 1000}k`}
                            domain={[10000, 'dataMax + 5000']}
                          />
                          <Tooltip
                            formatter={(value) => [`$${value}`, 'Revenue']}
                            labelStyle={{ color: colors.dark }}
                            contentStyle={{
                              backgroundColor: 'white',
                              borderColor: '#e2e8f0',
                              borderRadius: '0.375rem',
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke={colors.primary}
                            strokeWidth={3}
                            dot={{ r: 4, fill: colors.primary }}
                            activeDot={{ r: 6, fill: colors.primary }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>
                      Monthly user acquisition trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={revenueData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis dataKey="month" />
                          <YAxis domain={[1000, 'dataMax + 200']} />
                          <Tooltip
                            formatter={(value) => [`${value}`, 'Users']}
                            labelStyle={{ color: colors.dark }}
                            contentStyle={{
                              backgroundColor: 'white',
                              borderColor: '#e2e8f0',
                              borderRadius: '0.375rem',
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="users"
                            stroke={colors.secondary}
                            strokeWidth={3}
                            dot={{ r: 4, fill: colors.secondary }}
                            activeDot={{ r: 6, fill: colors.secondary }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Item Categories</CardTitle>
                    <CardDescription>
                      Distribution of items by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {categoryData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [`${value}%`, 'Percentage']}
                              contentStyle={{
                                backgroundColor: 'white',
                                borderColor: '#e2e8f0',
                                borderRadius: '0.375rem',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={categoryData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f0f0f0"
                            />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) => [`${value}`, 'Items']}
                              contentStyle={{
                                backgroundColor: 'white',
                                borderColor: '#e2e8f0',
                                borderRadius: '0.375rem',
                              }}
                            />
                            <Legend />
                            <Bar
                              dataKey="items"
                              fill={colors.accent}
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Recent Users */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>New users who joined recently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      whileHover={{ backgroundColor: '#f9fafb', x: 2 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-right">
                          <div>Joined {user.createdAt}</div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}
