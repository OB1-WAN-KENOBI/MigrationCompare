import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

type ChipColor = 'success' | 'warning' | 'error' | 'default' | 'primary' | 'secondary' | 'info';

interface MetricChipProps {
  type: 'safety' | 'immigration' | 'english' | 'healthcare';
  value: string;
  showTooltip?: boolean;
}

const getColor = (type: string, value: string): ChipColor => {
  const colorMap: Record<string, Record<string, ChipColor>> = {
    safety: {
      low: 'error',
      medium: 'warning',
      high: 'success',
    },
    immigration: {
      easy: 'success',
      medium: 'warning',
      hard: 'error',
    },
    english: {
      low: 'error',
      medium: 'warning',
      high: 'success',
    },
    healthcare: {
      basic: 'error',
      medium: 'warning',
      good: 'success',
    },
  };

  return colorMap[type]?.[value] ?? 'default';
};

export const MetricChip = ({ type, value, showTooltip = false }: MetricChipProps) => {
  const { t } = useTranslation();

  const translationKeys: Record<string, string> = {
    safety: 'values.safety',
    immigration: 'values.immigration',
    english: 'values.english',
    healthcare: 'values.healthcare',
  };

  const translationKey = translationKeys[type] ?? 'values.safety';
  const label = t(`${translationKey}.${value}`);
  const color = getColor(type, value);

  const chip = <Chip label={label} color={color} size="small" sx={{ fontWeight: 500 }} />;

  if (showTooltip) {
    const tooltipKeyMap: Record<string, string> = {
      safety: 'country.safety',
      immigration: 'country.immigrationDifficulty',
      english: 'country.englishLevel',
      healthcare: 'country.healthcare',
    };
    return <Tooltip title={t(tooltipKeyMap[type] ?? `country.${type}`)}>{chip}</Tooltip>;
  }

  return chip;
};
