import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  collections, type Collection, type InsertCollection,
  collectionProducts,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  wishlists, type Wishlist, type InsertWishlist,
  reviews, type Review, type InsertReview,
  coupons, type Coupon, type InsertCoupon,
  browsingHistory, type BrowsingHistory, type InsertBrowsingHistory,
  flashSales, type FlashSale, type InsertFlashSale
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  getFlashSaleProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Collection operations
  getCollections(): Promise<Collection[]>;
  getCollectionBySlug(slug: string): Promise<Collection | undefined>;
  getCollectionProducts(collectionId: number): Promise<Product[]>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  addProductToCollection(collectionId: number, productId: number): Promise<boolean>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order Item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Wishlist operations
  getUserWishlist(userId: number): Promise<Wishlist[]>;
  getUserWishlistProducts(userId: number): Promise<Product[]>;
  addToWishlist(wishlist: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;
  
  // Review operations
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Coupon operations
  getCoupons(): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  validateCoupon(code: string, orderTotal: number): Promise<Coupon | undefined>;
  updateCouponUsage(id: number): Promise<Coupon | undefined>;
  
  // Browsing History operations
  addToBrowsingHistory(history: InsertBrowsingHistory): Promise<BrowsingHistory>;
  getUserBrowsingHistory(userId: number, limit?: number): Promise<BrowsingHistory[]>;
  getRecommendedProducts(userId: number): Promise<Product[]>;
  
  // Flash Sale operations
  getActiveFlashSale(): Promise<FlashSale | undefined>;
  createFlashSale(flashSale: InsertFlashSale): Promise<FlashSale>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private categoriesMap: Map<number, Category>;
  private productsMap: Map<number, Product>;
  private collectionsMap: Map<number, Collection>;
  private collectionProductsMap: Map<string, boolean>;
  private ordersMap: Map<number, Order>;
  private orderItemsMap: Map<number, OrderItem>;
  private wishlistsMap: Map<number, Wishlist>;
  private reviewsMap: Map<number, Review>;
  private couponsMap: Map<number, Coupon>;
  private browsingHistoryMap: Map<number, BrowsingHistory>;
  private flashSalesMap: Map<number, FlashSale>;
  
  private userId: number;
  private categoryId: number;
  private productId: number;
  private collectionId: number;
  private orderId: number;
  private orderItemId: number;
  private wishlistId: number;
  private reviewId: number;
  private couponId: number;
  private browsingHistoryId: number;
  private flashSaleId: number;

  constructor() {
    this.usersMap = new Map();
    this.categoriesMap = new Map();
    this.productsMap = new Map();
    this.collectionsMap = new Map();
    this.collectionProductsMap = new Map();
    this.ordersMap = new Map();
    this.orderItemsMap = new Map();
    this.wishlistsMap = new Map();
    this.reviewsMap = new Map();
    this.couponsMap = new Map();
    this.browsingHistoryMap = new Map();
    this.flashSalesMap = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.collectionId = 1;
    this.orderId = 1;
    this.orderItemId = 1;
    this.wishlistId = 1;
    this.reviewId = 1;
    this.couponId = 1;
    this.browsingHistoryId = 1;
    this.flashSaleId = 1;
    
    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@xinhstyle.vn",
      fullName: "Admin User",
      phone: "0123456789",
      address: "Hồ Chí Minh, Việt Nam"
    }).then(user => {
      // Update role to admin
      this.updateUser(user.id, { role: "admin" });
    });
    
    // Create categories
    const categories = [
      { name: "Áo", slug: "ao", description: "Áo phong cách nữ", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80" },
      { name: "Váy", slug: "vay", description: "Váy đẹp cho phái nữ", image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?q=80" },
      { name: "Quần", slug: "quan", description: "Quần thời trang", image: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80" },
      { name: "Đồ thể thao", slug: "do-the-thao", description: "Trang phục thể thao nữ", image: "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80" },
      { name: "Phụ kiện", slug: "phu-kien", description: "Phụ kiện thời trang nữ", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80" }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
    
    // Create products
    const products = [
      {
        name: "Đầm hoa nhẹ nhàng",
        slug: "dam-hoa-nhe-nhang",
        description: "Đầm hoa nhẹ nhàng phong cách mùa hè",
        price: 359000,
        salePrice: 199000,
        discount: 45,
        categoryId: 2,
        images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80"],
        colors: ["Trắng", "Xanh", "Hồng"],
        sizes: ["S", "M", "L"],
        featured: true,
        newArrival: false,
        flashSale: true
      },
      {
        name: "Set áo trắng quần jean",
        slug: "set-ao-trang-quan-jean",
        description: "Set áo trắng quần jean thời trang",
        price: 350000,
        salePrice: 245000,
        discount: 30,
        categoryId: 1,
        images: ["https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80"],
        colors: ["Trắng", "Xanh"],
        sizes: ["S", "M", "L", "XL"],
        featured: false,
        newArrival: false,
        flashSale: true
      },
      {
        name: "Đầm dự tiệc đỏ sang trọng",
        slug: "dam-du-tiec-do-sang-trong",
        description: "Đầm dự tiệc đỏ sang trọng cho các buổi tiệc",
        price: 799000,
        salePrice: 399000,
        discount: 50,
        categoryId: 2,
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80"],
        colors: ["Đỏ", "Đen"],
        sizes: ["S", "M", "L"],
        featured: true,
        newArrival: false,
        flashSale: true
      },
      {
        name: "Áo phông phong cách",
        slug: "ao-phong-phong-cach",
        description: "Áo phông phong cách trẻ trung",
        price: 199000,
        salePrice: 149000,
        discount: 25,
        categoryId: 1,
        images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80"],
        colors: ["Trắng", "Đen", "Xám"],
        sizes: ["S", "M", "L", "XL"],
        featured: false,
        newArrival: false,
        flashSale: true
      },
      {
        name: "Mũ cói đi biển",
        slug: "mu-coi-di-bien",
        description: "Mũ cói đi biển phong cách",
        price: 199000,
        salePrice: 129000,
        discount: 35,
        categoryId: 5,
        images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80"],
        colors: ["Nâu"],
        sizes: ["Free size"],
        featured: false,
        newArrival: false,
        flashSale: true
      },
      {
        name: "Đầm hè nhẹ nhàng",
        slug: "dam-he-nhe-nhang",
        description: "Đầm hè nhẹ nhàng cho mùa hè",
        price: 329000,
        salePrice: null,
        discount: 0,
        categoryId: 2,
        images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80"],
        colors: ["Hồng", "Trắng"],
        sizes: ["S", "M", "L"],
        featured: true,
        newArrival: true,
        flashSale: false
      },
      {
        name: "Áo blazer công sở",
        slug: "ao-blazer-cong-so",
        description: "Áo blazer công sở phong cách chuyên nghiệp",
        price: 540000,
        salePrice: 459000,
        discount: 15,
        categoryId: 1,
        images: ["https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_960_720.jpg"],
        colors: ["Đen", "Xám", "Xanh navy"],
        sizes: ["S", "M", "L", "XL"],
        featured: true,
        newArrival: false,
        flashSale: false
      },
      {
        name: "Túi xách nữ da thật",
        slug: "tui-xach-nu-da-that",
        description: "Túi xách nữ da thật cao cấp",
        price: 799000,
        salePrice: null,
        discount: 0,
        categoryId: 5,
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80"],
        colors: ["Nâu", "Đen"],
        sizes: ["Free size"],
        featured: true,
        newArrival: false,
        flashSale: false
      },
      {
        name: "Áo sọc năng động",
        slug: "ao-soc-nang-dong",
        description: "Áo sọc năng động phong cách trẻ trung",
        price: 229000,
        salePrice: null,
        discount: 0,
        categoryId: 1,
        images: ["https://cdn.pixabay.com/photo/2016/11/29/03/35/woman-1867093_960_720.jpg"],
        colors: ["Trắng sọc đen", "Xanh sọc trắng"],
        sizes: ["S", "M", "L"],
        featured: true,
        newArrival: false,
        flashSale: false
      },
      {
        name: "Đầm tối giản hiện đại",
        slug: "dam-toi-gian-hien-dai",
        description: "Đầm tối giản hiện đại phong cách tối giản",
        price: 379000,
        salePrice: null,
        discount: 0,
        categoryId: 2,
        images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80"],
        colors: ["Đen", "Trắng"],
        sizes: ["S", "M", "L"],
        featured: false,
        newArrival: true,
        flashSale: false
      },
      {
        name: "Đầm bohemian dáng suông",
        slug: "dam-bohemian-dang-suong",
        description: "Đầm bohemian dáng suông phong cách tự do",
        price: 429000,
        salePrice: null,
        discount: 0,
        categoryId: 2,
        images: ["https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80"],
        colors: ["Họa tiết"],
        sizes: ["S", "M", "L"],
        featured: false,
        newArrival: true,
        flashSale: false
      },
      {
        name: "Set áo và quần tây",
        slug: "set-ao-va-quan-tay",
        description: "Set áo và quần tây phong cách công sở",
        price: 499000,
        salePrice: null,
        discount: 0,
        categoryId: 3,
        images: ["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80"],
        colors: ["Đen", "Xám", "Xanh navy"],
        sizes: ["S", "M", "L", "XL"],
        featured: false,
        newArrival: true,
        flashSale: false
      },
      {
        name: "Giày thể thao nữ",
        slug: "giay-the-thao-nu",
        description: "Giày thể thao nữ năng động",
        price: 589000,
        salePrice: null,
        discount: 0,
        categoryId: 5,
        images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80"],
        colors: ["Trắng", "Đen", "Hồng"],
        sizes: ["35", "36", "37", "38", "39"],
        featured: false,
        newArrival: true,
        flashSale: false
      }
    ];
    
    products.forEach(product => {
      this.createProduct(product);
    });
    
    // Create collections
    const collections = [
      { name: "Summer Vibes", slug: "summer-vibes", description: "Phong cách mùa hè tươi mát", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80" },
      { name: "Office Elegance", slug: "office-elegance", description: "Sang trọng nơi công sở", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80" },
      { name: "Weekend", slug: "weekend", description: "Thoải mái cho cuối tuần", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80" },
      { name: "Phụ kiện", slug: "phu-kien", description: "Điểm nhấn hoàn hảo", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80" },
      { name: "Trendy", slug: "trendy", description: "Xu hướng mới nhất", image: "https://images.unsplash.com/photo-1533659828870-95ee305cee3e?q=80" }
    ];
    
    collections.forEach(collection => {
      this.createCollection(collection);
    });
    
    // Add products to collections
    this.addProductToCollection(1, 1); // Summer Vibes - Đầm hoa nhẹ nhàng
    this.addProductToCollection(1, 2); // Summer Vibes - Set áo trắng quần jean
    this.addProductToCollection(1, 6); // Summer Vibes - Đầm hè nhẹ nhàng
    
    this.addProductToCollection(2, 7); // Office Elegance - Áo blazer công sở
    this.addProductToCollection(2, 3); // Office Elegance - Đầm dự tiệc đỏ sang trọng
    this.addProductToCollection(2, 12); // Office Elegance - Set áo và quần tây
    
    this.addProductToCollection(3, 4); // Weekend - Áo phông phong cách
    this.addProductToCollection(3, 9); // Weekend - Áo sọc năng động
    
    this.addProductToCollection(4, 5); // Phụ kiện - Mũ cói đi biển
    this.addProductToCollection(4, 8); // Phụ kiện - Túi xách nữ da thật
    this.addProductToCollection(4, 13); // Phụ kiện - Giày thể thao nữ
    
    this.addProductToCollection(5, 10); // Trendy - Đầm tối giản hiện đại
    this.addProductToCollection(5, 11); // Trendy - Đầm bohemian dáng suông
    
    // Create flash sale
    const now = new Date();
    const endDate = new Date(now);
    endDate.setHours(endDate.getHours() + 5);
    
    this.createFlashSale({
      name: "Flash Sale Mùa Hè",
      startDate: now,
      endDate: endDate,
      active: true
    });
    
    // Create coupons
    this.createCoupon({
      code: "WELCOME10",
      discount: 10,
      isPercentage: true,
      startDate: now,
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
      active: true,
      minOrder: 100000,
      maxUses: 100
    });
    
    this.createCoupon({
      code: "FREESHIP",
      discount: 30000,
      isPercentage: false,
      startDate: now,
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
      active: true,
      minOrder: 300000,
      maxUses: 50
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, role: "user", createdAt: new Date() };
    this.usersMap.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categoriesMap.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categoriesMap.set(id, newCategory);
    return newCategory;
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.productsMap.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.productsMap.values()).find(
      (product) => product.slug === slug,
    );
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.productsMap.values()).filter(
      (product) => product.categoryId === categoryId,
    );
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.productsMap.values()).filter(
      (product) => product.featured,
    );
  }
  
  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.productsMap.values()).filter(
      (product) => product.newArrival,
    );
  }
  
  async getFlashSaleProducts(): Promise<Product[]> {
    return Array.from(this.productsMap.values()).filter(
      (product) => product.flashSale,
    );
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const newProduct: Product = { 
      ...product, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.productsMap.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = await this.getProductById(id);
    if (!product) return undefined;
    
    const updatedProduct = { 
      ...product, 
      ...productData,
      updatedAt: new Date()
    };
    this.productsMap.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.productsMap.delete(id);
  }
  
  // Collection operations
  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collectionsMap.values());
  }
  
  async getCollectionBySlug(slug: string): Promise<Collection | undefined> {
    return Array.from(this.collectionsMap.values()).find(
      (collection) => collection.slug === slug,
    );
  }
  
  async getCollectionProducts(collectionId: number): Promise<Product[]> {
    const productIds = Array.from(this.collectionProductsMap.keys())
      .filter(key => key.startsWith(`${collectionId}:`))
      .map(key => parseInt(key.split(':')[1]));
    
    return Promise.all(productIds.map(id => this.getProductById(id)))
      .then(products => products.filter(Boolean) as Product[]);
  }
  
  async createCollection(collection: InsertCollection): Promise<Collection> {
    const id = this.collectionId++;
    const newCollection: Collection = { ...collection, id };
    this.collectionsMap.set(id, newCollection);
    return newCollection;
  }
  
  async addProductToCollection(collectionId: number, productId: number): Promise<boolean> {
    this.collectionProductsMap.set(`${collectionId}:${productId}`, true);
    return true;
  }
  
  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.ordersMap.values());
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.ordersMap.get(id);
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.ordersMap.values()).filter(
      (order) => order.userId === userId,
    );
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const now = new Date();
    const newOrder: Order = { 
      ...order, 
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now
    };
    this.ordersMap.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = await this.getOrderById(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order, 
      status,
      updatedAt: new Date()
    };
    this.ordersMap.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order Item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItemsMap.values()).filter(
      (item) => item.orderId === orderId,
    );
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItemsMap.set(id, newOrderItem);
    return newOrderItem;
  }
  
  // Wishlist operations
  async getUserWishlist(userId: number): Promise<Wishlist[]> {
    return Array.from(this.wishlistsMap.values()).filter(
      (wishlist) => wishlist.userId === userId,
    );
  }
  
  async getUserWishlistProducts(userId: number): Promise<Product[]> {
    const wishlistItems = await this.getUserWishlist(userId);
    const productIds = wishlistItems.map(item => item.productId);
    
    return Promise.all(productIds.map(id => this.getProductById(id)))
      .then(products => products.filter(Boolean) as Product[]);
  }
  
  async addToWishlist(wishlist: InsertWishlist): Promise<Wishlist> {
    // Check if already in wishlist
    const existing = Array.from(this.wishlistsMap.values()).find(
      (item) => item.userId === wishlist.userId && item.productId === wishlist.productId,
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.wishlistId++;
    const newWishlist: Wishlist = { 
      ...wishlist, 
      id,
      createdAt: new Date()
    };
    this.wishlistsMap.set(id, newWishlist);
    return newWishlist;
  }
  
  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const wishlist = Array.from(this.wishlistsMap.values()).find(
      (item) => item.userId === userId && item.productId === productId,
    );
    
    if (!wishlist) return false;
    
    return this.wishlistsMap.delete(wishlist.id);
  }
  
  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    return !!Array.from(this.wishlistsMap.values()).find(
      (item) => item.userId === userId && item.productId === productId,
    );
  }
  
  // Review operations
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviewsMap.values()).filter(
      (review) => review.productId === productId,
    );
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const newReview: Review = { 
      ...review, 
      id,
      createdAt: new Date()
    };
    this.reviewsMap.set(id, newReview);
    return newReview;
  }
  
  // Coupon operations
  async getCoupons(): Promise<Coupon[]> {
    return Array.from(this.couponsMap.values());
  }
  
  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    return Array.from(this.couponsMap.values()).find(
      (coupon) => coupon.code.toLowerCase() === code.toLowerCase(),
    );
  }
  
  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const id = this.couponId++;
    const newCoupon: Coupon = { 
      ...coupon, 
      id,
      usedCount: 0
    };
    this.couponsMap.set(id, newCoupon);
    return newCoupon;
  }
  
  async validateCoupon(code: string, orderTotal: number): Promise<Coupon | undefined> {
    const coupon = await this.getCouponByCode(code);
    if (!coupon) return undefined;
    
    const now = new Date();
    
    if (!coupon.active) return undefined;
    if (now < coupon.startDate || now > coupon.endDate) return undefined;
    if (orderTotal < coupon.minOrder) return undefined;
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return undefined;
    
    return coupon;
  }
  
  async updateCouponUsage(id: number): Promise<Coupon | undefined> {
    const coupon = await this.couponsMap.get(id);
    if (!coupon) return undefined;
    
    const updatedCoupon = { 
      ...coupon, 
      usedCount: coupon.usedCount + 1
    };
    this.couponsMap.set(id, updatedCoupon);
    return updatedCoupon;
  }
  
  // Browsing History operations
  async addToBrowsingHistory(history: InsertBrowsingHistory): Promise<BrowsingHistory> {
    // Remove old entry if exists
    Array.from(this.browsingHistoryMap.values()).forEach(item => {
      if (item.userId === history.userId && item.productId === history.productId) {
        this.browsingHistoryMap.delete(item.id);
      }
    });
    
    const id = this.browsingHistoryId++;
    const newHistory: BrowsingHistory = { 
      ...history, 
      id,
      viewedAt: new Date()
    };
    this.browsingHistoryMap.set(id, newHistory);
    return newHistory;
  }
  
  async getUserBrowsingHistory(userId: number, limit: number = 10): Promise<BrowsingHistory[]> {
    return Array.from(this.browsingHistoryMap.values())
      .filter(item => item.userId === userId)
      .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime())
      .slice(0, limit);
  }
  
  async getRecommendedProducts(userId: number): Promise<Product[]> {
    // Get user history
    const history = await this.getUserBrowsingHistory(userId);
    
    if (history.length === 0) {
      // If no history, return featured products
      return this.getFeaturedProducts();
    }
    
    // Get categories from history
    const productIds = history.map(item => item.productId);
    const products = await Promise.all(productIds.map(id => this.getProductById(id)));
    const categoryIds = products.filter(Boolean).map(product => product!.categoryId);
    
    // Count category occurrences
    const categoryCounts: Record<number, number> = {};
    categoryIds.forEach(id => {
      if (id) {
        categoryCounts[id] = (categoryCounts[id] || 0) + 1;
      }
    });
    
    // Sort categories by count
    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => parseInt(entry[0]));
    
    // Get products from top categories
    let recommendedProducts: Product[] = [];
    
    for (const categoryId of sortedCategories) {
      const categoryProducts = await this.getProductsByCategory(categoryId);
      // Filter out products already in history
      const newProducts = categoryProducts.filter(
        product => !productIds.includes(product.id)
      );
      recommendedProducts = [...recommendedProducts, ...newProducts];
      
      if (recommendedProducts.length >= 10) {
        break;
      }
    }
    
    // If not enough products, add some featured products
    if (recommendedProducts.length < 10) {
      const featuredProducts = await this.getFeaturedProducts();
      const additionalProducts = featuredProducts.filter(
        product => !recommendedProducts.some(p => p.id === product.id) && 
                  !productIds.includes(product.id)
      );
      
      recommendedProducts = [...recommendedProducts, ...additionalProducts].slice(0, 10);
    }
    
    return recommendedProducts;
  }
  
  // Flash Sale operations
  async getActiveFlashSale(): Promise<FlashSale | undefined> {
    const now = new Date();
    return Array.from(this.flashSalesMap.values()).find(
      (sale) => sale.active && now >= sale.startDate && now <= sale.endDate,
    );
  }
  
  async createFlashSale(flashSale: InsertFlashSale): Promise<FlashSale> {
    const id = this.flashSaleId++;
    const newFlashSale: FlashSale = { ...flashSale, id };
    this.flashSalesMap.set(id, newFlashSale);
    return newFlashSale;
  }
}

export const storage = new MemStorage();
