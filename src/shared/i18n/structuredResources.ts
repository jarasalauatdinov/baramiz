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
    profile: 'Profile',
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
    profile: 'Profil',
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
    profile: 'Профиль',
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
    profile: 'Profil',
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

Object.assign(enPages, {
  auth: {
    integration: 'Baramiz now signs you in through the backend API and keeps your traveler profile in sync.',
    gate: {
      continueBrowsing: 'Continue browsing',
      booking: {
        badge: 'Continue booking',
        title: 'Sign in to continue this protected step',
        description: 'You can explore the app freely. Login is only needed for bookings, payments, and saved actions.',
      },
      payment: {
        badge: 'Continue payment',
        title: 'Sign in before payment',
        description: 'Your booking context will stay in place. Login is needed only before the protected payment step.',
      },
      saveRoute: {
        badge: 'Save route',
        title: 'Sign in to save this route',
        description: 'Browsing stays open without login. We only ask when you want to keep routes for later.',
      },
      guide: {
        badge: 'Request guide',
        title: 'Sign in to request a local guide',
        description: 'We only ask now because guide requests need traveler details and a clear follow-up channel.',
      },
      service: {
        badge: 'Request service',
        title: 'Sign in to request this service',
        description: 'Your browsing stays open. Login is only needed when you move into booking or local support.',
      },
    },
    fields: {
      fullName: 'Full name',
      email: 'Email',
      password: 'Password',
    },
    login: {
      badge: 'Welcome back',
      title: 'Sign in to continue planning',
      description: 'Open your routes, bookings, and saved discovery flow in one place.',
      submit: 'Sign in',
      createAccount: 'Create account',
      switchAction: 'Need an account? Register',
      error: 'Enter email and password to continue.',
    },
    register: {
      badge: 'Create account',
      title: 'Start with a simple traveler profile',
      description: 'This keeps the app personal and makes bookings feel like part of one product flow.',
      submit: 'Create account',
      switchAction: 'Already have an account? Sign in',
      haveAccount: 'Back to sign in',
      fullNamePlaceholder: 'Aizada Nurymbetova',
      error: 'Fill in your name, email, and password first.',
    },
  },
  booking: {
    common: {
      backToBrowse: 'Back to browsing',
      backToBooking: 'Back to booking details',
      backToReview: 'Back to review',
      bookNow: 'Request booking',
    },
    source: {
      service: 'Service booking',
      guide: 'Guide booking',
      route: 'Route support',
    },
    empty: {
      badge: 'Booking flow',
      title: 'Start from a service, guide, or route support card',
      description: 'Once you choose a booking entry point, the request will continue here.',
    },
    fields: {
      phone: 'Phone number',
      travelDate: 'Travel date',
      guests: 'Guests',
      contactMethod: 'Preferred contact method',
      note: 'Trip note',
    },
    contact: {
      phone: 'Phone',
      telegram: 'Telegram',
      email: 'Email',
    },
    details: {
      eyebrow: 'Booking request',
      title: 'Share the trip details',
      description: 'Keep it short. Local support will use this to confirm the reservation.',
      validation: 'Add traveler details, phone, and travel date before continuing.',
      continue: 'Review request',
    },
    review: {
      eyebrow: 'Review request',
      title: 'Check the details once',
      description: 'This is still an MVP request flow, so the summary stays short and clear.',
      travelerTitle: 'Traveler details',
      guests_one: '1 guest',
      guests_other: '{{count}} guests',
      mvpTitle: 'What happens next',
      mvpDescription: 'Baramiz records the reservation request now and leaves final confirmation to local support.',
      continue: 'Choose payment method',
    },
    payment: {
      eyebrow: 'Payment preference',
      title: 'Select how you want to pay',
      description: 'Choose the payment method you prefer when support confirms the booking.',
      methods: {
        visa: 'Visa / bank card',
        humo: 'Humo / local card',
        cash: 'Pay on confirmation',
      },
      mvpNotice: 'This MVP does not process live payments yet. The selected method is saved as a preference for support follow-up.',
      confirm: 'Send booking request',
    },
    confirmation: {
      eyebrow: 'Request sent',
      title: 'Your booking request is in progress',
      description: 'The request is stored and ready for local follow-up.',
      pending: 'Pending support confirmation',
      reference: 'Reference',
      nextTitle: 'What to expect',
      next1: 'Local support will review the request details and preferred payment method.',
      next2: 'The traveler will be contacted through the selected channel for final confirmation.',
      next3: 'The final operational booking API can be connected later without rebuilding this flow.',
      back: 'Back to app',
      home: 'Open home',
    },
  },
  appHome: {
    greetingWithName: 'Welcome back, {{name}}',
  },
});

