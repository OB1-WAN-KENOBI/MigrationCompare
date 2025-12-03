import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
}

/**
 * Hook для обработки клавиатурных сокращений
 * @param shortcuts - массив объектов с описанием комбинаций клавиш и обработчиков
 * @param enabled - включен ли обработчик (по умолчанию true)
 */
export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch =
          event.key === shortcut.key || event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch =
          shortcut.ctrlKey === undefined ? true : event.ctrlKey === shortcut.ctrlKey;
        const metaMatch =
          shortcut.metaKey === undefined ? true : event.metaKey === shortcut.metaKey;
        const shiftMatch =
          shortcut.shiftKey === undefined ? true : event.shiftKey === shortcut.shiftKey;
        const altMatch = shortcut.altKey === undefined ? true : event.altKey === shortcut.altKey;

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
          // Проверяем, что не в поле ввода
          const target = event.target as HTMLElement;
          const isInput =
            target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

          // Для некоторых комбинаций (например, Ctrl+K) разрешаем даже в input
          const allowInInput = shortcut.ctrlKey || shortcut.metaKey;

          if (!isInput || allowInInput) {
            event.preventDefault();
            shortcut.handler();
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
};
