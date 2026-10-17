// Frequencies are full wingbeat cycles per second. An estimate transfers a
// measured reference using Pennycuick's mass^-1/6 scaling for similar birds.
// This is a teaching approximation, not a measurement of the selected species.
export const scalingSource='https://journals.biologists.com/jeb/article/199/7/1613/7344/Wingbeat-Frequency-of-Birds-in-Steady-Cruising';
export const comparisonDataset='https://cdn.elifesciences.org/articles/89968/elife-89968-supp3-v1.pdf';
const estimate=(massG,referenceMassG,referenceHz,reference,source,massSource)=>({
  hz:referenceHz*Math.pow(massG/referenceMassG,-1/6),kind:'estimate',
  basis:`Size-scaled from ${reference} (${referenceHz} beats/s); ${massG} g model mass.`,
  source,massSource
});
export const wingbeats={
  lorikeet:estimate(125,85,7.64,'cockatiel',comparisonDataset,'https://nre.tas.gov.au/Documents/Rainbow-Lorikeet-final.pdf'),
  kookaburra:estimate(400,293,6.7,'rock pigeon (a coarse size proxy)',comparisonDataset,'https://museum-publications.australian.museum/media/dd/Uploads/Documents/38306/ANH_vXXI_02_lowres.e43ac40.pdf'),
  owl:{hz:4.4,kind:'measured',basis:'Wild barn owls: 4.4 ± 0.4 beats/s across 134,919 wingbeats.',source:'https://nora.nerc.ac.uk/id/eprint/533121/1/rsif.2022.0168.pdf'},
  fairywren:estimate(9,13.3,27,'zebra finch',comparisonDataset,'https://pmc.ncbi.nlm.nih.gov/articles/PMC12105795/'),
  flamingo:estimate(3000,2140,2.6,'grey heron (a coarse waterbird proxy)',comparisonDataset,'https://www.chesterzoo.org/animals/greater-flamingo'),
  eagle:{hz:2.5,kind:'measured',basis:'Wild golden eagles flapped at about 2.5 beats/s; soaring has no wingbeats.',source:'https://arxiv.org/abs/2412.00231'},
  'horned-owl':estimate(1500,398,4.5,'tawny owl',comparisonDataset,'https://www.allaboutbirds.org/news/bird-cams-faq-great-horned-owl-nest/'),
  heron:estimate(550,2140,2.6,'grey heron',comparisonDataset,'https://nzbirdsonline.org.nz/species/white-faced-heron'),
  macaw:estimate(1080,85,7.64,'cockatiel (a coarse parrot proxy)',comparisonDataset,'https://parrots.org/encyclopedia/scarlet-macaw/'),
  hummingbird:{hz:53,kind:'reported',basis:'Cornell Lab reports about 53 wingbeats/s for this species.',source:'https://www.allaboutbirds.org/guide/Ruby-throated_Hummingbird/overview'},
  crow:estimate(550,387.6,6.4,'American crow',comparisonDataset,'https://www.absa.asn.au/wp-content/uploads/2016/01/Torresian-Crow.pdf')
};
export const beatsPerMinute=(hz)=>Math.round(hz*60);
export const displayBpm=(data)=>data.kind==='estimate'
  ? Math.round(beatsPerMinute(data.hz)/(data.hz>=20?100:50))*(data.hz>=20?100:50)
  : beatsPerMinute(data.hz);
