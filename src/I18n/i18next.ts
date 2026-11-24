import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./ar.json";
import en from "./en.json";

const resources = {
  ar: { translation: ar },
  en: { translation: en },
};

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: "ar",
  fallbackLng: "ar",
  supportedLngs: ["ar", "en"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
