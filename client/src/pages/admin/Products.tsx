import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/layout/AdminLayout';
import { Product, Category } from '@shared/schema';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách sản phẩm (Admin)</h2>
      <ul className="space-y-2">
        {products.map((p: any) => (
          <li key={p.id} className="border p-2 rounded flex justify-between">
            <span>{p.name}</span>
            <span>{p.price.toLocaleString()}đ</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
