import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// ─── Unsplash Image URLs ──────────────────────────────────────────────────────

const unsplashImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
];

function getImages(startIndex: number, count: number) {
  const images: { imageUrl: string; isPrimary: boolean; sortOrder: number }[] =
    [];
  for (let i = 0; i < count; i++) {
    images.push({
      imageUrl: unsplashImages[(startIndex + i) % unsplashImages.length],
      isPrimary: i === 0,
      sortOrder: i,
    });
  }
  return images;
}

function makeSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

// ─── Builder Data ─────────────────────────────────────────────────────────────

const buildersData = [
  {
    name: "Casatrance",
    description: "Your Property Our Priority",
    establishedYear: 2018,
    totalProjects: 12,
    logoUrl: "/images/builders/casatrance.jpeg",
    websiteUrl: "https://www.casatrance.com",
  },
  {
    name: "Goyal & Co. Hariyana Group",
    description: "Creating Landmarks Since 1971",
    establishedYear: 1971,
    totalProjects: 45,
    logoUrl: "/images/builders/goyal-hariyana.jpeg",
    websiteUrl: "https://www.goyalco.com",
  },
  {
    name: "Casagrand",
    description: "Building Aspirations",
    establishedYear: 2004,
    totalProjects: 80,
    logoUrl: "/images/builders/casagrand.jpeg",
    websiteUrl: "https://www.casagrand.co.in",
  },
  {
    name: "Modern Spaaces",
    description: "Modern Living Redefined",
    establishedYear: 2015,
    totalProjects: 15,
    logoUrl: "/images/builders/modern-spaaces.jpeg",
    websiteUrl: "https://www.modernspaaces.com",
  },
  {
    name: "Sumadhura",
    description: "Foundation of Happiness",
    establishedYear: 1995,
    totalProjects: 35,
    logoUrl: "/images/builders/sumadhura.jpeg",
    websiteUrl: "https://www.sumadhura.com",
  },
  {
    name: "Lodha",
    description: "Building a Better Life",
    establishedYear: 1980,
    totalProjects: 100,
    logoUrl: "/images/builders/lodha.jpeg",
    websiteUrl: "https://www.lodhagroup.com",
  },
  {
    name: "Sobha",
    description: "Passion at Work",
    establishedYear: 1995,
    totalProjects: 150,
    logoUrl: "/images/builders/sobha.jpeg",
    websiteUrl: "https://www.sobha.com",
  },
  {
    name: "DS Max",
    description: "Building Dreams",
    establishedYear: 2006,
    totalProjects: 90,
    logoUrl: "/images/builders/ds-max.jpeg",
    websiteUrl: "https://www.dsmaxproperties.com",
  },
  {
    name: "ELV Projects",
    description: "Premium Real Estate",
    establishedYear: 2010,
    totalProjects: 20,
    logoUrl: "/images/builders/elv-projects.jpeg",
    websiteUrl: "https://www.elvprojects.com",
  },
  {
    name: "Sowparnika",
    description: "Delivering Happiness",
    establishedYear: 2006,
    totalProjects: 30,
    logoUrl: "/images/builders/sowparnika.jpeg",
    websiteUrl: "https://www.sowparnika.com",
  },
  {
    name: "SBR Group",
    description: "Building Reality",
    establishedYear: 2008,
    totalProjects: 25,
    logoUrl: "/images/builders/sbr-group.jpeg",
    websiteUrl: "https://www.sbrgroup.in",
  },
  {
    name: "m1 Homes",
    description: "Hello, Happiness!",
    establishedYear: 2019,
    totalProjects: 8,
    logoUrl: "/images/builders/m1-homes.jpeg",
    websiteUrl: "https://www.m1homes.com",
  },
  {
    name: "Assetz",
    description: "Creating Living Spaces",
    establishedYear: 2006,
    totalProjects: 20,
    logoUrl: "/images/builders/assetz.jpeg",
    websiteUrl: "https://www.assetzproperty.com",
  },
  {
    name: "The House of Abhinandan Lodha",
    description: "Landmark Developments",
    establishedYear: 2020,
    totalProjects: 10,
    logoUrl: "/images/builders/abhinandan-lodha.jpeg",
    websiteUrl: "https://www.hfrhoal.com",
  },
];

// ─── Property Data ────────────────────────────────────────────────────────────

