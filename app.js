const birds = [
  {
    id:'lorikeet',name:'Rainbow lorikeet',scientific:'Trichoglossus moluccanus',origin:'AUSTRALIA',habitat:'woodland',place:'Woodlands & gardens',position:'0% 0%',tag:'Flower visitor',
    summary:'A colourful parrot often seen moving noisily between flowering trees in eastern Australia.',
    diet:'Mostly nectar and pollen, with some fruit, seeds and insects.',
    superpower:'Its brush-tipped tongue helps collect nectar and pollen from flowers.',
    question:'Look closely: why would a tongue that reaches into flowers be useful?',
    features:{beak:{title:'A flower-feeding specialist',text:'A curved beak helps the lorikeet climb and handle food. Its brush-tipped tongue collects nectar and pollen from flowers.'},feet:{title:'Grip and climb',text:'Like other parrots, it has two toes pointing forward and two backward. This helps it grip branches and climb around flowers.'},feathers:{title:'Bright travelling colours',text:'Wings carry it between flowering trees. Its colourful feathers can also help lorikeets recognise one another.'}}
  },
  {
    id:'kookaburra',name:'Laughing kookaburra',scientific:'Dacelo novaeguineae',origin:'AUSTRALIA',habitat:'woodland',place:'Woodlands & parks',position:'50% 0%',tag:'Perch hunter',
    summary:'This large kingfisher is famous for a laughing call and often watches for food from a branch.',
    diet:'Insects, worms and other small animals; it may also catch reptiles or frogs.',
    superpower:'It spots prey from a perch, swoops down and catches it with a strong beak.',
    question:'How might a lookout branch help a kookaburra find food?',
    features:{beak:{title:'A strong catching beak',text:'Its sturdy, pointed beak helps it catch and hold insects and other small animals.'},feet:{title:'A steady lookout',text:'Gripping feet keep it secure on a branch while it watches the ground for moving prey.'},feathers:{title:'A quick swoop',text:'Its wings help it leave a perch quickly and swoop towards food on the ground.'}}
  },
  {
    id:'owl',name:'Barn owl',scientific:'Tyto alba',origin:'AROUND THE WORLD',habitat:'grassland',place:'Grasslands & open country',position:'100% 0%',tag:'Night hunter',
    summary:'A pale owl that often hunts over open country after dark.',
    diet:'Mostly small mammals such as mice.',
    superpower:'Its heart-shaped face helps direct sound towards its ears, while special feathers help it fly quietly.',
    question:'Why might quiet flight help a bird hunting at night?',
    features:{beak:{title:'A hooked beak',text:'A short, hooked beak helps the owl tear food into pieces after it catches prey.'},feet:{title:'Grasping talons',text:'Sharp claws, called talons, help it seize and hold small animals.'},feathers:{title:'The quiet approach',text:'Soft, fringed flight feathers reduce noise as it flies. This can help it hear prey and approach unnoticed.'}}
  },
  {
    id:'penguin',name:'Little penguin',scientific:'Eudyptula minor',origin:'AUSTRALIA & NEW ZEALAND',habitat:'coast',place:'Coasts & ocean',position:'0% 100%',tag:'Ocean swimmer',
    summary:'The smallest penguin species spends much of its life at sea and returns to land to rest and breed.',
    diet:'Small fish and other tiny sea animals.',
    superpower:'Its stiff, flipper-like wings propel it underwater.',
    question:'What is different about the way this bird uses its wings?',
    features:{beak:{title:'Catching food at sea',text:'A pointed beak helps it catch slippery fish and other small sea animals.'},feet:{title:'Steering and walking',text:'Webbed feet help it steer in water and move on land.'},feathers:{title:'A swimming suit',text:'Dense, water-resistant feathers help keep cold water away from its body. Its flipper-like wings power its swimming.'}}
  },
  {
    id:'fairywren',name:'Superb fairywren',scientific:'Malurus cyaneus',origin:'AUSTRALIA',habitat:'woodland',place:'Shrublands & gardens',position:'50% 100%',tag:'Tiny insect hunter',
    summary:'A small Australian songbird that darts through low plants looking for insects.',
    diet:'Mostly insects and other small invertebrates.',
    superpower:'A slim, pointed beak helps it pick tiny prey from leaves and stems.',
    question:'Where might a small bird look for insects in a garden?',
    features:{beak:{title:'Small and precise',text:'Its narrow, pointed beak can pick insects from leaves, stems and the ground.'},feet:{title:'Perching in plants',text:'Small gripping feet help it move among twigs and shrubs while searching for food.'},feathers:{title:'A signal in blue',text:'Breeding males have vivid blue and black feathers. Females and non-breeding males are mostly brown; colour can help birds recognise one another.'}}
  },
  {
    id:'flamingo',name:'Flamingo',scientific:'Phoenicopteridae family',origin:'AROUND THE WORLD',habitat:'wetland',place:'Wetlands & salt lakes',position:'100% 100%',tag:'Shallow-water filterer',
    summary:'A tall wetland bird that feeds with its head turned upside down in shallow water.',
    diet:'Tiny water animals and algae, depending on the species.',
    superpower:'Its specialised bill filters small food from water and mud.',
    question:'What advantage do long legs give a bird feeding in shallow water?',
    features:{beak:{title:'A living filter',text:'A flamingo turns its head upside down and uses its bent bill and tongue to filter tiny food from water.'},feet:{title:'Long wading legs',text:'Long legs let it stand and search for food in shallow water while much of its body stays dry.'},feathers:{title:'Colour from food',text:'Flamingos get pink colour from pigments in the food they eat. They still have wings and can fly.'}}
  },
  {
    id:'eagle',name:'Golden eagle',scientific:'Aquila chrysaetos',origin:'NORTHERN HEMISPHERE',habitat:'grassland',place:'Open country & mountains',position:'0% 0%',atlas:'new',tag:'Soaring hunter',
    summary:'A large bird of prey with golden feathers on the back of its head and neck.',
    diet:'Mostly small to medium mammals, including rabbits and hares.',
    superpower:'Broad wings help it soar while powerful talons grasp prey.',
    question:'Why might soaring help a hunter search a wide open area?',
    features:{beak:{title:'A hooked tearing beak',text:'Its strong, hooked beak helps tear food into pieces after a catch.'},feet:{title:'Powerful talons',text:'Strong feet and sharp talons grip prey securely.'},feathers:{title:'Wings for soaring',text:'Wide wings help it ride rising air and search large areas while using less energy than constant flapping.'}}
  },
  {
    id:'horned-owl',name:'Great horned owl',scientific:'Bubo virginianus',origin:'THE AMERICAS',habitat:'woodland',place:'Forests & open country',position:'50% 0%',atlas:'new',tag:'Quiet night hunter',
    summary:'A powerful owl with feather tufts that look like horns. The tufts are feathers, not ears.',
    diet:'A wide variety of animals, especially mammals and birds.',
    superpower:'Sensitive hearing and soft feathers help it hunt quietly.',
    question:'How could a quiet approach help an owl catch food?',
    features:{beak:{title:'A sharp, hooked beak',text:'A hooked beak helps it tear the prey it catches.'},feet:{title:'Strong grasping feet',text:'Large talons can seize and hold animals securely.'},feathers:{title:'Quiet and warm',text:'Very soft feathers help it fly quietly and stay warm. Facial feathers direct sounds towards its ears; the head tufts are not ears.'}}
  },
  {
    id:'heron',name:'White-faced heron',scientific:'Egretta novaehollandiae',origin:'AUSTRALIA & NEW ZEALAND',habitat:'wetland',place:'Wetlands & damp grass',position:'100% 0%',atlas:'new',tag:'Patient wader',
    summary:'A blue-grey waterbird with a white face, often seen standing or walking near water.',
    diet:'Fish, insects, amphibians and other small animals.',
    superpower:'Long legs help it move through shallow water while it searches for prey.',
    question:'What does standing still let a heron notice in the water?',
    features:{beak:{title:'A long pointed bill',text:'Its slim, pointed bill helps it catch small animals it spots in water or damp ground.'},feet:{title:'Built for wading',text:'Long legs help it walk through shallow water and search among wet places.'},feathers:{title:'A slow, steady flyer',text:'Broad wings carry it between feeding places. White-faced herons often have a slow, bouncing flight.'}}
  },
  {
    id:'macaw',name:'Scarlet macaw',scientific:'Ara macao',origin:'CENTRAL & SOUTH AMERICA',habitat:'rainforest',place:'Tropical rainforest',position:'0% 100%',atlas:'new',tag:'Rainforest climber',
    summary:'A large red, yellow and blue parrot that moves through tropical forest trees.',
    diet:'Fruit, seeds and nuts, with some flowers and nectar.',
    superpower:'Its strong curved beak can open tough food, while grasping feet help it climb.',
    question:'Why would a powerful beak help a bird that eats hard nuts?',
    features:{beak:{title:'A powerful nut opener',text:'A large curved beak can break into tough fruits, seeds and nuts.'},feet:{title:'Feet like helpers',text:'Two toes point forward and two backward. These strong feet help it grip branches and hold food.'},feathers:{title:'Across the canopy',text:'Wings and a long tail help it travel and steer among rainforest trees.'}}
  },
  {
    id:'hummingbird',name:'Ruby-throated hummingbird',scientific:'Archilochus colubris',origin:'NORTH AMERICA',habitat:'woodland',place:'Open woodlands & gardens',position:'50% 100%',atlas:'new',tag:'Flower hoverer',
    summary:'A tiny bird whose males can flash a brilliant red throat in the sunlight.',
    diet:'Flower nectar, plus small insects and spiders.',
    superpower:'It can hover in one place while drinking nectar from flowers.',
    question:'How is hovering helpful when a flower has no place to perch?',
    features:{beak:{title:'Reaching into flowers',text:'Its long, slender bill and extendable tongue help it reach nectar deep inside flowers.'},feet:{title:'Tiny perching feet',text:'Its small feet are useful for gripping a twig when resting, but it usually moves between flowers by flying.'},feathers:{title:'Hovering wings',text:'Fast wing movements let it hover, move sideways and even fly backwards. A male’s ruby throat is a colourful display.'}}
  }
];

