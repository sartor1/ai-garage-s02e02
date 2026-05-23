export type Lang = "ru" | "en";

export const translations = {
  ru: {
    appName: "QR Генератор",
    title: "Создайте QR-код",
    subtitle: "Введите данные — код готов мгновенно",
    tabs: {
      url: "Ссылка",
      text: "Текст",
      email: "Email",
      phone: "Телефон",
    },
    labels: {
      url: "Адрес страницы",
      text: "Текст",
      email: "Адрес электронной почты",
      phone: "Номер телефона",
    },
    placeholders: {
      url: "example.com",
      text: "Введите любой текст",
      email: "name@example.com",
      phone: "+7 900 000 00 00",
    },
    download: "Скачать PNG",
    hint: "Начните вводить — QR-код появится справа",
    emptyState: "QR-код появится здесь",
    downloadHint: 'Нажмите «Скачать», чтобы сохранить изображение',
    footer: "Данные не передаются на сервер — всё работает в вашем браузере",
    upgrade: "Купить",
    portal: "Управление подпиской",
  },
  en: {
    appName: "QR Generator",
    title: "Create a QR code",
    subtitle: "Enter your content — code is ready instantly",
    tabs: {
      url: "Link",
      text: "Text",
      email: "Email",
      phone: "Phone",
    },
    labels: {
      url: "Web address",
      text: "Text",
      email: "Email address",
      phone: "Phone number",
    },
    placeholders: {
      url: "example.com",
      text: "Enter any text",
      email: "name@example.com",
      phone: "+1 555 000 0000",
    },
    download: "Download PNG",
    hint: "Start typing — your QR code will appear on the right",
    emptyState: "Your QR code will appear here",
    downloadHint: "Click Download to save the image",
    footer: "No data is sent to any server — everything runs in your browser",
    upgrade: "Upgrade",
    portal: "Manage subscription",
  },
} as const satisfies Record<Lang, object>;
