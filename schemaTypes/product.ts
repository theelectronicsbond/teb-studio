import { defineField, defineType } from 'sanity'

export const product = defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Product Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'image',
            title: 'Product Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'brands',
            title: 'Available Brands',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'brand' }] }],
            description: 'Select brands available for this product type.',
        }),
        defineField({
            name: 'order',
            title: 'Display Order',
            type: 'number',
        }),
    ],
})