const $ = (selector) => document.querySelector(selector);
const birdGrid = $('#birdGrid');
const select = $('#birdSelect');
let activeBird = birds[0];
let activeFeature = 'beak';

function setArt(element,bird){element.style.backgroundImage=bird.atlas==='new'?"url('assets/additional-birds.png')":'';element.style.backgroundPosition=bird.position;element.setAttribute('aria-label',`Illustration of a ${bird.name.toLowerCase()}`)}
function renderBirds(filter='all'){
  birdGrid.replaceChildren();
  const visible=birds.filter(b=>filter==='all'||b.habitat===filter);
  visible.forEach(bird=>{
    const card=document.createElement('button');card.type='button';card.className='bird-card';card.setAttribute('aria-label',`Open field notes for ${bird.name}`);
    const art=document.createElement('div');art.className='bird-art';art.setAttribute('role','img');setArt(art,bird);
    const lower=document.createElement('div');lower.className='bird-card-bottom';
    const topline=document.createElement('div');topline.className='bird-card-topline';
    const origin=document.createElement('span');origin.textContent=bird.origin;
    const arrow=document.createElement('span');arrow.className='card-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
    topline.append(origin,arrow);
    const title=document.createElement('h3');title.textContent=bird.name;
    const meta=document.createElement('p');meta.textContent=`${bird.place} · ${bird.tag}`;
    lower.append(topline,title,meta);card.append(art,lower);card.addEventListener('click',()=>openBird(bird));birdGrid.append(card);
  });
}
renderBirds();
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});
  button.classList.add('active');button.setAttribute('aria-pressed','true');renderBirds(button.dataset.filter);
}));

