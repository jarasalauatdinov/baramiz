import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { getCategories, type Category } from '../entities/category';
import { formatCategoryLabel, getPlaces, type Place } from '../entities/place';
import { routePaths } from '../router/paths';
import { PlacesExplorerScreen } from '../widgets/place-explorer';

export function PlacesPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const queryCity = searchParams.get('city')?.trim() ?? '';
  const queryCategory = searchParams.get('category')?.trim().toLowerCase() ?? '';
  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedCity, setSelectedCity] = useState(queryCity || 'all');
  const [selectedCategory, setSelectedCategory] = useState(queryCategory || 'all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [categoriesResult, placesResult] = await Promise.allSettled([
        getCategories(),
        getPlaces(),
      ]);

      if (!active) {
        return;
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
      }

      if (placesResult.status === 'fulfilled') {
        setPlaces(placesResult.value);
      }

      if (categoriesResult.status === 'rejected' || placesResult.status === 'rejected') {
        console.error('Failed to load places browser', {
          categories: categoriesResult.status === 'rejected' ? categoriesResult.reason : null,
          places: placesResult.status === 'rejected' ? placesResult.reason : null,
        });
        setHasError(true);
      }

      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (queryCity) {
      setSelectedCity(queryCity);
    }

    if (queryCategory) {
      setSelectedCategory(queryCategory);
    }
  }, [queryCategory, queryCity]);

  const cityOptions = useMemo(() => {
    const values = Array.from(new Set(places.map((place) => place.city).filter(Boolean))) as string[];

    return [
      { value: 'all', label: t('common.allDestinations') },
      ...values.map((city) => ({ value: city, label: city })),
    ];
  }, [places, t]);

  const categoryOptions = useMemo(
    () => [
      { id: 'all', label: t('common.allCategories') },
      ...categories.map((category) => ({
        id: String(category.id),
        label: formatCategoryLabel(String(category.id), t),
      })),
    ],
    [categories, t],
  );

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesCity = selectedCity === 'all' || place.city === selectedCity;
      const matchesCategory =
        selectedCategory === 'all' ||
        place.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !query ||
        place.name.toLowerCase().includes(query) ||
        (place.description ?? '').toLowerCase().includes(query);

      return matchesCity && matchesCategory && matchesSearch;
    });
  }, [places, search, selectedCategory, selectedCity]);

  const routeBuilderQuery = useMemo(() => {
    const query = new URLSearchParams();
    const routeCity = selectedCity !== 'all' ? selectedCity : filteredPlaces[0]?.city;

    if (routeCity) {
      query.set('city', routeCity);
    }

    if (selectedCategory !== 'all') {
      query.set('interest', selectedCategory);
    }

    return `${routePaths.appRouteBuilder}${query.toString() ? `?${query.toString()}` : ''}`;
  }, [filteredPlaces, selectedCategory, selectedCity]);

  return (
    <PlacesExplorerScreen
      loading={loading}
      hasError={hasError}
      places={filteredPlaces}
      search={search}
      selectedCity={selectedCity}
      selectedCategory={selectedCategory}
      cityOptions={cityOptions}
      categoryOptions={categoryOptions}
      routeBuilderQuery={routeBuilderQuery}
      onSearchChange={setSearch}
      onSelectCity={setSelectedCity}
      onSelectCategory={setSelectedCategory}
    />
  );
}
