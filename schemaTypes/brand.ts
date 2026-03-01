import { defineField, defineType } from 'sanity'

export const brand = defineType({
    name: 'brand',
    title: 'Brand',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Brand Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'website',
            title: 'Website',
            type: 'url',
        }),
    ],
})
