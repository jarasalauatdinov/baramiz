import { Badge, Text, UnstyledButton } from '@mantine/core';
import type { DestinationConfig } from '../../entities/destination/model/types';
import styles from './HeroDestinationShowcase.module.css';

interface HeroDestinationShowcaseProps {
  destinations: DestinationConfig[];
  activeSlug?: string;
  onSelect?: (slug: string) => void;
}

const tileClassNames = [
  styles.tileLarge,
  styles.tileTop,
  styles.tileBottom,
  styles.tileTall,
];

export function HeroDestinationShowcase({
  destinations,
  activeSlug,
  onSelect,
}: HeroDestinationShowcaseProps) {
  const items = destinations.slice(0, 4);

  return (
    <div className={styles.shell}>
      <div className={styles.trailOne} aria-hidden="true" />
      <div className={styles.trailTwo} aria-hidden="true" />
      <div className={styles.pin} aria-hidden="true" />
      <div className={styles.dot} aria-hidden="true" />

      <div className={styles.grid}>
        {items.map((destination, index) => {
          const active = destination.slug === activeSlug;

          return (
            <UnstyledButton
              key={destination.slug}
              type="button"
              onClick={() => onSelect?.(destination.slug)}
              className={`${styles.tile} ${tileClassNames[index] ?? ''} ${active ? styles.active : ''}`}
            >
              <img
                src={destination.heroImage}
                alt={destination.name}
                className={styles.image}
                loading="eager"
              />
              <div className={styles.overlay} />

              <div className={styles.label}>
                <Badge
                  variant="filled"
                  color={active ? 'sun' : 'dark'}
                  radius="xl"
                  className={styles.badge}
                  c={active ? '#5a420b' : 'white'}
                >
                  {destination.kicker}
                </Badge>
                <Text fw={800} className={styles.title}>
                  {destination.name}
                </Text>
              </div>
            </UnstyledButton>
          );
        })}
      </div>
    </div>
  );
}
