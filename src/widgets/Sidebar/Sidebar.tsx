import { memo, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface SidebarProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  width?: number;
}

export const Sidebar = memo(({ children, open, onClose, width = 280 }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: width,
            boxSizing: 'border-box',
            p: 2,
            pt: 10,
          },
        }}
      >
        {children}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: width,
        flexShrink: 0,
        p: 2,
        borderRight: 1,
        borderColor: 'divider',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        position: 'sticky',
        top: 64,
      }}
    >
      {children}
    </Box>
  );
});

Sidebar.displayName = 'Sidebar';
