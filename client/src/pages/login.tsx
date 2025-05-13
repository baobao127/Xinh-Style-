import { useState, FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Check if there's a redirect URL in the query string
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get('redirect') || '/';
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) return;
    
    const success = await login(username, password);
    
    if (success) {
      // Redirect after successful login
      setLocation(redirectTo);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Đăng nhập - Xinh Style QC</title>
        <meta name="description" content="Đăng nhập vào tài khoản Xinh Style QC" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-heading text-center">Đăng nhập</CardTitle>
              <p className="text-sm text-center text-gray-500">
                Đăng nhập để tiếp tục mua sắm tại Xinh Style QC
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input 
                    id="username" 
                    placeholder="Nhập tên đăng nhập của bạn" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Nhập mật khẩu" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe} 
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                  />
                  <Label htmlFor="remember" className="text-sm">Ghi nhớ đăng nhập</Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner animate-spin mr-2"></i>
                      Đang xử lý
                    </span>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <i className="fab fa-facebook-f mr-2 text-blue-600"></i>
                  Facebook
                </Button>
                <Button variant="outline" className="w-full">
                  <i className="fab fa-google mr-2 text-red-500"></i>
                  Google
                </Button>
              </div>
            </CardContent>
            
            <CardFooter>
              <p className="text-center text-sm text-gray-500 w-full">
                Chưa có tài khoản?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
