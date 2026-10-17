# EduBirds

An interactive field guide and 3D aviary lab for NSW Stage 2 and 3 students. The site can be published directly from the root of the `main` branch with GitHub Pages. It uses static HTML, CSS and JavaScript; no build step, server-side service or account is required.

## Run locally

From this repository's root:

```powershell
python -m http.server 8766
```

Open <http://127.0.0.1:8766/>. The 3D lab is at `/simulations.html`. A local HTTP server is needed because the lab imports JavaScript modules.

## Publish from `main`

In **Settings → Pages**, choose **Deploy from a branch**, then select **main** and **/(root)**. GitHub Pages will serve `index.html` and `simulations.html` from the branch. The expected Pages address is <https://edumetaverse.github.io/edubirds/> after Pages is enabled and the first deployment completes.

## Student activities

- Explore bird basics, 11 field guide profiles and adaptations of beaks, feet and feathers.
- Filter birds by habitat and open illustrated field notes.
- Compare flight, swimming, hovering and soaring.
- Use a 3D golden eagle soaring lab to test rising air and starting height, and a 3D flocking lab to test spacing, direction matching and cohesion.
- Answer seven beak questions and five habitat challenges.
- Save up to ten field observations in browser storage. Notes stay on the device.
- Visit the [virtual Aviary](https://framevr.io/eduaviary2).

The 3D labs use articulated mesh geometry rendered by Three.js. The soaring calculation uses a modelled golden eagle cruise speed of 16 m/s from Chatterjee et al. (2007) and a conservative best glide sink rate of 0.75 m/s used by Garstang et al. (2022). The student chooses the rising air speed and starting height. The calculation assumes a straight glide in steady air: vertical speed = rising air speed − 0.75 m/s; horizontal distance = 16 m/s × elapsed time. It does not simulate turns, changing wing posture, wind drift or powered flapping. The 3D scene is schematically scaled. Flocking follows adjustable teaching rules and reports model units, not measured metres. The birds are custom 3D feather meshes rather than SVGs. The field guide uses generated raster illustrations, not bird photographs. Models and illustrations are representative and should be compared with real observations.

## Artwork and third-party code

The PNGs in `assets/` were generated for EduBirds. The hero prompt requested a hand-painted Australian bushland scene with a kookaburra, rainbow lorikeet and superb fairywren, leaving space for a headline. The first portrait prompt requested a six-bird contact sheet of rainbow lorikeet, laughing kookaburra, barn owl, little penguin, superb fairywren and flamingo. The second requested golden eagle, great horned owl, white-faced heron, scarlet macaw and male ruby-throated hummingbird in five cells of a six-cell contact sheet.

The `assets/vendor/` files are Three.js 0.186.1 from the npm package `three`. Its MIT license is included as `THREE-LICENSE.txt`.

## Reading and fact sources

- [Australian Museum: birds](https://australian.museum/learn/animals/birds/)
- [BirdLife Australia: rainbow lorikeet](https://birdlife.org.au/bird-profiles/rainbow-lorikeet/)
- [Cornell Lab: golden eagle](https://www.allaboutbirds.org/guide/Golden_Eagle/overview)
- [Cornell Lab: great horned owl](https://www.allaboutbirds.org/guide/Great_Horned_Owl/overview)
- [New Zealand Birds Online: white-faced heron](https://nzbirdsonline.org.nz/species/white-faced-heron)
- [Animal Diversity Web: scarlet macaw](https://animaldiversity.org/accounts/Ara_macao/)
- [Cornell Lab: ruby-throated hummingbird](https://www.allaboutbirds.org/guide/Ruby-throated_Hummingbird/overview)
- [Chatterjee et al. (2007): aerodynamic data, Table 1](https://www.pnas.org/doi/10.1073/pnas.0702040104)
- [Garstang et al. (2022): instrumented golden eagle flight](https://pmc.ncbi.nlm.nih.gov/articles/PMC9179650/)
- [NSW Curriculum: Science and Technology K–6 (2024)](https://curriculum.nsw.edu.au/learning-areas/science/science-and-technology-k-6-2024/overview)

EduBirds is written for Stage 2–3 learners. It does not claim formal syllabus outcome mapping.
