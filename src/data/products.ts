export interface ProductSpec {
  modelCode: string;
  dimensions: string;
  capacity: string;
  material: string;
  packSize: number; // pcs per carton
  cartonWeightKg: number;
  leadTime: string;
  tempRange: string;
  microwaveSafe: boolean;
  oilWaterResistant: boolean;
  compostTime: string;
  certifications: string[];
}

export interface PriceTier {
  minCartons: number;
  pricePerUnit: number;
}

export interface Product {
  id: string;
  modelCode: string;
  name: string;
  category: 'Clamshells' | 'Burger' | 'Bio Boxes' | 'Compartment' | 'Custom';
  type: string;
  badge: string;
  image: string;
  shortDesc: string;
  basePrice: number; // £ per unit
  priceTiers: PriceTier[];
  specs: ProductSpec;
  isBestSeller?: boolean;
  inStock: boolean;
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'da68-5x5-burger-box',
    modelCode: 'DA68',
    name: '5 x 5" Sugarcane Burger Box',
    category: 'Burger',
    type: 'Single Burger Box',
    badge: 'Fast Moving',
    image: '/images/burger_box_5x5.png',
    shortDesc: 'Compact 5x5 inch vented bagasse burger clamshell designed for sliders, single burgers, and breakfast sandwiches.',
    basePrice: 0.28,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.28 },
      { minCartons: 5, pricePerUnit: 0.24 },
      { minCartons: 20, pricePerUnit: 0.20 }
    ],
    inStock: true,
    isBestSeller: true,
    specs: {
      modelCode: 'DA68',
      dimensions: '245 x 121 x 70 mm',
      capacity: 'Single Burger / Slider',
      material: '100% Sugarcane Bagasse Pulp',
      packSize: 500,
      cartonWeightKg: 7.5,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 60-90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'OK Compost EN13432', 'FDA Food Safe', 'PFAS-Free']
    }
  },
  {
    id: 'da32-6x6-burger-box',
    modelCode: 'DA32',
    name: '6 x 6" Gourmet Burger Box',
    category: 'Burger',
    type: 'Gourmet Burger Box',
    badge: 'Bestseller',
    image: '/images/burger_box_5x5.png',
    shortDesc: 'Deep 6x6 inch heavy-duty hinged box for double burgers, loaded fries, and bakery items.',
    basePrice: 0.32,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.32 },
      { minCartons: 5, pricePerUnit: 0.28 },
      { minCartons: 20, pricePerUnit: 0.23 }
    ],
    inStock: true,
    isBestSeller: true,
    specs: {
      modelCode: 'DA32',
      dimensions: '311 x 152 x 75 mm',
      capacity: 'Double Burger / Loaded Fries',
      material: 'Unbleached Sugarcane Pulp',
      packSize: 500,
      cartonWeightKg: 8.8,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 60-90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'OK Compost HOME', 'FDA Food Grade']
    }
  },
  {
    id: 'da30-7x5-clamshell',
    modelCode: 'DA30',
    name: '7 x 5" Medium Takeaway Clamshell',
    category: 'Clamshells',
    type: 'Medium Clamshell Box',
    badge: 'Hot Seller',
    image: '/images/clamshell_7x5.png',
    shortDesc: 'Versatile 7x5 inch clamshell container for kebabs, fish & chips, wraps, and takeaway meals.',
    basePrice: 0.36,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.36 },
      { minCartons: 5, pricePerUnit: 0.31 },
      { minCartons: 20, pricePerUnit: 0.26 }
    ],
    inStock: true,
    isBestSeller: true,
    specs: {
      modelCode: 'DA30',
      dimensions: '272 x 182 x 65 mm',
      capacity: '600 ml / 20 oz',
      material: '100% Plant Fiber Bagasse',
      packSize: 500,
      cartonWeightKg: 9.4,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 60-90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'OK Compost EN13432', 'EU Food Safe']
    }
  },
  {
    id: 'da33-9x6-clamshell',
    modelCode: 'DA33',
    name: '9 x 6" Large Takeaway Clamshell',
    category: 'Clamshells',
    type: 'Single Compartment Clamshell',
    badge: 'Popular',
    image: '/images/clamshell_7x5.png',
    shortDesc: 'Spacious 9x6 inch rectangular hinged meal box ideal for main entrees, mixed grills, and pasta.',
    basePrice: 0.42,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.42 },
      { minCartons: 5, pricePerUnit: 0.37 },
      { minCartons: 20, pricePerUnit: 0.31 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA33',
      dimensions: '310 x 228 x 46.5 mm',
      capacity: '850 ml / 28 oz',
      material: 'High-Density Bagasse Pulp',
      packSize: 200,
      cartonWeightKg: 7.2,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 60-90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'FDA Food Contact']
    }
  },
  {
    id: 'da31-9x6-2comp-clamshell',
    modelCode: 'DA31',
    name: '9 x 6" 2-Compartment Clamshell',
    category: 'Compartment',
    type: 'Dual Compartment',
    badge: 'Chef Choice',
    image: '/images/2comp_clamshell.png',
    shortDesc: 'Divided 9x6 clamshell box keeping main dishes separate from rice, salad, or sauce.',
    basePrice: 0.45,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.45 },
      { minCartons: 5, pricePerUnit: 0.39 },
      { minCartons: 20, pricePerUnit: 0.33 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA31',
      dimensions: '320 x 234 x 47 mm',
      capacity: '900 ml (600ml + 300ml)',
      material: 'Heavy-Duty Bagasse Fiber',
      packSize: 200,
      cartonWeightKg: 7.6,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 60-90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'OK Compost HOME', 'PFAS-Free']
    }
  },
  {
    id: 'da29-8x8-square-clamshell',
    modelCode: 'DA29',
    name: '8 x 8" Square Clamshell Box',
    category: 'Clamshells',
    type: 'Square Clamshell',
    badge: 'Dinner Box',
    image: '/images/single_comp_8x8.png',
    shortDesc: 'Large 8x8 inch square clamshell for full roast dinners, burritos, stir-fry, and sharing portions.',
    basePrice: 0.48,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.48 },
      { minCartons: 5, pricePerUnit: 0.42 },
      { minCartons: 20, pricePerUnit: 0.35 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA29',
      dimensions: '437 x 200 x 40 mm',
      capacity: '1000 ml / 34 oz',
      material: '100% Renewable Bagasse Pulp',
      packSize: 200,
      cartonWeightKg: 8.2,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'OK Compost EN13432']
    }
  },
  {
    id: 'da47-8x8-3comp-clamshell',
    modelCode: 'DA47',
    name: '8 x 8" 3-Compartment Clamshell',
    category: 'Compartment',
    type: '3-Compartment Box',
    badge: 'Meal Combo',
    image: '/images/clamshell_9x9.png',
    shortDesc: '3-section 8x8 meal container designed for complete dinner meals, sides, and dips.',
    basePrice: 0.50,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.50 },
      { minCartons: 5, pricePerUnit: 0.44 },
      { minCartons: 20, pricePerUnit: 0.37 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA47',
      dimensions: '437 x 200 x 45 mm',
      capacity: '1000 ml Total',
      material: 'Sugarcane Pulp Fiber',
      packSize: 200,
      cartonWeightKg: 8.5,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'FDA Food Contact Safe']
    }
  },
  {
    id: 'da34-9x9-large-clamshell',
    modelCode: 'DA34',
    name: '9 x 9" Extra Large Clamshell',
    category: 'Clamshells',
    type: 'XL Square Clamshell',
    badge: 'XL Size',
    image: '/images/clamshell_9x9.png',
    shortDesc: 'Deep 9x9 inch sugarcane clamshell built for large pizza slices, rack of ribs, and combo platters.',
    basePrice: 0.54,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.54 },
      { minCartons: 5, pricePerUnit: 0.47 },
      { minCartons: 20, pricePerUnit: 0.40 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA34',
      dimensions: '464 x 230 x 47.5 mm',
      capacity: '1200 ml / 40 oz',
      material: '100% Bagasse Fiber',
      packSize: 200,
      cartonWeightKg: 9.6,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'OK Compost EN13432']
    }
  },
  {
    id: 'da17-9x9-3comp-clamshell',
    modelCode: 'DA17',
    name: '9 x 9" 3-Compartment XL Clamshell',
    category: 'Compartment',
    type: '3-Compartment XL',
    badge: 'Catering Choice',
    image: '/images/3comp_8x8.png',
    shortDesc: 'Heavy-duty 3-compartment 9x9 box for full banquet meals, BBQ boxes, and thali style takeaway.',
    basePrice: 0.56,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.56 },
      { minCartons: 5, pricePerUnit: 0.49 },
      { minCartons: 20, pricePerUnit: 0.41 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA17',
      dimensions: '464 x 230 x 47.5 mm',
      capacity: '1250 ml Total',
      material: 'High-Density Moulded Bagasse',
      packSize: 200,
      cartonWeightKg: 9.8,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'FDA Approved']
    }
  },
  {
    id: 'da43-7x5-bio-box',
    modelCode: 'DA43',
    name: '7 x 5" Small Bio Box (F+C)',
    category: 'Bio Boxes',
    type: 'Compact Bio Box',
    badge: 'Eco Pack',
    image: '/images/bio_box_9x6.png',
    shortDesc: 'Compact fold-and-close bio box for desserts, side dishes, dim sum, and street food.',
    basePrice: 0.34,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.34 },
      { minCartons: 5, pricePerUnit: 0.29 },
      { minCartons: 20, pricePerUnit: 0.24 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA43',
      dimensions: '190 x 150 x 70 mm',
      capacity: '500 ml / 17 oz',
      material: 'Bagasse Fiber Mould',
      packSize: 250,
      cartonWeightKg: 6.2,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 60 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'OK Compost HOME']
    }
  },
  {
    id: 'da44-9x6-bio-box',
    modelCode: 'DA44',
    name: '9 x 6" Medium Bio Box (F+C)',
    category: 'Bio Boxes',
    type: 'Medium Bio Box',
    badge: 'Popular',
    image: '/images/bio_box_9x6.png',
    shortDesc: 'Standard fold-and-close bio takeaway box for fish & chips, noodles, and fried chicken.',
    basePrice: 0.40,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.40 },
      { minCartons: 5, pricePerUnit: 0.35 },
      { minCartons: 20, pricePerUnit: 0.29 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA44',
      dimensions: '250 x 155 x 60 mm',
      capacity: '750 ml / 25 oz',
      material: 'Sugarcane Bagasse Pulp',
      packSize: 250,
      cartonWeightKg: 7.4,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 60-90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'FDA Food Contact Safe']
    }
  },
  {
    id: 'da58-12.75x6-large-bio-box',
    modelCode: 'DA58',
    name: '12.75 x 6" Large Bio Box (F+C)',
    category: 'Bio Boxes',
    type: 'Long Bio Box',
    badge: 'Family Size',
    image: '/images/bio_box_9x6.png',
    shortDesc: 'Elongated bio box designed for baguettes, hot dogs, family meal combos, and skewered grills.',
    basePrice: 0.46,
    priceTiers: [
      { minCartons: 1, pricePerUnit: 0.46 },
      { minCartons: 5, pricePerUnit: 0.40 },
      { minCartons: 20, pricePerUnit: 0.34 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA58',
      dimensions: '324 x 155 x 60 mm',
      capacity: '950 ml / 32 oz',
      material: '100% Bagasse Fiber',
      packSize: 200,
      cartonWeightKg: 8.0,
      leadTime: 'Dispatch within 24h',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: 'Composts in 90 days',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'OK Compost EN13432']
    }
  },
  {
    id: 'custom-printed-dinearth-clamshell',
    modelCode: 'DA-CUSTOM',
    name: 'Custom Printed / Embossed Bagasse Box',
    category: 'Custom',
    type: 'Private Label Packaging',
    badge: 'Custom Print',
    image: '/images/burger_box_5x5.png',
    shortDesc: 'Custom soy-ink logo printing or factory debossing directly on clamshell lids for restaurant branding.',
    basePrice: 0.58,
    priceTiers: [
      { minCartons: 5, pricePerUnit: 0.58 },
      { minCartons: 20, pricePerUnit: 0.48 },
      { minCartons: 50, pricePerUnit: 0.39 }
    ],
    inStock: true,
    specs: {
      modelCode: 'DA-CUSTOM',
      dimensions: 'Custom Sizes (DA30, DA32, DA33, DA29)',
      capacity: '500ml / 750ml / 1000ml',
      material: 'Bagasse Pulp + Water-Based Soy Ink',
      packSize: 500,
      cartonWeightKg: 9.0,
      leadTime: '15-20 Working Days',
      tempRange: '-20°C to 120°C',
      microwaveSafe: true,
      oilWaterResistant: true,
      compostTime: '100% Home Compostable Ink',
      certifications: ['BRCGS Grade A', 'BPI Certified', 'OK Compost HOME', 'FDA Safe']
    }
  }
];