interface PropertySeed {
  title: string;
  description: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "PLOT";
  listingType: "SALE" | "RENT";
  builderName: string;
  price: number;
  priceUnit: "LAKH" | "CRORE";
  carpetArea: number;
  carpetAreaUnit: "SQFT";
  builtUpArea: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floorNumber: number | null;
  totalFloors: number | null;
  facingDirection: string | null;
  furnishing: "UNFURNISHED" | "SEMI_FURNISHED" | "FULLY_FURNISHED" | null;
  possessionStatus: "READY_TO_MOVE" | "UNDER_CONSTRUCTION" | "UPCOMING";
  possessionDate: Date | null;
  amenities: string[];
  address: string;
  locality: string;
  pincode: string;
  latitude: number;
  longitude: number;
  reraNumber: string;
  isFeatured: boolean;
  imageStartIndex: number;
  imageCount: number;
}

const propertiesData: PropertySeed[] = [
  // ── Residential (5) ───────────────────────────────────────────────────────

  {
    title: "Sobha Dream Acres 2BHK",
    description:
      "Spacious 2BHK apartment in Sobha Dream Acres, Whitefield. This ready-to-move unit features modern interiors with premium fittings, a well-designed layout, and access to world-class amenities. Located near IT hubs, schools, and hospitals for a convenient urban lifestyle.",
    propertyType: "RESIDENTIAL",
    listingType: "SALE",
    builderName: "Sobha",
    price: 45,
    priceUnit: "LAKH",
    carpetArea: 1100,
    carpetAreaUnit: "SQFT",
    builtUpArea: 1250,
    bedrooms: 2,
    bathrooms: 2,
    floorNumber: 5,
    totalFloors: 14,
    facingDirection: "East",
    furnishing: "SEMI_FURNISHED",
    possessionStatus: "READY_TO_MOVE",
    possessionDate: null,
    amenities: [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Children's Play Area",
      "Jogging Track",
    ],
    address: "Sobha Dream Acres, Panathur Road, Whitefield",
    locality: "Whitefield",
    pincode: "560066",
    latitude: 12.9698,
    longitude: 77.7500,
    reraNumber: "PRM/KA/RERA/1251/310/AG/180724/003487",
    isFeatured: true,
    imageStartIndex: 0,
    imageCount: 4,
  },
  {
    title: "Casagrand Northern Star 3BHK",
    description:
      "Premium 3BHK apartment in Casagrand Northern Star, Hebbal. Under construction with expected delivery in 2026, this property offers a perfect blend of luxury and comfort. Enjoy panoramic views, spacious rooms, and proximity to the international airport and Manyata Tech Park.",
    propertyType: "RESIDENTIAL",
    listingType: "SALE",
    builderName: "Casagrand",
    price: 85,
    priceUnit: "LAKH",
    carpetArea: 1650,
    carpetAreaUnit: "SQFT",
    builtUpArea: 1850,
    bedrooms: 3,
    bathrooms: 3,
    floorNumber: 8,
    totalFloors: 22,
    facingDirection: "North",
    furnishing: "UNFURNISHED",
    possessionStatus: "UNDER_CONSTRUCTION",
    possessionDate: new Date("2026-12-01"),
    amenities: [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Landscaped Gardens",
    ],
    address: "Casagrand Northern Star, Bellary Road, Hebbal",
    locality: "Hebbal",
    pincode: "560024",
    latitude: 13.0358,
    longitude: 77.5970,
    reraNumber: "PRM/KA/RERA/1251/310/AG/210315/004521",
    isFeatured: true,
    imageStartIndex: 2,
    imageCount: 4,
  },
  {
    title: "Sumadhura Horizon 3BHK",
    description:
      "Elegant fully furnished 3BHK apartment at Sumadhura Horizon on Sarjapur Road. This ready-to-move home comes with modular kitchen, wardrobes, and split ACs in all rooms. Located in a serene environment with excellent connectivity to major IT parks and shopping destinations.",
    propertyType: "RESIDENTIAL",
    listingType: "SALE",
    builderName: "Sumadhura",
    price: 72,
    priceUnit: "LAKH",
    carpetArea: 1450,
    carpetAreaUnit: "SQFT",
    builtUpArea: 1620,
    bedrooms: 3,
    bathrooms: 2,
    floorNumber: 3,
    totalFloors: 12,
    facingDirection: "South-East",
    furnishing: "FULLY_FURNISHED",
    possessionStatus: "READY_TO_MOVE",
    possessionDate: null,
    amenities: [
      "Swimming Pool",
      "Gym",
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Indoor Games",
    ],
    address: "Sumadhura Horizon, Sarjapur Road, near Wipro Junction",
    locality: "Sarjapur Road",
    pincode: "560035",
    latitude: 12.9100,
    longitude: 77.6868,
    reraNumber: "PRM/KA/RERA/1251/310/AG/190512/002198",
    isFeatured: false,
    imageStartIndex: 4,
    imageCount: 3,
  },
  {
    title: "DS Max Sky Shubham 2BHK",
    description:
      "Affordable 2BHK apartment at DS Max Sky Shubham in Electronic City. This semi-furnished unit is ready to move in and offers great value for money with quality construction. Ideal for IT professionals working in the Electronic City tech corridor.",
    propertyType: "RESIDENTIAL",
    listingType: "SALE",
    builderName: "DS Max",
    price: 38,
    priceUnit: "LAKH",
    carpetArea: 950,
    carpetAreaUnit: "SQFT",
    builtUpArea: 1080,
    bedrooms: 2,
    bathrooms: 2,
    floorNumber: 4,
    totalFloors: 10,
    facingDirection: "West",
    furnishing: "SEMI_FURNISHED",
    possessionStatus: "READY_TO_MOVE",
    possessionDate: null,
    amenities: [
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Children's Play Area",
      "Rainwater Harvesting",
    ],
    address: "DS Max Sky Shubham, Neeladri Road, Electronic City Phase 1",
    locality: "Electronic City",
    pincode: "560100",
    latitude: 12.8456,
    longitude: 77.6603,
    reraNumber: "PRM/KA/RERA/1251/310/AG/200823/003012",
    isFeatured: false,
    imageStartIndex: 6,
    imageCount: 3,
  },
  {
    title: "Modern Spaaces Luxury 4BHK",
    description:
      "Ultra-luxurious 4BHK apartment by Modern Spaaces in Whitefield. This under-construction masterpiece features expansive living spaces, designer interiors, and a private terrace garden. Located in a gated community with world-class amenities and excellent connectivity to ITPL and major tech parks.",
    propertyType: "RESIDENTIAL",
    listingType: "SALE",
    builderName: "Modern Spaaces",
    price: 1.8,
    priceUnit: "CRORE",
    carpetArea: 2800,
    carpetAreaUnit: "SQFT",
    builtUpArea: 3200,
    bedrooms: 4,
    bathrooms: 4,
    floorNumber: 12,
    totalFloors: 20,
    facingDirection: "North-East",
    furnishing: "UNFURNISHED",
    possessionStatus: "UNDER_CONSTRUCTION",
    possessionDate: new Date("2027-06-01"),
    amenities: [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Tennis Court",
      "Spa",
    ],
    address: "Modern Spaaces Luxury, ITPL Main Road, Whitefield",
    locality: "Whitefield",
    pincode: "560066",
    latitude: 12.9816,
    longitude: 77.7264,
    reraNumber: "PRM/KA/RERA/1251/310/AG/220917/005634",
    isFeatured: true,
    imageStartIndex: 1,
    imageCount: 4,
  },

  // ── Commercial (4) ────────────────────────────────────────────────────────

  {
    title: "Assetz Business Hub Office",
    description:
      "Premium office space at Assetz Business Hub in Koramangala. Ready-to-move commercial property ideal for startups and mid-size companies. Features modern infrastructure, high-speed internet connectivity, and ample parking. Located in the heart of Bangalore's startup ecosystem.",
    propertyType: "COMMERCIAL",
    listingType: "SALE",
    builderName: "Assetz",
    price: 1.2,
    priceUnit: "CRORE",
    carpetArea: 1200,
    carpetAreaUnit: "SQFT",
    builtUpArea: 1400,
    bedrooms: null,
    bathrooms: 2,
    floorNumber: 3,
    totalFloors: 8,
    facingDirection: "East",
    furnishing: null,
    possessionStatus: "READY_TO_MOVE",
    possessionDate: null,
    amenities: [
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Lift",
      "Cafeteria",
      "Conference Room",
    ],
    address: "Assetz Business Hub, 80 Feet Road, Koramangala 4th Block",
    locality: "Koramangala",
    pincode: "560034",
    latitude: 12.9352,
    longitude: 77.6245,
    reraNumber: "PRM/KA/RERA/1251/446/COM/210610/001245",
    isFeatured: true,
    imageStartIndex: 3,
    imageCount: 3,
  },
  {
    title: "ELV Commercial Plaza Shop",
    description:
      "Retail shop space at ELV Commercial Plaza in Rajajinagar. Perfect for showrooms, retail outlets, or office setups in one of Bangalore's most prominent commercial areas. Ground-floor unit with excellent street visibility and heavy foot traffic.",
    propertyType: "COMMERCIAL",
    listingType: "SALE",
    builderName: "ELV Projects",
    price: 65,
    priceUnit: "LAKH",
    carpetArea: 600,
    carpetAreaUnit: "SQFT",
    builtUpArea: 720,
    bedrooms: null,
    bathrooms: 1,
    floorNumber: 0,
    totalFloors: 5,
    facingDirection: "South",
    furnishing: null,
    possessionStatus: "READY_TO_MOVE",
    possessionDate: null,
    amenities: ["24/7 Security", "Parking", "Power Backup", "Lift"],
    address: "ELV Commercial Plaza, Dr. Rajkumar Road, Rajajinagar",
    locality: "Rajajinagar",
    pincode: "560010",
    latitude: 12.9912,
    longitude: 77.5530,
    reraNumber: "PRM/KA/RERA/1251/446/COM/200415/001087",
    isFeatured: false,
    imageStartIndex: 5,
    imageCount: 3,
  },
  {
    title: "Lodha Business District Office",
    description:
      "Fully furnished office space for rent at Lodha Business District near MG Road. This premium commercial space comes equipped with workstations, meeting rooms, and a pantry. Ideal for corporates looking for a prestigious address in Bangalore's central business district.",
    propertyType: "COMMERCIAL",
    listingType: "RENT",
    builderName: "Lodha",
    price: 4.5,
    priceUnit: "LAKH",
    carpetArea: 800,
    carpetAreaUnit: "SQFT",
    builtUpArea: 950,
    bedrooms: null,
    bathrooms: 2,
    floorNumber: 6,
    totalFloors: 12,
    facingDirection: "North",
    furnishing: "FULLY_FURNISHED",
    possessionStatus: "READY_TO_MOVE",
    possessionDate: null,
    amenities: [
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Lift",
      "Cafeteria",
      "Conference Room",
      "Reception",
    ],
    address: "Lodha Business District, Residency Road, off MG Road",
    locality: "Koramangala",
    pincode: "560025",
    latitude: 12.9716,
    longitude: 77.6099,
    reraNumber: "PRM/KA/RERA/1251/446/COM/220301/001512",
    isFeatured: false,
    imageStartIndex: 7,
    imageCount: 3,
  },
  {
    title: "SBR Tech Park Space",
    description:
      "Unfurnished commercial office space for rent at SBR Tech Park in Electronic City. Versatile layout suitable for IT companies and tech startups. The space offers flexible configuration options, 24/7 access, and is located in the heart of Bangalore's IT corridor.",
    propertyType: "COMMERCIAL",
    listingType: "RENT",
    builderName: "SBR Group",
    price: 5.5,
    priceUnit: "LAKH",
    carpetArea: 1000,
    carpetAreaUnit: "SQFT",
    builtUpArea: 1150,
    bedrooms: null,
    bathrooms: 2,
    floorNumber: 2,
    totalFloors: 6,
    facingDirection: "East",
    furnishing: "UNFURNISHED",
    possessionStatus: "READY_TO_MOVE",
    possessionDate: null,
    amenities: [
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Lift",
      "Fire Safety",
    ],
    address: "SBR Tech Park, Hosur Road, Electronic City Phase 2",
    locality: "Electronic City",
    pincode: "560100",
    latitude: 12.8520,
    longitude: 77.6710,
    reraNumber: "PRM/KA/RERA/1251/446/COM/210825/001389",
    isFeatured: false,
    imageStartIndex: 0,
    imageCount: 3,
  },

  // ── Plots (3) ─────────────────────────────────────────────────────────────

  {
    title: "Goyal Premium Plot",
    description:
      "Premium residential plot in a gated community by Goyal & Co. in Devanahalli, near the Kempegowda International Airport. An excellent investment opportunity with clear titles and approved layouts. The area is witnessing rapid infrastructure development including the upcoming metro line.",
    propertyType: "PLOT",
    listingType: "SALE",
    builderName: "Goyal & Co. Hariyana Group",
    price: 35,
    priceUnit: "LAKH",
    carpetArea: 1200,
    carpetAreaUnit: "SQFT",
    builtUpArea: null,
    bedrooms: null,
    bathrooms: null,
    floorNumber: null,
    totalFloors: null,
    facingDirection: "North",
    furnishing: null,
    possessionStatus: "UPCOMING",
    possessionDate: new Date("2027-03-01"),
    amenities: [
      "24/7 Security",
      "Gated Community",
      "Underground Drainage",
      "Street Lights",
      "Park",
    ],
    address: "Goyal Premium Layout, NH 44, Devanahalli",
    locality: "Devanahalli",
    pincode: "562110",
    latitude: 13.2468,
    longitude: 77.7106,
    reraNumber: "PRM/KA/RERA/1251/309/PL/230115/006201",
    isFeatured: true,
    imageStartIndex: 2,
    imageCount: 3,
  },
  {
    title: "Sowparnika Green Acres Plot",
    description:
      "Well-planned residential plot at Sowparnika Green Acres in Yelahanka. Ready for immediate construction with all approvals in place. The layout features wide roads, underground utilities, and is surrounded by lush greenery. Excellent connectivity to the airport and city center.",
    propertyType: "PLOT",
    listingType: "SALE",
    builderName: "Sowparnika",
    price: 28,
    priceUnit: "LAKH",
    carpetArea: 1500,
    carpetAreaUnit: "SQFT",
    builtUpArea: null,
    bedrooms: null,
    bathrooms: null,
    floorNumber: null,
    totalFloors: null,
    facingDirection: "East",
    furnishing: null,
    possessionStatus: "READY_TO_MOVE",
    possessionDate: null,
    amenities: [
      "24/7 Security",
      "Gated Community",
      "Underground Drainage",
      "Street Lights",
      "Park",
      "Clubhouse",
    ],
    address: "Sowparnika Green Acres, Doddaballapur Road, Yelahanka",
    locality: "Yelahanka",
    pincode: "560064",
    latitude: 13.1007,
    longitude: 77.5963,
    reraNumber: "PRM/KA/RERA/1251/309/PL/210722/005870",
    isFeatured: false,
    imageStartIndex: 4,
    imageCount: 3,
  },
  {
    title: "Casatrance Villa Plot",
    description:
      "Exclusive villa plot by Casatrance on Sarjapur Road, one of Bangalore's fastest-growing corridors. Under-construction gated community with premium amenities and wide internal roads. Ideal for building your dream villa with proximity to top schools, hospitals, and IT hubs.",
    propertyType: "PLOT",
    listingType: "SALE",
    builderName: "Casatrance",
    price: 55,
    priceUnit: "LAKH",
    carpetArea: 2400,
    carpetAreaUnit: "SQFT",
    builtUpArea: null,
    bedrooms: null,
    bathrooms: null,
    floorNumber: null,
    totalFloors: null,
    facingDirection: "South-East",
    furnishing: null,
    possessionStatus: "UNDER_CONSTRUCTION",
    possessionDate: new Date("2026-09-01"),
    amenities: [
      "24/7 Security",
      "Gated Community",
      "Underground Drainage",
      "Street Lights",
      "Swimming Pool",
      "Clubhouse",
      "Jogging Track",
    ],
    address: "Casatrance Villa Plot, Chandapura-Anekal Road, Sarjapur Road",
    locality: "Sarjapur Road",
    pincode: "562125",
    latitude: 12.8685,
    longitude: 77.7440,
    reraNumber: "PRM/KA/RERA/1251/309/PL/220530/006045",
    isFeatured: false,
    imageStartIndex: 6,
    imageCount: 3,
  },

  // ── Luxury (3) ────────────────────────────────────────────────────────────

  {
    title: "Lodha Luxury Penthouse",
    description:
      "Exquisite 4BHK penthouse by Lodha in the heart of Koramangala. This under-construction luxury residence features a private rooftop terrace, floor-to-ceiling windows, and Italian marble flooring. Experience the pinnacle of urban luxury living with unmatched views of the Bangalore skyline.",
    propertyType: "RESIDENTIAL",
    listingType: "SALE",
    builderName: "Lodha",
    price: 3.5,
    priceUnit: "CRORE",
    carpetArea: 3500,
    carpetAreaUnit: "SQFT",
    builtUpArea: 4000,
    bedrooms: 4,
    bathrooms: 5,
    floorNumber: 18,
    totalFloors: 18,
    facingDirection: "North-West",
    furnishing: null,
    possessionStatus: "UNDER_CONSTRUCTION",
    possessionDate: new Date("2027-12-01"),
    amenities: [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Spa",
      "Concierge Service",
    ],
    address: "Lodha Luxury Residences, 100 Feet Road, Koramangala 5th Block",
    locality: "Koramangala",
    pincode: "560095",
    latitude: 12.9344,
    longitude: 77.6168,
    reraNumber: "PRM/KA/RERA/1251/310/AG/230410/006789",
    isFeatured: false,
    imageStartIndex: 1,
    imageCount: 4,
  },
  {
    title: "Sobha Windsor Villa",
    description:
      "Magnificent 5BHK independent villa at Sobha Windsor in Yelahanka. This fully furnished luxury villa features a private garden, home theater, and imported fixtures throughout. Nestled in a gated enclave with mature landscaping, it offers the perfect retreat from the bustle of city life.",
    propertyType: "RESIDENTIAL",
    listingType: "SALE",
    builderName: "Sobha",
    price: 4.2,
    priceUnit: "CRORE",
    carpetArea: 4500,
    carpetAreaUnit: "SQFT",
    builtUpArea: 5200,
    bedrooms: 5,
    bathrooms: 6,
    floorNumber: null,
    totalFloors: 3,
    facingDirection: "East",
    furnishing: "FULLY_FURNISHED",
    possessionStatus: "READY_TO_MOVE",
    possessionDate: null,
    amenities: [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Tennis Court",
      "Home Theater",
    ],
    address: "Sobha Windsor, Bellary Road, Yelahanka New Town",
    locality: "Yelahanka",
    pincode: "560064",
    latitude: 13.1052,
    longitude: 77.5936,
    reraNumber: "PRM/KA/RERA/1251/310/AG/190828/002567",
    isFeatured: false,
    imageStartIndex: 3,
    imageCount: 4,
  },
  {
    title: "m1 Homes Premium Apartment",
    description:
      "Stylish 3BHK premium apartment by m1 Homes in the rapidly developing Thanisandra locality. This upcoming project features contemporary architecture, smart home automation, and curated amenities. An ideal investment for those seeking modern living in North Bangalore's growth corridor.",
    propertyType: "RESIDENTIAL",
    listingType: "SALE",
    builderName: "m1 Homes",
    price: 95,
    priceUnit: "LAKH",
    carpetArea: 1800,
    carpetAreaUnit: "SQFT",
    builtUpArea: 2050,
    bedrooms: 3,
    bathrooms: 3,
    floorNumber: 10,
    totalFloors: 16,
    facingDirection: "South",
    furnishing: null,
    possessionStatus: "UPCOMING",
    possessionDate: new Date("2028-03-01"),
    amenities: [
      "Swimming Pool",
      "Gym",
      "Clubhouse",
      "24/7 Security",
      "Parking",
      "Power Backup",
      "Smart Home",
    ],
    address: "m1 Homes Premium, Thanisandra Main Road, near Manyata Tech Park",
    locality: "Thanisandra",
    pincode: "560077",
    latitude: 13.0590,
    longitude: 77.6400,
    reraNumber: "PRM/KA/RERA/1251/310/AG/240215/007102",
    isFeatured: false,
    imageStartIndex: 5,
    imageCount: 4,
  },
];