Object.assign(uzPages, {
  auth: {
    integration: 'Baramiz endi backend auth API orqali kirishni boshqaradi va traveler profilingizni sinxron saqlaydi.',
    gate: {
      continueBrowsing: 'Ko‘rishda davom etish',
      booking: {
        badge: 'Bronni davom ettirish',
        title: 'Bu himoyalangan qadamni davom ettirish uchun kiring',
        description: 'Ilovani erkin ko‘rishingiz mumkin. Login faqat bron, to‘lov va saqlash kabi harakatlarda kerak bo‘ladi.',
      },
      payment: {
        badge: 'To‘lovni davom ettirish',
        title: 'To‘lovdan oldin kiring',
        description: 'Bron konteksti saqlanadi. Login faqat himoyalangan to‘lov bosqichidan oldin kerak bo‘ladi.',
      },
      saveRoute: {
        badge: 'Marshrutni saqlash',
        title: 'Bu marshrutni saqlash uchun kiring',
        description: 'Ko‘rish uchun login kerak emas. Biz faqat marshrutni keyinga saqlamoqchi bo‘lsangiz so‘raymiz.',
      },
      guide: {
        badge: 'Gid so‘rovi',
        title: 'Mahalliy gid so‘rash uchun kiring',
        description: 'Bu bosqichda traveler ma’lumoti va bog‘lanish kanali kerak bo‘lgani uchun login so‘raladi.',
      },
      service: {
        badge: 'Xizmat so‘rovi',
        title: 'Bu xizmatni so‘rash uchun kiring',
        description: 'Ko‘rish davom etadi. Login faqat bron yoki mahalliy yordam bosqichiga o‘tganda kerak bo‘ladi.',
      },
    },
    fields: {
      fullName: 'To‘liq ism',
      email: 'Email',
      password: 'Parol',
    },
    login: {
      badge: 'Qaytganingizdan xursandmiz',
      title: 'Rejalashni davom ettirish uchun kiring',
      description: 'Marshrutlar, bronlar va kashfiyot oqimini bitta joyda oching.',
      submit: 'Kirish',
      createAccount: 'Hisob yaratish',
      switchAction: 'Hisob yo‘qmi? Ro‘yxatdan o‘ting',
      error: 'Davom etish uchun email va parol kiriting.',
    },
    register: {
      badge: 'Hisob yaratish',
      title: 'Oddiy traveler profilidan boshlang',
      description: 'Bu ilovani shaxsiyroq qiladi va bron oqimini bitta mahsulot ichida ushlab turadi.',
      submit: 'Hisob yaratish',
      switchAction: 'Hisob bormi? Kiring',
      haveAccount: 'Kirishga qaytish',
      fullNamePlaceholder: 'Ayzada Nurymbetova',
      error: 'Avval ism, email va parolni to‘ldiring.',
    },
  },
  booking: {
    common: {
      backToBrowse: 'Ko‘rishga qaytish',
      backToBooking: 'Bron tafsilotlariga qaytish',
      backToReview: 'Ko‘rib chiqishga qaytish',
      bookNow: 'Bron so‘rovi',
    },
    source: {
      service: 'Xizmat broni',
      guide: 'Gid broni',
      route: 'Marshrut yordami',
    },
    empty: {
      badge: 'Bron oqimi',
      title: 'Xizmat, gid yoki marshrut yordami kartasidan boshlang',
      description: 'Bron kirish nuqtasini tanlaganingizdan keyin so‘rov shu yerda davom etadi.',
    },
    fields: {
      phone: 'Telefon raqam',
      travelDate: 'Safar sanasi',
      guests: 'Mehmonlar',
      contactMethod: 'Bog‘lanish usuli',
      note: 'Safar eslatmasi',
    },
    contact: {
      phone: 'Telefon',
      telegram: 'Telegram',
      email: 'Email',
    },
    details: {
      eyebrow: 'Bron so‘rovi',
      title: 'Safar tafsilotlarini kiriting',
      description: 'Qisqa yozing. Mahalliy yordam shu ma’lumot bilan bronni tasdiqlaydi.',
      validation: 'Davom etish uchun traveler ma’lumoti, telefon va safar sanasini kiriting.',
      continue: 'So‘rovni ko‘rib chiqish',
    },
    review: {
      eyebrow: 'So‘rovni ko‘rib chiqish',
      title: 'Tafsilotlarni yana bir bor tekshiring',
      description: 'Bu hali MVP so‘rov oqimi, shuning uchun xulosa qisqa va aniq turadi.',
      travelerTitle: 'Traveler ma’lumotlari',
      guests_one: '1 mehmon',
      guests_other: '{{count}} mehmon',
      mvpTitle: 'Keyingi qadam',
      mvpDescription: 'Baramiz hozir bron so‘rovini saqlaydi, yakuniy tasdiq esa mahalliy yordam orqali bo‘ladi.',
      continue: 'To‘lov usulini tanlash',
    },
    payment: {
      eyebrow: 'To‘lov tanlovi',
      title: 'Qanday to‘lashni tanlang',
      description: 'Yordam bronni tasdiqlaganda qaysi usul qulay ekanini tanlang.',
      methods: {
        visa: 'Visa / bank karta',
        humo: 'Humo / mahalliy karta',
        cash: 'Tasdiqda to‘lash',
      },
      mvpNotice: 'Bu MVP hali jonli to‘lovni qayta ishlamaydi. Tanlangan usul support uchun afzal ko‘rilgan variant sifatida saqlanadi.',
      confirm: 'Bron so‘rovini yuborish',
    },
    confirmation: {
      eyebrow: 'So‘rov yuborildi',
      title: 'Bron so‘rovingiz qabul qilindi',
      description: 'So‘rov saqlandi va mahalliy yordam uchun tayyor.',
      pending: 'Mahalliy tasdiq kutilmoqda',
      reference: 'Raqam',
      nextTitle: 'Keyin nima bo‘ladi',
      next1: 'Mahalliy yordam bron tafsilotlari va to‘lov usulini ko‘rib chiqadi.',
      next2: 'Traveler tanlangan kanal orqali yakuniy tasdiq uchun bog‘lanadi.',
      next3: 'Keyin real booking API shu oqimga alohida qo‘shilishi mumkin.',
      back: 'Ilovaga qaytish',
      home: 'Bosh sahifani ochish',
    },
  },
  appHome: {
    greetingWithName: 'Qaytganingiz yaxshi, {{name}}',
  },
});

