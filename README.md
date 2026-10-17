# EDUAVIARY

An interactive field guide and 3D aviary lab for NSW Stage 2 and 3 students. The public brand is EDUAVIARY; the existing `edubirds` repository and Pages URL remain in place so links continue working. The site can be published directly from the root of the `main` branch with GitHub Pages. It uses static HTML, CSS and JavaScript; no build step, server-side service or account is required.

## Run locally

From this repository's root:

```powershell
python -m http.server 8766
```

Open <http://127.0.0.1:8766/>. The 3D lab is at `/simulations.html`. A local HTTP server is needed because the lab imports JavaScript modules.

## Publish from `main`

In **Settings → Pages**, choose **Deploy from a branch**, then select **main** and **/(root)**. GitHub Pages will serve `index.html` and `simulations.html` from the branch. The expected Pages address is <https://edumetaverse.github.io/edubirds/> after Pages is enabled and the first deployment completes.

## Student activities

- Explore bird basics, 12 field guide profiles and adaptations of beaks, feet and feathers.
- Filter birds by habitat and open illustrated field notes.
- Compare flight, swimming, hovering and soaring.
- Explore how birds fly in a 3D four-force lab: vary wingbeat rate, compare flapping and gliding, or alternate them every three seconds; change airspeed and wing spread to make the bird rise or sink. Use a separate 3D flocking lab to test spacing, direction matching and cohesion. In the third lab, select any two of the eleven flying bird species, compare their custom 3D models and generated portraits, and choose only their supported movement modes: fly, soar or hover. Each comparison shows a sourced wingbeat rate or a labelled size-based estimate. The little penguin remains in the twelve-bird field guide but is not a flight-comparison choice.
- Answer seven beak questions and five habitat challenges.
- Save up to ten field observations in browser storage. Notes stay on the device.
- Visit the [virtual Aviary](https://framevr.io/eduaviary2).
- Complete a guided wetland mission: compare birds, choose a claim and evidence, explain the relationship, and export the response with local field notes and flight trials.
- Compare any two birds side by side and check generated portraits against linked real photographs and bird recordings.
- Run six-second flight trials from a shared starting height, graph altitude, and compare saved results while changing one control at a time.
- Use the printable [teacher guide](teacher.html) for a 25-minute lesson, stage adjustments, suggested syllabus links and assessment checks.

The 3D labs use articulated vector mesh geometry rendered by Three.js. The bird's shoulder joints sweep through a pronounced upstroke and downstroke, and the outer wings fold slightly on the recovery stroke. The flight lesson shows a general bird and the four forces: lift, weight, thrust and drag. Its numeric airflow-lift example uses a published golden eagle reference (mass 4.6 kg, weight 45 N, wing area 0.65 m², modelled cruise speed 16 m/s) from Chatterjee et al. (2007) solely to set a scale. It calculates airflow lift with NASA's equation L = ½ρv²SCL and standard sea-level air density 1.225 kg/m³, with a fixed lift coefficient calibrated so lift equals 45 N at the reference condition. Each beat per second contributes an assumed 5 N of average powered lift, an illustrative teaching value rather than measured species data. Vertical resistance is modelled as -1.5v|v| N, and the model integrates vertical acceleration as (total lift - weight + vertical resistance) / 4.6 kg. Height is bounded at 0 and 60 m. Forward thrust and drag remain qualitative, while the airspeed slider holds forward speed fixed. The bird's 3D vertical displacement compresses height for visibility. Flocking follows adjustable teaching rules and reports model units, not measured metres. The birds are custom 3D feather meshes rather than SVGs. In adaptation comparisons, model phases now use the rates in `wingbeat-data.js` at one eighth of real time; this common slow-motion factor preserves relative timing and avoids display aliasing for the hummingbird. Species descriptions and movement availability are source-based, but the 3D shapes and sizes remain simplified. The field guide uses generated raster illustrations, not bird photographs. Models and illustrations are representative and should be compared with real observations. [Wingbeat methods and all eleven sources](wingbeat-method.html) explain what was measured, reported, or estimated.

## Artwork and third-party code

The revised hero image, `assets/bushland-hero-v2.png`, was generated with a prompt to retain the hand-painted Australian bushland scene and all three birds while zooming out enough to show the kookaburra from crown to complete tail with clear margins.

The bird portraits in `assets/` were generated for EDUAVIARY. The hero prompt requested a hand-painted Australian bushland scene with a kookaburra, rainbow lorikeet and superb fairywren, leaving space for a headline. The first portrait prompt requested a six-bird contact sheet of rainbow lorikeet, laughing kookaburra, barn owl, little penguin, superb fairywren and flamingo. The second requested golden eagle, great horned owl, white-faced heron, scarlet macaw and male ruby-throated hummingbird in five cells of a six-cell contact sheet. The Torresian crow portrait was generated separately as a square natural-history illustration and saved as WebP for the site. The EDUmetaverse logo comes from the official EDUmetaverse website and is used in the banner on all three pages. The banner reads “An Edumetaverse Immersive Learning Experience”.

The `assets/vendor/` files are Three.js 0.186.1 from the npm package `three`. Its MIT license is included as `THREE-LICENSE.txt`.

## Reading and fact sources

- [Australian Museum: birds](https://australian.museum/learn/animals/birds/)
- [Australian Museum: Torresian crow](https://australian.museum/learn/animals/birds/torresian-crow/)
- [BirdLife Australia: rainbow lorikeet](https://birdlife.org.au/bird-profiles/rainbow-lorikeet/)
- [Cornell Lab: golden eagle](https://www.allaboutbirds.org/guide/Golden_Eagle/overview)
- [Cornell Lab: great horned owl](https://www.allaboutbirds.org/guide/Great_Horned_Owl/overview)
- [New Zealand Birds Online: white-faced heron](https://nzbirdsonline.org.nz/species/white-faced-heron)
- [Animal Diversity Web: scarlet macaw](https://animaldiversity.org/accounts/Ara_macao/)
- [Cornell Lab: ruby-throated hummingbird](https://www.allaboutbirds.org/guide/Ruby-throated_Hummingbird/overview)
- [Chatterjee et al. (2007): aerodynamic data, Table 1](https://www.pnas.org/doi/10.1073/pnas.0702040104)
- [NASA: the lift equation](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-equation/)
- [NASA: standard sea-level air density](https://ntrs.nasa.gov/api/citations/20030033031/downloads/20030033031.pdf)
- [NSW Curriculum: Science and Technology K–6 (2024)](https://curriculum.nsw.edu.au/learning-areas/science/science-and-technology-k-6-2024/overview)

EDUAVIARY is written for Stage 2–3 learners. Suggested teacher connections are not a formal syllabus outcome mapping.
