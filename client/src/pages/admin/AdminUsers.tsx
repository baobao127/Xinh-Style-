import React from 'react';
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


const AdminUsers: React.FC = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
      {users.length === 0 ? (
        <p>Chưa có user nào được lưu.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((u: any, idx: number) => (
            <li key={idx} className="border p-3 rounded">
              <p><strong>Họ tên:</strong> {u.name}</p>
              <p><strong>Email:</strong> {u.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUsers;
