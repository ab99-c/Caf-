export type PortalRole = "CUSTOMER" | "CAFE_OWNER" | "ACCOUNTANT" | "TAX_AUDITOR";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceMad: number;
  cafeId: string;
  image: string;
  calories?: string;
}

export interface LiveTicket {
  id: string;
  tableOrClient: string;
  items: string[];
  totalMad: number;
  time: string;
  status: "NEW" | "PREPARING" | "READY" | "COMPLETED";
  paymentMethod: "CASH" | "CARD";
}

export interface InvoiceRecord {
  id: string;
  number: number;
  year: number;
  orderId: string;
  date: string;
  subtotalHt: number;
  vatMad: number;
  totalTtc: number;
  paymentMethod: "CASH" | "CARD";
  status: "PAID" | "ISSUED" | "CANCELLED";
  client: string;
}

export interface CashSessionData {
  isOpen: boolean;
  sessionNumber: string;
  openingBalance: number;
  cashSales: number;
  cardSales: number;
  openedAt: string;
}

export interface CafeTenant {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  phone: string;
  ice: string;
  rc: string;
  taxId: string;
  rating: number;
  deliveryMinutes: number;
  isOpen: boolean;
  image: string;
  ownerName: string;
  products: MenuItem[];
  tickets: LiveTicket[];
  invoices: InvoiceRecord[];
  cashSession: CashSessionData;
}

