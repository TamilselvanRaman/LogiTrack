// src/components/common/PageWrapper.jsx
import React, { useState, useEffect } from "react";
import LoadingTruck from "./LoadingSpinner";

export default function PageWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); 
    return () => clearTimeout(timer);
  }, []);

  return loading ? <LoadingTruck /> : children;
}
