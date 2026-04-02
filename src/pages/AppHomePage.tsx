import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getAuthSession, getSessionFirstName, getSessionInitials } from '../features/auth/model/session';
import { getCategories, type Category } from '../entities/category';
import { getLocalizedDestinations } from '../entities/destination';
import { guideProfiles } from '../entities/guide';
import { getPlaces, type Place } from '../entities/place';
import { getLocalizedServiceSections } from '../entities/service';
import { routePaths } from '../router/paths';
import { AppHomeScreen } from '../widgets/app-home';

const ALL_CATEGORY = 'all';

export function AppHomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDataError, setHasDataError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const authSession = useMemo(() => getAuthSession(), []);
  const sessionFirstName = useMemo(() => getSessionFirstName(authSession), [authSession]);
  const sessionInitials = useMemo(() => getSessionInitials(authSession), [authSession]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [categoriesResult, placesResult] = await Promise.allSettled([
        getCategories(),
        getPlaces({ featured: true }),
      ]);

      if (!active) {
        return;
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
      }

      if (placesResult.status === 'fulfilled') {
        setFeaturedPlaces(placesResult.value);
      }

      if (categoriesResult.status === 'rejected' || placesResult.status === 'rejected') {
        console.error('Failed to load app home data', {
          categories: categoriesResult.status === 'rejected' ? categoriesResult.reason : null,
          places: placesResult.status === 'rejected' ? placesResult.reason : null,
        });
        setHasDataError(true);
      }

      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const destinations = useMemo(() => getLocalizedDestinations(t), [t]);
  const selectedDestinationData = useMemo(() => destinations[0] ?? null, [destinations]);

  const localizedDate = useMemo(
    () =>
      new Date().toLocaleDateString(i18n.resolvedLanguage ?? 'en', {
        month: 'short',
        day: 'numeric',
      }),
    [i18n.resolvedLanguage],
  );

  const greeting = sessionFirstName
    ? t('pages.appHome.greetingWithName', { name: sessionFirstName })
    : t('pages.appHome.greeting');

  const serviceSections = useMemo(() => getLocalizedServiceSections(t), [t]);
  const serviceCount = useMemo(
    () => serviceSections.reduce((sum, section) => sum + section.items.length, 0),
    [serviceSections],
  );

  const navigateToRouteBuilder = () => {
    const query = new URLSearchParams();
    const city = selectedDestinationData?.cities[0];

    if (city) {
      query.set('city', city);
    }

    if (selectedCategory !== ALL_CATEGORY) {
      query.set('interest', selectedCategory);
    }

    navigate(`${routePaths.appRouteBuilder}${query.toString() ? `?${query.toString()}` : ''}`);
  };

  return (
    <AppHomeScreen
      greeting={greeting}
      localizedDate={localizedDate}
      profileInitials={sessionInitials}
      categories={categories}
      featuredPlaces={featuredPlaces}
      selectedDestinationData={selectedDestinationData}
      selectedCategory={selectedCategory}
      search={search}
      loading={loading}
      hasDataError={hasDataError}
      serviceCount={serviceCount}
      guideCount={guideProfiles.length}
      onSearchChange={setSearch}
      onSelectCategory={setSelectedCategory}
      onNavigateToRouteBuilder={navigateToRouteBuilder}
    />
  );
}
