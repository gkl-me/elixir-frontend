"use client"


import { Provider } from "react-redux";
import { persist, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <PersistGate persistor={persist}>
    {children}
    </PersistGate>
    </Provider>;
}