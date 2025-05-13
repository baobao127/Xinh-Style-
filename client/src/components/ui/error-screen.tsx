import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "wouter";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ErrorScreen({
  title = "Đã xảy ra lỗi",
  message = "Rất tiếc, đã có lỗi xảy ra khi tải trang. Vui lòng thử lại sau.",
  onRetry,
  showHomeButton = true,
}: ErrorScreenProps) {
  // Hàm làm mới trang
  const handleRefresh = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="bg-red-100 rounded-full p-4 mb-4">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-600">
              {message}
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Button 
              onClick={handleRefresh}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </Button>

            {showHomeButton && (
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 border-secondary text-secondary hover:bg-secondary hover:text-white"
                >
                  <Home className="h-4 w-4" />
                  Về trang chủ
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}