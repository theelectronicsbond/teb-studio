import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-03-01' })

const BRANDS = [
    { name: 'Samsung', color: '034EA2' },
    { name: 'Apple', color: '555555' },
    { name: 'LG', color: 'A50034' },
    { name: 'Sony', color: '000000' },
    { name: 'Panasonic', color: '004098' },
    { name: 'HP', color: '0096D6' },
    { name: 'Dell', color: '007DB8' },
    { name: 'Lenovo', color: 'E2231A' },
    { name: 'Xiaomi', color: 'FF6700' },
    { name: 'OPPO', color: '00925F' },
    { name: 'Vivo', color: '1A73E8' },
    { name: 'Realme', color: 'FFC915' },
    { name: 'OnePlus', color: 'F5001C' },
    { name: 'Whirlpool', color: 'FFBC00' },
    { name: 'Haier', color: '005AAA' },
    { name: 'Voltas', color: '0075BE' },
    { name: 'Daikin', color: '0091D5' },
    { name: 'Hitachi', color: 'DE192D' },
    { name: 'Godrej', color: 'ED1C24' },
    { name: 'Bluestar', color: '004F9A' }
]

async function seed() {
    console.log('🚀 Starting brand seeding...')

    for (const brand of BRANDS) {
        try {
            console.log(`📦 Processing brand: ${brand.name}...`)

            // 1. Fetch placeholder logo
            const imageUrl = `https://placehold.co/400x400/${brand.color}/FFFFFF/png?text=${brand.name}`
            const response = await fetch(imageUrl)
            if (!response.ok) throw new Error(`Failed to fetch image for ${brand.name}`)

            const buffer = await response.arrayBuffer()

            // 2. Upload image asset to Sanity
            const asset = await client.assets.upload('image', Buffer.from(buffer), {
                filename: `${brand.name.toLowerCase()}-logo.png`
            })

            // 3. Create brand document
            await client.create({
                _type: 'brand',
                name: brand.name,
                logo: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: asset._id
                    }
                }
            })

            console.log(`✅ Seeded brand: ${brand.name}`)
        } catch (error) {
            console.error(`❌ Error seeding ${brand.name}:`, error.message)
        }
    }

    console.log('🏁 Seeding complete!')
}

seed()
