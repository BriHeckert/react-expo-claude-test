import { render, RenderOptions } from '@testing-library/react-native';
import { PropsWithChildren, ReactElement } from 'react';

// The provider-wrapping seam for component tests: as the app grows real
// global providers (a query client, SafeAreaProvider, GestureHandlerRootView,
// etc.), wrap them here once instead of per test file.
function TestProviders({ children }: PropsWithChildren) {
  return <>{children}</>;
}

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProviders, ...options });
}

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };
