import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Redirect if not logged in
  if (!user) {
    setLocation('/login?redirect=/account');
    return null;
  }
  
  // Form state
  const [fullName, setFullName] = useState(user.fullName || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle profile update
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    const success = await updateUserProfile({
      fullName,
      email,
      phone,
      address
    });
    
    setIsSubmitting(false);
    
    if (success) {
      toast({
        title: "Thành công",
        description: "Thông tin tài khoản đã được cập nhật",
        variant: "success",
      });
    }
  };
  
  // Handle password change
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới không khớp với xác nhận mật khẩu",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Không thể đổi mật khẩu");
      }
      
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.",
        variant: "success",
      });
      
      // Force re-login after password change
      setTimeout(() => {
        logout();
        setLocation('/login');
      }, 2000);
    } catch (error) {
      console.error('Change password error:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi thay đổi mật khẩu",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Quản lý tài khoản - Xinh Style QC</title>
        <meta name="description" content="Quản lý thông tin tài khoản của bạn tại Xinh Style QC" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-heading font-bold mb-6">Tài khoản của tôi</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="profile" className="flex-1">Thông tin</TabsTrigger>
            <TabsTrigger value="orders" className="flex-1">Đơn hàng</TabsTrigger>
            <TabsTrigger value="password" className="flex-1">Mật khẩu</TabsTrigger>
          </TabsList>
          
          {/* Profile tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Xem và cập nhật thông tin cá nhân của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Tên đăng nhập</Label>
                    <Input 
                      id="username" 
                      value={user.username} 
                      disabled 
                      className="bg-gray-50" 
                    />
                    <p className="text-xs text-gray-500">Bạn không thể thay đổi tên đăng nhập</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Textarea 
                      id="address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <i className="fas fa-spinner animate-spin mr-2"></i>
                        Đang cập nhật
                      </span>
                    ) : (
                      'Cập nhật thông tin'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Orders tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng của tôi</CardTitle>
                <CardDescription>
                  Xem lịch sử và trạng thái đơn hàng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Button asChild>
                    <a href="/orders">Xem tất cả đơn hàng</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Password tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
                <CardDescription>
                  Cập nhật mật khẩu của bạn để bảo vệ tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      required 
                    />
                    <p className="text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <i className="fas fa-spinner animate-spin mr-2"></i>
                        Đang cập nhật
                      </span>
                    ) : (
                      'Đổi mật khẩu'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Account;
