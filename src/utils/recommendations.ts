import { Book, Order } from "../types";

/**
 * Builds a "Recommended for You" list derived from order history.
 *
 * Algorithm:
 *  1. Collect all genres from books the user has ordered.
 *  2. Score every un-ordered book by how many of its genres overlap.
 *  3. Return up to `limit` books, highest-score first.
 *     Ties are broken by price (ascending) so cheaper reads surface first.
 */
export function getOrderRecommendations(
  allBooks: Book[],
  orders: Order[],
  limit = 5
): Book[] {
  if (orders.length === 0) return [];

  // IDs of books already purchased
  const orderedIds = new Set(
    orders.flatMap((o) => o.items.map((i) => i.book.id))
  );

  // Weighted genre frequency — more recent orders count more
  const genreWeight: Record<string, number> = {};
  orders.forEach((order, idx) => {
    // newer orders (lower idx after prepend) get a higher weight multiplier
    const recency = orders.length - idx;
    order.items.forEach(({ book, quantity }) => {
      book.genres.forEach((g) => {
        genreWeight[g] = (genreWeight[g] ?? 0) + recency * quantity;
      });
    });
  });

  // Score candidate books
  const candidates = allBooks
    .filter((b) => !orderedIds.has(b.id))
    .map((b) => ({
      book: b,
      score: b.genres.reduce((s, g) => s + (genreWeight[g] ?? 0), 0),
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || a.book.price - b.book.price);

  return candidates.slice(0, limit).map((c) => c.book);
}
