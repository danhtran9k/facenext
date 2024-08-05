"use client";

import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

// Dùng hook nhưng ko cần `use client` ?
// vì for-you-feed là client component sẵn và import component này vào
// tuy nhiên chặt chẽ thì nên add
export default function InfiniteScrollContainer({
  children,
  onBottomReached,
  className,
}: InfiniteScrollContainerProps) {
  // https://github.com/thebuilder/react-intersection-observer?tab=readme-ov-file#options
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}
