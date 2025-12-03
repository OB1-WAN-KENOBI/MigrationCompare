import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import SecurityIcon from '@mui/icons-material/Security';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LanguageIcon from '@mui/icons-material/Language';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import type { SxProps, Theme } from '@mui/material/styles';

type ChipColor = 'success' | 'warning' | 'error' | 'default' | 'primary' | 'secondary' | 'info';

interface MetricChipProps {
  type: 'safety' | 'immigration' | 'english' | 'healthcare';
  value: string;
  showTooltip?: boolean;
  showLabel?: boolean; // Показывать подпись метрики
  sx?: SxProps<Theme>;
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
      advanced: 'success',
    },
  };

  return colorMap[type]?.[value] ?? 'default';
};

const getIcon = (type: string): React.ReactElement | undefined => {
  const iconMap: Record<string, React.ReactElement> = {
    safety: <SecurityIcon sx={{ fontSize: 14 }} />,
    immigration: <FlightTakeoffIcon sx={{ fontSize: 14 }} />,
    english: <LanguageIcon sx={{ fontSize: 14 }} />,
    healthcare: <LocalHospitalIcon sx={{ fontSize: 14 }} />,
  };
  return iconMap[type];
};

export const MetricChip = ({
  type,
  value,
  showTooltip = false,
  showLabel = false,
  sx,
}: MetricChipProps) => {
  const { t } = useTranslation();

  const translationKeys: Record<string, string> = {
    safety: 'values.safety',
    immigration: 'values.immigration',
    english: 'values.english',
    healthcare: 'values.healthcare',
  };

  const tooltipKeyMap: Record<string, string> = {
    safety: 'country.safety',
    immigration: 'country.immigrationDifficulty',
    english: 'country.englishLevel',
    healthcare: 'country.healthcare',
  };

  const translationKey = translationKeys[type] ?? 'values.safety';
  const valueLabel = t(`${translationKey}.${value}`);
  const metricLabel = t(tooltipKeyMap[type] ?? `country.${type}`);
  const color = getColor(type, value);
  const icon = getIcon(type);

  const chipLabel = showLabel ? `${metricLabel}: ${valueLabel}` : valueLabel;

  const chip = (
    <Chip
      {...(icon && { icon })}
      label={chipLabel}
      color={color}
      size="small"
      sx={{ fontWeight: 500, ...sx }}
    />
  );

  if (showTooltip && !showLabel) {
    return <Tooltip title={metricLabel}>{chip}</Tooltip>;
  }

  return chip;
};
