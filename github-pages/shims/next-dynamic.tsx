import { lazy, Suspense, type ComponentType } from "react";

type Loader = () => Promise<{ default: ComponentType<Record<string, unknown>> }>;

export default function dynamic(loader: Loader) {
  const Component = lazy(loader);
  return function DynamicComponent(props: Record<string, unknown>) {
    return <Suspense fallback={null}><Component {...props} /></Suspense>;
  };
}
