import { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';

interface MetricItemProps {
  label: string;
  value: number | string;
  maxValue?: number;
  showProgress?: boolean;
  unit?: string;
  tooltip?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const MetricItem = memo(
  ({
    label,
    value,
    maxValue = 100,
    showProgress = false,
    unit = '',
    tooltip,
    color = 'primary',
  }: MetricItemProps) => {
    const numericValue = typeof value === 'number' ? value : 0;
    const progressValue = Math.min((numericValue / maxValue) * 100, 100);

    const content = (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {value}
            {unit}
          </Typography>
        </Box>
        {showProgress && (
          <LinearProgress
            variant="determinate"
            value={progressValue}
            color={color}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'action.hover',
            }}
          />
        )}
      </Box>
    );

    if (tooltip) {
      return <Tooltip title={tooltip}>{content}</Tooltip>;
    }

    return content;
  }
);

MetricItem.displayName = 'MetricItem';
