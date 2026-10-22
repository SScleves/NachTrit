// Reference sheets for the shared sprites: gallery.html?only=cast and ?only=props.
// Not part of the game. Every artist draws the cast with these same functions.
(function () {
  const A = window.NRART;
  A.cast = (g, t) => {
    A.sky(g, ['night2', 'night3', 'night4'], 0, 150);
    A.rect(g, 0, 150, 320, 30, 'slate2'); A.hline(g, 0, 150, 320, 'slate3');
    A.key(g, 300, -40, 1);
    A.hline(g, 0, 70, 320, 'slate3');
    // row 1: the man
    A.man(g, 14, 68, { t, facing: 'front' });
    A.man(g, 34, 68, { t, facing: 'front', face: 'worry' });
    A.man(g, 54, 68, { t, facing: 'front', face: 'smug' });
    A.man(g, 74, 68, { t, facing: 'front', face: 'talk' });
    A.man(g, 94, 68, { t, facing: 'front', face: 'shock' });
    A.man(g, 114, 68, { t, facing: 'front', face: 'side' });
    A.man(g, 134, 68, { t, facing: 'back' });
    A.man(g, 154, 68, { t, facing: 'right' });
    A.man(g, 174, 68, { t, facing: 'right', pose: 'walk' });
    A.man(g, 194, 68, { t, facing: 'left', pose: 'walk', face: 'talk' });
    A.man(g, 214, 68, { t, facing: 'right', arm: 'wave' });
    A.man(g, 236, 68, { t, facing: 'front', hold: 'helmet' });
    A.man(g, 262, 60, { t, facing: 'front', pose: 'sit', floor: 8 }); A.rect(g, 254, 60, 16, 2, 'wood3');
    A.man(g, 290, 60, { t, facing: 'right', pose: 'sit', floor: 8 }); A.rect(g, 282, 60, 10, 2, 'wood3');
    // row 2: bikes and dogs
    A.omafiets(g, 30, 148, { t, rider: true, basket: 'book' });
    A.omafiets(g, 90, 148, { t, rider: false });
    A.omafiets(g, 150, 148, { t, rider: true, facing: 'left', basket: 'dog' });
    A.dog(g, 190, 148, { t, coat: 'brown' });
    A.dog(g, 220, 148, { t, coat: 'black', pose: 'walk' });
    A.dog(g, 246, 148, { t, coat: 'golden', pose: 'sit', look: 'up' });
    A.dog(g, 270, 148, { t, coat: 'grey', pose: 'sit', facing: 'left' });
    A.dog(g, 300, 148, { t, coat: 'brown', pose: 'lie' });
  };
})();
