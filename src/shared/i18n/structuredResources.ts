import type { TranslationResource } from './createTranslationResource';

interface StructuredLocales {
  en: TranslationResource;
  uz: TranslationResource;
  ru: TranslationResource;
  kaa: TranslationResource;
}

export const structuredResources: StructuredLocales = {
  en: {
    common: {
      clearFilters: 'Clear filters',
    },
    layout: {
      navigation: {
        guides: 'Guides',
        about: 'About',
        route: 'Route',
        menu: 'Navigation',
      },
      footer: {
        description:
          'Tourism planning, destination discovery, and trusted local services for Karakalpakstan.',
        sections: {
          explore: 'Explore',
          planning: 'Plan your trip',
          value: 'Why Baramiz',
        },
        links: {
          guidesDirectory: 'Local guides directory',
          transport: 'Hotels, transport, and tours',
        },
        values: {
          routePlanning: 'Warm, practical route planning',
          livePlaces: 'Live tourism places from the backend',
          localDiscovery: 'Trusted local tourism discovery',
        },
      },
    },
    pages: {
            home: {
        hero: {
          eyebrow: 'Karakalpakstan travel',
          title: 'Discover Karakalpakstan through places, routes, and local support',
          description:
            'Start with a destination, review live places, and turn the trip into a route you can use.',
          primaryCta: 'Explore destination',
          secondaryCta: 'Build route',
        },
        quickBuilder: {
          eyebrow: 'Start with a destination',
          title: 'Choose the city, add an interest, and keep moving',
          summaryBadge: 'Ready to plan',
          summaryText: 'Open the destination, browse places, or go straight to route planning.',
        },
      },guides: {
        card: {
          specialtiesLabel: 'Specializations',
          coverageLabel: 'Available cities',
          regionExpertiseLabel: 'Region expertise',
          availabilityLabel: 'Availability',
          contactAction: 'Contact guide',
        },
      },
      services: {
        card: {
          coverageLabel: 'Coverage',
          availabilityLabel: 'Availability',
          noteLabel: 'Travel note',
        },
      },
      about: {
        badge: 'About the platform',
        title:
          'Baramiz connects tourism discovery, services, and route planning in one platform flow',
        description:
          'This frontend is structured to feel like a real travel product for Karakalpakstan: destination-led, multilingual, backend-connected, and ready to scale beyond a competition demo.',
        primaryAction: 'Explore destinations',
        secondaryAction: 'Browse services',
        routeAction: 'Open route builder',
        meta: 'Tourism platform direction',
        highlightsEyebrow: 'Platform strengths',
        highlightsTitle: 'What makes the product structure realistic',
        highlightsDescription:
          'The product is positioned as a tourism platform first, while route generation stays a useful feature inside that larger journey.',
        highlights: {
          discoveryTitle: 'Destination-first travel discovery',
          discoveryDescription:
            'Baramiz is designed around how travelers actually plan a trip: choose where to go, see what matters there, and move into places, services, and navigation.',
          multilingualTitle: 'Built for four languages from the start',
          multilingualDescription:
            'The platform interface supports Karakalpak, Uzbek, Russian, and English so local and international users can navigate the experience clearly.',
          backendTitle: 'Live tourism content from the backend',
          backendDescription:
            'Places and categories are connected to backend data so the product can evolve into a real tourism platform, not a static promo page.',
        },
        flowEyebrow: 'User journey',
        flowTitle: 'How the platform is meant to be used',
        flowDescription:
          'Baramiz is strongest when users move through a clear travel journey instead of landing on a single isolated form.',
        responsibilities: {
          destinations: 'Explore destinations and understand what each region offers',
          places: 'Browse places, museums, and attractions with consistent cards and filters',
          services: 'Discover guides, transport, accommodation, and tourism services',
          routes:
            'Generate a route when the traveler is ready to move from browsing to action',
        },
      },
      notFound: {
        title: 'Page not found',
        description:
          'The page you requested is not available. Continue with destinations, services, or route planning from the main product flow.',
        adminDescription:
          'The admin page you requested does not exist or has been moved. Return to the dashboard to continue managing content.',
        adminAction: 'Open admin dashboard',
        homeAction: 'Go to home',
        destinationsAction: 'Browse destinations',
        routeAction: 'Open route builder',
      },
    },
  },
  uz: {
    common: {
      clearFilters: 'Filtrlarni tozalash',
    },
    layout: {
      navigation: {
        guides: 'Gidlar',
        about: 'Platforma haqida',
        route: 'Marshrut',
        menu: 'Navigatsiya',
      },
      footer: {
        description:
          "Qoraqalpog'iston uchun sayohat rejalash, manzillarni kashf etish va ishonchli mahalliy xizmatlar bir platformada.",
        sections: {
          explore: 'Kashf etish',
          planning: 'Sayohatni rejalash',
          value: 'Nega Baramiz',
        },
        links: {
          guidesDirectory: 'Mahalliy gidlar katalogi',
          transport: 'Mehmonxonalar, transport va turlar',
        },
        values: {
          routePlanning: 'Qulay va amaliy marshrut rejalash',
          livePlaces: "Backenddan keladigan jonli joylar",
          localDiscovery: 'Ishonchli mahalliy turizm kashfiyoti',
        },
      },
    },
    pages: {
            home: {
        hero: {
          eyebrow: "Qoraqalpog'iston sayohati",
          title: "Qoraqalpog'istonni joylar, marshrutlar va mahalliy yordam orqali kashf eting",
          description:
            "Manzilni tanlang, jonli joylarni ko'ring va safarni amalda ishlatish mumkin bo'lgan marshrutga aylantiring.",
          primaryCta: 'Manzilni ochish',
          secondaryCta: 'Marshrut qurish',
        },
        quickBuilder: {
          eyebrow: 'Manzildan boshlang',
          title: "Shaharni tanlang, qiziqishni qo'shing va davom eting",
          summaryBadge: 'Rejaga tayyor',
          summaryText: "Manzil sahifasini oching, joylarni ko'ring yoki darhol marshrut qurishga o'ting.",
        },
      },guides: {
        card: {
          specialtiesLabel: 'Mutaxassisliklar',
          coverageLabel: 'Mavjud shaharlar',
          regionExpertiseLabel: 'Hudud tajribasi',
          availabilityLabel: 'Mavjudlik',
          contactAction: 'Gid bilan bogâ€˜lanish',
        },
      },
      services: {
        card: {
          coverageLabel: 'Qamrov',
          availabilityLabel: 'Mavjudlik',
          noteLabel: 'Sayohat eslatmasi',
        },
      },
      about: {
        badge: 'Platforma haqida',
        title:
          'Baramiz turizm kashfiyoti, xizmatlar va marshrut rejalashni bitta platforma oqimida birlashtiradi',
        description:
          "Bu frontend Qoraqalpog'iston uchun haqiqiy sayohat mahsulotidek tuzilgan: manzildan boshlanadi, ko'p tilli, backend bilan bog'langan va keyingi bosqichlar uchun tayyor.",
        primaryAction: 'Manzillarni koâ€˜rish',
        secondaryAction: 'Xizmatlarni koâ€˜rish',
        routeAction: 'Marshrut tuzishni ochish',
        meta: 'Turizm platformasi yoâ€˜nalishi',
        highlightsEyebrow: 'Platforma kuchli tomonlari',
        highlightsTitle: 'Mahsulot tuzilmasini ishonchli qiladigan jihatlar',
        highlightsDescription:
          'Baramiz avvalo turizm platformasi sifatida qurilgan, marshrut tuzish esa shu katta oqim ichidagi foydali imkoniyat boâ€˜lib qoladi.',
        highlights: {
          discoveryTitle: 'Manzilga yoâ€˜naltirilgan kashfiyot',
          discoveryDescription:
            'Baramiz sayohatchi qanday rejalashini hisobga oladi: qayerga borishni tanlaydi, u yerda nima muhimligini koâ€˜radi va keyin joylar, xizmatlar hamda navigatsiyaga oâ€˜tadi.',
          multilingualTitle: 'Boshidan 4 til uchun tayyor',
          multilingualDescription:
            "Interfeys qoraqalpoq, o'zbek, rus va ingliz tillarini qo'llab-quvvatlaydi, shu sabab mahalliy va xalqaro foydalanuvchilar oqimni aniq tushunadi.",
          backendTitle: 'Backendga ulangan jonli turizm kontenti',
          backendDescription:
            "Joylar va toifalar backend ma'lumotlari bilan bog'langan, shuning uchun mahsulot statik promo sahifa emas, balki haqiqiy platformaga aylanishi mumkin.",
        },
        flowEyebrow: 'Foydalanuvchi yoâ€˜li',
        flowTitle: 'Platforma qanday ishlatilishi kerak',
        flowDescription:
          'Foydalanuvchi alohida forma ichida qolib ketmasdan, tushunarli turizm oqimi orqali harakatlanganda Baramiz eng kuchli koâ€˜rinadi.',
        responsibilities: {
          destinations: 'Manzillarni ochib, har bir hudud nimalarni taklif qilishini tushunish',
          places: 'Joylar, muzeylar va diqqatga sazovor maskanlarni kartalar va filtrlar orqali koâ€˜rish',
          services: 'Gidlar, transport, turar joy va turizm xizmatlarini topish',
          routes:
            'Foydalanuvchi koâ€˜rish bosqichidan harakat bosqichiga oâ€˜tishga tayyor boâ€˜lganda marshrut tuzish',
        },
      },
      notFound: {
        title: 'Sahifa topilmadi',
        description:
          'Siz soâ€˜ragan sahifa mavjud emas. Asosiy oqimdan manzillar, xizmatlar yoki marshrut tuzishga oâ€˜ting.',
        adminDescription:
          "Siz soâ€˜ragan admin sahifa mavjud emas yoki koâ€˜chirilgan. Kontentni boshqarishni davom ettirish uchun dashboardga qayting.",
        adminAction: 'Admin panelni ochish',
        homeAction: 'Bosh sahifaga oâ€˜tish',
        destinationsAction: 'Manzillarni koâ€˜rish',
        routeAction: 'Marshrut tuzishni ochish',
      },
    },
  },
  ru: {
    common: {
      clearFilters: 'Ð¡Ð±Ñ€Ð¾ÑÐ¸Ñ‚ÑŒ Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ñ‹',
    },
    layout: {
      navigation: {
        guides: 'Ð“Ð¸Ð´Ñ‹',
        about: 'Ðž Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ðµ',
        route: 'ÐœÐ°Ñ€ÑˆÑ€ÑƒÑ‚',
        menu: 'ÐÐ°Ð²Ð¸Ð³Ð°Ñ†Ð¸Ñ',
      },
      footer: {
        description:
          'ÐŸÐ»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¿Ð¾ÐµÐ·Ð´ÐºÐ¸, Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ð¹ Ð¸ Ð½Ð°Ð´ÐµÐ¶Ð½Ñ‹Ðµ Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ñ‹Ðµ ÑÐµÑ€Ð²Ð¸ÑÑ‹ Ð´Ð»Ñ ÐšÐ°Ñ€Ð°ÐºÐ°Ð»Ð¿Ð°ÐºÑÑ‚Ð°Ð½Ð°.',
        sections: {
          explore: 'ÐžÑ‚ÐºÑ€Ñ‹Ñ‚ÑŒ',
          planning: 'ÐŸÐ»Ð°Ð½Ð¸Ñ€ÑƒÐ¹Ñ‚Ðµ Ð¿Ð¾ÐµÐ·Ð´ÐºÑƒ',
          value: 'ÐŸÐ¾Ñ‡ÐµÐ¼Ñƒ Baramiz',
        },
        links: {
          guidesDirectory: 'ÐšÐ°Ñ‚Ð°Ð»Ð¾Ð³ Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ñ‹Ñ… Ð³Ð¸Ð´Ð¾Ð²',
          transport: 'ÐžÑ‚ÐµÐ»Ð¸, Ñ‚Ñ€Ð°Ð½ÑÐ¿Ð¾Ñ€Ñ‚ Ð¸ Ñ‚ÑƒÑ€Ñ‹',
        },
        values: {
          routePlanning: 'Ð¢ÐµÐ¿Ð»Ð¾Ðµ Ð¸ Ð¿Ñ€Ð°ÐºÑ‚Ð¸Ñ‡Ð½Ð¾Ðµ Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð°',
          livePlaces: 'Ð–Ð¸Ð²Ñ‹Ðµ Ñ‚ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ð¼ÐµÑÑ‚Ð° Ð¸Ð· backend',
          localDiscovery: 'ÐÐ°Ð´ÐµÐ¶Ð½Ð¾Ðµ Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ð¾Ðµ Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ð¹',
        },
      },
    },
    pages: {
            home: {
        hero: {
          eyebrow: 'Путешествие по Каракалпакстану',
          title: 'Откройте Каракалпакстан через места, маршруты и локальную поддержку',
          description:
            'Выберите направление, посмотрите живые места и превратите поездку в маршрут, которым реально можно пользоваться.',
          primaryCta: 'Открыть направление',
          secondaryCta: 'Построить маршрут',
        },
        quickBuilder: {
          eyebrow: 'Начните с направления',
          title: 'Выберите город, добавьте интерес и двигайтесь дальше',
          summaryBadge: 'Готово к планированию',
          summaryText: 'Откройте направление, посмотрите места или сразу переходите к построению маршрута.',
        },
      },guides: {
        card: {
          specialtiesLabel: 'Ð¡Ð¿ÐµÑ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ð¸',
          coverageLabel: 'Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ñ‹Ðµ Ð³Ð¾Ñ€Ð¾Ð´Ð°',
          regionExpertiseLabel: 'Ð­ÐºÑÐ¿ÐµÑ€Ñ‚Ð¸Ð·Ð° Ð¿Ð¾ Ñ€ÐµÐ³Ð¸Ð¾Ð½Ñƒ',
          availabilityLabel: 'Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ',
          contactAction: 'Ð¡Ð²ÑÐ·Ð°Ñ‚ÑŒÑÑ Ñ Ð³Ð¸Ð´Ð¾Ð¼',
        },
      },
      services: {
        card: {
          coverageLabel: 'ÐžÑ…Ð²Ð°Ñ‚',
          availabilityLabel: 'Ð”Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¾ÑÑ‚ÑŒ',
          noteLabel: 'Ð¡Ð¾Ð²ÐµÑ‚ Ð´Ð»Ñ Ð¿Ð¾ÐµÐ·Ð´ÐºÐ¸',
        },
      },
      about: {
        badge: 'Ðž Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ðµ',
        title:
          'Baramiz Ð¾Ð±ÑŠÐµÐ´Ð¸Ð½ÑÐµÑ‚ Ñ‚ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ¾Ðµ Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ, ÑÐµÑ€Ð²Ð¸ÑÑ‹ Ð¸ Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð° Ð² Ð¾Ð´Ð½Ð¾Ð¼ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ðµ',
        description:
          'Ð­Ñ‚Ð¾Ñ‚ frontend ÑƒÑÑ‚Ñ€Ð¾ÐµÐ½ ÐºÐ°Ðº Ñ€ÐµÐ°Ð»ÑŒÐ½Ñ‹Ð¹ Ñ‚ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚ Ð´Ð»Ñ ÐšÐ°Ñ€Ð°ÐºÐ°Ð»Ð¿Ð°ÐºÑÑ‚Ð°Ð½Ð°: Ñ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸ÐµÐ¼ Ð² Ñ†ÐµÐ½Ñ‚Ñ€Ðµ, Ð¼ÑƒÐ»ÑŒÑ‚Ð¸ÑÐ·Ñ‹Ñ‡Ð½Ð¾ÑÑ‚ÑŒÑŽ, ÑÐ²ÑÐ·ÑŒÑŽ Ñ backend Ð¸ Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚ÑŒÑŽ Ð¼Ð°ÑÑˆÑ‚Ð°Ð±Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð´Ð°Ð»ÑŒÑˆÐµ Ð´ÐµÐ¼Ð¾.',
        primaryAction: 'ÐžÑ‚ÐºÑ€Ñ‹Ñ‚ÑŒ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ',
        secondaryAction: 'Ð¡Ð¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ ÑÐµÑ€Ð²Ð¸ÑÑ‹',
        routeAction: 'ÐžÑ‚ÐºÑ€Ñ‹Ñ‚ÑŒ ÐºÐ¾Ð½ÑÑ‚Ñ€ÑƒÐºÑ‚Ð¾Ñ€ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð°',
        meta: 'Ð¢ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð°',
        highlightsEyebrow: 'Ð¡Ð¸Ð»ÑŒÐ½Ñ‹Ðµ ÑÑ‚Ð¾Ñ€Ð¾Ð½Ñ‹ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñ‹',
        highlightsTitle: 'Ð§Ñ‚Ð¾ Ð´ÐµÐ»Ð°ÐµÑ‚ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð¾Ð²ÑƒÑŽ ÑÑ‚Ñ€ÑƒÐºÑ‚ÑƒÑ€Ñƒ Ñ€ÐµÐ°Ð»Ð¸ÑÑ‚Ð¸Ñ‡Ð½Ð¾Ð¹',
        highlightsDescription:
          'Baramiz ÑÑ‚Ñ€Ð¾Ð¸Ñ‚ÑÑ ÐºÐ°Ðº Ñ‚ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð°, Ð° Ð³ÐµÐ½ÐµÑ€Ð°Ñ†Ð¸Ñ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð° Ð¾ÑÑ‚Ð°ÐµÑ‚ÑÑ Ð¿Ð¾Ð»ÐµÐ·Ð½Ð¾Ð¹ Ñ„ÑƒÐ½ÐºÑ†Ð¸ÐµÐ¹ Ð²Ð½ÑƒÑ‚Ñ€Ð¸ ÑÑ‚Ð¾Ð³Ð¾ Ð±Ð¾Ð»ÑŒÑˆÐ¾Ð³Ð¾ ÑÑ†ÐµÐ½Ð°Ñ€Ð¸Ñ.',
        highlights: {
          discoveryTitle: 'ÐžÑ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ Ð¿ÑƒÑ‚ÐµÑˆÐµÑÑ‚Ð²Ð¸Ñ Ð¾Ñ‚ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ',
          discoveryDescription:
            'Baramiz Ð¿Ð¾Ð²Ñ‚Ð¾Ñ€ÑÐµÑ‚ Ñ€ÐµÐ°Ð»ÑŒÐ½ÑƒÑŽ Ð»Ð¾Ð³Ð¸ÐºÑƒ Ð¿ÑƒÑ‚ÐµÑˆÐµÑÑ‚Ð²ÐµÐ½Ð½Ð¸ÐºÐ°: ÑÐ½Ð°Ñ‡Ð°Ð»Ð° Ð²Ñ‹Ð±Ñ€Ð°Ñ‚ÑŒ, ÐºÑƒÐ´Ð° ÐµÑ…Ð°Ñ‚ÑŒ, Ð¿Ð¾Ñ‚Ð¾Ð¼ Ð¿Ð¾Ð½ÑÑ‚ÑŒ, Ñ‡Ñ‚Ð¾ Ñ‚Ð°Ð¼ Ð²Ð°Ð¶Ð½Ð¾, Ð¸ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð·Ð°Ñ‚ÐµÐ¼ Ð¿ÐµÑ€ÐµÐ¹Ñ‚Ð¸ Ðº Ð¼ÐµÑÑ‚Ð°Ð¼, ÑÐµÑ€Ð²Ð¸ÑÐ°Ð¼ Ð¸ Ð½Ð°Ð²Ð¸Ð³Ð°Ñ†Ð¸Ð¸.',
          multilingualTitle: 'Ð¡Ñ€Ð°Ð·Ñƒ Ñ€Ð°ÑÑÑ‡Ð¸Ñ‚Ð°Ð½Ð¾ Ð½Ð° Ñ‡ÐµÑ‚Ñ‹Ñ€Ðµ ÑÐ·Ñ‹ÐºÐ°',
          multilingualDescription:
            'Ð˜Ð½Ñ‚ÐµÑ€Ñ„ÐµÐ¹Ñ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶Ð¸Ð²Ð°ÐµÑ‚ ÐºÐ°Ñ€Ð°ÐºÐ°Ð»Ð¿Ð°ÐºÑÐºÐ¸Ð¹, ÑƒÐ·Ð±ÐµÐºÑÐºÐ¸Ð¹, Ñ€ÑƒÑÑÐºÐ¸Ð¹ Ð¸ Ð°Ð½Ð³Ð»Ð¸Ð¹ÑÐºÐ¸Ð¹, Ð¿Ð¾ÑÑ‚Ð¾Ð¼Ñƒ ÐºÐ°Ðº Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ñ‹Ðµ, Ñ‚Ð°Ðº Ð¸ Ð¼ÐµÐ¶Ð´ÑƒÐ½Ð°Ñ€Ð¾Ð´Ð½Ñ‹Ðµ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ð¸ Ð¿Ð¾Ð½Ð¸Ð¼Ð°ÑŽÑ‚ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚Ð¾Ð²Ñ‹Ð¹ Ð¿Ð¾Ñ‚Ð¾Ðº.',
          backendTitle: 'Ð–Ð¸Ð²Ð¾Ð¹ Ñ‚ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚ Ð¸Ð· backend',
          backendDescription:
            'ÐœÐµÑÑ‚Ð° Ð¸ ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ð¸ Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ñ‹ Ðº backend-Ð´Ð°Ð½Ð½Ñ‹Ð¼, Ð¿Ð¾ÑÑ‚Ð¾Ð¼Ñƒ Ð¿Ñ€Ð¾Ð´ÑƒÐºÑ‚ Ð¼Ð¾Ð¶ÐµÑ‚ Ð²Ñ‹Ñ€Ð°ÑÑ‚Ð¸ Ð² Ñ€ÐµÐ°Ð»ÑŒÐ½ÑƒÑŽ Ñ‚ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÑƒÑŽ Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ñƒ, Ð° Ð½Ðµ Ð¾ÑÑ‚Ð°Ñ‚ÑŒÑÑ ÑÑ‚Ð°Ñ‚Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¿Ñ€Ð¾Ð¼Ð¾-ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†ÐµÐ¹.',
        },
        flowEyebrow: 'ÐŸÑƒÑ‚ÑŒ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»Ñ',
        flowTitle: 'ÐšÐ°Ðº Ð¿Ð»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð¾Ð¹ Ð½ÑƒÐ¶Ð½Ð¾ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÑŒÑÑ',
        flowDescription:
          'Baramiz ÑÐ¸Ð»ÑŒÐ½ÐµÐµ Ð²ÑÐµÐ³Ð¾, ÐºÐ¾Ð³Ð´Ð° Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ Ð¿Ñ€Ð¾Ñ…Ð¾Ð´Ð¸Ñ‚ Ñ‡ÐµÑ€ÐµÐ· Ð¿Ð¾Ð½ÑÑ‚Ð½Ñ‹Ð¹ Ñ‚ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ð¿ÑƒÑ‚ÑŒ, Ð° Ð½Ðµ Ð·Ð°ÑÑ‚Ñ€ÐµÐ²Ð°ÐµÑ‚ Ð² Ð¾Ð´Ð½Ð¾Ð¹ Ð¸Ð·Ð¾Ð»Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ð¾Ð¹ Ñ„Ð¾Ñ€Ð¼Ðµ.',
        responsibilities: {
          destinations: 'ÐžÑ‚ÐºÑ€Ñ‹Ð²Ð°Ñ‚ÑŒ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ Ð¸ Ð¿Ð¾Ð½Ð¸Ð¼Ð°Ñ‚ÑŒ, Ñ‡Ñ‚Ð¾ Ð¿Ñ€ÐµÐ´Ð»Ð°Ð³Ð°ÐµÑ‚ ÐºÐ°Ð¶Ð´Ñ‹Ð¹ Ñ€ÐµÐ³Ð¸Ð¾Ð½',
          places: 'Ð¡Ð¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ Ð¼ÐµÑÑ‚Ð°, Ð¼ÑƒÐ·ÐµÐ¸ Ð¸ Ð´Ð¾ÑÑ‚Ð¾Ð¿Ñ€Ð¸Ð¼ÐµÑ‡Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚Ð¸ Ñ‡ÐµÑ€ÐµÐ· ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸ Ð¸ Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ñ‹',
          services: 'ÐÐ°Ñ…Ð¾Ð´Ð¸Ñ‚ÑŒ Ð³Ð¸Ð´Ð¾Ð², Ñ‚Ñ€Ð°Ð½ÑÐ¿Ð¾Ñ€Ñ‚, Ð¿Ñ€Ð¾Ð¶Ð¸Ð²Ð°Ð½Ð¸Ðµ Ð¸ Ñ‚ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ ÑÐµÑ€Ð²Ð¸ÑÑ‹',
          routes:
            'Ð¡Ñ‚Ñ€Ð¾Ð¸Ñ‚ÑŒ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚ Ð² Ð¼Ð¾Ð¼ÐµÐ½Ñ‚, ÐºÐ¾Ð³Ð´Ð° Ð¿ÑƒÑ‚ÐµÑˆÐµÑÑ‚Ð²ÐµÐ½Ð½Ð¸Ðº Ð³Ð¾Ñ‚Ð¾Ð² Ð¿ÐµÑ€ÐµÐ¹Ñ‚Ð¸ Ð¾Ñ‚ Ð¿Ñ€Ð¾ÑÐ¼Ð¾Ñ‚Ñ€Ð° Ðº Ð´ÐµÐ¹ÑÑ‚Ð²Ð¸ÑŽ',
        },
      },
      notFound: {
        title: 'Ð¡Ñ‚Ñ€Ð°Ð½Ð¸Ñ†Ð° Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ð°',
        description:
          'Ð—Ð°Ð¿Ñ€Ð¾ÑˆÐµÐ½Ð½Ð°Ñ ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ð° Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð°. ÐŸÑ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ñ‚Ðµ Ñ‡ÐµÑ€ÐµÐ· Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ, ÑÐµÑ€Ð²Ð¸ÑÑ‹ Ð¸Ð»Ð¸ Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð°.',
        adminDescription:
          'Ð—Ð°Ð¿Ñ€Ð¾ÑˆÐµÐ½Ð½Ð°Ñ Ð°Ð´Ð¼Ð¸Ð½-ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ð° Ð½Ðµ ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÐµÑ‚ Ð¸Ð»Ð¸ Ð±Ñ‹Ð»Ð° Ð¿ÐµÑ€ÐµÐ¼ÐµÑ‰ÐµÐ½Ð°. Ð’ÐµÑ€Ð½Ð¸Ñ‚ÐµÑÑŒ Ð² dashboard, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð¿Ñ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ñ‚ÑŒ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÐ¾Ð½Ñ‚ÐµÐ½Ñ‚Ð¾Ð¼.',
        adminAction: 'ÐžÑ‚ÐºÑ€Ñ‹Ñ‚ÑŒ Ð°Ð´Ð¼Ð¸Ð½-Ð¿Ð°Ð½ÐµÐ»ÑŒ',
        homeAction: 'ÐÐ° Ð³Ð»Ð°Ð²Ð½ÑƒÑŽ',
        destinationsAction: 'Ð¡Ð¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ',
        routeAction: 'ÐžÑ‚ÐºÑ€Ñ‹Ñ‚ÑŒ ÐºÐ¾Ð½ÑÑ‚Ñ€ÑƒÐºÑ‚Ð¾Ñ€ Ð¼Ð°Ñ€ÑˆÑ€ÑƒÑ‚Ð°',
      },
    },
  },
  kaa: {
    common: {
      clearFilters: 'Filtrlerdi tazalaw',
    },
    layout: {
      navigation: {
        guides: 'Gidler',
        about: 'Platforma haqqinda',
        route: 'Marshrut',
        menu: 'Navigatsiya',
      },
      footer: {
        description:
          'Qaraqalpaqstan ushin sayahat josparlaw, manzil ashiw ham isenimli lokal xizmetler bir platformada.',
        sections: {
          explore: 'Ashiw',
          planning: 'Sayahatti josparlaw',
          value: 'Ne ushin Baramiz',
        },
        links: {
          guidesDirectory: 'Lokal gidler katalogi',
          transport: 'Oteller, transport ham turlar',
        },
        values: {
          routePlanning: 'Jili ham ameliy marshrut josparlaw',
          livePlaces: 'Backendten kelgen tiris orinler',
          localDiscovery: 'Isenimli lokal turizm ashiwi',
        },
      },
    },
    pages: {
            home: {
        hero: {
          eyebrow: 'Qaraqalpaqstan sayahati',
          title: 'Qaraqalpaqstanni orinler, marshrutlar hám lokal qollaw arqali ashiń',
          description:
            'Manzildi tańlań, tiris orinlerdi kóriń hám sayahatti paydalanıwǵa bolatugin marshrutqa aylantırıń.',
          primaryCta: 'Manzildi ashiw',
          secondaryCta: 'Marshrut qurıw',
        },
        quickBuilder: {
          eyebrow: 'Manzilden baslań',
          title: 'Qalani tańlań, qızıǵıw qosiń hám dawam etiń',
          summaryBadge: 'Josparda tayar',
          summaryText: 'Manzil betin ashiń, orinlerdi kóriń yamasa birden marshrut qurıwǵa ótiń.',
        },
      },guides: {
        card: {
          specialtiesLabel: 'Mutaxassislikler',
          coverageLabel: 'Mavjud qalalar',
          regionExpertiseLabel: 'Region tajiriybesi',
          availabilityLabel: 'Mavjudlik',
          contactAction: 'Gid menen baylanisiw',
        },
      },
      services: {
        card: {
          coverageLabel: 'Qamrov',
          availabilityLabel: 'Mavjudlik',
          noteLabel: 'Sayahat eslatpesi',
        },
      },
      about: {
        badge: 'Platforma haqqinda',
        title:
          'Baramiz turizm ashiwin, xizmetlerdi ham marshrut josparlawdi bir platforma agiminda birlestiredi',
        description:
          'Bul frontend Qaraqalpaqstan ushin haqiyqiy travel-onim siyaqli qurilgan: manzilge bagdarlangan, kop tilli, backend penen baylanisqan ham keyingi osiw ushin tayar.',
        primaryAction: 'Manzillerdi koriw',
        secondaryAction: 'Xizmetlerdi koriw',
        routeAction: 'Marshrut quruwdi ashiw',
        meta: 'Turizm platformasi bagdari',
        highlightsEyebrow: 'Platforma kusli jaqlari',
        highlightsTitle: 'Onim dizilisin isenimli etetin jaqlar',
        highlightsDescription:
          'Baramiz avval turizm platformasi retinde quriladi, marshrut quruw bolsa usi ulken agim ishindegi paydali funkciya bolip qaladi.',
        highlights: {
          discoveryTitle: 'Manzil birinshi orinda turatugin ashiw',
          discoveryDescription:
            'Baramiz sayahatshining haqiyqiy qararina say qurilgan: avval qayerge baratinin tanlaydi, keyin sol jerde ne magizli ekenin koredi ham odan son orinlerge, xizmetlerge ham navigatsiyaga otedi.',
          multilingualTitle: 'Basinnan 4 til ushin tayar',
          multilingualDescription:
            'Interfeys qaraqalpaq, ozbek, rus ham inglis tillerin qollaydi, sonliqdan lokal ham xaliqaraliq paydalaniwshilar agimdi aniq tusinedi.',
          backendTitle: 'Backendten kelgen tiris turizm kontenti',
          backendDescription:
            'Orinler ham kategoriyalar backend magliwmatlari menen baylanisqan, sonliqdan onim statik promo bet emes, haqiyqiy turizm platformasina aynaliwi mumkin.',
        },
        flowEyebrow: 'Paydalaniwshi joly',
        flowTitle: 'Platforma qalay qollaniliwi kerek',
        flowDescription:
          'Paydalaniwshi jeke bir forma ishinde qalmay, tusinikli turizm agimi arqali harakatlanganda Baramiz en kusli korinedi.',
        responsibilities: {
          destinations: 'Manzillerdi aship, har bir region ne usinatin tusiniw',
          places: 'Orinlerdi, muzeylerdi ham diqqatqa sazawar jaylardi kartalar ham filtrler arqali koriw',
          services: 'Gidlerdi, transportti, turar jaydi ham turizm xizmetlerin tabiw',
          routes:
            'Sayahatshi koriw basqishinan ameliy areketke otiwge tayar bolganda marshrut quruw',
        },
      },
      notFound: {
        title: 'Bet tabilmadi',
        description:
          'Suralgan bet joq. Tiykargi agim arqali manzillerge, xizmetlerge yamasa marshrut quruwga otin.',
        adminDescription:
          'Suralgan admin beti joq yamasa koshirildi. Kontentti basqariwdi dawam ettiriw ushin dashboardqa qaytin.',
        adminAction: 'Admin paneldi ashiw',
        homeAction: 'Bas betke qaytiw',
        destinationsAction: 'Manzillerdi koriw',
        routeAction: 'Marshrut quruwdi ashiw',
      },
    },
  },
};

