#!/bin/zsh
# ================================
# Скрипт запуска проекта Renter
# ================================
# Поддерживает режимы:
#   run       -> dev
#   run dev   -> dev
#   run prod  -> prod (backend only)
# ================================

function check_error {
  if [ $? -ne 0 ]; then
    echo "❌ Ошибка на шаге: $1"
    exit 1
  fi
}

# Определяем базовую директорию (корень проекта renter/)
BASE_DIR="$(cd "$(dirname "$0")" || exit 1; pwd)"
echo "📂 Базовая директория: $BASE_DIR"

MODE=$1
if [ -z "$MODE" ]; then
  MODE="dev"
fi

# Очистка зависших процессов
echo "🧹 Очистка зависших node/electron процессов..."
pkill -f "node src/index.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
pkill -f "electron" 2>/dev/null

# Очистка кэша vite (чтобы не было конфликтов)
echo "🧹 Очистка кеша vite..."
rm -rf "$BASE_DIR/app/node_modules/.vite"

# ===== Запуск в DEV =====
if [ "$MODE" = "dev" ]; then
  echo "🚀 Запуск в DEV режиме..."
  cd "$BASE_DIR" || exit 1
  npm run dev

# ===== Запуск в PROD =====
elif [ "$MODE" = "prod" ]; then
  echo "🚀 Запуск в PROD режиме..."
  cd "$BASE_DIR" || exit 1
  npm run prod
else
  echo "⚠️ Неизвестный режим: $MODE (используйте dev или prod)"
  exit 1
fi