// useCategories.js or useCategories.ts
import { useState, useEffect } from 'react';
import { fetchCategoriesApi } from '../api/category.api.js'; // Adjust the import path as necessary

let cachedCategories = null;

export const useCategories = () => {
  const [categories, setCategories] = useState(cachedCategories);
  const [loading, setLoading] = useState(!cachedCategories);

  useEffect(() => {
    // If not already cached, fetch and cache
    if (!cachedCategories) {
      setLoading(true);
      fetchCategoriesApi()
        .then((data) => {
          cachedCategories = data; // Cache the fetched categories
          setCategories(data);
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [categories]);

  return { categories, loading, setCategories };
};
