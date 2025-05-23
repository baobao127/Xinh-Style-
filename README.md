# XinhStyle - Web Bán Hàng Thời Trang (Mobile-first, hoàn chỉnh)

## Công nghệ sử dụng

- React + TypeScript
- TailwindCSS
- LocalStorage (no backend)
- Mobile-first, responsive
- Sản phẩm, giỏ hàng, đơn hàng, wishlist, mã giảm giá, minigame, quản trị, flash sale, đề xuất, popup, toast, xác nhận, lịch sử đơn hàng...

## Chạy thử local

```bash
npm install
npm run dev
```

## Cấu trúc thư mục

```plaintext
src/
├── components/
│   ├── common/
│   │   ├── ConfirmModal.tsx
│   │   └── Toast.tsx
│   ├── DiscountCodeModal.tsx
│   ├── FlashSaleBanner.tsx
│   ├── ProductCard.tsx
│   ├── ProductSuggestions.tsx
│   ├── QuickViewModal.tsx
│   ├── SecretCodeInput.tsx
│   ├── SkeletonProduct.tsx
│   ├── SpinToWin.tsx
│   ├── UnlockAdmin.tsx
├── context/
│   ├── CartContext.tsx
│   ├── CompareContext.tsx
│   ├── WishlistContext.tsx
├── hooks/
│   ├── useCountdown.ts
│   ├── useErrorBoundary.ts
│   ├── useLocalStorage.ts
│   ├── useToast.ts
├── lib/
│   ├── errorUtils.ts
│   ├── fakeApi.ts
│   ├── OrderUtils.ts
├── pages/
│   ├── Admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── DiscountManager.tsx
│   │   ├── OrderList.tsx
│   │   └── ProductManager.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Compare.tsx
│   ├── Home.tsx
│   ├── OrderHistory.tsx
│   ├── ProductDetail.tsx
│   ├── ProductsView.tsx
├── routes/
│   └── AppRoutes.tsx
├── utils/
│   └── discountLogic.ts
├── App.tsx
├── index.css
├── main.tsx
```