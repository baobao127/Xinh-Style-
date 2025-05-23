import React, { createContext, useContext, useState } from "react";
import { Product } from "../components/ProductCard";

const CompareContext = createContext<any>(null);

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [compare, setCompare] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    if (compare.find((p) => p.id === product.id) || compare.length >= 3) return;
    setCompare((prev: Product[]) => [...prev, product]);
  };
  const removeFromCompare = (id: string | number) => {
    setCompare((prev: Product[]) => prev.filter((p) => p.id !== id));
  };
  const clearCompare = () => setCompare([]);

  return (
    <CompareContext.Provider value={{ compare, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);