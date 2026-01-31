# Instrukcje wdrożenia na GitHub Pages

## Krok 1: Włącz GitHub Pages

1. Przejdź do: https://github.com/akaz515/framio/settings/pages
2. W sekcji **"Source"** wybierz: **GitHub Actions**
3. Zapisz zmiany

## Krok 2: Upewnij się że workflow ma uprawnienia

1. Przejdź do: https://github.com/akaz515/framio/settings/actions
2. W sekcji **"Workflow permissions"** wybierz: **Read and write permissions**
3. Zaznacz checkbox: **Allow GitHub Actions to create and approve pull requests**
4. Kliknij **Save**

## Krok 3: Uruchom workflow

1. Przejdź do: https://github.com/akaz515/framio/actions
2. Jeśli workflow się nie uruchomił automatycznie:
   - Kliknij na workflow "Deploy to GitHub Pages"
   - Kliknij "Run workflow"
   - Wybierz branch "main"
   - Kliknij "Run workflow"

## Krok 4: Sprawdź deployment

Po zakończeniu workflow (zazwyczaj 1-2 minuty), strona będzie dostępna pod:
**https://akaz515.github.io/framio/**

## Rozwiązywanie problemów

Jeśli strona jest pusta:
1. Sprawdź czy workflow zakończył się sukcesem w zakładce Actions
2. Sprawdź czy GitHub Pages jest ustawiony na "GitHub Actions" jako źródło
3. Poczekaj 1-2 minuty - czasami propagacja zmian trwa chwilę

Jeśli widzisz błędy w Actions:
- Sprawdź uprawnienia workflow (Krok 2)
- Sprawdź logi w zakładce Actions aby zobaczyć szczegóły błędu
