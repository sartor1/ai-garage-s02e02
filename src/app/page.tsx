"use client";

import { useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const TABS = [
  { id: "url", label: "Ссылка" },
  { id: "text", label: "Текст" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Телефон" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function buildValue(tab: TabId, input: string): string {
  if (!input.trim()) return "";
  switch (tab) {
    case "url":
      return /^https?:\/\//i.test(input) ? input : `https://${input}`;
    case "email":
      return `mailto:${input}`;
    case "phone":
      return `tel:${input.replace(/\s/g, "")}`;
    default:
      return input;
  }
}

const PLACEHOLDERS: Record<TabId, string> = {
  url: "example.com",
  text: "Введите любой текст",
  email: "name@example.com",
  phone: "+7 900 000 00 00",
};

export default function Home() {
  const [tab, setTab] = useState<TabId>("url");
  const [input, setInput] = useState("");
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const value = buildValue(tab, input);
  const hasValue = value.length > 0;

  const handleTabChange = useCallback((newTab: TabId) => {
    setTab(newTab);
    setInput("");
  }, []);

  const handleDownload = useCallback(() => {
    const canvas = canvasWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto flex h-16 items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="5" height="5" rx="0.5" fill="white"/>
                <rect x="10" y="1" width="5" height="5" rx="0.5" fill="white"/>
                <rect x="1" y="10" width="5" height="5" rx="0.5" fill="white"/>
                <rect x="10" y="10" width="2" height="2" fill="white"/>
                <rect x="13" y="10" width="2" height="2" fill="white"/>
                <rect x="10" y="13" width="2" height="2" fill="white"/>
                <rect x="13" y="13" width="2" height="2" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">QR Генератор</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Создайте QR-код
            </h1>
            <p className="text-muted-foreground text-base">
              Введите данные — код готов мгновенно
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left: Input panel */}
            <div className="space-y-5">
              {/* Tabs */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleTabChange(t.id)}
                    className={[
                      "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                      tab === t.id
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {tab === "url" && "Адрес страницы"}
                  {tab === "text" && "Текст"}
                  {tab === "email" && "Адрес электронной почты"}
                  {tab === "phone" && "Номер телефона"}
                </label>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={PLACEHOLDERS[tab]}
                  className="h-12 text-base bg-card"
                  type={tab === "email" ? "email" : tab === "phone" ? "tel" : "text"}
                />
              </div>

              {/* Download */}
              <Button
                onClick={handleDownload}
                disabled={!hasValue}
                className="w-full h-12 text-base font-medium"
              >
                Скачать PNG
              </Button>

              {/* Hint */}
              {!hasValue && (
                <p className="text-sm text-muted-foreground text-center">
                  Начните вводить — QR-код появится справа
                </p>
              )}
            </div>

            {/* Right: QR preview */}
            <div className="flex flex-col items-center gap-4">
              <Card className="w-full">
                <CardContent className="flex items-center justify-center p-8">
                  {hasValue ? (
                    <div ref={canvasWrapRef} className="rounded-lg overflow-hidden">
                      <QRCodeCanvas
                        value={value}
                        size={220}
                        bgColor="#ffffff"
                        fgColor="#2d4a52"
                        level="M"
                        marginSize={2}
                      />
                    </div>
                  ) : (
                    <div className="w-[220px] h-[220px] flex items-center justify-center bg-muted rounded-lg">
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-lg bg-border flex items-center justify-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                            <rect x="3" y="3" width="7" height="7" rx="1"/>
                            <rect x="14" y="3" width="7" height="7" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" rx="1"/>
                            <path d="M14 14h.01M18 14h.01M14 18h.01M18 18h.01M14 18v-4h4v4"/>
                          </svg>
                        </div>
                        <p className="text-sm text-muted-foreground">QR-код появится здесь</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {hasValue && (
                <p className="text-xs text-muted-foreground text-center">
                  Нажмите «Скачать», чтобы сохранить изображение
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-5">
        <p className="text-center text-sm text-muted-foreground">
          Данные не передаются на сервер — всё работает в вашем браузере
        </p>
      </footer>
    </div>
  );
}
