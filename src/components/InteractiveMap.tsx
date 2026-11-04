import React, { useState } from "react";
import { MapPin, Navigation, ExternalLink, Eye, RotateCw } from "lucide-react";
import { ADDRESS_FULL, MAP_DIRECTIONS_URL, MAP_EMBED_URL } from "../data/siteInfo";

export const InteractiveMap: React.FC = () => {
  const [loadIframe, setLoadIframe] = useState(false);

  const googleMapsUrl = MAP_DIRECTIONS_URL;
  const embedSrc = MAP_EMBED_URL;

  return (
    <section className="relative w-full border-t border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              <MapPin size={15} />
              <span>Vị trí lớp học</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {ADDRESS_FULL}
            </h3>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs sm:text-sm transition shadow-md shadow-primary-500/20 active:scale-95"
            >
              <Navigation size={16} />
              <span>Chỉ đường trên Google Maps</span>
              <ExternalLink size={13} />
            </a>

            {!loadIframe && (
              <button
                onClick={() => setLoadIframe(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl glass-panel text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 font-medium text-xs sm:text-sm transition active:scale-95"
                title="Tải bản đồ tương tác trực tiếp"
              >
                <Eye size={15} />
                <span className="hidden xs:inline">Xem bản đồ</span>
              </button>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-lg bg-slate-200 dark:bg-slate-950">
          {loadIframe ? (
            <iframe
              title="Địa chỉ IMEJI日本語教室"
              src={embedSrc}
              className="w-full h-full filter contrast-100 opacity-95 dark:opacity-85"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-100 via-primary-50/40 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
              {/* Simulated Map vector background */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 max-w-md space-y-3.5">
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto shadow-sm">
                  <MapPin size={30} className="animate-bounce" />
                </div>
                <div>
                  <p className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    IMEJI日本語教室
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {ADDRESS_FULL}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setLoadIframe(true)}
                    className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-primary-500 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-sm transition flex items-center gap-2 active:scale-95"
                  >
                    <RotateCw size={14} />
                    <span>Xem bản đồ</span>
                  </button>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5 active:scale-95"
                  >
                    <Navigation size={14} />
                    <span>Mở ứng dụng chỉ đường</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Floating badge */}
          <div className="absolute bottom-4 left-4 glass-panel px-3.5 py-2 rounded-xl shadow-md text-xs font-medium text-slate-800 dark:text-slate-100 pointer-events-none flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span>Phòng học trực tiếp máy lạnh tiêu chuẩn</span>
          </div>
        </div>
      </div>
    </section>
  );
};
