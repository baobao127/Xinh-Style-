import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  // Hàm làm mới trang
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Trang không tìm thấy</h1>
            <p className="mt-2 text-gray-600">
              Rất tiếc, chúng tôi không thể tìm thấy trang bạn yêu cầu.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button 
              onClick={handleRefresh}
              className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90"
            >
              <RefreshCw className="h-4 w-4" />
              Tải lại trang
            </Button>

            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Home className="h-4 w-4" />
                Về trang chủ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
