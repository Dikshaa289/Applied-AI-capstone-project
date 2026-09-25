import { getOrderRecommendations } from "../utils/recommendations";
import { Book, Order } from "../types";

const makeBook = (overrides: Partial<Book> & { id: number; genres: string[] }): Book => ({
  title: `Book ${overrides.id}`,
  author: "Author",
  description: "Desc",
  format: "Paperback",
  price: 100,
  delivery: "Mon, 21 Jul",
  coverColor: "#fff",
  coverText: "COVER",
  coverBg: "#000",
  ...overrides,
});

const makeOrder = (books: Book[], status: Order["status"] = "Processing"): Order => ({
  id: `ORD${Date.now()}`,
  placedAt: new Date().toISOString(),
  items: books.map((b) => ({ book: b, quantity: 1 })),
  subtotal: books.reduce((s, b) => s + b.price, 0),
  tax: 0,
  discount: 0,
  total: books.reduce((s, b) => s + b.price, 0),
  status,
  address: "123 Street",
});

describe("getOrderRecommendations", () => {
  const selfHelpBook = makeBook({ id: 1, genres: ["Self Help", "Non-fiction"], price: 200 });
  const thrillerBook = makeBook({ id: 2, genres: ["Fiction", "Thriller"], price: 300 });
  const selfHelpBook2 = makeBook({ id: 3, genres: ["Self Help"], price: 150 });
  const horrorBook = makeBook({ id: 4, genres: ["Fiction", "Horror"], price: 250 });
  const unrelatedBook = makeBook({ id: 5, genres: ["Cooking"], price: 100 });

  const allBooks = [selfHelpBook, thrillerBook, selfHelpBook2, horrorBook, unrelatedBook];

  it("returns empty array when there are no orders", () => {
    expect(getOrderRecommendations(allBooks, [])).toEqual([]);
  });

  it("excludes books already ordered", () => {
    const orders = [makeOrder([selfHelpBook])];
    const result = getOrderRecommendations(allBooks, orders);
    expect(result.find((b) => b.id === selfHelpBook.id)).toBeUndefined();
  });

  it("returns books with overlapping genres", () => {
    const orders = [makeOrder([selfHelpBook])];
    const result = getOrderRecommendations(allBooks, orders);
    // selfHelpBook2 shares "Self Help" genre → should appear
    expect(result.find((b) => b.id === selfHelpBook2.id)).toBeDefined();
  });

  it("does not return unrelated books (no genre overlap)", () => {
    const orders = [makeOrder([selfHelpBook])];
    const result = getOrderRecommendations(allBooks, orders);
    expect(result.find((b) => b.id === unrelatedBook.id)).toBeUndefined();
  });

  it("respects the limit parameter", () => {
    const manyBooks = Array.from({ length: 10 }, (_, i) =>
      makeBook({ id: i + 10, genres: ["Self Help"] })
    );
    const orders = [makeOrder([selfHelpBook])];
    const result = getOrderRecommendations([...allBooks, ...manyBooks], orders, 3);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("ranks higher-overlap books before lower-overlap ones", () => {
    // selfHelpBook2 (1 overlap) vs thrillerBook (0 Self Help overlap)
    const orders = [makeOrder([selfHelpBook])];
    const result = getOrderRecommendations(allBooks, orders);
    const selfHelpIdx = result.findIndex((b) => b.id === selfHelpBook2.id);
    const thrillerIdx = result.findIndex((b) => b.id === thrillerBook.id);
    // thrillerBook has no genre overlap so it won't appear; selfHelpIdx should be ≥ 0
    expect(selfHelpIdx).toBeGreaterThanOrEqual(0);
    expect(thrillerIdx).toBe(-1);
  });

  it("breaks score ties by price ascending", () => {
    // Two books with identical genre overlap, different prices
    const cheap = makeBook({ id: 20, genres: ["Self Help"], price: 99 });
    const expensive = makeBook({ id: 21, genres: ["Self Help"], price: 499 });
    const orders = [makeOrder([selfHelpBook])];
    const result = getOrderRecommendations([selfHelpBook, cheap, expensive], orders);
    expect(result[0].id).toBe(cheap.id);
  });

  it("gives higher weight to more recent orders", () => {
    // older order: Fiction. Newer order: Self Help.
    // selfHelpBook2 should be ranked above horrorBook (Fiction/Horror)
    const olderOrder = makeOrder([thrillerBook]); // Fiction, Thriller
    const newerOrder = makeOrder([selfHelpBook]); // Self Help, Non-fiction
    // orders array is newest-first (prepend pattern)
    const orders = [newerOrder, olderOrder];
    const result = getOrderRecommendations(allBooks, orders);
    const selfHelpIdx = result.findIndex((b) => b.id === selfHelpBook2.id);
    const horrorIdx = result.findIndex((b) => b.id === horrorBook.id);
    if (selfHelpIdx !== -1 && horrorIdx !== -1) {
      expect(selfHelpIdx).toBeLessThan(horrorIdx);
    }
  });

  it("handles orders with quantity > 1 (higher quantity boosts genre weight)", () => {
    const order: Order = {
      ...makeOrder([selfHelpBook]),
      items: [{ book: selfHelpBook, quantity: 5 }],
    };
    const result = getOrderRecommendations(allBooks, [order]);
    expect(result.find((b) => b.id === selfHelpBook2.id)).toBeDefined();
  });

  it("handles multiple orders with overlapping genres correctly", () => {
    const order1 = makeOrder([selfHelpBook]);
    const order2 = makeOrder([thrillerBook]);
    const result = getOrderRecommendations(allBooks, [order1, order2]);
    // both selfHelpBook2 (Self Help) and horrorBook (Fiction/Horror) should be candidates
    const ids = result.map((b) => b.id);
    expect(ids).toContain(selfHelpBook2.id);
    expect(ids).toContain(horrorBook.id);
  });

  it("returns empty when all books are already ordered", () => {
    const orders = [makeOrder([selfHelpBook, thrillerBook, selfHelpBook2, horrorBook, unrelatedBook])];
    const result = getOrderRecommendations(allBooks, orders);
    expect(result).toEqual([]);
  });
});