Object.assign(ruPages, {
  auth: {
    integration: 'Baramiz теперь использует backend auth API и синхронизирует профиль путешественника через сервер.',
    gate: {
      continueBrowsing: 'Продолжить просмотр',
      booking: {
        badge: 'Продолжить бронь',
        title: 'Войдите, чтобы продолжить этот защищенный шаг',
        description: 'Приложение можно свободно изучать без входа. Авторизация нужна только для брони, оплаты и сохраненных действий.',
      },
      payment: {
        badge: 'Продолжить оплату',
        title: 'Войдите перед оплатой',
        description: 'Контекст бронирования сохранится. Вход нужен только перед защищенным этапом оплаты.',
      },
      saveRoute: {
        badge: 'Сохранить маршрут',
        title: 'Войдите, чтобы сохранить этот маршрут',
        description: 'Для просмотра вход не нужен. Мы просим авторизацию только когда вы хотите сохранить маршрут на потом.',
      },
      guide: {
        badge: 'Запросить гида',
        title: 'Войдите, чтобы запросить локального гида',
        description: 'На этом шаге уже нужны данные путешественника и канал связи, поэтому требуется вход.',
      },
      service: {
        badge: 'Запросить сервис',
        title: 'Войдите, чтобы запросить этот сервис',
        description: 'Просмотр остается открытым. Вход нужен только когда вы переходите к брони или локальной поддержке.',
      },
    },
    fields: {
      fullName: 'Полное имя',
      email: 'Email',
      password: 'Пароль',
    },
    login: {
      badge: 'С возвращением',
      title: 'Войдите, чтобы продолжить планирование',
      description: 'Откройте маршруты, бронирования и сценарий открытия в одном месте.',
      submit: 'Войти',
      createAccount: 'Создать аккаунт',
      switchAction: 'Нет аккаунта? Зарегистрируйтесь',
      error: 'Введите email и пароль, чтобы продолжить.',
    },
    register: {
      badge: 'Создать аккаунт',
      title: 'Начните с простого профиля путешественника',
      description: 'Так приложение становится личным, а бронирование выглядит частью единого продукта.',
      submit: 'Создать аккаунт',
      switchAction: 'Уже есть аккаунт? Войдите',
      haveAccount: 'Вернуться ко входу',
      fullNamePlaceholder: 'Айзада Нурымбетова',
      error: 'Сначала заполните имя, email и пароль.',
    },
  },
  booking: {
    common: {
      backToBrowse: 'Назад к просмотру',
      backToBooking: 'Назад к деталям брони',
      backToReview: 'Назад к проверке',
      bookNow: 'Запросить бронь',
    },
    source: {
      service: 'Бронирование сервиса',
      guide: 'Бронирование гида',
      route: 'Поддержка маршрута',
    },
    empty: {
      badge: 'Поток бронирования',
      title: 'Начните с карточки сервиса, гида или поддержки маршрута',
      description: 'После выбора точки входа запрос продолжится здесь.',
    },
    fields: {
      phone: 'Номер телефона',
      travelDate: 'Дата поездки',
      guests: 'Гости',
      contactMethod: 'Предпочтительный канал связи',
      note: 'Комментарий к поездке',
    },
    contact: {
      phone: 'Телефон',
      telegram: 'Telegram',
      email: 'Email',
    },
    details: {
      eyebrow: 'Запрос на бронь',
      title: 'Добавьте детали поездки',
      description: 'Коротко и по делу. Локальная поддержка использует это для подтверждения.',
      validation: 'Перед продолжением добавьте данные путешественника, телефон и дату поездки.',
      continue: 'Проверить запрос',
    },
    review: {
      eyebrow: 'Проверка запроса',
      title: 'Проверьте детали один раз',
      description: 'Это MVP-поток запроса, поэтому итог остается коротким и понятным.',
      travelerTitle: 'Данные путешественника',
      guests_one: '1 гость',
      guests_other: '{{count}} гостей',
      mvpTitle: 'Что будет дальше',
      mvpDescription: 'Сейчас Baramiz сохраняет запрос на бронь, а финальное подтверждение остается за локальной поддержкой.',
      continue: 'Выбрать способ оплаты',
    },
    payment: {
      eyebrow: 'Способ оплаты',
      title: 'Выберите удобный способ оплаты',
      description: 'Укажите предпочтение, которое будет использовано при подтверждении со стороны поддержки.',
      methods: {
        visa: 'Visa / банковская карта',
        humo: 'Humo / локальная карта',
        cash: 'Оплата при подтверждении',
      },
      mvpNotice: 'Этот MVP пока не обрабатывает живые платежи. Выбранный способ сохраняется как предпочтение для поддержки.',
      confirm: 'Отправить запрос на бронь',
    },
    confirmation: {
      eyebrow: 'Запрос отправлен',
      title: 'Ваш запрос на бронь принят',
      description: 'Запрос сохранен и готов для локального сопровождения.',
      pending: 'Ожидает подтверждения поддержки',
      reference: 'Номер',
      nextTitle: 'Что дальше',
      next1: 'Локальная поддержка проверит детали и выбранный способ оплаты.',
      next2: 'С путешественником свяжутся через выбранный канал для финального подтверждения.',
      next3: 'Позже сюда можно подключить реальный booking API без перестройки экрана.',
      back: 'Вернуться в приложение',
      home: 'Открыть главную',
    },
  },
  appHome: {
    greetingWithName: 'С возвращением, {{name}}',
  },
});

