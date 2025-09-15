Отлично 👍
Я собрал для тебя финальные версии трёх файлов: run.sh, electron.js, vite.config.js.
Я учёл твои текущие файлы и внёс только минимальные изменения, необходимые для согласованности и исправления ошибок.
🔹 1. run.sh

#!/bin/zsh
# ================================
# Скрипт запуска проекта Renter
# ================================
# Использование:
#   run           → dev-режим (по умолчанию)
#   run dev       → dev-режим
#   run prod      → prod-режим (backend + собранный frontend + electron)
#   run backup    → создать zip-бэкап проекта
# ================================

# --- 1. Автоматическая регистрация alias ---
ALIAS_CMD="alias run='/Volumes/Mac/Development/renter/run.sh'"
if ! grep -Fxq "$ALIAS_CMD" "$HOME/.zshrc"; then
  echo "🔧 Добавляем alias 'run' в ~/.zshrc..."
  echo "$ALIAS_CMD" >> "$HOME/.zshrc"
  echo "✅ Alias добавлен."
  source "$HOME/.zshrc"
fi

# --- 2. Определение режима ---
MODE=$1
if [ -z "$MODE" ]; then
  MODE="dev"
fi

BASE_DIR="$(cd "$(dirname "$0")" || exit 1; pwd)"
LOG_CORE="$BASE_DIR/logs_core.txt"
LOG_APP="$BASE_DIR/logs_app.txt"
LOG_ELECTRON="$BASE_DIR/logs_electron.txt"

echo "📂 Базовая директория: $BASE_DIR"

# --- 3. Очистка логов ---
if [ "$MODE" != "backup" ]; then
  echo "🧹 Очищаем старые логи..."
  : > "$LOG_CORE"
  : > "$LOG_APP"
  : > "$LOG_ELECTRON"
fi

# --- 4. Функция очистки зависших процессов ---
kill_processes() {
  echo "🧹 Чистим процессы Node/Vite/Electron..."
  pkill -f "node src/index.js" 2>/dev/null
  pkill -f "vite" 2>/dev/null
  pkill -f "electron" 2>/dev/null
}
kill_processes

# --- 5. Запуск ---
if [ "$MODE" = "dev" ]; then
  echo "🚀 Запуск в DEV-режиме..."
  echo "📜 Логи:"
  echo "   - $LOG_CORE"
  echo "   - $LOG_APP"
  echo "   - $LOG_ELECTRON"

  # Backend
  cd "$BASE_DIR/core" || exit 1
  npm run dev > "$LOG_CORE" 2>&1 & CORE_PID=$!
  echo "⚡ Backend PID: $CORE_PID"

  # Frontend (Vite)
  cd "$BASE_DIR/app" || exit 1
  npm run dev > "$LOG_APP" 2>&1 & APP_PID=$!
  echo "⚡ Frontend PID: $APP_PID"

  # Electron (ждём пока Vite поднимется)
  cd "$BASE_DIR/app" || exit 1
  NODE_ENV=development npm run start > "$LOG_ELECTRON" 2>&1 & ELECTRON_PID=$!
  echo "🖥️ Electron PID: $ELECTRON_PID"

  # Автоматический вывод логов в консоль
  echo "📡 Подключаемся к логам (Ctrl+C чтобы выйти):"
  tail -f "$LOG_CORE" "$LOG_APP" "$LOG_ELECTRON" & TAIL_PID=$!
  wait $ELECTRON_PID
  kill $CORE_PID $APP_PID $TAIL_PID 2>/dev/null
  echo "🛑 Backend, frontend и tail остановлены."

elif [ "$MODE" = "prod" ]; then
  echo "📦 Сборка frontend..."
  cd "$BASE_DIR/app" || exit 1
  npm run build

  echo "🚀 Запуск backend..."
  cd "$BASE_DIR/core" || exit 1
  node src/index.js > "$LOG_CORE" 2>&1 & CORE_PID=$!
  echo "⚡ Backend PID: $CORE_PID"

  echo "🖥️ Запуск Electron..."
  cd "$BASE_DIR/app" || exit 1
  NODE_ENV=production npm run start > "$LOG_ELECTRON" 2>&1 & ELECTRON_PID=$!
  echo "🖥️ Electron PID: $ELECTRON_PID"

  echo "📡 Подключаемся к логам (Ctrl+C чтобы выйти):"
  tail -f "$LOG_CORE" "$LOG_ELECTRON" & TAIL_PID=$!
  wait $ELECTRON_PID
  kill $CORE_PID $TAIL_PID 2>/dev/null
  echo "🛑 Backend и tail остановлены."

elif [ "$MODE" = "backup" ]; then
  BACKUP_DIR="/Volumes/Mac/Development/backup/renter"
  mkdir -p "$BACKUP_DIR"
  TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
  BACKUP_FILE="$BACKUP_DIR/renter_backup_$TIMESTAMP.zip"

  echo "📦 Создаём бэкап проекта в $BACKUP_FILE..."
  cd "$BASE_DIR" || exit 1
  zip -r "$BACKUP_FILE" . \
    -x "*/node_modules/*" \
    -x "logs_core.txt" \
    -x "logs_app.txt" \
    -x "logs_electron.txt" \
    -x "*.zip"

  echo "✅ Бэкап создан: $BACKUP_FILE"
else
  echo "❌ Неизвестный режим: $MODE"
  echo "Используй: run | run dev | run prod | run backup"
  exit 1
fi
