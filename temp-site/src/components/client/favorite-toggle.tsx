"use client";

import type { FavoriteItem } from "@/hooks/use-favorites";
import { useFavorites } from "@/hooks/use-favorites";

type FavoriteToggleProps = {
  item: FavoriteItem;
};

export function FavoriteToggle({ item }: FavoriteToggleProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item.slug, item.category);

  return (
    <button type="button" className="ghost-button" onClick={() => toggleFavorite(item)}>
      {favorite ? "已收藏" : "加入收藏"}
    </button>
  );
}