Object.assign(kaaPages, {
  auth: {
    integration: 'Baramiz endi backend auth API arqalı kiriwdi basqaradı hám sayahatshi profilińizdi server menen sinxron saqlaydı.',
    gate: {
      continueBrowsing: 'Kóriwdi dawam etiw',
      booking: {
        badge: 'Brondı dawam etiw',
        title: 'Bul qorǵalǵan qadamdı dawam ettiriw ushin kiriń',
        description: 'Ilovanı erkin kóriwge boladı. Kiriw tek bron, tólem hám saqlanǵan ámeller ushin kerek.',
      },
      payment: {
        badge: 'Tólemni dawam etiw',
        title: 'Tólemden aldın kiriń',
        description: 'Bron konteksti saqlanadı. Kiriw tek qorǵalǵan tólem basqıshınan aldın kerek.',
      },
      saveRoute: {
        badge: 'Marshruttı saqlaw',
        title: 'Bul marshruttı saqlaw ushin kiriń',
        description: 'Kóriw ushin kiriw kerek emes. Biz tek marshruttı keyinge saqlamaqşı bolsańız soraymız.',
      },
      guide: {
        badge: 'Gid sorawi',
        title: 'Lokal giddi soraw ushin kiriń',
        description: 'Bul basqıshta sayahatshi maǵlıwmatı menen baylanıs kanalı kerek bolǵanı ushın kiriw soraladı.',
      },
      service: {
        badge: 'Xızmet sorawi',
        title: 'Bul xızmetti soraw ushin kiriń',
        description: 'Kóriw ashıq qaladı. Kiriw tek bron yamasa lokal qollaw basqıshına ótkende kerek boladı.',
      },
    },
    fields: {
      fullName: 'Tolıq atı',
      email: 'Email',
      password: 'Parol',
    },
    login: {
      badge: 'Qaytıp kelgenińiz jaqsı',
      title: 'Josparlawdı dawam ettiriw ushin kiriń',
      description: 'Marshrutlar, bronlar hám ashiw aǵımın bir jerden aşıń.',
      submit: 'Kiriw',
      createAccount: 'Account jaratıw',
      switchAction: 'Account joq pa? Dizimnen ótiń',
      error: 'Dawam etiw ushin email hám paroldı kiritıń.',
    },
    register: {
      badge: 'Account jaratıw',
      title: 'Sayahatshi profilinen baslań',
      description: 'Bul ilovanı jekeleytin hám bron aǵımın bir ónim ishinde uslap turadı.',
      submit: 'Account jaratıw',
      switchAction: 'Account bar ma? Kiriń',
      haveAccount: 'Kiriwge qaytıw',
      fullNamePlaceholder: 'Ayzada Nurymbetova',
      error: 'Aldın atıńızdı, email hám paroldı toltırıń.',
    },
  },
  booking: {
    common: {
      backToBrowse: 'Kóriwge qaytıw',
      backToBooking: 'Bron detallarina qaytıw',
      backToReview: 'Tekseriwge qaytıw',
      bookNow: 'Bron sorawın jiberiw',
    },
    source: {
      service: 'Xızmet bronı',
      guide: 'Gid bronı',
      route: 'Marshrut qollawi',
    },
    empty: {
      badge: 'Bron aǵımı',
      title: 'Xızmet, gid yamasa marshrut qollawi kartasınan baslań',
      description: 'Kiriw noqatı tańlanǵannan keyin soraw osı jerde dawam etedi.',
    },
    fields: {
      phone: 'Telefon nomeri',
      travelDate: 'Sayahat sáni',
      guests: 'Mehmanlar',
      contactMethod: 'Baylanıs usılı',
      note: 'Sayahat eslatpesi',
    },
    contact: {
      phone: 'Telefon',
      telegram: 'Telegram',
      email: 'Email',
    },
    details: {
      eyebrow: 'Bron sorawi',
      title: 'Sayahat detalların kiritiń',
      description: 'Qısqa jazıń. Lokal qollaw usı maǵlıwmat penen tastıyıqlaydı.',
      validation: 'Dawam etiw ushin sayahatshi maǵlıwmatı, telefon hám sáneni kiritiń.',
      continue: 'Sorawdı tekseriw',
    },
    review: {
      eyebrow: 'Sorawdı tekseriw',
      title: 'Detallardı taǵı bir ret kóriń',
      description: 'Bul áli MVP soraw aǵımı, sonıń ushın qorytındı qısqa hám túsinikli.',
      travelerTitle: 'Sayahatshi maǵlıwmatları',
      guests_one: '1 mehman',
      guests_other: '{{count}} mehman',
      mvpTitle: 'Keyingi qadam',
      mvpDescription: 'Házir Baramiz bron sorawın saqlaydı, al aqırǵı tastıyıq lokal qollaw arqalı boladı.',
      continue: 'Tólem usılın tańlaw',
    },
    payment: {
      eyebrow: 'Tólem tańlawı',
      title: 'Qalay tólewdi tańlań',
      description: 'Qollaw tastıyıqlaganda qaysı usıl qolay ekenin kórsetiń.',
      methods: {
        visa: 'Visa / bank kartası',
        humo: 'Humo / lokal karta',
        cash: 'Tastıyıqta tólew',
      },
      mvpNotice: 'Bul MVP ázir tiris tólem qabıllamaydı. Tańlanǵan usıl qollaw ushin qalaǵan variant retinde saqlanadı.',
      confirm: 'Bron sorawın jiberiw',
    },
    confirmation: {
      eyebrow: 'Soraw jiberildi',
      title: 'Bron sorawińız qabıllandı',
      description: 'Soraw saqlandı hám lokal qollawǵa tayar.',
      pending: 'Qollaw tastıyığın kútip tur',
      reference: 'Nomer',
      nextTitle: 'Keyin ne boladı',
      next1: 'Lokal qollaw bron detalları hám tólem usılın kóredi.',
      next2: 'Sayahatshi menen tańlanǵan kanal arqalı aqırǵı tastıyıq ushin baylanısıлады.',
      next3: 'Keyin bul aǵımǵa haqıyqıy booking API qosıwǵa boladı.',
      back: 'Ilovaǵa qaytıw',
      home: 'Bas betti ashiw',
    },
  },
  appHome: {
    greetingWithName: 'Qaytıp kelgenińiz jaqsı, {{name}}',
  },
});

