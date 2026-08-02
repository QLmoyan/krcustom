import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Main content shell.
 * Desktop max width 1360px. A future right-rail ad slot may sit beside this
 * region in a parent layout — it is intentionally not rendered for now.
 */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1360px] px-4 md:px-6 xl:px-8 ${className}`.trim()}
      data-layout="main-content"
    >
      {children}
    </div>
  );
}
