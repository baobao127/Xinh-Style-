import { useState, FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { register, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Mật khẩu nhập lại không khớp');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    setPasswordError('');
    return true;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword() || !agreeTerms) return;
    
    const userData = {
      username,
      password,
      fullName,
      email,
      phone,
      address
    };
    
    const success = await register(userData);
    
    if (success) {
      // Redirect after successful registration
      setLocation('/');
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Đăng ký - Xinh Style QC</title>
        <meta name="description" content="Đăng ký tài khoản mới tại Xinh Style QC" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-heading text-center">Đăng ký tài khoản</CardTitle>
              <p className="text-sm text-center text-gray-500">
                Đăng ký tài khoản để mua sắm tại Xinh Style QC
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập <span className="text-red-500">*</span></Label>
                  <Input 
                    id="username" 
                    placeholder="Nhập tên đăng nhập" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input 
                    id="fullName" 
                    placeholder="Nhập họ và tên" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="Nhập email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input 
                      id="phone" 
                      placeholder="Nhập số điện thoại" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input 
                    id="address" 
                    placeholder="Nhập địa chỉ" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Nhập mật khẩu" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="text-red-500">*</span></Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Nhập lại mật khẩu" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms} 
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} 
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Điều khoản sử dụng
                    </Link>
                    {" "}và{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Chính sách bảo mật
                    </Link>
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !agreeTerms}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner animate-spin mr-2"></i>
                      Đang xử lý
                    </span>
                  ) : (
                    'Đăng ký'
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter>
              <p className="text-center text-sm text-gray-500 w-full">
                Đã có tài khoản?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Register;