Object.assign(((enPages as { auth: { gate: Record<string, unknown> } }).auth.gate), {
  profile: {
    badge: 'Open profile',
    title: 'Sign in to open your profile',
    description:
      'Baramiz stays open for browsing. We only ask for login when you want your personal profile and saved activity.',
  },
});

Object.assign(((uzPages as { auth: { gate: Record<string, unknown> } }).auth.gate), {
  profile: {
    badge: 'Profilni ochish',
    title: 'Profilni ochish uchun kiring',
    description:
      'Baramiz ko‘rish uchun ochiq qoladi. Login faqat shaxsiy profil, saqlangan marshrutlar va faoliyat uchun kerak bo‘ladi.',
  },
});

Object.assign(((ruPages as { auth: { gate: Record<string, unknown> } }).auth.gate), {
  profile: {
    badge: 'Открыть профиль',
    title: 'Войдите, чтобы открыть профиль',
    description:
      'Baramiz остается открытым для просмотра. Вход нужен только когда вам нужен личный профиль и сохраненная активность.',
  },
});

Object.assign(((kaaPages as { auth: { gate: Record<string, unknown> } }).auth.gate), {
  profile: {
    badge: 'Profildi ashiw',
    title: 'Profildi ashiw ushin kiriń',
    description:
      'Baramiz kóriw ushin ashıq qaladı. Kiriw tek jeke profilińiz hám saqlanǵan ámeller ushin kerek boladı.',
  },
});

