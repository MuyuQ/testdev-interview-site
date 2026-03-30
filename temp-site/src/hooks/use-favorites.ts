"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";

export type FavoriteItem = {
  slug: string;
  title: string;
  category: string;
  summary: string;
};

const STORAGE_KEY = "testdev:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() =>
    readStorage<FavoriteItem[]>(STORAGE_KEY, []),
  );

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((current) => {
      const exists = current.some(
        (favorite) =>
          favorite.slug === item.slug && favorite.category === item.category,
      );
      const next = exists
        ? current.filter(
            (favorite) =>
              !(
                favorite.slug === item.slug &&
                favorite.category === item.category
              ),
          )
        : [item, ...current].slice(0, 20);

      writeStorage(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite: (slug: string, category: string) =>
      favorites.some(
        (favorite) => favorite.slug === slug && favorite.category === category,
      ),
  };
}
