# Nowodworski Religio Zwalniacz

Program do ułatwienia wysyłania wzięcia odpowiedzialności za ucznia podczas przerwy(religii) gdy organy szkolne wyraźnie powiedziały że oświadczenie takie jest tylko jednorazowe

**Korzystając z programu zgadzasz się na warunki licencji która zanjduje się na dole tego dokumentu**

## Instalacja

**UWAGA! Jeżeli zmieniałeś ustawienia portów port 8081 może być otwarty wtedy każdy znający twoje IP może zmieniać ustawienia programu**

### Windows
1. Zainstaluj node.js: https://nodejs.org/en/ w wersji LTS oraz **zapamiętaj Folder instalacji** podany podczas jej
2. Z realeases: https://github.com/22h39/nwd-religio-zwalniacz/releases pobierz plik Windows-1.0.zip
3. Wypakuj go w dowolnym Folderze oraz włącz install.exe
4. Instalator poprosi cię o podanie Folderu instalcji node.js zrób to, po naciśnięciu przycisku dalej odczekaj chwilę aż ciemne okno się zajmie
5. Przejdź do konfiguracji

### Linux

```
cd ~
mkdir nwd-rel
cd nwd-rel
wget https://github.com/22h39/nwd-religio-zwalniacz/releases/download/v1.0/nwd-rel-zwln.tar
tar -xvf nwd-rel-zwln.tar
node main.js
```

Przejdź do konfiguracji

## Konfiguracja

Otwórz dowolną wyszukiwarke i wejdź na http://localhost:8081

![Search bar](/images/searchbar.png)

Wpisz następujące informacje aby program mógł wysyłać wiadomości za pomocą [librus-api-relibrused](http://github.com/22h39/librus-api-relibrused)

![Dashboard](/images/dashboard.png)

Dzień wysyłania to dzień tygodnia w którym wiadomość będzie wysyłana, godzina to godzina o której wiadomość będzie wysyłana.
Komputer/maszyna na której program działa musi być włączona o tej godzinie w tym dniu aby wysłanie wiadomości było możliwe
Godzina zakończenia i godzina rozpoczęcia to testy użyte do wiadomości możesz tam wpisać cokolwiek i poźniej to zmienić
Dzień religji to dzień w którym masz religie dzień ten będzie używany do obliczenia następnej religji aby wstawić datę w wiadomość

![Wych](/images/wych.png)

Wybieramy wychowawcę oraz nauczyciela od zajęć opiekuńczych (jeżeli mamy zajęcia opiekuńcze z wychowacą wybieramy te same osoby a wiadmość zostanie wysłana tylko raz) do których wiadomość ma być wysłana
Aby sprawdzić poprawność działania logowania do librusa będą na tej stronie wyświetlone oceny z twojego pierwszego przedmiotu w dzienniku upewnij się że są one poprawne
Wiadomość możesz edytować do woli na tej stronie ta wiadomość którą zatwierdzisz będzie wysyłana
Słowo ```[data]``` zostanie zastąpione datą następnej relgiji według kalendarza przy wysyłaniu
Zostawiając pole Wiadomość puste, program nie będzie wysyłał żadnych wiadomości

![Status](/images/status.png)

Podsumowanie


Wiadmości będą oczywiście wysyłane z konta które zostało wpisane na początku konfiguracji czyli, jeżeli jest to konto z u na końcu z konta ucznia, inaczej z konta rodzica

**Autor nie odpowiada za jakiekolwiek szkody wynikające z użycia programu, program jest dystrybułowany bez jakiejkolwiek gwarancji działania na danej maszynie**

## Prof Halina Tyliba

Wpisując http://localhost:8081/najlepszy_nauczyciel otrzymamy dość ciekawą stronę

## Program stworzony przy pomocy
[librus-api-relibrused](http://github.com/22h39/librus-api-relibrused)
[express](https://expressjs.com/)
[handlebars](https://handlebarsjs.com/)
[node.js](https://nodejs.org)

## Licencja
MIT License

Copyright (c) 2019 Mikołaj Gazeel, Mateusz Bagiński (przed forkowy kod librus-api)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.




