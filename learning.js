// Student investigations extend the field-guide data in app.js.
const learningBirds = document.querySelectorAll('#compareA, #compareB');
const comparisonGrid = document.querySelector('#compareGrid');
const missionStorageKey = 'eduaviary-wetland-mission-v1';

for (const picker of learningBirds) {
  for (const bird of birds) {
    const option = document.createElement('option');
    option.value = bird.id;
    option.textContent = bird.name;
    picker.append(option);
  }
}
document.querySelector('#compareA').value = 'heron';
document.querySelector('#compareB').value = 'lorikeet';

function addComparisonDetail(parent, label, value) {
  const row = document.createElement('div');
  const heading = document.createElement('strong');
  const text = document.createElement('p');
  heading.textContent = label;
  text.textContent = value;
  row.append(heading, text);
  parent.append(row);
}

function renderComparison() {
  comparisonGrid.replaceChildren();
  for (const id of [document.querySelector('#compareA').value, document.querySelector('#compareB').value]) {
    const bird = birds.find(item => item.id === id);
    const card = document.createElement('article');
    card.className = 'comparison-card';
    const art = document.createElement('div');
    art.className = 'bird-art comparison-art';
    art.setAttribute('role', 'img');
    setArt(art, bird);
    const content = document.createElement('div');
    content.className = 'comparison-copy';
    const name = document.createElement('h3');
    name.textContent = bird.name;
    const role = document.createElement('p');
    role.className = 'comparison-role';
    role.textContent = bird.tag;
    content.append(name, role);
    addComparisonDetail(content, 'WHERE IT LIVES', bird.place);
    addComparisonDetail(content, 'FOOD', bird.diet);
    addComparisonDetail(content, 'BEAK & FEEDING', bird.features.beak.text);
    addComparisonDetail(content, 'FEET & HABITAT', bird.features.feet.text);
    addComparisonDetail(content, 'WINGS & FEATHERS', bird.features.feathers.text);
    card.append(art, content);
    comparisonGrid.append(card);
  }
}
learningBirds.forEach(picker => picker.addEventListener('change', renderComparison));
renderComparison();

function missionResponse() {
  return {
    bird: document.querySelector('input[name="wetlandBird"]:checked')?.value || '',
    evidence: document.querySelector('#missionEvidence').value,
    reason: document.querySelector('#missionReason').value.trim()
  };
}
function saveMission() {
  try { localStorage.setItem(missionStorageKey, JSON.stringify(missionResponse())); } catch { /* Local storage may be disabled. */ }
}
try {
  const saved = JSON.parse(localStorage.getItem(missionStorageKey) || 'null');
  if (saved && typeof saved === 'object') {
    const radio = document.querySelector(`input[name="wetlandBird"][value="${saved.bird}"]`);
    if (radio) radio.checked = true;
    if (['legs', 'tongue', 'colour'].includes(saved.evidence)) document.querySelector('#missionEvidence').value = saved.evidence;
    if (typeof saved.reason === 'string') document.querySelector('#missionReason').value = saved.reason.slice(0, 450);
  }
} catch { /* The investigation remains usable without storage. */ }
document.querySelectorAll('input[name="wetlandBird"], #missionEvidence, #missionReason').forEach(control => control.addEventListener('input', saveMission));

document.querySelector('#checkMission').addEventListener('click', () => {
  const response = missionResponse();
  const feedback = document.querySelector('#missionFeedback');
  saveMission();
  if (!response.bird || !response.evidence) {
    feedback.textContent = 'Choose a bird and an observation first. Use the comparison cards for clues.';
  } else if (response.bird !== 'heron') {
    feedback.textContent = 'Look again at where each bird finds food. Which bird has legs for standing in shallow water?';
  } else if (response.evidence !== 'legs') {
    feedback.textContent = 'The heron fits the wetland. Now choose the feature that helps it reach and catch food there.';
  } else if (response.reason.length < 25) {
    feedback.textContent = 'Good evidence. Add a sentence explaining how the legs or bill help the heron in shallow water.';
  } else {
    feedback.textContent = 'Your bird and feature match the habitat. Read your explanation: does it connect the feature to finding food? A teacher or classmate can check your reasoning.';
  }
});

document.querySelector('#exportResponse').addEventListener('click', () => {
  const response = missionResponse();
  const birdName = response.bird === 'heron' ? 'White-faced heron' : response.bird === 'lorikeet' ? 'Rainbow lorikeet' : 'Not chosen';
  const evidenceName = { legs: 'Long legs and a pointed bill', tongue: 'A brush-tipped tongue', colour: 'Brightly coloured feathers' }[response.evidence] || 'Not chosen';
  const fieldNotes = notes.map((note, index) => `${index + 1}. ${note.bird}${note.place ? ` — ${note.place}` : ''}\n   ${note.text}`).join('\n\n') || 'No field observations saved.';
  let trialSummary = 'No flight trials recorded.';
  try {
    const savedTrials = JSON.parse(localStorage.getItem('eduaviary-flight-trials-v1') || '[]');
    if (Array.isArray(savedTrials) && savedTrials.length) trialSummary = savedTrials.map((trial, index) => `${index + 1}. ${trial.style}, ${trial.beatRate} beats/s, airspeed ${trial.airspeed} m/s, spread ${Math.round(trial.spread * 100)}%: ${trial.change >= 0 ? '+' : ''}${Number(trial.change).toFixed(1)} m`).join('\n');
  } catch { /* The student can still export the mission. */ }
  const content = `EDUAVIARY — BIRD DETECTIVE MISSION\n\nQuestion: Which bird fits a shallow wetland?\nClaim: ${birdName}\nEvidence: ${evidenceName}\nExplanation: ${response.reason || 'Not written'}\n\nFLIGHT TRIALS\n${trialSummary}\n\nFIELD JOURNAL\n${fieldNotes}\n\nGenerated illustrations and the flight simulation are learning aids. Check claims against real observations and linked sources.\n`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'EDUAVIARY-bird-investigation.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#missionFeedback').textContent = 'Your response and field notes were saved as a text file.';
});