Object.assign(enPages, {
  profile: {
    guest: {
      badge: 'Traveler profile',
      title: 'Sign in to open your profile',
      description:
        'Browse Baramiz freely first. Login is only needed when you want your personal profile, saved routes, or bookings.',
    },
    header: {
      badge: 'Profile',
    },
    loading: 'Refreshing your profile...',
    metrics: {
      savedRoutesLabel: 'Saved routes',
      bookingLabel: 'Latest booking',
      bookingStatus: 'Pending support',
      bookingEmpty: 'No request yet',
    },
    actions: {
      logout: 'Log out',
      title: 'Continue from where you left off',
      buildRoute: 'Build a route',
    },
  },
});

Object.assign(uzPages, {
  profile: {
    guest: {
      badge: 'Traveler profili',
      title: 'Profilni ochish uchun kiring',
      description:
        'Avval Baramizni erkin ko‘ring. Login faqat shaxsiy profil, saqlangan marshrutlar yoki bronlar kerak bo‘lganda so‘raladi.',
    },
    header: {
      badge: 'Profil',
    },
    loading: 'Profil yangilanmoqda...',
    metrics: {
      savedRoutesLabel: 'Saqlangan marshrutlar',
      bookingLabel: 'So‘nggi bron',
      bookingStatus: 'Support kutilmoqda',
      bookingEmpty: 'Hali so‘rov yo‘q',
    },
    actions: {
      logout: 'Chiqish',
      title: 'Qolgan joydan davom eting',
      buildRoute: 'Marshrut qurish',
    },
  },
});

