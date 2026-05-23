"use client";

import { useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { type Lang, translations } from "@/lib/i18n";
import { useUser } from "@clerk/nextjs";

const TAB_IDS = ["url", "text", "email", "phone"] as const;
type TabId = (typeof TAB_IDS)[number];

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

export default function Home() {
  const [lang, setLang] = useState<Lang>("ru");
  const [tab, setTab] = useState<TabId>("url");
  const [input, setInput] = useState("");
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useUser();

  const t = translations[lang];
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
        <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-6">
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
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {t.appName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Upgrade / Portal button */}
            <a
              href={isSignedIn ? "/api/portal" : "/api/checkout"}
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {isSignedIn ? t.portal : t.upgrade}
            </a>

            {/* Language switcher */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {(["ru", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={[
                    "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                    lang === l
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {l === "ru" ? "РУ" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              {t.title}
            </h1>
            <p className="text-muted-foreground text-base">{t.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left: Input panel */}
            <div className="space-y-5">
              {/* Tabs */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                {TAB_IDS.map((id) => (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id)}
                    className={[
                      "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                      tab === id
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    ].join(" ")}
                  >
                    {t.tabs[id]}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {t.labels[tab]}
                </label>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholders[tab]}
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
                {t.download}
              </Button>

              {/* Hint */}
              {!hasValue && (
                <p className="text-sm text-muted-foreground text-center">
                  {t.hint}
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
                        <p className="text-sm text-muted-foreground">{t.emptyState}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {hasValue && (
                <p className="text-xs text-muted-foreground text-center">
                  {t.downloadHint}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-5">
        <p className="text-center text-sm text-muted-foreground">{t.footer}</p>
      </footer>
    </div>
  );
}