const enHome = (structuredResources.en as { pages: { home: Record<string, unknown> } }).pages.home;
const uzHome = (structuredResources.uz as { pages: { home: Record<string, unknown> } }).pages.home;
const ruHome = (structuredResources.ru as { pages: { home: Record<string, unknown> } }).pages.home;
const kaaHome = (structuredResources.kaa as { pages: { home: Record<string, unknown> } }).pages.home;

enHome.hero = {
  ...(enHome.hero as Record<string, unknown>),
  title: 'Explore Karakalpakstan with routes and local support',
  description: 'Choose a destination, open live places, and plan the trip in a few taps.',
};
uzHome.hero = {
  ...(uzHome.hero as Record<string, unknown>),
  title: "Qoraqalpog'istonni marshrutlar va mahalliy yordam bilan kashf eting",
  description: "Manzilni tanlang, jonli joylarni oching va sayohatni bir necha qadamda rejalang.",
};
ruHome.hero = {
  ...(ruHome.hero as Record<string, unknown>),
  title: 'Откройте Каракалпакстан через маршруты и локальную поддержку',
  description: 'Выберите направление, откройте живые места и спланируйте поездку за несколько шагов.',
};
kaaHome.hero = {
  ...(kaaHome.hero as Record<string, unknown>),
  title: 'Qaraqalpaqstanni marshrutlar ham lokal qollaw menen ashiń',
  description: 'Manzildi tańlań, tiris orinlerdi ashiń ham sayahatti birneshe qadamda josparlań.',
};

