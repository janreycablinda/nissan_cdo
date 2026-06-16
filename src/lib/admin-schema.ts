export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'image';

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type EntityConfig = {
  key: string;
  label: string;
  table: string;
  fields: Field[];
};

export const ENTITIES: Record<string, EntityConfig> = {
  slides: {
    key: 'slides',
    label: 'Hero Slides',
    table: 'slides',
    fields: [
      { name: 'kicker', label: 'Kicker', type: 'text', placeholder: 'The All-New Nissan Patrol' },
      { name: 'title_line1', label: 'Title Line 1', type: 'text', required: true, placeholder: 'Dare to Be' },
      { name: 'title_line2', label: 'Title Line 2', type: 'text', placeholder: 'Exceptional' },
      { name: 'image_url', label: 'Background Image URL', type: 'image', required: true, placeholder: 'https://… or /images/…' },
      { name: 'cta_label', label: 'Button Label', type: 'text', placeholder: 'Discover More' },
      { name: 'cta_href', label: 'Button Link', type: 'text', placeholder: '#vehicles' },
      { name: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
  },
  vehicles: {
    key: 'vehicles',
    label: 'Vehicles',
    table: 'vehicles',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Patrol' },
      { name: 'category', label: 'Category', type: 'select', required: true, options: ['Cars', 'Vans & Trucks', 'SUVs'] },
      { name: 'tagline', label: 'Tagline', type: 'text', required: true },
      { name: 'price_from', label: 'Price From (₱)', type: 'number', required: true },
      { name: 'image_url', label: 'Image URL', type: 'image', required: true, placeholder: '/images/vehicles/…' },
      { name: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
  },
  offers: {
    key: 'offers',
    label: 'Special Offers',
    table: 'offers',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'caption', label: 'Caption', type: 'textarea', required: true },
      { name: 'image_url', label: 'Image URL', type: 'image', required: true },
    ],
  },
};

export const ENTITY_KEYS = Object.keys(ENTITIES);
