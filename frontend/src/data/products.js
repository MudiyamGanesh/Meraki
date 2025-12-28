const createProduct = (id) => ({
  id,
  name: "Oversized Graphic Tee",
  category: "Men",
  price: 999,
  image: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_4788883.jpg?w=480&dpr=2",
  image2: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_3493128.jpg?w=480&dpr=2",
  image3: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_6004455.jpg?w=480&dpr=2",
  image4: "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1711950406_1673107.jpg?w=480&dpr=2",
  variants: [
    { id: 'v1', color: 'Black', thumb: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_4788883.jpg?w=480&dpr=2', mainImg: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_3493128.jpg?w=480&dpr=2' },
    { id: 'v2', color: 'White', thumb: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_4788883.jpg?w=480&dpr=2', mainImg: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_3493128.jpg?w=480&dpr=2' },
    { id: 'v3', color: 'Beige', thumb: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_4788883.jpg?w=480&dpr=2', mainImg: 'https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1692793157_3493128.jpg?w=480&dpr=2' }
  ],
  subtitle: "Premium Oversized Collection",
  description: "Crafted from 240 GSM heavy-duty cotton..."
});

export const sampleProducts = Array.from({ length: 100 }, (_, i) => createProduct(i + 1));
