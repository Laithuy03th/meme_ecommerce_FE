import { ProductType } from "@/types";

export const categories = [
    { id: '1', name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&q=80&w=500' },
    { id: '2', name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=500' },
    { id: '3', name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=500' },
    { id: '4', name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80&w=500' },
];

const baseProducts: ProductType[] = [
    {
        id: '1',
        name: 'Wireless Noise-Canceling Headphones',
        slug: 'wireless-headphones',
        price: 299.99,
        originalPrice: 349.99,
        rating: 4.8,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
        ],
        variantImages: {
            'Black': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
            'Silver': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800',
            'Blue': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
        },
        category: 'Electronics',
        isNew: true,
        isSale: true,
        description: 'Experience premium sound quality with our latest noise-canceling technology. Perfect for travel and work.',
        variants: [
            { name: 'Color', options: ['Black', 'Silver', 'Blue'] }
        ],
        colors: ['Black', 'Silver', 'Blue'],
        sizes: []
    },
    {
        id: '2',
        name: 'Smart Fitness Watch',
        slug: 'smart-fitness-watch',
        price: 199.50,
        rating: 4.5,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
        ],
        variantImages: {
            'Black': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
            'White': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
            'Pink': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
        },
        category: 'Electronics',
        isNew: false,
        isSale: false,
        description: 'Track your fitness goals with precision. Features heart rate monitoring, GPS, and sleep tracking.',
        variants: [
            { name: 'Band Color', options: ['Black', 'White', 'Pink'] }
        ],
        colors: ['Black', 'White', 'Pink'],
        sizes: []
    },
    {
        id: '3',
        name: 'Premium Cotton T-Shirt',
        slug: 'premium-cotton-tshirt',
        price: 29.99,
        originalPrice: 39.99,
        rating: 4.2,
        reviews: 45,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
        variantImages: {
            'White': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
            'Black': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
            'Navy': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'
        },
        category: 'Fashion',
        isNew: true,
        isSale: true,
        description: 'Soft, breathable, and durable. The perfect everyday t-shirt made from 100% organic cotton.',
        variants: [
            { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
            { name: 'Color', options: ['White', 'Black', 'Navy'] }
        ],
        colors: ['White', 'Black', 'Navy'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '4',
        name: 'Minimalist Desk Lamp',
        slug: 'minimalist-desk-lamp',
        price: 89.00,
        rating: 4.9,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1507473888900-52e1adad5420?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1507473888900-52e1adad5420?auto=format&fit=crop&q=80&w=800'],
        category: 'Home & Living',
        isNew: false,
        isSale: false,
        description: 'Illuminate your workspace with style. Adjustable brightness and color temperature.',
        variants: [],
        colors: [],
        sizes: []
    },
    {
        id: '5',
        name: 'Hydrating Face Serum',
        slug: 'hydrating-face-serum',
        price: 45.00,
        rating: 4.7,
        reviews: 156,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'],
        category: 'Beauty',
        isNew: true,
        isSale: false,
        description: 'Deeply hydrate and rejuvenate your skin with our advanced formula.',
        variants: [
            { name: 'Size', options: ['30ml', '50ml'] }
        ],
        colors: [],
        sizes: ['30ml', '50ml']
    },
    {
        id: '6',
        name: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        price: 350.00,
        originalPrice: 450.00,
        rating: 4.6,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800'],
        variantImages: {
            'Black': 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
            'Grey': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800'
        },
        category: 'Home & Living',
        isNew: false,
        isSale: true,
        description: 'Work in comfort all day long with lumbar support and adjustable height.',
        variants: [
            { name: 'Color', options: ['Black', 'Grey'] }
        ],
        colors: ['Black', 'Grey'],
        sizes: []
    }
];

// Generate more products
const generatedProducts: ProductType[] = [];
const adjectives = ['Premium', 'Luxury', 'Essential', 'Modern', 'Classic', 'Ultra', 'Pro', 'Max'];
const categories_list = ['Electronics', 'Fashion', 'Home & Living', 'Beauty'];

for (let i = 7; i <= 60; i++) {
    const baseProduct = baseProducts[Math.floor(Math.random() * baseProducts.length)];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomCategory = categories_list[Math.floor(Math.random() * categories_list.length)];

    generatedProducts.push({
        ...baseProduct,
        id: i.toString(),
        name: `${randomAdjective} ${baseProduct.name} ${i}`,
        slug: `${baseProduct.slug}-${i}`,
        price: Number((Math.random() * 200 + 20).toFixed(2)),
        rating: Number((Math.random() * 2 + 3).toFixed(1)),
        reviews: Math.floor(Math.random() * 500),
        isNew: Math.random() > 0.8,
        isSale: Math.random() > 0.7,
        category: randomCategory // Distribute across categories
    });
}

export const products: ProductType[] = [...baseProducts, ...generatedProducts];

export const reviews = [
    { id: 1, user: 'Alice M.', rating: 5, comment: 'Absolutely love this product! Highly recommended.', date: '2023-10-15' },
    { id: 2, user: 'John D.', rating: 4, comment: 'Great quality, but shipping took a bit longer than expected.', date: '2023-10-12' },
];
