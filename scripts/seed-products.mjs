import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-03-01' })

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-')     // Replace multiple - with single -
}

const CATEGORIES = [
    { title: 'Digital Signage', description: 'Impactful visual communication for public spaces.' },
    { title: 'AV Solutions', description: 'State-of-the-art audio-visual setups for boardrooms and theaters.' },
    { title: 'Consumer Electronics', description: 'Premium appliances and electronics for everyday excellence.' },
    { title: 'Corporate Gifting', description: 'Curated electronics to strengthen business bonds.' }
]

const PRODUCTS = [
    // Digital Signage
    {
        name: '4K Ultra-Thin Professional Display',
        category: 'Digital Signage',
        description: 'Premium slim-bezel display designed for 24/7 operation in high-traffic environments.',
        brandNames: ['Samsung', 'LG', 'Sony']
    },
    {
        name: 'Interactive Multi-Touch Video Wall',
        category: 'Digital Signage',
        description: 'Seamless touch-enabled video walls for collaborative corporate lobbies.',
        brandNames: ['Samsung', 'Panasonic']
    },
    // AV Solutions
    {
        name: 'Wireless Presentation System',
        category: 'AV Solutions',
        description: 'One-click screen sharing for modern conference rooms.',
        brandNames: ['Sony', 'HP', 'Dell']
    },
    {
        name: 'Professional Line Array Speaker System',
        category: 'AV Solutions',
        description: 'Exceptional audio clarity for auditoriums and large halls.',
        brandNames: ['Sony', 'Panasonic']
    },
    // Consumer Electronics
    {
        name: '8K OLED Smart TV',
        category: 'Consumer Electronics',
        description: 'Experience true colors and deepest blacks in stunning 8K resolution.',
        brandNames: ['Samsung', 'Sony', 'LG']
    },
    {
        name: 'Smart Dual-Inverter Air Conditioner',
        category: 'Consumer Electronics',
        description: 'Energy-efficient cooling with AI-driven voice controls.',
        brandNames: ['Voltas', 'Daikin', 'Hitachi', 'LG']
    },
    {
        name: 'Premium Cloud-Connected Side-by-Side Refrigerator',
        category: 'Consumer Electronics',
        description: 'Intelligent food management and advanced cooling technology.',
        brandNames: ['Samsung', 'Whirlpool', 'Haier', 'Godrej']
    }
]

async function seed() {
    console.log('🚀 Starting Product & Category seeding...')

    try {
        // 1. Fetch Brands for reference mapping
        const brands = await client.fetch(`*[_type == "brand"]{_id, name}`)
        const brandMap = brands.reduce((acc, b) => ({ ...acc, [b.name]: b._id }), {})
        console.log(`✅ Loaded ${brands.length} brands from Sanity.`)

        // 2. Seed Categories
        const categoryMap = {}
        for (const cat of CATEGORIES) {
            console.log(`📦 Creating Category: ${cat.title}...`)
            const slug = slugify(cat.title, { lower: true })

            // Upload placeholder category image
            const imgRes = await fetch(`https://placehold.co/800x600/1e293b/FFFFFF/png?text=${cat.title}`)
            const buffer = await imgRes.arrayBuffer()
            const asset = await client.assets.upload('image', Buffer.from(buffer), { filename: `${slug}.png` })

            const savedCat = await client.create({
                _type: 'category',
                title: cat.title,
                slug: { _type: 'slug', current: slug },
                description: cat.description,
                image: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id }
                },
                order: CATEGORIES.indexOf(cat)
            })
            categoryMap[cat.title] = savedCat._id
            console.log(`✅ Seeded Category: ${cat.title}`)
        }

        // 3. Seed Products
        for (const prod of PRODUCTS) {
            console.log(`📦 Creating Product: ${prod.name}...`)

            // Map brand names to IDs
            const brandRefs = prod.brandNames
                .map(name => brandMap[name])
                .filter(id => !!id)
                .map(id => ({ _type: 'reference', _ref: id, _key: Math.random().toString(36).substr(2, 9) }))

            // Upload placeholder product image
            const prodSlug = prod.name.toLowerCase().replace(/ /g, '-')
            const imgRes = await fetch(`https://placehold.co/800x600/3b82f6/FFFFFF/png?text=${prod.name}`)
            const buffer = await imgRes.arrayBuffer()
            const asset = await client.assets.upload('image', Buffer.from(buffer), { filename: `${prodSlug}.png` })

            await client.create({
                _type: 'product',
                name: prod.name,
                category: {
                    _type: 'reference',
                    _ref: categoryMap[prod.category]
                },
                description: prod.description,
                image: {
                    _type: 'image',
                    asset: { _type: 'reference', _ref: asset._id }
                },
                brands: brandRefs,
                order: PRODUCTS.indexOf(prod)
            })
            console.log(`✅ Seeded Product: ${prod.name}`)
        }

        console.log('🏁 Seeding complete! Your store is now live with demo data.')
    } catch (error) {
        console.error('❌ Error during seeding:', error.message)
    }
}

seed()