export const CERTIFICATIONS = [
  {
    title: 'BRCGS Packaging Certified',
    code: 'Global Standard Grade A Facility',
    description: 'Manufactured in BRCGS Grade A audited facilities guaranteeing strict food safety and hygiene protocols.',
    icon: 'shield-check'
  },
  {
    title: 'BPI & OK Compost HOME',
    code: 'ASTM D6400 / EN 13432 (TA8012206794)',
    description: 'Certified 100% home and commercial compostable. Fully breaks down into natural soil nutrients within 90 days.',
    icon: 'leaf'
  },
  {
    title: 'FDA & EU Food Contact Safe',
    code: 'US FDA 21 CFR 176.170 / Eurofins & SGS',
    description: 'Rigorously tested for direct hot, oily, and acidic food contact safety with zero chemical leaching.',
    icon: 'check-circle'
  },
  {
    title: 'PFAS-Free Guarantee',
    code: 'Fluorine-Free 2026 Compliant (Intertek)',
    description: 'Zero added forever chemicals. 100% natural sugarcane oil & liquid barrier.',
    icon: 'flame'
  }
];

export const FAQS = [
  {
    question: 'Are your bagasse clamshells manufactured in certified facilities?',
    answer: 'Yes! All our sugarcane bagasse clamshells and bio boxes are manufactured in state-of-the-art BRCGS Grade A facilities (Ashtavinayak Ecopak Ltd / Dinearth). Products carry BPI Compostable, TÜV Austria OK Compost (EN13432), and FDA Food Contact certifications.'
  },
  {
    question: 'What clamshell model sizes and codes are available for dispatch?',
    answer: 'We import the full Dinearth takeaway clamshell range, including 5x5" (DA68) & 6x6" (DA32) Burger Boxes, 7x5" (DA30) & 9x6" (DA33) Clamshells, 9x6" 2-Compartment (DA31), 8x8" (DA29) & 9x9" (DA34) Dinner Boxes, and 7x5" to 12.75x6" Bio Boxes (DA43, DA44, DA58).'
  },
  {
    question: 'How do volume tier discounts work for UK restaurant buyers?',
    answer: 'Pricing scales automatically based on carton volume. Tier 1 applies to 1-4 cartons, Tier 2 applies to 5-19 cartons (approx. 12-15% discount), and Tier 3 applies to 20+ cartons (up to 25% wholesale discount). You can combine different clamshell sizes in your Quote Builder.'
  },
  {
    question: 'Can I get free sample packs to test with our takeaway menu items?',
    answer: 'Yes! We supply free physical sample packs of our Dinearth bagasse clamshells for verified restaurants, takeaways, caterers, and cloud kitchens. Click "Request Free Samples" in the header to select your required sizes.'
  }
];
