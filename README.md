# Activitat: Carregar personatges des d’un fitxer (Java)

Activitat pràctica guiada per afegir **lectura de fitxers** al projecte de personatges, fent que l’`Academia` pugui **carregar personatges** des d’un fitxer de text.

---

## Contextualització

Fins ara, els personatges s’han creat “a mà” des del `main(...)`. Això està bé per provar, però no és escalable ni realista: en un projecte real, les dades acostumen a venir de fora (fitxers, bases de dades, APIs…).

En aquesta activitat, ampliareu la classe `Academia` perquè pugui **carregar una llista de personatges** des d’un fitxer i incorporar-los al repositori intern.

L’objectiu és practicar:

- lectura i processament de fitxers
- validació de dades
- tractament d’errors (fitxer inexistent, línies mal formades…)
- ús de col·leccions i factorització de codi

---

## Objectius d’aprenentatge

### Lectura de fitxers
Llegir un fitxer línia a línia amb `Files.readAllLines(...)` o `BufferedReader`.

### Parsing de dades
Transformar text (CSV senzill) en objectes del domini (`Guerrer`, `Mag`, `Arquer`).

### Robustesa i validació
Gestionar errors sense “petar” el programa: línies buides, comentaris, valors no numèrics, tipus desconeguts…

### Disseny net
Separar responsabilitats: mètode de lectura, mètode de parsing d’una línia, i creació d’objectes.

---

## Format del fitxer (CSV senzill amb `;`)

El fitxer conté **una línia per personatge**, amb aquest format:

```text
TIPUS;NOM;VIDA;NIVELL;ATRIBUT
```

On:

- `TIPUS`: `GUERRER`, `MAG` o `ARQUER` (sense accents; majúscules recomanades)
- `NOM`: text (sense `;`)
- `VIDA`: enter (>= 0)
- `NIVELL`: enter (>= 1)
- `ATRIBUT`: enter (>= 0) i representa:
  - `GUERRER` → `forca`
  - `MAG` → `mana`
  - `ARQUER` → `precisio`

### Comentaris i línies buides

- Les línies buides s’han d’ignorar.
- Les línies que comencen per `#` s’han de considerar comentaris i ignorar-les.

### Exemple de fitxer `personatges.csv`

```text
# tipus;nom;vida;nivell;atribut
GUERRER;Thorin;120;10;25
MAG;Merlina;80;9;38
ARQUER;Lira;90;8;18
MAG;Morlina;80;9;38
```

Fitxer d’exemple: [personatges.csv](https://drive.google.com/file/d/1es2MFlTZJzDkU6RRxhoIKcU3YxO8y-rw/view?usp=sharing)

---

## FASE 1 — Afegir el mètode de càrrega a `Academia`

Implementeu un mètode a `Academia` amb una signatura similar a:

```java
public int carregarDesDeFitxer(String path)
```

Requisits mínims:

1. Llegeix el fitxer indicat per `path`.
2. Per cada línia vàlida, crea el personatge corresponent i l’afegeix a la col·lecció de l’`Academia`.
3. Retorna el **nombre de personatges carregats**.

> Si preferiu, podeu sobrecarregar el mètode per acceptar també un `Path`.

---

## FASE 2 — Parsing d’una línia

Per evitar tenir un mètode massa llarg, creeu un mètode auxiliar (a `Academia` o en una classe utilitària) que s’encarregui de convertir una línia en un `Personatge`.

Proposta de signatura:

```java
private Personatge parseLiniaPersonatge(String linia)
```

Comportament recomanat:

- Si la línia és buida o comentari → retorna `null`.
- Si la línia no té 5 camps → retorna `null` (o llança una excepció controlada, però gestioneu-la a la càrrega).
- Si els números no es poden parsejar → retorna `null`.
- Si `TIPUS` és desconegut → retorna `null`.
- Si tot és correcte → retorna un `new Guerrer(...)`, `new Mag(...)` o `new Arquer(...)`.

> Important: decideix un criteri consistent. Per exemple: “les línies incorrectes s’ignoren però s’informa per consola”.

---

## FASE 3 — Gestió d’errors i missatges

Quan feu lectura de fitxers, poden passar moltes coses. Heu de controlar com a mínim:

- Fitxer no trobat / path incorrecte
- Error d’entrada/sortida (I/O)
- Línies mal formades

### Requisits

1. El programa **no ha de fallar** amb una excepció no controlada quan el fitxer no existeix.
2. Heu de mostrar un missatge útil, per exemple:

```text
No s'ha pogut llegir el fitxer: dades/personatges.csv
```

3. Si una línia és incorrecta, indiqueu el número de línia i el motiu (si ho voleu simplificar, almenys indiqueu que s’ha ignorat):

```text
Línia 6 ignorada (format incorrecte): GUERRER;SenseNivell;120
```

---

## FASE 4 — Proves des del `main`

Al `Principal` (o un programa de prova equivalent):

1. Crea una `Academia`.
2. Carrega personatges des d’un fitxer.
3. Mostra el llistat de personatges carregats.
4. (Opcional) crea un `Equip` amb alguns personatges carregats i prova alguna funcionalitat existent.

### Exemple de sortida esperada

```text
Carregats 4 personatges des de dades/personatges.csv

Personatges a l'Academia:
Guerrer: Thorin | Vida: 120 | Nivell: 10 | Forca: 25
Mag: Merlina | Vida: 80 | Nivell: 9 | Mana: 38
Arquer: Lira | Vida: 90 | Nivell: 8 | Precisio: 18
Mag: Morlina | Vida: 80 | Nivell: 9 | Mana: 38
```

---

## EXTRA — Extensions opcionalment recomanades

- **Carregar sense duplicats:** si ja existeix un personatge amb el mateix nom, decideix si s’ignora o s’actualitza.
- **Headers opcionals:** permetre una primera línia amb capçalera `tipus;nom;vida;nivell;atribut`.
- **Noms amb espais:** assegurar que el `trim()` s’aplica a cada camp.
- **Resum final:** nombre total de línies llegides, vàlides i ignorades.

---

## Preguntes de reflexió

1. Per què és millor ignorar una línia incorrecta i continuar (en comptes de parar-ho tot)?
2. Quines validacions t’han semblat imprescindibles quan parses dades d’un fitxer?
3. Quin mètode ha estat més net: “tot en un” o separar lectura/parsing/creació d’objectes?
4. Com canviaria el disseny si el fitxer fos JSON en comptes de CSV?
