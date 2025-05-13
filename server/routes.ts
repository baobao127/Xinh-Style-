import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertCategorySchema, 
  insertCollectionSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertWishlistSchema,
  insertReviewSchema,
  insertCouponSchema,
  insertBrowsingHistorySchema,
  insertFlashSaleSchema
} from "@shared/schema";

// Helper function to handle Zod validation errors
function handleZodError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return res.status(400).json({ message: validationError.message });
  }
  console.error("Server error:", error);
  return res.status(500).json({ message: "Internal server error" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", time: new Date() });
  });

  // User Routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
      }
      
      // Check if email already exists if provided
      if (userData.email) {
        const existingEmail = await storage.getUserByEmail(userData.email);
        if (existingEmail) {
          return res.status(400).json({ message: "Email đã tồn tại" });
        }
      }
      
      const user = await storage.createUser(userData);
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
      }
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      // We don't use the insert schema here because we want to allow partial updates
      const userData = req.body;
      
      // Don't allow updating username or role
      delete userData.username;
      delete userData.role;
      
      const user = await storage.updateUser(userId, userData);
      
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Category Routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      
      if (!category) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Get category error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Product Routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, newArrival, flashSale } = req.query;
      let products;
      
      if (category) {
        const categoryObj = await storage.getCategoryBySlug(category as string);
        if (!categoryObj) {
          return res.json([]);
        }
        products = await storage.getProductsByCategory(categoryObj.id);
      } else if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else if (newArrival === 'true') {
        products = await storage.getNewArrivals();
      } else if (flashSale === 'true') {
        products = await storage.getFlashSaleProducts();
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.put("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const productData = req.body;
      
      const product = await storage.updateProduct(productId, productData);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const success = await storage.deleteProduct(productId);
      
      if (!success) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Collection Routes
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getCollections();
      res.json(collections);
    } catch (error) {
      console.error("Get collections error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/collections/:slug", async (req, res) => {
    try {
      const collection = await storage.getCollectionBySlug(req.params.slug);
      
      if (!collection) {
        return res.status(404).json({ message: "Không tìm thấy bộ sưu tập" });
      }
      
      res.json(collection);
    } catch (error) {
      console.error("Get collection error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/collections/:id/products", async (req, res) => {
    try {
      const collectionId = parseInt(req.params.id);
      const products = await storage.getCollectionProducts(collectionId);
      res.json(products);
    } catch (error) {
      console.error("Get collection products error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/collections", async (req, res) => {
    try {
      const collectionData = insertCollectionSchema.parse(req.body);
      const collection = await storage.createCollection(collectionData);
      res.status(201).json(collection);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.post("/api/collections/:collectionId/products/:productId", async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const productId = parseInt(req.params.productId);
      
      const success = await storage.addProductToCollection(collectionId, productId);
      
      if (!success) {
        return res.status(500).json({ message: "Không thể thêm sản phẩm vào bộ sưu tập" });
      }
      
      res.status(201).json({ message: "Đã thêm sản phẩm vào bộ sưu tập" });
    } catch (error) {
      console.error("Add product to collection error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Order Routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrderById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      
      const orderItems = await storage.getOrderItems(orderId);
      
      res.json({ ...order, items: orderItems });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/:userId/orders", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/orders", async (req, res) => {
    try {
      const { order, items } = req.body;
      
      const orderData = insertOrderSchema.parse(order);
      const newOrder = await storage.createOrder(orderData);
      
      // Add order items
      const orderItems = await Promise.all(
        items.map((item: any) => 
          storage.createOrderItem({
            ...item,
            orderId: newOrder.id
          })
        )
      );
      
      // Update coupon usage if applicable
      if (newOrder.couponCode) {
        const coupon = await storage.getCouponByCode(newOrder.couponCode);
        if (coupon) {
          await storage.updateCouponUsage(coupon.id);
        }
      }
      
      res.status(201).json({ ...newOrder, items: orderItems });
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Vui lòng cung cấp trạng thái đơn hàng" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Wishlist Routes
  app.get("/api/users/:userId/wishlist", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const products = await storage.getUserWishlistProducts(userId);
      res.json(products);
    } catch (error) {
      console.error("Get wishlist error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/wishlist", async (req, res) => {
    try {
      const wishlistData = insertWishlistSchema.parse(req.body);
      const wishlist = await storage.addToWishlist(wishlistData);
      res.status(201).json(wishlist);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.delete("/api/users/:userId/wishlist/:productId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      
      const success = await storage.removeFromWishlist(userId, productId);
      
      if (!success) {
        return res.status(404).json({ message: "Sản phẩm không có trong danh sách yêu thích" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/:userId/wishlist/:productId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      
      const isInWishlist = await storage.isInWishlist(userId, productId);
      
      res.json({ inWishlist: isInWishlist });
    } catch (error) {
      console.error("Check wishlist error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Review Routes
  app.get("/api/products/:productId/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Coupon Routes
  app.get("/api/coupons", async (req, res) => {
    try {
      const coupons = await storage.getCoupons();
      res.json(coupons);
    } catch (error) {
      console.error("Get coupons error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/coupons/validate", async (req, res) => {
    try {
      const { code, total } = req.body;
      
      if (!code || !total) {
        return res.status(400).json({ message: "Vui lòng cung cấp mã giảm giá và tổng đơn hàng" });
      }
      
      const coupon = await storage.validateCoupon(code, total);
      
      if (!coupon) {
        return res.status(404).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn" });
      }
      
      res.json(coupon);
    } catch (error) {
      console.error("Validate coupon error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/coupons", async (req, res) => {
    try {
      const couponData = insertCouponSchema.parse(req.body);
      const coupon = await storage.createCoupon(couponData);
      res.status(201).json(coupon);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Browsing History Routes
  app.post("/api/browsing-history", async (req, res) => {
    try {
      const historyData = insertBrowsingHistorySchema.parse(req.body);
      const history = await storage.addToBrowsingHistory(historyData);
      res.status(201).json(history);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const products = await storage.getRecommendedProducts(userId);
      res.json(products);
    } catch (error) {
      console.error("Get recommendations error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Flash Sale Routes
  app.get("/api/flash-sales/active", async (req, res) => {
    try {
      const flashSale = await storage.getActiveFlashSale();
      
      if (!flashSale) {
        return res.status(404).json({ message: "Không có flash sale đang diễn ra" });
      }
      
      res.json(flashSale);
    } catch (error) {
      console.error("Get active flash sale error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/flash-sales", async (req, res) => {
    try {
      const flashSaleData = insertFlashSaleSchema.parse(req.body);
      const flashSale = await storage.createFlashSale(flashSaleData);
      res.status(201).json(flashSale);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