const basics=[
  {bird:birds[4],label:'FEATURE 01 / FEATHERS',title:'Feathers are a bird’s special covering.',text:'All birds have feathers. They can help with warmth, flight, waterproofing, camouflage or signalling. Not every bird flies, but every living bird has feathers.',clue:'Compare: an owl’s soft flight feathers and a penguin’s dense water-resistant feathers do different jobs.'},
  {bird:birds[0],label:'FEATURE 02 / BEAKS',title:'A beak is a tool for a way of life.',text:'Birds have beaks instead of teeth. The size and shape of a beak can give clues about the food a bird eats and how it collects that food.',clue:'Compare: a lorikeet reaches flowers, while a flamingo filters food from water.'},
  {bird:birds[1],label:'FEATURE 03 / GROWING UP',title:'Birds begin life inside eggs.',text:'A developing chick grows inside an egg. After hatching, some chicks need lots of feeding and protection; others can move around quite soon. Birds do not all raise young in the same way.',clue:'Notice: a nest or safe shelter can protect eggs and young birds.'},
  {bird:birds[5],label:'FEATURE 04 / CONNECTIONS',title:'Birds are part of living systems.',text:'Birds eat plants or animals, and may become food for other animals. Some move pollen between flowers or spread seeds. Where they live affects the food and shelter they can find.',clue:'Ask: what might change if a habitat lost many of its birds?'}
];
function updateBasics(index){const item=basics[index],panel=$('#basicsPanel');panel.replaceChildren();const art=document.createElement('div');art.className='basics-art bird-art';art.setAttribute('role','img');setArt(art,item.bird);const copy=document.createElement('div');copy.className='basics-copy';const label=document.createElement('span');label.textContent=item.label;const title=document.createElement('h3');title.textContent=item.title;const text=document.createElement('p');text.textContent=item.text;const clue=document.createElement('strong');clue.textContent=item.clue;copy.append(label,title,text,clue);panel.append(art,copy);document.querySelectorAll('.basics-list button').forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1});panel.setAttribute('aria-labelledby',`basicTab${index}`)}
document.querySelectorAll('.basics-list button').forEach((tab,index)=>{tab.addEventListener('click',()=>updateBasics(index));tab.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowRight'||event.key==='ArrowUp'||event.key==='ArrowLeft'){event.preventDefault();const next=(index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1)+basics.length)%basics.length;updateBasics(next);$(`#basicTab${next}`).focus()}})});updateBasics(0);

const dialog=$('#birdDialog');
function openBird(bird){
  setArt($('#dialogArt'),bird);$('#dialogOrigin').textContent=`FIELD GUIDE / ${bird.origin}`;$('#dialogTitle').textContent=bird.name;$('#dialogScientific').textContent=bird.scientific;$('#dialogSummary').textContent=bird.summary;
  const facts=$('#dialogFacts');facts.replaceChildren();
  [['HABITAT',bird.place],['FOOD',bird.diet],['SPECIAL FEATURE',bird.superpower]].forEach(([label,value])=>{const row=document.createElement('div');const strong=document.createElement('strong');strong.textContent=label;const span=document.createElement('span');span.textContent=value;row.append(strong,span);facts.append(row)});
  $('#dialogQuestion').textContent=`Think about it: ${bird.question}`;dialog.showModal();
}
$('#closeDialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});

birds.forEach((bird,index)=>{const option=document.createElement('option');option.value=bird.id;option.textContent=bird.name;select.append(option)});
function updateLab(){
  setArt($('#labArt'),activeBird);$('#labCommon').textContent=activeBird.name;$('#labScientific').textContent=activeBird.scientific;$('#specimenNumber').textContent=`${String(birds.indexOf(activeBird)+1).padStart(2,'0')} / ${String(birds.length).padStart(2,'0')}`;
  const feature=activeBird.features[activeFeature];const copy=$('#featureCopy');copy.replaceChildren();const title=document.createElement('strong');title.textContent=feature.title;const text=document.createElement('p');text.textContent=feature.text;copy.append(title,text);
}
select.addEventListener('change',()=>{activeBird=birds.find(b=>b.id===select.value)||birds[0];updateLab()});
document.querySelectorAll('.feature-button').forEach(button=>button.addEventListener('click',()=>{activeFeature=button.dataset.feature;document.querySelectorAll('.feature-button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});updateLab()}));
updateLab();

const movements=[
  {bird:birds[2],label:'THE BARN OWL',title:'Almost silent flight',body:'Owls have soft flight feathers with fringed edges. These reduce the noise made as air moves over the wings. Quiet flight helps an owl listen for prey and approach it.',clue:'Look for: broad wings and soft feather edges.'},
  {bird:birds[3],label:'THE LITTLE PENGUIN',title:'Flying through water',body:'A penguin is a bird with wings, but it does not fly through air. Its wings act like stiff flippers, pushing against water so it can chase food underwater.',clue:'Look for: compact wings and a streamlined body.'},
  {bird:birds[10],label:'THE RUBY-THROATED HUMMINGBIRD',title:'Hovering at a flower',body:'A hummingbird can hold its position in midair to reach nectar. It can move sideways and backwards with fine control of its wings.',clue:'Look for: fast wing movements and a long, slender bill.'},
  {bird:birds[6],label:'THE GOLDEN EAGLE',title:'Soaring above open country',body:'A golden eagle can spread its broad wings and ride rising air. Soaring helps it search across wide areas without constant flapping.',clue:'Look for: wide wings and open air above the ground.'}
];
function updateMovement(index){
  const item=movements[index];const panel=$('#movementPanel');panel.replaceChildren();
  const art=document.createElement('div');art.className='movement-art bird-art';art.setAttribute('role','img');setArt(art,item.bird);
  const copy=document.createElement('div');copy.className='movement-copy';
  const label=document.createElement('span');label.textContent=item.label;const title=document.createElement('h3');title.textContent=item.title;const body=document.createElement('p');body.textContent=item.body;const clue=document.createElement('p');clue.className='movement-clue';clue.textContent=item.clue;copy.append(label,title,body,clue);panel.append(art,copy);
  document.querySelectorAll('.movement-tabs button').forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1});panel.setAttribute('aria-labelledby',`moveTab${index}`);
}
document.querySelectorAll('.movement-tabs button').forEach((tab,index)=>{tab.addEventListener('click',()=>updateMovement(index));tab.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=(index+(event.key==='ArrowRight'?1:-1)+movements.length)%movements.length;updateMovement(next);$(`#moveTab${next}`).focus()}})});updateMovement(0);

const quiz=[
  {question:'A bird needs to collect nectar from deep inside flowers. Which feature helps most?',choices:['A brush-tipped tongue','A broad filtering bill','A hooked tearing beak'],answer:0,why:'A lorikeet’s brush-tipped tongue helps collect nectar and pollen from flowers.'},
  {question:'A bird hunts small animals at night. Which feature helps it hold prey?',choices:['Long wading legs','Sharp gripping talons','A flat filtering bill'],answer:1,why:'An owl uses its talons to catch and hold small animals.'},
  {question:'A bird feeds on tiny food in shallow water. Which beak suits it best?',choices:['A bent filtering bill','A short seed-crushing beak','A straight spear-like beak'],answer:0,why:'A flamingo’s bent bill filters tiny food from water and mud.'},
  {question:'A bird searches shrubs for tiny insects. Which beak is useful?',choices:['A broad scoop','A slim pointed beak','A brush-tipped tongue'],answer:1,why:'A fairywren’s narrow beak can pick small insects from leaves and stems.'},
  {question:'A golden eagle has caught prey. Which beak helps it eat?',choices:['A hooked tearing beak','A flat filtering bill','A brush-tipped tongue'],answer:0,why:'A golden eagle uses its hooked beak to tear food into pieces.'},
  {question:'A macaw needs to open a hard nut. Which feature is most useful?',choices:['A tiny pointed bill','A large curved beak','A long wading leg'],answer:1,why:'A scarlet macaw’s powerful curved beak can break into tough nuts and seeds.'},
  {question:'A bird waits in shallow water for fish. Which bill helps it catch prey?',choices:['A long pointed bill','A broad filtering bill','A short seed-crushing beak'],answer:0,why:'A white-faced heron has a long pointed bill for catching small animals in water or damp ground.'}
];
let quizIndex=0,quizScore=0,quizAnswered=false;
function renderQuiz(){
  quizAnswered=false;const item=quiz[quizIndex];$('#quizProgress').textContent=`QUESTION ${quizIndex+1} OF ${quiz.length}`;$('#quizQuestion').textContent=item.question;$('#quizFeedback').textContent='';$('#quizNext').hidden=true;
  const choices=$('#quizChoices');choices.replaceChildren();item.choices.forEach((choice,index)=>{const button=document.createElement('button');button.type='button';button.textContent=choice;button.addEventListener('click',()=>{
    if(quizAnswered)return;quizAnswered=true;const correct=index===item.answer;if(correct)quizScore++;
    choices.querySelectorAll('button').forEach((b,i)=>{b.disabled=true;if(i===item.answer)b.classList.add('correct');else if(i===index)b.classList.add('incorrect')});
    $('#quizFeedback').textContent=`${correct?'Correct!':'Good try.'} ${item.why}`;$('#quizNext').hidden=false;$('#quizNext').textContent=quizIndex===quiz.length-1?'See your result →':'Next question →';
  });choices.append(button)});
}
$('#quizNext').addEventListener('click',()=>{if(quizIndex===quiz.length-1){$('#quizProgress').textContent='CHALLENGE COMPLETE';$('#quizQuestion').textContent=`You found ${quizScore} of ${quiz.length} answers!`;$('#quizChoices').replaceChildren();$('#quizFeedback').textContent=quizScore===quiz.length?'Excellent observing! Try the habitat challenge next.':'Every answer is a chance to learn. Have another go!';$('#quizNext').textContent='Try again →';$('#quizNext').hidden=false;quizIndex=-1;quizScore=0}else{quizIndex++;renderQuiz()}});
renderQuiz();

const habitats={
  water:{prompt:'A bird must swim for fish in cold sea water.',answer:'Dense water-resistant feathers',reason:'Dense, water-resistant feathers help a little penguin keep cold water away from its body.'},
  flowers:{prompt:'A bird visits flowering trees to find food.',answer:'A brush-tipped tongue',reason:'A brush-tipped tongue helps a lorikeet collect nectar and pollen from flowers.'},
  shallows:{prompt:'A bird searches for food while standing in shallow water.',answer:'Long wading legs',reason:'Long legs help a flamingo or heron reach feeding places in shallow water.'},
  rainforest:{prompt:'A large parrot must open tough nuts in the rainforest canopy.',answer:'A powerful curved beak',reason:'A scarlet macaw uses its strong curved beak to open tough nuts and seeds.'},
  tubular:{prompt:'A tiny bird hovers beside a tube-shaped flower.',answer:'A long slender bill',reason:'A hummingbird’s long bill and tongue help it reach nectar inside the flower.'}
};
const habitatFeatures=['Dense water-resistant feathers','A brush-tipped tongue','Long wading legs','Sharp grasping talons','A powerful curved beak','A long slender bill'];
let activeHabitat='water';
function renderHabitat(){const scene=habitats[activeHabitat];$('#habitatPrompt').textContent=scene.prompt;$('#habitatFeedback').textContent='';const options=$('#habitatOptions');options.replaceChildren();habitatFeatures.forEach(feature=>{const button=document.createElement('button');button.type='button';button.textContent=feature;button.addEventListener('click',()=>{options.querySelectorAll('button').forEach(b=>b.classList.remove('correct','incorrect'));button.classList.add(feature===scene.answer?'correct':'incorrect');$('#habitatFeedback').textContent=feature===scene.answer?`That fits! ${scene.reason}`:`Try another feature. ${feature} has a different job in this habitat.`});options.append(button)})}
document.querySelectorAll('.habitat-choice').forEach(button=>button.addEventListener('click',()=>{activeHabitat=button.dataset.habitat;document.querySelectorAll('.habitat-choice').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});renderHabitat()}));renderHabitat();