Object.assign(ruPages, {
  profile: {
    guest: {
      badge: 'Профиль путешественника',
      title: 'Войдите, чтобы открыть профиль',
      description:
        'Сначала изучайте Baramiz свободно. Вход нужен только когда вам нужен личный профиль, сохраненные маршруты или бронирования.',
    },
    header: {
      badge: 'Профиль',
    },
    loading: 'Профиль обновляется...',
    metrics: {
      savedRoutesLabel: 'Сохраненные маршруты',
      bookingLabel: 'Последняя бронь',
      bookingStatus: 'Ожидает поддержки',
      bookingEmpty: 'Запросов пока нет',
    },
    actions: {
      logout: 'Выйти',
      title: 'Продолжите с того места, где остановились',
      buildRoute: 'Построить маршрут',
    },
  },
});

Object.assign(kaaPages, {
  profile: {
    guest: {
      badge: 'Sayahatshi profili',
      title: 'Profildi ashiw ushin kiriń',
      description:
        'Aldın Baramizdi erkin kóriń. Kiriw tek jeke profilińiz, saqlanǵan marshrutlar yamasa bronlar kerek bolǵanda soraladı.',
    },
    header: {
      badge: 'Profil',
    },
    loading: 'Profil jańalanıp atır...',
    metrics: {
      savedRoutesLabel: 'Saqlanǵan marshrutlar',
      bookingLabel: 'Sońǵı bron',
      bookingStatus: 'Qollaw kútilmekte',
      bookingEmpty: 'Ázirge soraw joq',
    },
    actions: {
      logout: 'Shığıw',
      title: 'Toqtaǵan jerińizden dawam etiń',
      buildRoute: 'Marshrut quriw',
    },
  },
});

Object.assign((enPages as { booking: { source: Record<string, unknown>; fields: Record<string, unknown> } }).booking.source, {
  hotel: 'Hotel booking',
});
Object.assign((enPages as { booking: { fields: Record<string, unknown> } }).booking.fields, {
  checkOutDate: 'Check-out date',
});
Object.assign(enPages, {
  hotels: {
    list: {
      badge: 'Trip stays',
      title: 'Hotels for your {{city}} route',
      description: 'A short curated list matched to your trip city, pace, and budget.',
      hotelsLabel: 'hotels',
      emptyTitle: 'Generate a route first',
      emptyDescription: 'Hotels are suggested after a route is planned so the stay fits the trip.',
    },
    card: {
      priceFrom: 'From ${{price}} / night',
      rating: '{{rating}} rating',
      view: 'View details',
      book: 'Book',
    },
    details: {
      badge: 'Hotel details',
      back: 'Back to hotels',
      tripBadge: 'Matched for {{city}} route',
      amenitiesTitle: 'Amenities',
      book: 'Book',
      emptyTitle: 'This hotel is not available right now',
      emptyDescription: 'Open the trip hotel list again to choose another stay for your route.',
    },
    route: {
      title: 'Stay close to this route',
      description: 'Open a short curated list of hotels matched to this city, budget, and route pace.',
      cta: 'Find hotels for this trip',
    },
  },
});

