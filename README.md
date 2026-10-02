# mandemand.dk — koncept-webshop

Statisk koncept-site for en webshop målrettet den maskuline mand: grooming, tøj og (senere) gadgets.

## Filer

- `index.html` — forsiden (hero, kategorier, grooming, manifest, tøj, gadgets-teaser, USP, nyhedsbrev, footer, kurv-drawer)
- `assets/css/style.css` — alt design. Farver og fonte ligger som variabler øverst i `:root`
- `assets/js/main.js` — mobilmenu, kurv (kun i browserens hukommelse), toast, scroll-reveal, tilmeldingsformer
- `build.ps1` — samler alt i én fil, `dist/index.html`, som kan sendes eller åbnes direkte

## Byg én-fils version

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

## Næste skridt

- Erstat SVG-illustrationerne i `.product__media` med rigtige produktfotos
- Vælg platform til den rigtige shop (Shopify, Shoporama, WooCommerce) og genbrug design-tokens derfra
- Priser, produktnavne og tekster er placeholders
