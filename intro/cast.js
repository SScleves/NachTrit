// Reference sheets for the shared sprites: gallery.html?only=cast and ?only=props.
// Not part of the game. Every artist draws the cast with these same functions.
(function () {
  const A = window.NRART;
  A.cast = (g, t) => {
    A.sky(g, ['night2', 'night3', 'night4'], 0, 180);
    A.key(g, 300, -40, 1);
    A.rect(g, 0, 62, 320, 2, 'slate2'); A.rect(g, 0, 120, 320, 2, 'slate2'); A.rect(g, 0, 172, 320, 8, 'slate2');
    // row 1: the man
    A.man(g, 10, 62, { t, facing: 'front' });
    A.man(g, 26, 62, { t, facing: 'front', face: 'worry' });
    A.man(g, 42, 62, { t, facing: 'front', face: 'smug' });
    A.man(g, 58, 62, { t, facing: 'front', face: 'talk' });
    A.man(g, 74, 62, { t, facing: 'front', face: 'shock' });
    A.man(g, 90, 62, { t, facing: 'back' });
    A.man(g, 106, 62, { t, facing: 'right' });
    A.man(g, 122, 62, { t, facing: 'right', pose: 'walk' });
    A.man(g, 140, 62, { t, facing: 'left', pose: 'walk', face: 'talk' });
    A.man(g, 156, 62, { t, facing: 'right', arm: 'wave' });
    A.man(g, 176, 62, { t, facing: 'front', hold: 'helmet' });
    A.man(g, 200, 52, { t, facing: 'front', pose: 'sit', floor: 10 }); A.rect(g, 192, 52, 16, 2, 'wood3');
    A.man(g, 224, 52, { t, facing: 'right', pose: 'sit', floor: 10 }); A.rect(g, 216, 52, 10, 2, 'wood3');
    A.friend(g, 254, 62, { t, face: 'talk' });
    A.friend(g, 276, 62, { t, arm: 'wave' });
    A.friend(g, 300, 62, { t, arm: 'drink' });
    // row 2: the dead
    A.zombie(g, 12, 120, { t, variant: 'plain', seed: 1 });
    A.zombie(g, 40, 120, { t, variant: 'hat', seed: 2, pose: 'walk' });
    A.zombie(g, 68, 120, { t, variant: 'bonnet', seed: 3 });
    A.zombie(g, 96, 120, { t, variant: 'cheese', seed: 4 });
    A.zombie(g, 124, 120, { t, variant: 'phone', seed: 5 });
    A.zombie(g, 152, 120, { t, variant: 'plain', seed: 6, carry: 'cheese', hunch: 0.9 });
    A.zombie(g, 180, 120, { t, variant: 'plain', seed: 7, facing: 'left', pose: 'walk' });
    A.tallWoman(g, 206, 120, { t });
    A.tallWoman(g, 230, 120, { t, seed: 9, facing: 'left', phone: false });
    A.zombie(g, 254, 120, { t, height: 34, tone: 'night1', seed: 10 });
    A.zombie(g, 272, 120, { t, height: 24, tone: 'mist1', seed: 11 });
    A.zombie(g, 290, 120, { t, height: 18, tone: 'mist2', seed: 12 });
    A.duck(g, 308, 120, { t });
    // row 3: bikes and dogs
    A.omafiets(g, 30, 172, { t, rider: true, basket: 'book' });
    A.omafiets(g, 90, 172, { t, rider: false });
    A.omafiets(g, 150, 172, { t, rider: true, facing: 'left', basket: 'dog' });
    A.dog(g, 190, 172, { t, coat: 'brown' });
    A.dog(g, 218, 172, { t, coat: 'black', pose: 'walk' });
    A.dog(g, 244, 172, { t, coat: 'golden', pose: 'sit', look: 'up' });
    A.dog(g, 268, 172, { t, coat: 'grey', pose: 'sit', facing: 'left' });
    A.dog(g, 300, 172, { t, coat: 'brown', pose: 'lie' });
  };
  A.props = (g, t) => {
    A.sky(g, ['night2', 'night3', 'night4'], 0, 180);
    A.key(g, 300, -40, 1);
    A.rect(g, 0, 84, 320, 3, 'slate2'); A.rect(g, 0, 172, 320, 8, 'slate2');
    const gs = ['step', 'bell', 'neck', 'spout', 'roof'];
    gs.forEach((gb, i) => A.canalHouse(g, 4 + i * 30, 84, 26, 64 + (i % 2) * 8, { gable: gb, t, lit: 0.6, seed: i * 11 + 1 }));
    A.windmill(g, 196, 84, 1, t * 0.8, { t, tone: 'night3' });
    A.windmill(g, 252, 84, 0.6, t, { t, tone: 'mist0', cloth: 1 });
    A.windmill(g, 290, 84, 0.35, -t, { t, tone: 'mist2' });
    A.church(g, 312, 84, 0.8, {});
    A.lamp(g, 12, 172, { t, style: 'lantern' });
    A.lamp(g, 34, 172, { t, style: 'modern', h: 40, flicker: 0.2 });
    A.bollard(g, 56, 172); A.bollard(g, 62, 172);
    A.tulips(g, 70, 172, 18, { t });
    A.fingerpost(g, 104, 172);
    A.cheeseCart(g, 140, 172, {});
    A.fence(g, 170, 172, 20, 9);
    A.tree(g, 202, 172, 1, { t });
    A.reeds(g, 214, 172, 20, 16, { t });
    A.clogs(g, 238, 172);
    A.book(g, 262, 172, { t });
    A.drawbridge(g, 120, 120, 70);
    A.archBridge(g, 200, 136, 70, 16);
    A.boat(g, 286, 150, { t, kind: 'barge', mast: true });
    A.boat(g, 286, 168, { t, len: 30 });
    A.say(g, 40, 120, 'Tikkie?', {});
    A.bubble(g, 4, 126, 60, 14, { text: 'English is fine.', tail: [50, 150] });
  };
})();
