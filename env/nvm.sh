#!/bin/zsh

: <<'COMMENT'
==========================================================================
📌 Скрипт nvm-tools.sh — управление NVM и Node.js через zsh

Описание:
- Позволяет проверять и обновлять NVM.
- Позволяет устанавливать и переключаться между версиями Node.js.
- Работает в zsh на macOS и автоматически подключает nvm.

Использование:
  ./env/nvm-tools.sh <команда> [аргументы]

Доступные команды:

  nvm-version
      Показать версию NVM.

  nvm-update
      Обновить NVM до последней версии и автоматически подключить его
      через source ~/.nvm/nvm.sh.

  node-version
      Показать активную версию Node.js и npm.

  node-install-lts
      Установить последнюю LTS-версию Node.js и сделать её активной.

  node-install <версия>
      Установить конкретную версию Node.js и сделать её активной.
      Пример: ./nvm-tools.sh node-install 18

  node-use <версия>
      Переключиться на уже установленную версию Node.js.
      Пример: ./nvm-tools.sh node-use 18

  node-list
      Показать все установленные версии Node.js через nvm.

Запуск без аргументов:
  ./env/nvm-tools.sh
      Показывает справку с доступными командами.

Пример последовательного использования:
  ./env/nvm-tools.sh nvm-version
  ./env/nvm-tools.sh nvm-update
  ./env/nvm-tools.sh node-install-lts
  ./env/nvm-tools.sh node-list
  ./env/nvm-tools.sh node-use 18
==========================================================================
COMMENT

# ========= Подключение nvm =========
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

# ========= Функции ==========
nvm_version() {
  if command -v nvm >/dev/null 2>&1; then
    echo "NVM version: $(nvm --version)"
  else
    echo "❌ NVM не найден. Проверь установку."
  fi
}

node_version() {
  if command -v node >/dev/null 2>&1; then
    echo "Node.js version: $(node -v)"
    echo "npm version: $(npm -v)"
  else
    echo "❌ Node.js не установлен через nvm."
  fi
}

nvm_update() {
  if ! command -v nvm &>/dev/null; then
    echo "❌ NVM не найден. Установите nvm перед обновлением."
    return 1
  fi

  local current_version
  current_version=$(nvm --version 2>/dev/null)
  echo "🔄 Проверка обновлений NVM... (текущая версия: $current_version)"

  if [ -d "$NVM_DIR" ]; then
    cd "$NVM_DIR" || return 1

    # Получаем теги из удалённого репозитория
    git fetch --tags origin

    local latest_tag latest_version
    latest_tag=$(git describe --tags `git rev-list --tags --max-count=1`)
    latest_version="${latest_tag#v}"  # убираем 'v'

    if [ -z "$latest_version" ]; then
      echo "❌ Не удалось определить последний тег NVM."
      return 1
    fi

    if [ "$current_version" = "$latest_version" ]; then
      echo "✅ NVM уже актуальна: $current_version"
    else
      echo "🔄 Обновление до версии $latest_version..."
      git checkout "$latest_tag"

      # Подключаем nvm для текущего сеанса
      if [ -s "$NVM_DIR/nvm.sh" ]; then
        \. "$NVM_DIR/nvm.sh"
        local new_version
        new_version=$(nvm --version 2>/dev/null)
        echo "✅ NVM обновлена: $current_version → $new_version"
      else
        echo "❌ Не удалось подключить nvm после обновления."
        return 1
      fi

      # Возвращаемся на ветку master для будущих обновлений
      if git show-ref --verify --quiet refs/heads/master; then
        git checkout master &>/dev/null
      else
        echo "⚠️ Ветка master не найдена, оставляем на теге $latest_tag"
      fi
    fi

  else
    echo "❌ Директория $NVM_DIR не найдена. Убедитесь, что nvm установлен через Git."
    return 1
  fi
}

node_install_lts() {
  echo "🔄 Установка последней LTS версии Node.js..."
  nvm install --lts
  nvm use --lts
  echo "✅ Node.js обновлён до версии: $(node -v)"
}

node_install() {
  VERSION=$1
  if [ -z "$VERSION" ]; then
    echo "⚠️ Укажи версию для установки, например: ./nvm-tools.sh node-install 18"
    exit 1
  fi
  echo "🔄 Установка Node.js $VERSION..."
  nvm install $VERSION
  nvm use $VERSION
  echo "✅ Node.js переключен на: $(node -v)"
}

node_use() {
  VERSION=$1
  if [ -z "$VERSION" ]; then
    echo "⚠️ Укажи версию для переключения, например: ./nvm-tools.sh node-use 18"
    exit 1
  fi

  if nvm ls "$VERSION" >/dev/null 2>&1; then
    nvm use "$VERSION"
    echo "✅ Node.js переключен на версию: $(node -v)"
  else
    echo "❌ Node.js версии $VERSION не установлено. Используй node-install $VERSION"
  fi
}

node_list() {
  echo "📦 Установленные версии Node.js:"
  nvm ls
}

# ========= Меню ==========
show_help() {
  echo "Использование: $0 <команда> [аргументы]"
  echo "Доступные команды:"
  echo "  nvm-version          - Показать версию NVM"
  echo "  nvm-update           - Обновить NVM и подключить его"
  echo "  node-version         - Показать версию Node.js и npm"
  echo "  node-install-lts     - Установить последнюю LTS Node.js"
  echo "  node-install <ver>   - Установить конкретную версию Node.js"
  echo "  node-use <ver>       - Переключиться на установленную версию Node.js"
  echo "  node-list            - Список всех установленных Node.js"
}

case "$1" in
  nvm-version)       nvm_version ;;
  nvm-update)        nvm_update ;;
  node-version)      node_version ;;
  node-install-lts)  node_install_lts ;;
  node-install)      node_install $2 ;;
  node-use)          node_use $2 ;;
  node-list)         node_list ;;
  *)                 show_help ;;
esac