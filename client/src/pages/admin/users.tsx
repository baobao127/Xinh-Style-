import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus, Search, MoreVertical, CheckCircle, XCircle } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  address: string | null;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phone: "",
    address: "",
    role: "user",
  });

  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        password: "",
        email: selectedUser.email || "",
        fullName: selectedUser.fullName || "",
        phone: selectedUser.phone || "",
        address: selectedUser.address || "",
        role: selectedUser.role,
      });
    }
  }, [selectedUser]);

  if (error) {
    toast({
      variant: "destructive",
      title: "Lỗi khi tải danh sách người dùng",
      description: "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.",
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleCreateUser = async () => {
    try {
      await apiRequest("POST", "/api/admin/users", formData);

      toast({
        title: "Thành công!",
        description: "Đã tạo người dùng mới.",
      });

      // Reset form and close dialog
      setFormData({
        username: "",
        password: "",
        email: "",
        fullName: "",
        phone: "",
        address: "",
        role: "user",
      });
      setIsCreateDialogOpen(false);

      // Invalidate cache to reload users
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi tạo người dùng.",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const dataToSend = { ...formData };
      // Don't send password if empty
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      await apiRequest("PUT", `/api/admin/users/${selectedUser.id}`, dataToSend);

      toast({
        title: "Thành công!",
        description: "Đã cập nhật thông tin người dùng.",
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);

      // Invalidate cache to reload users
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật người dùng.",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      return;
    }

    try {
      await apiRequest(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      toast({
        title: "Thành công!",
        description: "Đã xóa người dùng.",
      });

      // Invalidate cache to reload users
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi!",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi xóa người dùng.",
      });
    }
  };

  const filteredUsers = users
    ? users.filter((user) => {
        const matchesSearch =
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesRole = selectedRole === "all" || user.role === selectedRole;
        
        return matchesSearch && matchesRole;
      })
    : [];

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quản lý Người Dùng</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Thêm Người Dùng
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bộ Lọc</CardTitle>
            <CardDescription>Tìm kiếm và lọc danh sách người dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="user">Người dùng</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <span>Đang tải...</span>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên Đăng Nhập</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Họ Tên</TableHead>
                    <TableHead>Vai Trò</TableHead>
                    <TableHead>Ngày Đăng Ký</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center p-4">
                        Không tìm thấy người dùng nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email || "—"}</TableCell>
                        <TableCell>{user.fullName || "—"}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                            {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                Chỉnh Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Xóa Người Dùng
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để tạo tài khoản người dùng mới.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Tên đăng nhập*</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Mật khẩu*</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="fullName">Họ tên</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Vai trò</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" onClick={handleCreateUser}>
              Tạo Người Dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin người dùng.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-username">Tên đăng nhập</Label>
                <Input
                  id="edit-username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-password">Mật khẩu (để trống nếu không thay đổi)</Label>
                <Input
                  id="edit-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="edit-fullName">Họ tên</Label>
              <Input
                id="edit-fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit-role">Vai trò</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="edit-address">Địa chỉ</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" onClick={handleUpdateUser}>
              Lưu Thay Đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}