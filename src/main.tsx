import ScrollToTop from "./base-components/ScrollToTop";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";
import { AuthProvider } from "./contexts/Auth";
import { TourProvider } from "./TourContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <TourProvider>
      <Provider store={store}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </Provider>
      <ScrollToTop />
    </TourProvider>
  </BrowserRouter>
);
