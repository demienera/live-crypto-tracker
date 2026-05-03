# 📊 Live Crypto Tracker [![Live Demo](https://img.shields.io/badge/🚀_Демо-посмотреть_онлайн-blue?style=flat)](https://live-crypto-tracker-ashy.vercel.app/)

Дашборд для отслеживания криптовалют в реальном времени. Данные поступают напрямую с биржи **Binance** через WebSocket.  


<img width="1633" height="986" alt="Снимок экрана 2026-05-03 222656" src="https://github.com/user-attachments/assets/b4b4962b-fc4b-4475-b1b1-746ed01dc580" />

## ✨ Ключевые возможности

- ⚡ **Real‑time обновления** — цены и процент изменения приходят мгновенно по WebSocket.
- 🟢🔴 **Индикация роста/падения** — анимация карточек при изменении цены, зелёный/красный.
- 📈 **График цены** — интерактивный график выбранной пары (Recharts).
- 📋 **Лента сделок** — таблица последних трейдов с подсветкой покупок/продаж.
- 📱 **Адаптивный дизайн** — корректное отображение на телефонах, планшетах и десктопах.
- 🔄 **Автоматическое переподключение** — при обрыве связи WebSocket восстанавливается.

## 🛠️ Технологический стек

| Категория | Инструменты |
| --- | --- |
| Фреймворк | [Next.js 16](https://nextjs.org/) (App Router) |
| Язык | [TypeScript](https://www.typescriptlang.org/) |
| Стейт-менеджмент | [Zustand](https://zustand.docs.pmnd.rs/) |
| Стилизация | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| Анимации | [Motion](https://motion.dev/) (ранее Framer Motion) |
| WebSocket | [Binance Stream API](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams) |
| Графики | [Recharts](https://recharts.org/) |

## 🚀 Быстрый старт (локально)

1. **Клонируйте репозиторий**

   ```bash
   git clone https://github.com/your-username/live-crypto-tracker.git
   cd live-crypto-tracker

2. **Установите зависимости**

   ```bash
   npm install                                                                                
3. **Запустите dev-сервер**

   ```bash
   npm run dev

Откройте http://localhost:3000 в браузере.

## 📖 Как это работает
Дашборд подключается к **wss://stream.binance.com:9443/ws** и подписывается на потоки @ticker для пяти криптовалют (BTC, ETH, BNB, SOL, ADA) и @trade для выбранного символа.
При получении данных обновляется состояние в Zustand‑сторе, что вызывает ререндер карточек, графика и таблицы. Для плавности применён троттлинг обновлений, а мелкие сделки фильтруются по минимальному объёму (≥ 10 USD).
