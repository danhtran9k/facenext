import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

// TODO: tại sao dùng hook nhưng ko cần `use client` ?
// vẫn chạy bình thường
// tuy nhiên behaviour đôi lúc sai
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