enHome.quickBuilder = {
  ...(enHome.quickBuilder as Record<string, unknown>),
  eyebrow: 'Plan fast',
  title: 'Choose a city, add an interest, and go',
  summaryBadge: 'Next step',
  summaryText: 'Open the destination, browse places, or go straight to the route.',
};
uzHome.quickBuilder = {
  ...(uzHome.quickBuilder as Record<string, unknown>),
  eyebrow: 'Tez reja',
  title: "Shaharni tanlang, qiziqishni qo'shing va davom eting",
  summaryBadge: 'Keyingi qadam',
  summaryText: "Manzilni oching, joylarni ko'ring yoki to'g'ridan-to'g'ri marshrutga o'ting.",
};
ruHome.quickBuilder = {
  ...(ruHome.quickBuilder as Record<string, unknown>),
  eyebrow: 'Быстрый старт',
  title: 'Выберите город, добавьте интерес и двигайтесь дальше',
  summaryBadge: 'Следующий шаг',
  summaryText: 'Откройте направление, посмотрите места или сразу переходите к маршруту.',
};
kaaHome.quickBuilder = {
  ...(kaaHome.quickBuilder as Record<string, unknown>),
  eyebrow: 'Tez baslaw',
  title: 'Qalani tańlań, qızıǵıwdı qosiń hám dawam etiń',
  summaryBadge: 'Keyingi qadam',
  summaryText: 'Manzildi ashiń, orinlerdi kóriń yamasa birden marshrutqa ótiń.',
};