const noteKey='bird-lab-field-notes-v1';
let notes=[];try{const stored=JSON.parse(localStorage.getItem(noteKey)||'[]');if(Array.isArray(stored))notes=stored.slice(0,10)}catch{}
function renderNotes(){const list=$('#savedNotes');list.replaceChildren();notes.forEach((note,index)=>{const item=document.createElement('article');item.className='saved-note';const head=document.createElement('div');head.className='saved-note-head';const title=document.createElement('strong');title.textContent=note.bird;const del=document.createElement('button');del.type='button';del.textContent='Remove';del.setAttribute('aria-label',`Remove observation about ${note.bird}`);del.addEventListener('click',()=>{notes.splice(index,1);localStorage.setItem(noteKey,JSON.stringify(notes));renderNotes()});head.append(title,del);const body=document.createElement('p');body.textContent=note.text;item.append(head,body);list.append(item)})}
$('#saveNote').addEventListener('click',()=>{const bird=$('#birdSeen').value.trim();const text=$('#birdNote').value.trim();if(!bird||!text){$('#journalStatus').textContent='Please add a bird description and an observation first.';return}notes.unshift({bird,text});notes=notes.slice(0,10);try{localStorage.setItem(noteKey,JSON.stringify(notes));$('#journalStatus').textContent='Observation saved on this device.'}catch{$('#journalStatus').textContent='This browser could not save your observation.'}$('#birdSeen').value='';$('#birdNote').value='';renderNotes()});renderNotes();

const menuToggle=$('#menuToggle'),mobileNav=$('#mobileNav');menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!open));menuToggle.setAttribute('aria-label',open?'Open menu':'Close menu');mobileNav.hidden=open});mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileNav.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open menu')}));
