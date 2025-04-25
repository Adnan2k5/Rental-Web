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
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { format } from 'date-fns';
import { getAllUsers, changeUserStatus } from '../../api/admin.api';
import { toast } from 'sonner';

export default function ManageUsers() {
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

  // Sample admin data
  const admin = {
    name: 'Sarah Johnson',
    role: 'Super Admin',
    avatar: '/placeholder.svg?height=40&width=40',
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

  // Particle effect component
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
            Active
          </Badge>
        );
      case 'suspended':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Suspended
          </Badge>
        ); default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updateUserStatus = async () => {
    console.log(selectedUser._id, selectedUser.status);
    const res = await changeUserStatus(selectedUser._id, selectedUser.status);
    if (res) {
      toast.success('User status updated successfully');
      setIsUserDialogOpen(false);
      setSelectedUser(null);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, status: selectedUser.status } : user
        )
      );
    }
    else {
      toast.error('Failed to update user status');
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-light flex"
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
                  Manage Users
                </motion.h1>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  View and manage all users on the platform
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
                  Refresh
                </Button>

                <Button variant="outline" className="h-9">
                  <Download className="h-4 w-4 mr-2" />
                  Export
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
                      placeholder="Search by name or email..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Filter:</span>
                  </div>

                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
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
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead className="text-center">
                          Items Rented
                        </TableHead>
                        <TableHead className="text-center">Verified</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                            {user.verified ? (
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
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions
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
                  Name
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
                  Email
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
                <Label className="text-right">Verified</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    disabled
                    id="verified"
                    defaultChecked={selectedUser.verified}
                  />
                  <Label htmlFor="verified">
                    {selectedUser.verified
                      ? 'Verified Account'
                      : 'Not Verified'}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  defaultValue={selectedUser.status}
                  className="col-span-3"
                  onValueChange={(value) => {
                    setSelectedUser((prev) => ({ ...prev, status: value }));
                  }}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Verified</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="verified"
                    defaultChecked={selectedUser.verified}
                    readOnly
                  />
                  <Label htmlFor="verified">
                    {selectedUser.verified
                      ? 'Verified Account'
                      : 'Not Verified'}
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUserDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
                onClick={updateUserStatus}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
