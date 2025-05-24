import {
  ChevronDown,
  UserPlus,
  ShoppingBag,
  Activity,
  ArrowUp,
  Euro,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../Components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../Components/ui/avatar';
import { Badge } from '../../Components/ui/badge';
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
} from '../../Components/ui/tabs';
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
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { itemFadeIn, pageTransition } from '../../assets/Animations';
import { Particles } from '../../Components/Particles';
import { useAuth } from '../../Middleware/AuthProvider';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { t } = useTranslation();

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

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042',
    '#8dd1e1', '#a4de6c', '#d0ed57', '#ffbb28',
    '#d88884', '#a28fef', '#f26298', '#63cdda'
  ];
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [itemGrowth, setItemGrowth] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStats();

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
            value: (item.itemCount / response.stats.totalItems) * 100,
          }))
        );

        setItemGrowth(
          response.itemsByCategory.map((item) => ({
            month: item.categoryName,
            items: item.itemCount,
          }))
        );

        setRecentUsers(
          response.recentUsers
        );
      } catch (error) {
        toast.error("Error")
      }
    }

    fetchData();
  }, []);


  // Sample admin data
  const admin = useAuth();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
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
      className="min-h-screen bg-light flex flex-col"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      {/* Content */}
      <main className="flex-1 p-6 overflow-auto relative">


        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <motion.h1
                className="text-2xl font-bold text-dark mb-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t('adminDashboard.title')}
              </motion.h1>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('adminDashboard.welcome', { name: admin.user.name })}
              </motion.p>
            </div>
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
                  <Euro className="h-6 w-6 text-primary" />
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
                {t('adminDashboard.totalRevenue')}
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
                  <UserPlus className="h-6 w-6 text-primary" />
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
                {t('adminDashboard.totalUsers')}
              </div>
              <div className="text-2xl font-bold text-dark">
                {formatNumber(dashboardData.totalUsers)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {t('adminDashboard.newUsers', { count: dashboardData.newUsers })}
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
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-muted-foreground text-sm mb-1">
                {t('adminDashboard.totalItems')}
              </div>
              <div className="text-2xl font-bold text-dark">
                {formatNumber(dashboardData.totalItems)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {t('adminDashboard.newItems', { count: dashboardData.newItems })}
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
                {t('adminDashboard.activeItems')}
              </div>
              <div className="text-2xl font-bold text-dark">
                {formatNumber(dashboardData.activeItems)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {t('adminDashboard.activeItemsPercent', { percent: Math.round((dashboardData.activeItems / dashboardData.totalItems) * 100) })}
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
                    {t('adminDashboard.revenueTab')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    {t('adminDashboard.usersTab')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="items"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    {t('adminDashboard.itemsTab')}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="revenue" className="mt-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>{t('adminDashboard.revenueOverview')}</CardTitle>
                    <CardDescription>
                      {t('adminDashboard.revenueOverviewDesc')}
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
                    <CardTitle>{t('adminDashboard.userGrowth')}</CardTitle>
                    <CardDescription>
                      {t('adminDashboard.userGrowthDesc')}
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
                    <CardTitle>{t('adminDashboard.itemCategories')}</CardTitle>
                    <CardDescription>
                      {t('adminDashboard.itemCategoriesDesc')}
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
                                  fill={colors[index % colors.length]}
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
                            data={itemGrowth}
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
                <CardTitle>{t('adminDashboard.recentUsers')}</CardTitle>
                <CardDescription>{t('adminDashboard.recentUsersDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <motion.div
                      key={user._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      whileHover={{ backgroundColor: '#f9fafb', x: 2 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium"><Link to={`/profile/${user._id}`}>{user.name}</Link></div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-right">
                          <div>{t('adminDashboard.joined', { date: format(user.createdAt, 'dd-MM-yyyy') })}</div>
                        </div>
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
