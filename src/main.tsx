/** @format */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";

import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </Provider>
    </Theme>
  </StrictMode>
);
