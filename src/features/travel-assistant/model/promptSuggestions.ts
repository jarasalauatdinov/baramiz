import type { TFunction } from 'i18next';
import { formatCategoryLabel } from '../../../utils/placeArtwork';

interface RouteBuilderPromptContext {
  city?: string;
  interest?: string;
}

interface RouteResultPromptContext {
  city: string;
  stopName?: string;
  interest?: string;
}

export const getRouteBuilderAssistantPrompts = (
  t: TFunction,
  context: RouteBuilderPromptContext,
): string[] => {
  const city = context.city?.trim();
  const interest = context.interest?.trim();
  const localizedInterest = interest ? formatCategoryLabel(interest, t) : null;

  return [
    city
      ? t('pages.travelAssistant.prompts.routeBuilderCity', {
          defaultValue: 'What works best for a half-day in {{city}}?',
          city,
        })
      : t('pages.travelAssistant.prompts.routeBuilderDefault', {
          defaultValue: 'Which city is best for a first visit to Karakalpakstan?',
        }),
    interest
      ? t('pages.travelAssistant.prompts.routeBuilderInterest', {
          defaultValue: 'Which places are strongest for {{interest}}?',
          interest: localizedInterest ?? interest,
        })
      : t('pages.travelAssistant.prompts.routeBuilderMuseums', {
          defaultValue: 'Which places are strongest for museums and culture?',
        }),
    t('pages.travelAssistant.prompts.routeBuilderTiming', {
      defaultValue: 'How much time should I keep for travel between stops?',
    }),
  ];
};

export const getRouteResultAssistantPrompts = (
  t: TFunction,
  context: RouteResultPromptContext,
): string[] => {
  const localizedInterest = context.interest ? formatCategoryLabel(context.interest, t) : null;

  return [
    t('pages.travelAssistant.prompts.routeResultAdjust', {
      defaultValue: 'How can I shorten this {{city}} route if I have less time?',
      city: context.city,
    }),
    context.stopName
      ? t('pages.travelAssistant.prompts.routeResultStop', {
          defaultValue: 'Is {{stop}} worth keeping as a priority stop?',
          stop: context.stopName,
        })
      : t('pages.travelAssistant.prompts.routeResultPriority', {
          defaultValue: 'Which stop should stay if I can only keep the strongest places?',
        }),
    context.interest
      ? t('pages.travelAssistant.prompts.routeResultInterest', {
          defaultValue: 'What local advice fits a {{interest}} route in {{city}}?',
          interest: localizedInterest ?? context.interest,
          city: context.city,
        })
      : t('pages.travelAssistant.prompts.routeResultGeneral', {
          defaultValue: 'What local advice fits this route best?',
        }),
  ];
};