// ─── Testimonial Data ─────────────────────────────────────────────────────────

const testimonialsData = [
  {
    name: "Rajesh Kumar",
    rating: 5,
    text: "City Nexa helped us find our dream home in Whitefield. Their team was incredibly professional and guided us through the entire process. Zero commission was a huge plus!",
  },
  {
    name: "Priya Sharma",
    rating: 5,
    text: "Excellent service! We were looking for a 3BHK in Sarjapur Road and they showed us multiple options within our budget. Highly recommended!",
  },
  {
    name: "Amit Patel",
    rating: 4,
    text: "The team at City Nexa is knowledgeable about the Bangalore real estate market. They helped us compare different builders and make an informed decision.",
  },
  {
    name: "Sneha Reddy",
    rating: 5,
    text: "I purchased a plot in Devanahalli through City Nexa. The process was smooth and transparent. Their builder connections are impressive.",
  },
  {
    name: "Vikram Singh",
    rating: 4,
    text: "Great experience working with City Nexa for our commercial space in Electronic City. Their market knowledge saved us both time and money.",
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  // ── 1. Seed Admin User ──────────────────────────────────────────────────

  console.log("👤 Seeding admin user...");
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@citynexa.com" },
    update: {
      name: "Super Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
    create: {
      name: "Super Admin",
      email: "admin@citynexa.com",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log("   Admin user created: admin@citynexa.com\n");

  // ── 2. Seed Builders ────────────────────────────────────────────────────

  console.log("🏗️  Seeding builders...");
  const builderMap = new Map<string, string>();

  // Builder.name is not unique in the schema, so we use findFirst + create/update
  for (const builder of buildersData) {
    const existing = await prisma.builder.findFirst({
      where: { name: builder.name },
    });

    let builderId: string;

    if (existing) {
      await prisma.builder.update({
        where: { id: existing.id },
        data: {
          logoUrl: builder.logoUrl,
          description: builder.description,
          websiteUrl: builder.websiteUrl,
          totalProjects: builder.totalProjects,
          establishedYear: builder.establishedYear,
          isActive: true,
        },
      });
      builderId = existing.id;
    } else {
      const created = await prisma.builder.create({
        data: {
          name: builder.name,
          logoUrl: builder.logoUrl,
          description: builder.description,
          websiteUrl: builder.websiteUrl,
          totalProjects: builder.totalProjects,
          establishedYear: builder.establishedYear,
          isActive: true,
        },
      });
      builderId = created.id;
    }

    builderMap.set(builder.name, builderId);
    console.log(`   Builder seeded: ${builder.name}`);
  }
  console.log(`   Total builders seeded: ${builderMap.size}\n`);

  // ── 3. Seed Properties ──────────────────────────────────────────────────

  console.log("🏠 Seeding properties...");

  // Delete existing property images and properties for clean re-seed
  await prisma.propertyImage.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.property.deleteMany({});
  console.log("   Cleared existing properties and images.");

  for (const prop of propertiesData) {
    const builderId = builderMap.get(prop.builderName);
    if (!builderId) {
      console.error(`   ERROR: Builder not found: ${prop.builderName}`);
      continue;
    }

    const slug = makeSlug(prop.title);
    const images = getImages(prop.imageStartIndex, prop.imageCount);

    const property = await prisma.property.create({
      data: {
        title: prop.title,
        slug,
        description: prop.description,
        propertyType: prop.propertyType,
        listingType: prop.listingType,
        builderId,
        price: prop.price,
        priceUnit: prop.priceUnit,
        carpetArea: prop.carpetArea,
        carpetAreaUnit: prop.carpetAreaUnit,
        builtUpArea: prop.builtUpArea,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        floorNumber: prop.floorNumber,
        totalFloors: prop.totalFloors,
        facingDirection: prop.facingDirection,
        furnishing: prop.furnishing,
        possessionStatus: prop.possessionStatus,
        possessionDate: prop.possessionDate,
        amenities: prop.amenities,
        address: prop.address,
        city: "Bangalore",
        locality: prop.locality,
        state: "Karnataka",
        pincode: prop.pincode,
        latitude: prop.latitude,
        longitude: prop.longitude,
        reraNumber: prop.reraNumber,
        isFeatured: prop.isFeatured,
        isActive: true,
        images: {
          create: images,
        },
      },
    });

    console.log(
      `   Property created: ${property.title} (${slug}) - ${prop.imageCount} images`
    );
  }
  console.log(`   Total properties seeded: ${propertiesData.length}\n`);

  // ── 4. Seed Testimonials ────────────────────────────────────────────────

  console.log("💬 Seeding testimonials...");

  // Delete existing testimonials for clean re-seed
  await prisma.testimonial.deleteMany({});

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({
      data: {
        name: testimonial.name,
        text: testimonial.text,
        rating: testimonial.rating,
        isActive: true,
      },
    });
    console.log(`   Testimonial created: ${testimonial.name}`);
  }
  console.log(`   Total testimonials seeded: ${testimonialsData.length}\n`);

  console.log("✅ Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
