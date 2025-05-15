
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Trang không tồn tại hoặc đã bị dịch chuyển về quá khứ!</p>
      <Link
        to="/"
        className="text-blue-600 underline hover:text-blue-800 transition-all"
      >
        Về trang chủ thôi
      </Link>
    </div>
  );
};

export default NotFound;