Object.assign(enHome, {
  discover: {
    eyebrow: 'Start exploring',
    title: 'Pick a destination or open live places',
    destinationsLabel: 'Featured destinations',
    placesLabel: 'Live place highlights',
  },
  support: {
    eyebrow: 'Local support',
    title: 'Find stays, transport, and people who know the region',
    servicesLabel: 'Popular services',
    guidesLabel: 'Local guides',
  },
  story: {
    eyebrow: 'Why Baramiz',
    title: 'Built for real travel decisions',
    stepsEyebrow: 'How it works',
    stepsTitle: 'Three clear moves into a route',
    pillars: {
      discoveryTitle: 'Destination-first discovery',
      discoveryDescription: 'Start with where to go, then move into places and routes.',
      supportTitle: 'Local support in the same flow',
      supportDescription: 'Guides, stays, transport, and tours stay close to the trip.',
      contextTitle: 'Regional context stays visible',
      contextDescription: 'Museums, heritage, and local identity are not flattened away.',
    },
    steps: {
      destinationTitle: 'Pick the destination',
      destinationDescription: 'Start with Nukus, Moynaq, or another city that fits the trip.',
      interestsTitle: 'Add what matters',
      interestsDescription: 'Mix history, museums, nature, food, and local culture.',
      resultTitle: 'Move into the route',
      resultDescription: 'Open the plan, review stops, and continue into navigation.',
    },
  },
  final: {
    eyebrow: 'Ready to start?',
    title: 'Start with a place. Leave with a route.',
    description: 'Open the destination now or jump straight into planning.',
  },
});

