import { useEffect, useState } from 'react';

/**
 * 窄屏（手机）判定。与 index.css 的 700px 断点保持一致 ——
 * 布局归 CSS 管，但"面板默认收起、点开才盖住画面"这类行为必须由组件决定。
 */
export function useNarrow(maxWidth = 700): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${maxWidth}px)`).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [maxWidth]);
  return narrow;
}
