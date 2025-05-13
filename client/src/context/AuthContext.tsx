import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getAuthUser, setAuthUser, clearAuthUser } from '@/lib/localStorage';

interface User {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
}

interface RegisterData {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = getAuthUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/users/login', { username, password });
      
      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Đăng nhập thất bại",
          description: error.message || "Tên đăng nhập hoặc mật khẩu không đúng",
          variant: "destructive",
        });
        return false;
      }
      
      const userData = await response.json();
      setUser(userData);
      setAuthUser(userData);
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng quay trở lại, ${userData.fullName || userData.username}!`,
        variant: "success",
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Đăng nhập thất bại",
        description: "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/users/register', userData);
      
      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Đăng ký thất bại",
          description: error.message || "Không thể đăng ký tài khoản",
          variant: "destructive",
        });
        return false;
      }
      
      const newUser = await response.json();
      
      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản đã được tạo thành công!",
        variant: "success",
      });
      
      // Auto login after successful registration
      setUser(newUser);
      setAuthUser(newUser);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    clearAuthUser();
    setLocation('/');
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi tài khoản.",
      variant: "default",
    });
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      const response = await apiRequest('PUT', `/api/users/${user.id}`, data);
      
      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Cập nhật thất bại",
          description: error.message || "Không thể cập nhật thông tin tài khoản",
          variant: "destructive",
        });
        return false;
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      setAuthUser(updatedUser);
      
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin tài khoản đã được cập nhật!",
        variant: "success",
      });
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = !!user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAdmin,
      login, 
      register, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