export const INITIAL_CAFES: CafeTenant[] = [
  {
    id: "cafe_casa",
    name: "مقهى ومحمصة الأصالة",
    type: "قهوة مختصة وتحميص محلي",
    city: "الدار البيضاء (Casablanca)",
    address: "زنقة المسيرة الخضراء، حي المعاريف، الدار البيضاء",
    phone: "+212 522 98 76 54",
    ice: "001234567000089",
    rc: "RC-Casa 1001",
    taxId: "IF-12345678",
    rating: 4.9,
    deliveryMinutes: 15,
    isOpen: true,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    ownerName: "ياسين بنجلون (Gérant Casa)",
    products: [
      {
        id: "p_casa_1",
        name: "إسبريسو سينغل أوريجين إثيوبي",
        category: "قهوة مختصة",
        description: "حبوب يرقاتشيفي معالجة مجففة بنفحات الياسمين والفاكهة الحمراء",
        priceMad: 15,
        cafeId: "cafe_casa",
        calories: "5 سعرة",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "p_casa_2",
        name: "قهوة نص-نص بيضاوية",
        category: "مشروبات بالحليب",
        description: "إسبريسو مكثف بنسبة 50/50 مع حليب مغلى محلى حسب الرغبة",
        priceMad: 16,
        cafeId: "cafe_casa",
        calories: "75 سعرة",
        image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "p_casa_3",
        name: "كابتشينو كراميل بالرسم",
        category: "مشروبات بالحليب",
        description: "إسبريسو غني مع رغوة حليب ناعمة كالحرير وصلصة الكراميل المملح",
        priceMad: 24,
        cafeId: "cafe_casa",
        calories: "135 سعرة",
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "p_casa_4",
        name: "كرواسون زبدة طازج",
        category: "مخبوزات وحلويات",
        description: "كرواسون فرنسي هش بالزبدة الطبيعية يخبز كل صباح في المعاريف",
        priceMad: 12,
        cafeId: "cafe_casa",
        calories: "240 سعرة",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
      },
    ],
    tickets: [
      {
        id: "CMD-CAS-101",
        tableOrClient: "طاولة 4 (الصالون الداخلي)",
        items: ["2x إسبريسو إثيوبي", "1x كرواسون زبدة"],
        totalMad: 42,
        time: "منذ 3 دقائق",
        status: "NEW",
        paymentMethod: "CASH",
      },
      {
        id: "CMD-CAS-102",
        tableOrClient: "زبون كاونتر المعاريف",
        items: ["1x قهوة نص-نص"],
        totalMad: 16,
        time: "منذ 7 دقائق",
        status: "PREPARING",
        paymentMethod: "CARD",
      },
    ],
    invoices: [
      {
        id: "inv_cas_1",
        number: 1045,
        year: 2026,
        orderId: "CMD-CAS-098",
        date: "15/11/2026 11:30",
        subtotalHt: 38.18,
        vatMad: 3.82,
        totalTtc: 42.0,
        paymentMethod: "CASH",
        status: "PAID",
        client: "زبون المعاريف",
      },
      {
        id: "inv_cas_2",
        number: 1046,
        year: 2026,
        orderId: "CMD-CAS-099",
        date: "15/11/2026 12:15",
        subtotalHt: 72.73,
        vatMad: 7.27,
        totalTtc: 80.0,
        paymentMethod: "CARD",
        status: "PAID",
        client: "مكتب استشارات البيضاء",
      },
    ],
    cashSession: {
      isOpen: true,
      sessionNumber: "SES-CAS-2026-88",
      openingBalance: 600,
      cashSales: 1540,
      cardSales: 1120,
      openedAt: "08:00 صباحاً",
    },
  },

  {
    id: "cafe_rabat",
    name: "جلسة كافيه & برانش الرباط",
    type: "فطور ومخبوزات راقية ومشروبات باردة",
    city: "الرباط (Rabat)",
    address: "شارع النخيل، حي الرياض، الرباط",
    phone: "+212 537 65 43 21",
    ice: "002987654000031",
    rc: "RC-Rabat 2045",
    taxId: "IF-87654321",
    rating: 4.8,
    deliveryMinutes: 20,
    isOpen: true,
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80",
    ownerName: "أمينة التازي (Gérante Rabat)",
    products: [
      {
        id: "p_rabat_1",
        name: "فطور الرياض الملكي",
        category: "فطور وبرانش",
        description: "بيض بلدي، أجبان فاخرة، عسل السدر المغربي، زيت زيتون بكر وخبيزات طازجة",
        priceMad: 55,
        cafeId: "cafe_rabat",
        calories: "450 سعرة",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "p_rabat_2",
        name: "موكا بلجيكية بالشوكولاتة الداكنة",
        category: "قهوة مختصة",
        description: "إسبريسو ممزوج مع شوكولاتة كالي باوت البلجيكية وحليب مبخر غني",
        priceMad: 30,
        cafeId: "cafe_rabat",
        calories: "190 سعرة",
        image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "p_rabat_3",
        name: "تشيز كيك التوت الأزرق",
        category: "مخبوزات وحلويات",
        description: "تشيز كيك كريمي محضر يومياً مع صوص التوت البري الطازج وقاعدة بسكويت مقرمشة",
        priceMad: 34,
        cafeId: "cafe_rabat",
        calories: "320 سعرة",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "p_rabat_4",
        name: "آيسد ماتشا لاتيه يابانية",
        category: "مشروبات باردة",
        description: "شاي ماتشا أوغاني من كيوتو مع حليب الشوفان ومكعبات الثلج",
        priceMad: 32,
        cafeId: "cafe_rabat",
        calories: "90 سعرة",
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
      },
    ],
    tickets: [
      {
        id: "CMD-RAB-201",
        tableOrClient: "شرفة حي الرياض (طاولة 12)",
        items: ["1x فطور الرياض الملكي", "1x موكا بلجيكية"],
        totalMad: 85,
        time: "منذ 5 دقائق",
        status: "PREPARING",
        paymentMethod: "CARD",
      },
      {
        id: "CMD-RAB-202",
        tableOrClient: "طاولة 3 (VIP)",
        items: ["2x تشيز كيك التوت", "2x آيسد ماتشا"],
        totalMad: 132,
        time: "منذ 9 دقائق",
        status: "READY",
        paymentMethod: "CARD",
      },
    ],
    invoices: [
      {
        id: "inv_rab_1",
        number: 3012,
        year: 2026,
        orderId: "CMD-RAB-190",
        date: "15/11/2026 10:45",
        subtotalHt: 77.27,
        vatMad: 7.73,
        totalTtc: 85.0,
        paymentMethod: "CARD",
        status: "PAID",
        client: "وفد وزارة الانتقال الرقمي",
      },
      {
        id: "inv_rab_2",
        number: 3013,
        year: 2026,
        orderId: "CMD-RAB-191",
        date: "15/11/2026 12:00",
        subtotalHt: 120.0,
        vatMad: 12.0,
        totalTtc: 132.0,
        paymentMethod: "CARD",
        status: "PAID",
        client: "سفارة فرنسا بالرباط",
      },
    ],
    cashSession: {
      isOpen: true,
      sessionNumber: "SES-RAB-2026-42",
      openingBalance: 400,
      cashSales: 890,
      cardSales: 2450,
      openedAt: "08:30 صباحاً",
    },
  },

  {
    id: "cafe_tanger",
    name: "بُن الصباح Roastery طنجة",
    type: "إسبريسو بار وحبوب قهوة طازجة مع إطلالة بحرية",
    city: "طنجة (Tanger)",
    address: "كورنيش مالاباطا، مارينا باي، طنجة",
    phone: "+212 539 33 22 11",
    ice: "003112233000045",
    rc: "RC-Tanger 3189",
    taxId: "IF-45678912",
    rating: 4.7,
    deliveryMinutes: 18,
    isOpen: true,
    image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80",
    ownerName: "كريم الطنجاوي (Gérant Tanger)",
    products: [
      {
        id: "p_tng_1",
        name: "إسبريسو بحري نورديك",
        category: "قهوة مختصة",
        description: "تحميص خفيف بأسلوب دول الشمال لإبراز حموضة الفواكه الاستوائية",
        priceMad: 18,
        cafeId: "cafe_tanger",
        calories: "4 سعرة",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "p_tng_2",
        name: "قهوة باردة كولد برو 18 ساعة",
        category: "مشروبات باردة",
        description: "منقوعة بالماء البارد لمدة 18 ساعة لنكهة سلسة مع انعدام المرارة",
        priceMad: 26,
        cafeId: "cafe_tanger",
        calories: "8 سعرة",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "p_tng_3",
        name: "شاي مغربي بنعناع طنجة الأصيل",
        category: "مشروبات ساخنة",
        description: "شاي أخضر بارود مع نعناع طازج وأعشاب الجبل العطرية الشمالية",
        priceMad: 14,
        cafeId: "cafe_tanger",
        calories: "40 سعرة",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: "p_tng_4",
        name: "حلوى طرطة اللوز الشمالية",
        category: "مخبوزات وحلويات",
        description: "وصفة تطوانية تقليدية باللوز البلدي وماء الزهر المقطر",
        priceMad: 22,
        cafeId: "cafe_tanger",
        calories: "280 سعرة",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      },
    ],
    tickets: [
      {
        id: "CMD-TNG-301",
        tableOrClient: "طاولة 7 (إطلالة المارينا)",
        items: ["2x كولد برو 18 ساعة", "1x طرطة اللوز"],
        totalMad: 74,
        time: "منذ 4 دقائق",
        status: "NEW",
        paymentMethod: "CASH",
      },
    ],
    invoices: [
      {
        id: "inv_tng_1",
        number: 501,
        year: 2026,
        orderId: "CMD-TNG-295",
        date: "15/11/2026 11:10",
        subtotalHt: 49.09,
        vatMad: 4.91,
        totalTtc: 54.0,
        paymentMethod: "CASH",
        status: "PAID",
        client: "سياح مارينا طنجة",
      },
    ],
    cashSession: {
      isOpen: true,
      sessionNumber: "SES-TNG-2026-19",
      openingBalance: 500,
      cashSales: 1230,
      cardSales: 780,
      openedAt: "09:00 صباحاً",
    },
  },
];
