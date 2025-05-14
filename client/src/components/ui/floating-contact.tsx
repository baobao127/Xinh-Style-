import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function FloatingContact() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 right-4 flex flex-col items-center space-y-2"
    >
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-primary text-white rounded-full"
      >
        {isCollapsed ? "Open" : "Close"}
      </Button>
      {!isCollapsed && (
        <motion.div className="bg-white p-4 rounded-lg shadow-lg">
          <a href="tel:0123456789" className="block text-primary">
            Call Us
          </a>
          <a href="https://zalo.me/0123456789" className="block text-secondary">
            Zalo
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}