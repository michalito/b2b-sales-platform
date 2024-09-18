import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as userApi from '../api/userApi';
import { User } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, Pencil, Trash2, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../AuthContext';
import { useMessage } from '../MessageContext';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { token } = useAuth();
  const { setError, setSuccess } = useMessage();

  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'password'>>({
    name: '',
    email: '',
    role: 'USER',
    approved: false,
    emailVerified: false,
    discountRate: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAllUsers(token);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
      setUsers([]);
    }
  };

  const handleAddUser = async () => {
    try {
      const data = await userApi.createUser(token, newUser);
      setUsers(prevUsers => [...prevUsers, { ...newUser, id: data.id }]);
      setIsAddDialogOpen(false);
      setNewUser({ name: '', email: '', role: 'USER', approved: false, emailVerified: false, discountRate: 0 });
      setSuccess('User added successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to add user: ${error.response.data.error}`);
      } else {
        setError('Failed to add user: Unknown error');
      }
    }
  };

  const handleEditUser = async () => {
    if (editingUser) {
      try {
        const data = await userApi.updateUser(token, editingUser.id, editingUser);
        setUsers(users.map(user => user.id === editingUser.id ? data : user));
        setIsEditDialogOpen(false);
        setEditingUser(null);
        setSuccess('User updated successfully');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`Failed to update user: ${error.response.data.error}`);
        } else {
          setError('Failed to update user: Unknown error');
        }
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(token, id);
        setUsers(users.filter(user => user.id !== id));
        setSuccess('User deleted successfully');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(`Failed to delete user: ${error.response.data.error}`);
        } else {
          setError('Failed to delete user: Unknown error');
        }
      }
    }
  };

  const handleApproveUser = async (id: string) => {
    try {
      await userApi.approveUser(token, id);
      setUsers(users.map(user => user.id === id ? { ...user, approved: true } : user));
      setSuccess('User approved successfully');
    } catch (error) {
      setError('Failed to approve user');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new user.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value as 'USER' | 'ADMIN' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="USER" value="USER">User</SelectItem>
                      <SelectItem key="ADMIN" value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountRate">Discount Rate</Label>
                  <Input
                    id="discountRate"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={newUser.discountRate}
                    onChange={(e) => setNewUser({ ...newUser, discountRate: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead key="name">Name</TableHead>
            <TableHead key="email">Email</TableHead>
            <TableHead key="role">Role</TableHead>
            <TableHead key="approved">Approved</TableHead>
            <TableHead key="emailVerified">Email Verified</TableHead>
            <TableHead key="discountRate">Discount Rate</TableHead>
            <TableHead key="actions">Actions</TableHead>
          </TableRow>
        </TableHeader>
          <TableBody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell key={`name-${user.id}`}>{user.name}</TableCell>
                  <TableCell key={`email-${user.id}`}>{user.email}</TableCell>
                  <TableCell key={`role-${user.id}`}>{user.role}</TableCell>
                  <TableCell key={`approved-${user.id}`}>{user.approved ? 'Yes' : 'No'}</TableCell>
                  <TableCell key={`emailVerified-${user.id}`}>{user.emailVerified ? 'Yes' : 'No'}</TableCell>
                  <TableCell key={`discountRate-${user.id}`}>{(user.discountRate * 100).toFixed(2)}%</TableCell>
                  <TableCell key={`actions-${user.id}`}>
                    <div className="flex space-x-2">
                      <Dialog
                        key={`edit-dialog-${user.id}`}
                        open={isEditDialogOpen && editingUser?.id === user.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setIsEditDialogOpen(false);
                            setEditingUser(null);
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Update the user's information below.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-name">Name</Label>
                              <Input
                                id="edit-name"
                                value={editingUser?.name || ''}
                                onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-email">Email</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={editingUser?.email || ''}
                                onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-role">Role</Label>
                              <Select
                                value={editingUser?.role}
                                onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, role: value as 'USER' | 'ADMIN' } : null)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem key="USER" value="USER">User</SelectItem>
                                  <SelectItem key="ADMIN" value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-discountRate">Discount Rate</Label>
                              <Input
                                id="edit-discountRate"
                                type="number"
                                min="0"
                                max="1"
                                step="0.01"
                                value={editingUser?.discountRate || 0}
                                onChange={(e) => setEditingUser(prev => prev ? { ...prev, discountRate: parseFloat(e.target.value) } : null)}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => {
                                  setIsEditDialogOpen(false);
                                  setEditingUser(null);
                                }}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditUser}>Save</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        key={`delete-button-${user.id}`}
                        onClick={() => handleDeleteUser(user.id)}
                        variant="ghost"
                        size="sm"
                      >
                      <Trash2 className="h-4 w-4" />
                      </Button>
                      {!user.approved && (
                      <Button
                        key={`approve-button-${user.id}`} // Add key here
                        onClick={() => handleApproveUser(user.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
