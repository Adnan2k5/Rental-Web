import { useEffect, useState } from 'react';
import {
  Search,
  MoreHorizontal,
  Filter,
  RefreshCw,
  Download,
  UserPlus,
  CheckCircle,
  XCircle,
  Edit,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../Components/ui/button';
import { Input } from '../../Components/ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../Components/ui/avatar';
import { Badge } from '../../Components/ui/badge';
import { Card, CardContent } from '../../Components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../Components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../Components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../Components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../Components/ui/pagination';
import { Switch } from '../../Components/ui/switch';
import { Label } from '../../Components/ui/label';
import { format } from 'date-fns';
import { getAllUsers, changeUserStatus } from '../../api/admin.api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function ManageUsers() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // You can make this selectable if you want
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers(page, limit);
      if (response) {
        setUsers(response.users);
        if (response.pagination) setPagination(response.pagination);
      } else {
        console.error('Failed to fetch users');
      }
    }
    fetchUsers();
  }, [page, limit]);

  // Rental Color Palette
  const colors = {
    primary: '#4D39EE', // Coral
    secondary: '#191B24', // Amber
    accent: '#4FC3F7', // Light Blue
    light: '#FAFAFA', // Almost White
    dark: '#455A64', // Blue Grey
  };




  // Animation variants
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

  // Particle effect Components
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

  // Handle user edit
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {t('manageUsers.statusActive')}
          </Badge>
        );
      case 'suspended':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {t('manageUsers.statusSuspended')}
          </Badge>
        ); default:
        return <Badge variant="outline">{t('manageUsers.statusOther', { status })}</Badge>;
    }
  };

  const updateUserStatus = async () => {
    console.log(selectedUser._id, selectedUser.status);
    const res = await changeUserStatus(selectedUser._id, selectedUser.status);
    if (res) {
      toast.success(t('manageUsers.statusUpdateSuccess'));
      setIsUserDialogOpen(false);
      setSelectedUser(null);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, status: selectedUser.status } : user
        )
      );
    }
    else {
      toast.error(t('manageUsers.statusUpdateFail'));
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-light flex flex-col"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      {/* Main Content */}
      <motion.div className="flex-1 flex flex-col" variants={itemFadeIn}>
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
                  {t('manageUsers.title')}
                </motion.h1>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t('manageUsers.subtitle')}
                </motion.p>
              </div>

              <motion.div
                className="flex items-center space-x-3 mt-4 md:mt-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button onClick={() => { location.reload() }} variant="outline" className="h-9">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('manageUsers.refresh')}
                </Button>

                <Button variant="outline" className="h-9">
                  <Download className="h-4 w-4 mr-2" />
                  {t('manageUsers.export')}
                </Button>
              </motion.div>
            </div>

            {/* Filters */}
            <motion.div
              className="bg-white p-4 rounded-lg border border-gray-100 mb-6"
              variants={itemFadeIn}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('manageUsers.searchPlaceholder')}
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{t('manageUsers.filter')}:</span>
                  </div>

                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t('manageUsers.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('manageUsers.statusAll')}</SelectItem>
                      <SelectItem value="active">{t('manageUsers.statusActive')}</SelectItem>
                      <SelectItem value="suspended">{t('manageUsers.statusSuspended')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Users Table */}
            <motion.div variants={itemFadeIn}>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">{t('manageUsers.table.id')}</TableHead>
                        <TableHead>{t('manageUsers.table.user')}</TableHead>
                        <TableHead>{t('manageUsers.table.status')}</TableHead>
                        <TableHead>{t('manageUsers.table.joinDate')}</TableHead>
                        <TableHead className="text-center">
                          {t('manageUsers.table.itemsRented')}
                        </TableHead>
                        <TableHead className="text-center">{t('manageUsers.table.verified')}</TableHead>
                        <TableHead className="text-right">{t('manageUsers.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {user._id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{format(user.createdAt, 'MM-dd-yyyy')}</TableCell>
                          <TableCell className="text-center">
                            {user.bookings.length}
                          </TableCell>
                          <TableCell className="text-center">
                            {user.documentVerified ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Pagination */}
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={e => { e.preventDefault(); if (pagination.hasPreviousPage) setPage(p => p - 1); }}
                        className={pagination.hasPreviousPage ? '' : 'pointer-events-none opacity-50'}
                        aria-label={t('pagination.previous')}
                      />
                    </PaginationItem>
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          href="#"
                          isActive={pagination.currentPage === i + 1}
                          onClick={e => { e.preventDefault(); setPage(i + 1); }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={e => { e.preventDefault(); if (pagination.hasNextPage) setPage(p => p + 1); }}
                        className={pagination.hasNextPage ? '' : 'pointer-events-none opacity-50'}
                        aria-label={t('pagination.next')}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </motion.div>
          </div>
        </main>
      </motion.div>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('manageUsers.editUserTitle')}</DialogTitle>
              <DialogDescription>
                {t('manageUsers.editUserDesc')}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {t('manageUsers.name')}
                </Label>
                <Input
                  id="name"
                  defaultValue={selectedUser.name}
                  disabled
                  className="col-span-3"
                  readOnly={true}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  {t('manageUsers.email')}
                </Label>
                <Input
                  id="email"
                  defaultValue={selectedUser.email}
                  disabled
                  className="col-span-3 disabled"
                  readOnly={true}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t('manageUsers.verified')}</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    disabled
                    id="verified"
                    defaultChecked={selectedUser.verified}
                  />
                  <Label htmlFor="verified">
                    {selectedUser.verified
                      ? t('manageUsers.verifiedAccount')
                      : t('manageUsers.notVerified')}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  {t('manageUsers.status')}
                </Label>
                <Select
                  defaultValue={selectedUser.status}
                  className="col-span-3"
                  onValueChange={(value) => {
                    setSelectedUser((prev) => ({ ...prev, status: value }));
                  }}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t('manageUsers.statusSelect')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('manageUsers.statusActive')}</SelectItem>
                    <SelectItem value="suspended">{t('manageUsers.statusSuspended')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">{t('manageUsers.verified')}</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="verified"
                    defaultChecked={selectedUser.verified}
                    readOnly
                  />
                  <Label htmlFor="verified">
                    {selectedUser.verified
                      ? t('manageUsers.verifiedAccount')
                      : t('manageUsers.notVerified')}
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUserDialogOpen(false)}
              >
                {t('dialogbox.cancel')}
              </Button>
              <Button
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
                onClick={updateUserStatus}
              >
                {t('manageUsers.saveChanges')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
