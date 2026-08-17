import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

export default function Link({ href, children, ...props }: LinkProps) {
  const resolvedHref = href === "/" ? import.meta.env.BASE_URL : href;
  return <a href={resolvedHref} {...props}>{children}</a>;
}
