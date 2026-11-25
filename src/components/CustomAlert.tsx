import React, { createContext, useCallback, useContext, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../store/useAppStore";

export type CustomAlertButton = {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
};

export type CustomAlertOptions = {
  title: string;
  message?: string;
  variant?: "info" | "success" | "error" | "destructive";
  buttons?: CustomAlertButton[];
};

type CustomAlertContextValue = {
  showAlert: (options: CustomAlertOptions) => void;
  hideAlert: () => void;
};

const CustomAlertContext = createContext<CustomAlertContextValue | null>(null);

export function CustomAlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<CustomAlertOptions | null>(null);
  const { theme, language } = useAppStore();
  const isArabic = language === "ar";
  const isDark = theme === "dark";

  const hideAlert = useCallback(() => setAlert(null), []);
  const showAlert = useCallback((options: CustomAlertOptions) => {
    setAlert(options);
  }, []);

  const handleButtonPress = (button?: CustomAlertButton) => {
    hideAlert();
    button?.onPress?.();
  };

  const buttons =
    alert?.buttons && alert.buttons.length > 0
      ? alert.buttons
      : [{ text: isArabic ? "حسنًا" : "OK", style: "default" as const }];

  const variant = alert?.variant ?? "info";
  const iconConfig = {
    info: { name: "information-circle" as const, color: isDark ? "#22D3C5" : "#0F766E" },
    success: { name: "checkmark-circle" as const, color: isDark ? "#7AA891" : "#3D6352" },
    error: { name: "alert-circle" as const, color: "#EF4444" },
    destructive: { name: "trash" as const, color: "#EF4444" },
  }[variant];

  return (
    <CustomAlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <Modal
        visible={Boolean(alert)}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={hideAlert}
        presentationStyle="overFullScreen"
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/55 px-6"
          onPress={hideAlert}
        >
          <Pressable
            className="w-full max-w-sm rounded-[28px] border border-surface-light bg-card-light p-5 shadow-2xl dark:border-surface-dark dark:bg-card-dark"
            onPress={() => undefined}
          >
            <View className="mb-4 items-center">
              <View
                className={`h-14 w-14 items-center justify-center rounded-full ${
                  variant === "error" || variant === "destructive"
                    ? "bg-red-50 dark:bg-red-950/40"
                    : "bg-primary-light/10 dark:bg-primary-dark/10"
                }`}
              >
                <Ionicons name={iconConfig.name} size={32} color={iconConfig.color} />
              </View>
            </View>

            <Text
              className={`text-xl font-extrabold text-zinc-900 dark:text-zinc-50 text-center`}
            >
              {alert?.title}
            </Text>

            {alert?.message ? (
              <Text
                className={`mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300 text-center`}
              >
                {alert.message}
              </Text>
            ) : null}

            <View
              className={`${buttons.length > 1 ? "flex-row" : "flex-row"} mt-6 gap-3 ${
                isArabic ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {buttons.map((button, index) => {
                const destructive = button.style === "destructive";
                const cancel = button.style === "cancel";
                const buttonClass = destructive
                  ? "bg-red-600"
                  : cancel
                    ? "border border-surface-light bg-zinc-100 dark:border-surface-dark dark:bg-zinc-800"
                    : "bg-primary-light dark:bg-primary-dark";

                return (
                  <TouchableOpacity
                    key={`${button.text}-${index}`}
                    accessibilityRole="button"
                    onPress={() => handleButtonPress(button)}
                    className={`${buttons.length > 1 ? "flex-1" : "flex-1"} h-12 items-center justify-center rounded-2xl ${buttonClass}`}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        destructive
                          ? "text-white"
                          : cancel
                            ? "text-zinc-700 dark:text-zinc-200"
                            : "text-white dark:text-zinc-950"
                      }`}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </CustomAlertContext.Provider>
  );
}

export function useCustomAlert() {
  const context = useContext(CustomAlertContext);
  if (!context) {
    throw new Error("useCustomAlert must be used within CustomAlertProvider");
  }
  return context;
}
