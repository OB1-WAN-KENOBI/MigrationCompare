import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface FavoritesButtonProps {
  count: number;
  onClick?: () => void;
}

export const FavoritesButton = memo(({ count, onClick }: FavoritesButtonProps) => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t('countries.addToFavorites')}>
      <IconButton onClick={onClick} color={count > 0 ? 'error' : 'default'}>
        <Badge badgeContent={count} color="error">
          <FavoriteIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
});

FavoritesButton.displayName = 'FavoritesButton';
