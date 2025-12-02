import { memo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

interface CompareListProps {
  count: number;
}

export const CompareList = memo(({ count }: CompareListProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    void navigate('/compare');
  };

  return (
    <Box>
      <Tooltip title={t('nav.compare')}>
        <Button
          variant={count > 0 ? 'contained' : 'outlined'}
          onClick={handleClick}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <Badge badgeContent={count} color="error">
            <CompareArrowsIcon />
          </Badge>
        </Button>
      </Tooltip>
    </Box>
  );
});

CompareList.displayName = 'CompareList';