Object.assign(uzHome, {
  discover: {
    eyebrow: 'Kashf etishni boshlang',
    title: "Manzilni tanlang yoki jonli joylarni oching",
    destinationsLabel: 'Tavsiya etilgan manzillar',
    placesLabel: 'Jonli joylar tanlovi',
  },
  support: {
    eyebrow: 'Mahalliy yordam',
    title: "Mehmonxona, transport va hududni biladigan odamlarni toping",
    servicesLabel: 'Ommabop xizmatlar',
    guidesLabel: 'Mahalliy gidlar',
  },
  story: {
    eyebrow: 'Nega Baramiz',
    title: 'Haqiqiy sayohat qarorlari uchun qurilgan',
    stepsEyebrow: 'Qanday ishlaydi',
    stepsTitle: 'Marshrutga olib boradigan uch qadam',
    pillars: {
      discoveryTitle: 'Manzil birinchi turadi',
      discoveryDescription: "Avval qayerga borishni tanlaysiz, keyin joylar va marshrutga o'tasiz.",
      supportTitle: 'Mahalliy yordam shu oqimning ichida',
      supportDescription: "Gid, transport, turar joy va turlar sayohatning yonida qoladi.",
      contextTitle: 'Hududiy kontekst saqlanadi',
      contextDescription: 'Muzeylar, meros va mahalliy ruh yoqolib ketmaydi.',
    },
    steps: {
      destinationTitle: 'Manzilni tanlang',
      destinationDescription: "Safarga mos Nukus, Moynaq yoki boshqa shahardan boshlang.",
      interestsTitle: 'Muhim qiziqishlarni qo\'shing',
      interestsDescription: 'Tarix, muzey, tabiat, taom va madaniyatni birlashtiring.',
      resultTitle: 'Marshrutga o\'ting',
      resultDescription: 'Rejani oching, bekatlarni ko\'ring va navigatsiyaga davom eting.',
    },
  },
  final: {
    eyebrow: 'Boshlashga tayyormisiz?',
    title: 'Joydan boshlang. Marshrut bilan chiqing.',
    description: 'Hozir manzilni oching yoki to\'g\'ridan-to\'g\'ri rejalashga o\'ting.',
  },
});

