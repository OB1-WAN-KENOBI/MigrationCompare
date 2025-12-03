import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import { useThemeMode } from '@app/providers';
import { CompareList } from '@features/CompareList';
import { useCompare, useFavorites, useNormalizedLanguage } from '@shared/lib';
import { STORAGE_KEYS } from '@shared/config';

const navItems = [
  { key: 'home', path: '/' },
  { key: 'compare', path: '/compare' },
];

export const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleTheme } = useThemeMode();
  const { compareCount } = useCompare();
  const { favorites } = useFavorites();
  const currentLang = useNormalizedLanguage();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (path: string) => {
    void navigate(path);
    setMobileOpen(false);
  };

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    void i18n.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    handleLangMenuClose();
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PublicIcon color="primary" />
        <Typography variant="h6" fontWeight={700}>
          {t('app.title')}
        </Typography>
      </Box>
      <Divider />

      {/* Navigation */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavClick('/')} selected={location.pathname === '/'}>
            <ListItemIcon>
              <HomeIcon color={location.pathname === '/' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary={t('nav.home')} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavClick('/compare')}
            selected={location.pathname === '/compare'}
          >
            <ListItemIcon>
              <Badge badgeContent={compareCount} color="error">
                <CompareArrowsIcon
                  color={location.pathname === '/compare' ? 'primary' : 'inherit'}
                />
              </Badge>
            </ListItemIcon>
            <ListItemText primary={t('nav.compare')} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleNavClick('/favorites')}
            selected={location.pathname === '/favorites'}
          >
            <ListItemIcon>
              <Badge badgeContent={favorites.length} color="error">
                <FavoriteIcon color={location.pathname === '/favorites' ? 'error' : 'inherit'} />
              </Badge>
            </ListItemIcon>
            <ListItemText primary={t('nav.favorites')} />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      {/* Settings */}
      <List>
        {/* Theme toggle */}
        <ListItem>
          <ListItemIcon>{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}</ListItemIcon>
          <ListItemText primary={mode === 'dark' ? t('theme.dark') : t('theme.light')} />
          <Switch edge="end" checked={mode === 'dark'} onChange={toggleTheme} />
        </ListItem>

        {/* Language */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleLanguageChange(currentLang === 'ru' ? 'en' : 'ru')}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary={t('language.ru')} secondary={currentLang === 'ru' ? '✓' : ''} />
            <ListItemText
              primary={t('language.en')}
              secondary={currentLang === 'en' ? '✓' : ''}
              sx={{ textAlign: 'right' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: 'blur(8px)',
          backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
              aria-label={t('nav.menu')}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
            }}
            onClick={() => void navigate('/')}
          >
            <PublicIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {t('app.title')}
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.key}
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                >
                  {t(`nav.${item.key}`)}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            {/* Compare - always visible */}
            <CompareList count={compareCount} />

            {/* Favorites - always visible */}
            <Tooltip title={t('nav.favorites')}>
              <IconButton
                onClick={() => void navigate('/favorites')}
                sx={{ color: location.pathname === '/favorites' ? 'error.main' : 'text.secondary' }}
                size={isMobile ? 'small' : 'medium'}
                aria-label={t('nav.favorites')}
              >
                <Badge badgeContent={favorites.length} color="error">
                  <FavoriteIcon fontSize={isMobile ? 'small' : 'medium'} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Language - desktop only */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <IconButton
                onClick={handleLangMenuOpen}
                sx={{ color: 'text.secondary' }}
                aria-label={t('language.change')}
              >
                <LanguageIcon />
              </IconButton>
              <Menu
                anchorEl={langAnchorEl}
                open={Boolean(langAnchorEl)}
                onClose={handleLangMenuClose}
              >
                <MenuItem
                  onClick={() => handleLanguageChange('ru')}
                  selected={currentLang === 'ru'}
                >
                  {t('language.ru')}
                </MenuItem>
                <MenuItem
                  onClick={() => handleLanguageChange('en')}
                  selected={currentLang === 'en'}
                >
                  {t('language.en')}
                </MenuItem>
              </Menu>
            </Box>

            {/* Theme toggle - desktop only */}
            <IconButton
              onClick={toggleTheme}
              sx={{ color: 'text.secondary', display: { xs: 'none', md: 'flex' } }}
              aria-label={t(`theme.${mode === 'dark' ? 'light' : 'dark'}`)}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};