Object.assign((uzPages as { booking: { source: Record<string, unknown>; fields: Record<string, unknown> } }).booking.source, {
  hotel: 'Mehmonxona broni',
});
Object.assign((uzPages as { booking: { fields: Record<string, unknown> } }).booking.fields, {
  checkOutDate: 'Chiqish sanasi',
});
Object.assign(uzPages, {
  hotels: {
    list: {
      badge: 'Safar mehmonxonalari',
      title: '{{city}} marshruti uchun mehmonxonalar',
      description: 'Safar shahri, ritmi va budjetiga mos qisqa tanlangan ro‘yxat.',
      hotelsLabel: 'mehmonxona',
      emptyTitle: 'Avval marshrut yarating',
      emptyDescription: 'Mehmonxonalar marshrut tuzilgandan keyin tavsiya qilinadi.',
    },
    card: {
      priceFrom: '${{price}} / kechadan',
      rating: '{{rating}} reyting',
      view: 'Tafsilotlar',
      book: 'Bron qilish',
    },
    details: {
      badge: 'Mehmonxona tafsilotlari',
      back: 'Mehmonxonalarga qaytish',
      tripBadge: '{{city}} marshrutiga mos',
      amenitiesTitle: 'Qulayliklar',
      book: 'Bron qilish',
      emptyTitle: 'Bu mehmonxona hozir mavjud emas',
      emptyDescription: 'Safaringiz uchun boshqa variantni tanlash uchun ro‘yxatni qayta oching.',
    },
    route: {
      title: 'Shu marshrutga yaqin turing',
      description: 'Shahar, budjet va safar ritmiga mos mehmonxonalarni oching.',
      cta: 'Bu safar uchun mehmonxonalar',
    },
  },
});

Object.assign((ruPages as { booking: { source: Record<string, unknown>; fields: Record<string, unknown> } }).booking.source, {
  hotel: 'Бронь отеля',
});
Object.assign((ruPages as { booking: { fields: Record<string, unknown> } }).booking.fields, {
  checkOutDate: 'Дата выезда',
});
Object.assign(ruPages, {
  hotels: {
    list: {
      badge: 'Отели поездки',
      title: 'Отели для маршрута по {{city}}',
      description: 'Небольшая подборка отелей под город маршрута, темп и бюджет поездки.',
      hotelsLabel: 'отеля',
      emptyTitle: 'Сначала постройте маршрут',
      emptyDescription: 'Отели предлагаются после генерации маршрута, чтобы проживание подходило под поездку.',
    },
    card: {
      priceFrom: 'От ${{price}} / ночь',
      rating: 'Рейтинг {{rating}}',
      view: 'Подробнее',
      book: 'Забронировать',
    },
    details: {
      badge: 'Детали отеля',
      back: 'Назад к отелям',
      tripBadge: 'Подходит для маршрута по {{city}}',
      amenitiesTitle: 'Удобства',
      book: 'Забронировать',
      emptyTitle: 'Этот отель сейчас недоступен',
      emptyDescription: 'Откройте список отелей снова и выберите другой вариант для маршрута.',
    },
    route: {
      title: 'Остановитесь ближе к этому маршруту',
      description: 'Откройте короткий список отелей под город, бюджет и темп поездки.',
      cta: 'Найти отели для этой поездки',
    },
  },
});

Object.assign((kaaPages as { booking: { source: Record<string, unknown>; fields: Record<string, unknown> } }).booking.source, {
  hotel: 'Mehmanxana bronı',
});
Object.assign((kaaPages as { booking: { fields: Record<string, unknown> } }).booking.fields, {
  checkOutDate: 'Shığıw sánesi',
});
Object.assign(kaaPages, {
  hotels: {
    list: {
      badge: 'Sayahat qonaq üyleri',
      title: '{{city}} marshruti ushin mehmanxanalar',
      description: 'Qala, sayahat ritmi hám byudjetke mos qısqa tańlanǵan dizim.',
      hotelsLabel: 'mehmanxana',
      emptyTitle: 'Aldın marshrut quriń',
      emptyDescription: 'Mehmanxanalar marshrut tayarlanǵannan keyin usınıladı.',
    },
    card: {
      priceFrom: '${{price}} / túnnen',
      rating: '{{rating}} reyting',
      view: 'Tolıq kóriw',
      book: 'Bron qılıw',
    },
    details: {
      badge: 'Mehmanxana detalları',
      back: 'Mehmanxanalarga qaytıw',
      tripBadge: '{{city}} marshrutına mos',
      amenitiesTitle: 'Qolaylıqlar',
      book: 'Bron qılıw',
      emptyTitle: 'Bul mehmanxana házir qoljetimsiz',
      emptyDescription: 'Sayahatińız ushin basqa varianttı tańlaw ushin dizimdi qayta aşıń.',
    },
    route: {
      title: 'Bul marshrutqa jaqın turaq tańlań',
      description: 'Qala, byudjet hám sayahat ritmine mas mehmanxanalardı aşıń.',
      cta: 'Bul sayahat ushin mehmanxana tabıń',
    },
  },
});