Object.assign(ruHome, {
  discover: {
    eyebrow: 'Начните с открытия',
    title: 'Выберите направление или откройте живые места',
    destinationsLabel: 'Рекомендуемые направления',
    placesLabel: 'Подборка живых мест',
  },
  support: {
    eyebrow: 'Локальная поддержка',
    title: 'Найдите проживание, транспорт и людей, которые знают регион',
    servicesLabel: 'Популярные сервисы',
    guidesLabel: 'Локальные гиды',
  },
  story: {
    eyebrow: 'Почему Baramiz',
    title: 'Платформа для реальных решений в поездке',
    stepsEyebrow: 'Как это работает',
    stepsTitle: 'Три понятных шага к маршруту',
    pillars: {
      discoveryTitle: 'Открытие начинается с направления',
      discoveryDescription: 'Сначала выбираете куда ехать, потом переходите к местам и маршруту.',
      supportTitle: 'Локальная поддержка внутри того же пути',
      supportDescription: 'Гиды, транспорт, проживание и туры остаются рядом с поездкой.',
      contextTitle: 'Региональный контекст не теряется',
      contextDescription: 'Музеи, наследие и локальная идентичность остаются видимыми.',
    },
    steps: {
      destinationTitle: 'Выберите направление',
      destinationDescription: 'Начните с Нукуса, Муйнака или другого города под ваш маршрут.',
      interestsTitle: 'Добавьте главное',
      interestsDescription: 'Смешайте историю, музеи, природу, еду и локальную культуру.',
      resultTitle: 'Перейдите к маршруту',
      resultDescription: 'Откройте план, посмотрите остановки и двигайтесь в навигацию.',
    },
  },
  final: {
    eyebrow: 'Готовы начать?',
    title: 'Начните с места. Уйдите с маршрутом.',
    description: 'Откройте направление сейчас или сразу переходите к планированию.',
  },
});

