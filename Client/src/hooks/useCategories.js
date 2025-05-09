// useCategories.js or useCategories.ts
import { useState, useEffect } from 'react';
import { fetchCategoriesApi } from '../api/category.api.js';
import { useTranslation } from 'react-i18next';

let cachedCategories = null;

export const useCategories = () => {
  const [categories, setCategories] = useState(cachedCategories);
  const [loading, setLoading] = useState(!cachedCategories);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    // If not already cached, fetch and cache
    setLoading(true);
    fetchCategoriesApi(currentLanguage)
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        setCategories(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { categories, loading, setCategories };
};