Object.assign(kaaHome, {
  discover: {
    eyebrow: 'Ashiwdi baslań',
    title: 'Manzildi tańlań yamasa tiris orinlerdi ashiń',
    destinationsLabel: 'Usınılǵan manziller',
    placesLabel: 'Tiris orinler toplami',
  },
  support: {
    eyebrow: 'Lokal qollaw',
    title: 'Turar jay, transport hám regiondi biletugin adamlardı tabıń',
    servicesLabel: 'Kóp qollanılatuǵın xızmetler',
    guidesLabel: 'Lokal gidler',
  },
  story: {
    eyebrow: 'Ne ushin Baramiz',
    title: 'Haqıyqıy sayahat qararlari ushin qurılǵan',
    stepsEyebrow: 'Qalay isleydi',
    stepsTitle: 'Marshrutqa alıp baratuǵın úsh qadam',
    pillars: {
      discoveryTitle: 'Manzil birinshi turadı',
      discoveryDescription: 'Avval qayerge barıwdı tańlaysız, keyin orinlerge hám marshrutqa ótesiz.',
      supportTitle: 'Lokal qollaw usi aǵım ishinde',
      supportDescription: 'Gidler, transport, turar jay hám turlar sayahat penen birge turadı.',
      contextTitle: 'Region konteksti joǵalıp ketpeydi',
      contextDescription: 'Muzeyler, miyras hám lokal ruh kórinip turadı.',
    },
    steps: {
      destinationTitle: 'Manzildi tańlań',
      destinationDescription: 'Saparga say Nukus, Moynaq yamasa basqa qaladan baslań.',
      interestsTitle: 'Mázmunlı qızıǵıwdı qosiń',
      interestsDescription: 'Tarix, muzey, tábiǵat, taǵam hám mádeniyatti birlestiriń.',
      resultTitle: 'Marshrutqa ótiń',
      resultDescription: 'Josparnı ashiń, toqtawlardı kóriń hám navigatsiyaǵa dawam etiń.',
    },
  },
  final: {
    eyebrow: 'Baslawǵa tayarsız ba?',
    title: 'Orinnen baslań. Marshrut penen shıǵıń.',
    description: 'Házir manzildi ashiń yamasa birden josparlawǵa ótiń.',
  },
});

const enPages = (structuredResources.en as { pages: Record<string, unknown> }).pages;
const uzPages = (structuredResources.uz as { pages: Record<string, unknown> }).pages;
const ruPages = (structuredResources.ru as { pages: Record<string, unknown> }).pages;
const kaaPages = (structuredResources.kaa as { pages: Record<string, unknown> }).pages;

Object.assign(enPages, {
  travelAssistant: {
    suggestionsLabel: 'Quick prompts',
    submit: 'Ask assistant',
    replyTitle: 'Assistant reply',
    sourceLive: 'Live backend reply',
    sourceFallback: 'Fallback backend reply',
    error:
      'The assistant could not respond right now. You can still continue with route planning and place browsing.',
  },
  appNav: {
    home: 'Home',
    explore: 'Explore',
    route: 'Route',
    guides: 'Guides',
  },
  appLayout: {
    subtitle: 'Travel app',
  },
  appIntro: {
    splashTagline: 'Karakalpakstan travel app',
    languageEyebrow: 'Language',
    languageTitle: 'Choose app language',
    languageDescription: 'You can change it later from the app header.',
    languageContinue: 'Continue with current language',
    onboarding: {
      badge: 'Getting started',
      skip: 'Skip',
      next: 'Next',
      start: 'Start app',
      step1: {
        title: 'Discover real destinations',
        description: 'Start from where to go, not from a complicated form.',
      },
      step2: {
        title: 'Build a practical route',
        description: 'Use interests and travel style to generate useful stops.',
      },
      step3: {
        title: 'Use local support',
        description: 'Guides, stays, and services stay close to every route.',
      },
    },
  },
  appHome: {
    greeting: 'Good to see you',
    hero: {
      eyebrow: 'Baramiz app',
      title: 'Find places fast and turn them into a route',
      description: 'Explore destination highlights, then continue into route planning.',
    },
    filters: {
      title: 'Quick search',
      searchPlaceholder: 'Museum, fortress, food, nature...',
    },
    categories: {
      all: 'All categories',
    },
    routeEntry: {
      title: 'Quick route entry',
      button: 'Build from this destination',
    },
    featured: {
      title: 'Featured places',
    },
    destinations: {
      title: 'Top destinations',
    },
    support: {
      servicesEyebrow: 'Support',
      servicesTitle: 'Local support nearby',
      servicesDescription: '{{services}} services and {{guides}} guides available.',
    },
  },
});

Object.assign(uzPages, {
  travelAssistant: {
    suggestionsLabel: 'Tez promptlar',
    submit: 'Yordamchidan so‘rash',
    replyTitle: 'Yordamchi javobi',
    sourceLive: 'Backenddan jonli javob',
    sourceFallback: 'Backend fallback javobi',
    error:
      'Yordamchi hozir javob bera olmadi. Siz marshrut qurish va joylarni ko‘rishda davom etishingiz mumkin.',
  },
  appNav: {
    home: 'Bosh sahifa',
    explore: 'Kashf etish',
    route: 'Marshrut',
    guides: 'Gidlar',
  },
  appLayout: {
    subtitle: 'Sayohat ilovasi',
  },
  appIntro: {
    splashTagline: "Qoraqalpog'iston sayohat ilovasi",
    languageEyebrow: 'Til',
    languageTitle: 'Ilova tilini tanlang',
    languageDescription: 'Keyinroq app header orqali o‘zgartirishingiz mumkin.',
    languageContinue: 'Joriy til bilan davom etish',
    onboarding: {
      badge: 'Boshlash',
      skip: "O'tkazib yuborish",
      next: 'Keyingi',
      start: 'Ilovani boshlash',
      step1: {
        title: 'Haqiqiy manzillarni kashf eting',
        description: 'Murakkab formadan emas, manzildan boshlang.',
      },
      step2: {
        title: 'Amaliy marshrut tuzing',
        description: 'Qiziqish va sayohat uslubiga qarab foydali bekatlar oling.',
      },
      step3: {
        title: 'Mahalliy yordamdan foydalaning',
        description: 'Gidlar va xizmatlar marshrut bilan birga bo‘ladi.',
      },
    },
  },
  appHome: {
    greeting: 'Sizni yana ko‘rganimizdan xursandmiz',
    hero: {
      eyebrow: 'Baramiz ilovasi',
      title: 'Joylarni tez toping va marshrutga aylantiring',
      description: 'Manzil punktlarini ko‘ring, so‘ng marshrut rejalashga o‘ting.',
    },
    filters: {
      title: 'Tez qidiruv',
      searchPlaceholder: 'Muzey, qalʼa, taom, tabiat...',
    },
    categories: {
      all: 'Barcha kategoriyalar',
    },
    routeEntry: {
      title: 'Tez marshrut kirishi',
      button: 'Shu manzil bo‘yicha qurish',
    },
    featured: {
      title: 'Tavsiya etilgan joylar',
    },
    destinations: {
      title: 'Top manzillar',
    },
    support: {
      servicesEyebrow: 'Yordam',
      servicesTitle: 'Mahalliy yordam yaqin',
      servicesDescription: '{{services}} ta xizmat va {{guides}} ta gid mavjud.',
    },
  },
});

Object.assign(ruPages, {
  travelAssistant: {
    suggestionsLabel: 'Быстрые запросы',
    submit: 'Спросить помощника',
    replyTitle: 'Ответ помощника',
    sourceLive: 'Ответ от backend',
    sourceFallback: 'Резервный ответ backend',
    error:
      'Помощник сейчас не может ответить. Вы все равно можете продолжить построение маршрута и просмотр мест.',
  },
  appNav: {
    home: 'Главная',
    explore: 'Обзор',
    route: 'Маршрут',
    guides: 'Гиды',
  },
  appLayout: {
    subtitle: 'Тревел-приложение',
  },
  appIntro: {
    splashTagline: 'Тревел-приложение Каракалпакстана',
    languageEyebrow: 'Язык',
    languageTitle: 'Выберите язык приложения',
    languageDescription: 'Позже язык можно изменить в шапке приложения.',
    languageContinue: 'Продолжить с текущим языком',
    onboarding: {
      badge: 'Старт',
      skip: 'Пропустить',
      next: 'Далее',
      start: 'Открыть приложение',
      step1: {
        title: 'Откройте реальные направления',
        description: 'Начинайте с места поездки, а не со сложной формы.',
      },
      step2: {
        title: 'Соберите практичный маршрут',
        description: 'Интересы и стиль поездки помогут получить полезные остановки.',
      },
      step3: {
        title: 'Используйте локальную поддержку',
        description: 'Гиды, проживание и сервисы остаются рядом с маршрутом.',
      },
    },
  },
  appHome: {
    greeting: 'Рады снова вас видеть',
    hero: {
      eyebrow: 'Приложение Baramiz',
      title: 'Быстро находите места и собирайте маршрут',
      description: 'Откройте ключевые точки и переходите к планированию маршрута.',
    },
    filters: {
      title: 'Быстрый поиск',
      searchPlaceholder: 'Музей, крепость, еда, природа...',
    },
    categories: {
      all: 'Все категории',
    },
    routeEntry: {
      title: 'Быстрый вход в маршрут',
      button: 'Построить по этому направлению',
    },
    featured: {
      title: 'Рекомендуемые места',
    },
    destinations: {
      title: 'Топ-направления',
    },
    support: {
      servicesEyebrow: 'Поддержка',
      servicesTitle: 'Локальная помощь рядом',
      servicesDescription: '{{services}} сервисов и {{guides}} гидов доступны.',
    },
  },
});

Object.assign(kaaPages, {
  travelAssistant: {
    suggestionsLabel: 'Tez sorawlar',
    submit: 'Jardemshiden soraw',
    replyTitle: 'Jardemshi juwabi',
    sourceLive: 'Backendten tiris juwap',
    sourceFallback: 'Backend fallback juwabi',
    error:
      'Jardemshi házir juwap bere almadı. Siz marshrut qurıw hám orinlerdi kóriwdi dawam ettire alasız.',
  },
  appNav: {
    home: 'Bas bet',
    explore: 'Ashiw',
    route: 'Marshrut',
    guides: 'Gidler',
  },
  appLayout: {
    subtitle: 'Sayahat ilovasi',
  },
  appIntro: {
    splashTagline: 'Qaraqalpaqstan sayahat ilovasi',
    languageEyebrow: 'Til',
    languageTitle: 'Ilova tilin tańlań',
    languageDescription: 'Keyin app header arqali ózgertseńiz boladi.',
    languageContinue: 'Aǵımdagı til menen dawam etiw',
    onboarding: {
      badge: 'Baslaw',
      skip: 'Ótkizip jiberiw',
      next: 'Keyingi',
      start: 'Ilovani baslaw',
      step1: {
        title: 'Haqıyqıy manzillerdi ashıń',
        description: 'Qıyın formadan emes, manzilden baslań.',
      },
      step2: {
        title: 'Ameliy marshrut quriń',
        description: 'Qızıǵıw ham sayahat stili paydalı toqtawlardı beredi.',
      },
      step3: {
        title: 'Lokal qollawdı qollanıń',
        description: 'Gidler, turar jay ham xızmetler marshrutpen birge boladı.',
      },
    },
  },
  appHome: {
    greeting: 'Sizdi qayta kórgenimizge quwanamız',
    hero: {
      eyebrow: 'Baramiz ilovasi',
      title: 'Orinlerdi tez tabıń ham marshrutqa aylantırıń',
      description: 'Manzil punktlerin kóriń, keyin marshrut josparlawǵa ótiń.',
    },
    filters: {
      title: 'Tez izlew',
      searchPlaceholder: 'Muzey, qorgan, taǵam, tábiǵat...',
    },
    categories: {
      all: 'Barlyq kategoriyalar',
    },
    routeEntry: {
      title: 'Tez marshrut kirisi',
      button: 'Usi manzil boyinsha quriw',
    },
    featured: {
      title: 'Usınılǵan orinler',
    },
    destinations: {
      title: 'Top manziller',
    },
    support: {
      servicesEyebrow: 'Qollaw',
      servicesTitle: 'Lokal qollaw jaqın',
      servicesDescription: '{{services}} xızmet hám {{guides}} gid bar.',
    },
  },
});
