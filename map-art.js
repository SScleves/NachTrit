/* Nachtrit world map art: window.NRMAP
 *
 * A classic script, loaded before the module (like fares.js). It paints the map screen as a night
 * diorama after concept-art/F-map-concept.png: the real outline of the Netherlands as a raised
 * slab in dark water, with a dark side face, reflections and a lit rim; dressed with silhouettes;
 * every town a small lit vignette built from its landmarks; the route as roads from town to town.
 *
 * index.html calls:
 *   NRMAP.layout(W, H, box, towns, f)       projection, town spots, label blocks, the route (px)
 *   NRMAP.paint(canvas, lay, towns, states) the static diorama, painted once per size and state
 *   NRMAP.fx(canvas, lay, t, bike)          one animated frame: glow pulse, route lamps, cyclist
 *   NRMAP.at(route, s)                      point and direction at arc length s along the route
 *   NRMAP.badge(t, i, state, cur, f, col), NRMAP.label(t), NRMAP.defs
 * states[i]: 'locked' | 'open' | 'saved'. Saved towns burn brightest: all their windows light up.
 */
(function () {
  'use strict';
  const NRMAP = window.NRMAP = {};
  const TAU = Math.PI * 2;

  // ---------------------------------------------------------------- geography (lon, lat)
  // Typed by hand from the real coast and borders, simplified. The mainland runs clockwise from
  // Hoek van Holland: the North Sea coast, the Wadden shore and the Afsluitdijk, the German border,
  // the Belgian border, Zuid-Beveland and Walcheren, then the delta back to the Maasvlakte.
  const MAINLAND = [
    [4.12, 51.985], [4.17, 52.03], [4.21, 52.065], [4.26, 52.105], [4.33, 52.155], [4.385, 52.205], [4.42, 52.245], [4.47, 52.3],
    [4.515, 52.36], [4.555, 52.44], [4.585, 52.52], [4.615, 52.6], [4.63, 52.67], [4.655, 52.76], [4.69, 52.83], [4.715, 52.9],
    [4.73, 52.955], [4.775, 52.965], [4.82, 52.935], [4.9, 52.92], [4.97, 52.935], [5.035, 52.948],
    [5.19, 53.015], [5.335, 53.078], [5.39, 53.112], [5.415, 53.175], [5.455, 53.24], [5.52, 53.29], [5.62, 53.315], [5.75, 53.35],
    [5.9, 53.38], [6.04, 53.405], [6.17, 53.41], [6.22, 53.4], [6.32, 53.41], [6.45, 53.42], [6.58, 53.44], [6.7, 53.46],
    [6.83, 53.45], [6.92, 53.4], [6.93, 53.34], [7.02, 53.3], [7.1, 53.28], [7.2, 53.245],
    [7.21, 53.18], [7.2, 53.08], [7.11, 52.97], [7.07, 52.86], [7.05, 52.73], [7.03, 52.64], [6.88, 52.64], [6.74, 52.645],
    [6.71, 52.57], [6.73, 52.48], [6.87, 52.44], [7.02, 52.44], [7.07, 52.38], [7.03, 52.3], [7.06, 52.24], [7.02, 52.18],
    [6.93, 52.14], [6.8, 52.11], [6.72, 52.06], [6.7, 52.03], [6.83, 51.98], [6.8, 51.93], [6.72, 51.9], [6.55, 51.87],
    [6.4, 51.83], [6.27, 51.87], [6.17, 51.86], [6.1, 51.85], [6.03, 51.86], [5.96, 51.79], [5.95, 51.72], [6.04, 51.63],
    [6.1, 51.55], [6.21, 51.47], [6.22, 51.36], [6.17, 51.29], [6.08, 51.22], [6.07, 51.16], [5.97, 51.1], [5.88, 51.05],
    [5.91, 51.0], [6.0, 50.95], [6.08, 50.9], [6.03, 50.8], [6.02, 50.755],
    [5.9, 50.755], [5.78, 50.76], [5.7, 50.755], [5.64, 50.82], [5.66, 50.87], [5.73, 50.95], [5.76, 51.03], [5.81, 51.07],
    [5.84, 51.16], [5.75, 51.18], [5.7, 51.22], [5.62, 51.27], [5.53, 51.27], [5.48, 51.29], [5.4, 51.27], [5.24, 51.31],
    [5.11, 51.35], [5.08, 51.4], [5.03, 51.45], [4.95, 51.42], [4.83, 51.43], [4.75, 51.43], [4.67, 51.42], [4.55, 51.43],
    [4.47, 51.48], [4.42, 51.42], [4.38, 51.38], [4.29, 51.37], [4.25, 51.37],
    [4.21, 51.395], [4.1, 51.405], [3.99, 51.44], [3.9, 51.405], [3.82, 51.385], [3.73, 51.42], [3.66, 51.44], [3.57, 51.44],
    [3.5, 51.47], [3.455, 51.51], [3.435, 51.535], [3.47, 51.56], [3.54, 51.58], [3.6, 51.595], [3.66, 51.565], [3.78, 51.55],
    [3.89, 51.545], [3.98, 51.525], [4.05, 51.505], [4.13, 51.475], [4.21, 51.455],
    [4.27, 51.49], [4.27, 51.55], [4.31, 51.6], [4.37, 51.645], [4.44, 51.685], [4.55, 51.69], [4.64, 51.7], [4.73, 51.715],
    [4.62, 51.727], [4.5, 51.732], [4.44, 51.738], [4.36, 51.757], [4.27, 51.79], [4.17, 51.812], [4.08, 51.832], [4.04, 51.846],
    [4.05, 51.88], [4.07, 51.915], [4.0, 51.93], [3.98, 51.965], [4.04, 51.99], [4.1, 51.98],
  ];
  const ISLANDS = [
    // Zeeuws-Vlaanderen, between the Westerschelde and Belgium
    [[3.37, 51.375], [3.45, 51.4], [3.55, 51.405], [3.66, 51.38], [3.76, 51.355], [3.84, 51.345], [3.95, 51.37], [4.04, 51.38],
      [4.14, 51.36], [4.24, 51.35], [4.2, 51.3], [4.1, 51.27], [3.98, 51.23], [3.85, 51.21], [3.75, 51.24], [3.62, 51.28],
      [3.52, 51.25], [3.44, 51.25], [3.38, 51.29], [3.36, 51.33]],
    // Noord-Beveland
    [[3.67, 51.6], [3.74, 51.615], [3.82, 51.62], [3.9, 51.605], [3.96, 51.585], [3.92, 51.56], [3.84, 51.555], [3.76, 51.565], [3.7, 51.58]],
    // Schouwen-Duiveland
    [[3.68, 51.71], [3.72, 51.735], [3.79, 51.745], [3.86, 51.755], [3.93, 51.74], [4.0, 51.72], [4.07, 51.69], [4.12, 51.66],
      [4.07, 51.63], [3.98, 51.615], [3.9, 51.63], [3.82, 51.64], [3.74, 51.655], [3.7, 51.68]],
    // Goeree-Overflakkee
    [[3.84, 51.81], [3.91, 51.84], [3.99, 51.835], [4.05, 51.82], [4.12, 51.79], [4.17, 51.765], [4.25, 51.745], [4.32, 51.72],
      [4.4, 51.7], [4.45, 51.68], [4.42, 51.655], [4.33, 51.66], [4.22, 51.675], [4.12, 51.695], [4.03, 51.715], [3.94, 51.745], [3.87, 51.78]],
    // Tholen and Sint Philipsland
    [[4.01, 51.59], [4.06, 51.615], [4.12, 51.635], [4.2, 51.635], [4.24, 51.6], [4.25, 51.56], [4.23, 51.52], [4.17, 51.505], [4.1, 51.52], [4.04, 51.55]],
    // the Wadden: Texel, Vlieland, Terschelling, Ameland, Schiermonnikoog
    [[4.72, 52.995], [4.79, 53.0], [4.85, 53.035], [4.88, 53.08], [4.91, 53.13], [4.89, 53.18], [4.86, 53.185], [4.81, 53.15],
      [4.77, 53.11], [4.745, 53.06], [4.72, 53.03]],
    [[4.92, 53.24], [4.98, 53.255], [5.06, 53.28], [5.12, 53.305], [5.1, 53.318], [5.03, 53.3], [4.96, 53.27]],
    [[5.17, 53.36], [5.25, 53.37], [5.35, 53.39], [5.45, 53.42], [5.55, 53.44], [5.6, 53.455], [5.57, 53.47], [5.47, 53.455],
      [5.37, 53.43], [5.27, 53.405], [5.19, 53.385]],
    [[5.62, 53.445], [5.72, 53.44], [5.82, 53.445], [5.92, 53.46], [5.9, 53.48], [5.8, 53.47], [5.7, 53.465], [5.63, 53.46]],
    [[6.1, 53.475], [6.18, 53.465], [6.28, 53.47], [6.34, 53.49], [6.27, 53.505], [6.17, 53.5], [6.11, 53.49]],
  ];
  // the IJsselmeer, the Markermeer and the randmeren as one sheet of water inside the mainland;
  // its north edge runs a little south of the coast so the Afsluitdijk stands between them
  const LAKE = [
    [5.055, 52.925], [5.19, 52.99], [5.322, 53.052],
    [5.385, 53.045], [5.41, 52.995], [5.4, 52.94], [5.355, 52.885], [5.45, 52.85], [5.57, 52.835], [5.7, 52.835],
    [5.665, 52.775], [5.63, 52.72], [5.595, 52.67], [5.64, 52.635], [5.72, 52.615], [5.81, 52.6], [5.89, 52.57],
    [5.89, 52.52], [5.86, 52.46], [5.75, 52.395], [5.63, 52.345], [5.5, 52.29], [5.37, 52.265], [5.24, 52.29], [5.12, 52.305],
    [5.05, 52.33], [4.99, 52.36], [4.99, 52.39], [5.06, 52.43], [5.13, 52.45], [5.09, 52.475], [5.04, 52.465],
    [5.07, 52.5], [5.06, 52.53], [5.08, 52.58], [5.06, 52.64], [5.15, 52.665], [5.29, 52.7], [5.22, 52.745], [5.11, 52.77], [5.09, 52.85],
  ];
  const FLEVOLAND = [[5.43, 52.53], [5.5, 52.57], [5.58, 52.59], [5.66, 52.59], [5.75, 52.565], [5.83, 52.53], [5.845, 52.505],
    [5.8, 52.465], [5.72, 52.415], [5.62, 52.37], [5.52, 52.335], [5.42, 52.31], [5.32, 52.3], [5.22, 52.31], [5.13, 52.335],
    [5.06, 52.36], [5.11, 52.39], [5.2, 52.43], [5.3, 52.47], [5.38, 52.5]];
  const HOUTRIBDIJK = [[5.29, 52.7], [5.36, 52.615], [5.43, 52.535]];
  const BARRIER = [[3.705, 51.7], [3.69, 51.645], [3.675, 51.6]];   // the Oosterscheldekering over Neeltje Jans
  const WADDEN = [[4.76, 52.97], [4.9, 53.2], [5.15, 53.36], [5.6, 53.46], [6.1, 53.48], [6.45, 53.52], [6.95, 53.48], [6.93, 53.4],
    [6.6, 53.43], [6.2, 53.4], [5.9, 53.37], [5.6, 53.3], [5.42, 53.17], [5.33, 53.07], [5.04, 52.94], [4.85, 52.93]];
  const RIVERS = [   // [width in km, points], each from upstream to the sea
    [1.3, [[6.12, 51.855], [6.08, 51.87], [6.0, 51.92], [5.9, 51.975], [5.8, 51.97], [5.66, 51.955], [5.52, 51.96], [5.34, 51.97],
      [5.25, 51.975], [5.09, 51.985], [5.0, 51.97], [4.85, 51.955], [4.72, 51.92], [4.64, 51.885], [4.55, 51.9], [4.48, 51.905],
      [4.42, 51.905], [4.34, 51.9], [4.25, 51.92], [4.11, 51.983]]],
    [1.6, [[6.05, 51.875], [5.95, 51.86], [5.86, 51.852], [5.75, 51.87], [5.6, 51.88], [5.43, 51.88], [5.3, 51.82], [5.15, 51.81],
      [4.97, 51.83], [4.85, 51.82], [4.73, 51.81], [4.66, 51.82], [4.6, 51.83], [4.5, 51.84], [4.4, 51.855], [4.33, 51.86], [4.29, 51.885]]],
    [0.9, [[4.67, 51.815], [4.655, 51.85], [4.645, 51.885]]],
    [1.1, [[5.69, 50.8], [5.7, 50.87], [5.73, 50.95], [5.79, 51.05], [5.86, 51.13], [5.95, 51.2], [6.05, 51.28], [6.15, 51.36],
      [6.12, 51.47], [6.05, 51.57], [5.97, 51.68], [5.85, 51.76], [5.7, 51.77], [5.55, 51.77], [5.4, 51.75], [5.3, 51.74],
      [5.15, 51.74], [5.0, 51.73], [4.85, 51.718], [4.74, 51.716]]],
    [0.8, [[5.95, 51.965], [6.07, 52.02], [6.17, 52.12], [6.18, 52.2], [6.15, 52.27], [6.1, 52.38], [6.08, 52.47], [5.98, 52.53], [5.89, 52.565]]],
    [0.7, [[4.99, 52.375], [4.9, 52.385], [4.8, 52.415], [4.68, 52.44], [4.565, 52.465]]],
  ];
  // dune coasts, as open lines along the sea
  const DUNES = [MAINLAND.slice(1, 17), [[4.72, 53.03], [4.745, 53.06], [4.77, 53.11], [4.81, 53.15], [4.86, 53.18]],
    [[4.96, 53.27], [5.03, 53.3], [5.1, 53.315]], [[5.19, 53.385], [5.27, 53.405], [5.37, 53.43], [5.47, 53.455], [5.57, 53.468]],
    [[5.63, 53.46], [5.7, 53.465], [5.8, 53.47], [5.9, 53.478]], [[6.11, 53.49], [6.17, 53.5], [6.27, 53.503]],
    [[3.5, 51.47], [3.455, 51.51], [3.435, 51.535], [3.47, 51.56], [3.54, 51.58]], [[3.7, 51.69], [3.72, 51.73], [3.79, 51.745]],
    [[3.85, 51.815], [3.91, 51.838]]];
  // what grows where: the dressing picks its silhouettes by region
  const REGIONS = [
    ['forest', [[5.55, 52.42], [6.05, 52.4], [6.15, 52.12], [5.95, 51.99], [5.62, 52.0], [5.55, 52.2]]],
    ['forest', [[5.18, 52.15], [5.45, 52.13], [5.55, 51.99], [5.32, 51.99], [5.18, 52.07]]],
    ['forest', [[6.25, 53.03], [6.75, 53.0], [6.85, 52.72], [6.35, 52.7]]],
    ['forest', [[4.95, 51.52], [5.7, 51.52], [5.9, 51.3], [5.2, 51.31]]],
    ['forest', [[6.55, 52.45], [6.95, 52.42], [6.95, 52.2], [6.6, 52.2]]],
    ['tulips', [[4.45, 52.37], [4.6, 52.37], [4.56, 52.18], [4.42, 52.2]]],
    ['tulips', [[4.7, 52.93], [4.97, 52.9], [4.95, 52.72], [4.72, 52.72]]],
    ['tulips', [[5.6, 52.83], [5.95, 52.83], [5.95, 52.63], [5.65, 52.63]]],
    ['tulips', [[5.3, 52.56], [5.8, 52.56], [5.8, 52.38], [5.3, 52.36]]],
    ['mills', [[4.55, 51.99], [5.0, 51.99], [5.0, 51.83], [4.62, 51.85]]],
    ['mills', [[4.72, 52.52], [4.92, 52.52], [4.92, 52.41], [4.72, 52.43]]],
    ['mills', [[5.45, 53.26], [6.12, 53.31], [6.12, 52.95], [5.5, 52.95]]],
    ['mills', [[6.3, 53.41], [6.95, 53.41], [6.9, 53.15], [6.3, 53.15]]],
    ['glass', [[4.16, 52.065], [4.33, 52.04], [4.31, 51.96], [4.15, 51.98]]],
    ['orchard', [[5.15, 51.96], [5.8, 51.95], [5.8, 51.86], [5.15, 51.86]]],
  ];
  // places that are not in the game: a few lit windows and a spire each
  const CITIES = [[5.48, 51.44, 3], [5.08, 51.56, 2], [4.78, 51.59, 2], [5.3, 51.69, 2], [5.9, 51.98, 2], [6.09, 52.51, 2], [5.8, 53.2, 2],
    [6.89, 52.22, 2], [5.97, 52.21, 2], [4.64, 52.38, 2], [4.49, 52.16, 2], [4.36, 52.01, 1], [5.22, 52.37, 2], [5.47, 52.51, 1],
    [6.56, 52.99, 1], [6.17, 51.37, 1], [6.9, 52.78, 1], [3.61, 51.5, 1], [4.76, 52.95, 1], [5.06, 52.64, 1], [4.75, 52.63, 1],
    [5.39, 52.16, 2], [6.16, 52.25, 1], [4.82, 52.44, 1], [5.98, 50.89, 1], [5.99, 51.19, 1], [5.66, 53.03, 1], [5.42, 53.17, 1],
    [3.57, 51.45, 1], [3.83, 51.33, 1], [4.29, 51.5, 1], [4.46, 51.53, 1], [5.17, 52.22, 1], [5.67, 52.04, 1], [6.3, 51.97, 1],
    [6.79, 52.27, 1], [6.19, 52.7, 1], [5.75, 52.71, 1], [6.1, 53.11, 1], [5.29, 52.7, 1], [4.98, 51.83, 1], [5.43, 51.89, 1]];
  const LIGHTHOUSES = [[4.752, 52.958, 1], [5.215, 53.362, 0], [5.632, 53.448, 2], [6.165, 53.485, 0], [4.935, 53.292, 0],
    [3.448, 51.524, 0], [5.122, 52.462, 0], [4.585, 52.463, 1], [3.862, 51.814, 2]];
  // where a town's data point is not on land, the map uses this spot (Zeeland's point is the barrier itself)
  const ANCHOR = { zeeland: [3.87, 51.675] };
  // the roads between towns in tier order: waypoints that keep them on land and clear of other towns
  const ROUTE_VIA = {
    'kinderdijk>gouda': [[4.8, 51.9]],
    'gouda>zeeland': [[4.6, 51.93], [4.53, 51.83], [4.4, 51.75], [4.2, 51.7], [4.03, 51.67]],
    'zeeland>utrecht': [[4.1, 51.635], [4.33, 51.58], [4.75, 51.6], [4.97, 51.79], [5.06, 51.96]],
    'utrecht>denhaag': [[4.95, 52.14], [4.68, 52.15], [4.48, 52.13]],
    'denhaag>rotterdam': [[4.37, 52.0]],
    'rotterdam>urk': [[4.6, 52.0], [4.88, 52.06], [5.1, 52.2], [5.24, 52.32], [5.42, 52.46], [5.62, 52.58]],
    'urk>texel': [[5.42, 52.8], [5.1, 52.9], [4.79, 52.958]],
    'texel>groningen': [[4.8, 52.955], [5.04, 52.947], [5.36, 53.09], [5.62, 53.17], [5.85, 53.2], [6.2, 53.25]],
    'groningen>maastricht': [[6.56, 52.99], [6.12, 52.52], [6.0, 52.2], [5.72, 51.98], [5.52, 51.72], [5.48, 51.44], [5.78, 51.18]],
    'maastricht>nijmegen': [[5.88, 51.12], [6.13, 51.37], [6.0, 51.66]],
    'nijmegen>amsterdam': [[5.68, 52.03], [5.42, 52.16], [5.16, 52.25]],
  };

  // ---------------------------------------------------------------- projection
  // Equirectangular at 52 N, then a lens that pushes everything away from the Randstad (no
  // folding, nothing squeezed into a ring) so its seven towns get room. The vertical scale is
  // chosen per screen in layout(). nodePositions in index.html gets its towns from the same lens.
  const base = (lon, lat) => [(lon - 5.2) * 0.62, -(lat - 52.15)];
  const LC = base(4.6, 51.95), LB = 0.95, LS = 0.24;
  function world(lon, lat) {
    const p = base(lon, lat), dx = p[0] - LC[0], dy = p[1] - LC[1], r = Math.hypot(dx, dy);
    if (r < 1e-9) return p;
    const k = 1 + LB * LS * Math.tanh(r / LS) / r;
    return [LC[0] + dx * k, LC[1] + dy * k];
  }
  NRMAP.world = world;
  function densify(poly, closed, step) {
    const out = [], n = poly.length, m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const a = poly[i], b = poly[(i + 1) % n], k = Math.max(1, Math.ceil(Math.hypot((b[0] - a[0]) * 0.62, b[1] - a[1]) / step));
      for (let j = 0; j < k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]);
    }
    if (!closed) out.push(poly[n - 1]);
    return out;
  }
  const wpoly = (p, closed) => densify(p, closed !== false, 0.025).map(q => world(q[0], q[1]));
  // the Wadden islands are a few kilometres wide: drawn twice as fat, as every good map does, or they vanish
  const fatten = (p, k) => { const la = p.reduce((s, q) => s + q[1], 0) / p.length; return p.map(q => [q[0], la + (q[1] - la) * k]); };
  const GEO = {
    land: [MAINLAND, ...ISLANDS.map((p, i) => i >= 5 ? fatten(p, i === 5 ? 1.25 : 2.1) : p)].map(p => wpoly(p)), lake: wpoly(LAKE), flevo: wpoly(FLEVOLAND), wadden: wpoly(WADDEN),
    dyke: wpoly(HOUTRIBDIJK, false), barrier: wpoly(BARRIER, false), dunes: DUNES.map(p => wpoly(p, false)),
    rivers: RIVERS.map(([w, p]) => [w, wpoly(p, false)]), regions: REGIONS.map(([k, p]) => [k, wpoly(p)]),
    cities: CITIES.map(([lo, la, n]) => [...world(lo, la), n]), lights: LIGHTHOUSES.map(([lo, la, k]) => [...world(lo, la), k]),
  };
  let BX0 = 1e9, BY0 = 1e9, BX1 = -1e9, BY1 = -1e9;
  for (const poly of GEO.land) for (const p of poly) { BX0 = Math.min(BX0, p[0]); BX1 = Math.max(BX1, p[0]); BY0 = Math.min(BY0, p[1]); BY1 = Math.max(BY1, p[1]); }
  const lonlat = t => ANCHOR[t.id] || t.lonlat || [3.3 + t.pos[0] * 3.9, 53.55 - t.pos[1] * 2.8];

  // ---------------------------------------------------------------- helpers
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function inPoly(pts, x, y) { let ins = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const a = pts[i], b = pts[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) ins = !ins; } return ins; }
  function poly(c, pts, dx, dy) { dx = dx || 0; dy = dy || 0; c.moveTo(pts[0][0] + dx, pts[0][1] + dy); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0] + dx, pts[i][1] + dy); c.closePath(); }
  function line(c, pts, dx, dy) { dx = dx || 0; dy = dy || 0; c.moveTo(pts[0][0] + dx, pts[0][1] + dy); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0] + dx, pts[i][1] + dy); }
  function area(pts) { let a = 0; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += (pts[j][0] - pts[i][0]) * (pts[j][1] + pts[i][1]); return a / 2; }
  function bbox(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); } return { x0, y0, x1, y1 }; }
  function glow(c, x, y, r, a, col) {
    const g = c.createRadialGradient(x, y, 0, x, y, r); col = col || '255,178,80';
    g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(0.3, `rgba(${col},${a * 0.38})`); g.addColorStop(1, `rgba(${col},0)`);
    c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function sprite(col, soft) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `rgba(${col},1)`); gr.addColorStop(soft ? 0.45 : 0.18, `rgba(${col},${soft ? 0.45 : 0.42})`); gr.addColorStop(soft ? 0.75 : 0.5, `rgba(${col},0.12)`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return cv;
  }
  let SPR = null;
  function sprites() {
    if (SPR) return SPR;
    const beam = document.createElement('canvas'); beam.width = 256; beam.height = 64; const b = beam.getContext('2d');
    const gl = b.createLinearGradient(0, 0, 256, 0); gl.addColorStop(0, 'rgba(255,236,190,.75)'); gl.addColorStop(0.35, 'rgba(255,230,170,.28)'); gl.addColorStop(1, 'rgba(255,230,170,0)');
    b.fillStyle = gl; b.beginPath(); b.moveTo(0, 30); b.lineTo(256, 0); b.lineTo(256, 64); b.lineTo(0, 34); b.closePath(); b.fill();
    SPR = { warm: sprite('255,176,72', true), lamp: sprite('255,214,140'), green: sprite('130,220,110', true), cold: sprite('150,170,195', true), beam };
    return SPR;
  }
  const mctx = document.createElement('canvas').getContext('2d');
  NRMAP.label = t => (t.name.length > 16 ? t.name.split(/[ :]/)[0] : t.name).toUpperCase();
  function textW(s, px, weight, track) { mctx.font = `${weight} ${px}px "Segoe UI",system-ui,-apple-system,sans-serif`; return mctx.measureText(s).width + s.length * px * track; }

  // a smooth field that moves the land along with the towns pushed apart, so every town keeps its ground
  function makeField(src, dst, sig) {
    const d = src.map((p, i) => [dst[i][0] - p[0], dst[i][1] - p[1]]);
    if (!d.some(v => Math.abs(v[0]) + Math.abs(v[1]) > 0.5)) return (x, y) => [x, y];
    const k = -1 / (2 * sig * sig);
    return (x, y) => {
      let sw = 0, dx = 0, dy = 0;
      for (let i = 0; i < src.length; i++) { const ex = x - src[i][0], ey = y - src[i][1], w = Math.exp((ex * ex + ey * ey) * k); sw += w; dx += w * d[i][0]; dy += w * d[i][1]; }
      const n = 1 / (sw + 0.15); return [x + dx * n, y + dy * n];
    };
  }
  // centripetal Catmull-Rom through the control points, sampled about every `step` px
  function spline(ctrl, step) {
    const out = [ctrl[0]], n = ctrl.length;
    for (let i = 0; i < n - 1; i++) {
      const p1 = ctrl[i], p2 = ctrl[i + 1];
      const p0 = i > 0 ? ctrl[i - 1] : [2 * p1[0] - p2[0], 2 * p1[1] - p2[1]], p3 = i < n - 2 ? ctrl[i + 2] : [2 * p2[0] - p1[0], 2 * p2[1] - p1[1]];
      const d = (a, b) => Math.max(1e-3, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])));
      const t01 = d(p0, p1), t12 = d(p1, p2), t23 = d(p2, p3);
      const m1 = [0, 1].map(k => (p2[k] - p1[k]) + t12 * ((p1[k] - p0[k]) / t01 - (p2[k] - p0[k]) / (t01 + t12)));
      const m2 = [0, 1].map(k => (p2[k] - p1[k]) + t12 * ((p3[k] - p2[k]) / t23 - (p3[k] - p1[k]) / (t12 + t23)));
      const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), steps = Math.max(2, Math.ceil(len / step));
      for (let s = 1; s <= steps; s++) {
        const u = s / steps, u2 = u * u, u3 = u2 * u, h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
        out.push([0, 1].map(k => h00 * p1[k] + h10 * m1[k] + h01 * p2[k] + h11 * m2[k]));
      }
    }
    return out;
  }
  NRMAP.at = function (R, s) {
    const P = R.pts, C = R.cum; if (P.length < 2) return { x: P.length ? P[0][0] : 0, y: P.length ? P[0][1] : 0, dx: 1, dy: 0 };
    s = Math.max(0, Math.min(R.total, s)); let lo = 0, hi = C.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (C[m] <= s) lo = m; else hi = m; }
    const a = P[lo], b = P[hi], L = (C[hi] - C[lo]) || 1, u = (s - C[lo]) / L;
    return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, dx: (b[0] - a[0]) / L, dy: (b[1] - a[1]) / L };
  };

  // ---------------------------------------------------------------- layout
  NRMAP.layout = function (W, H, box, towns, f) {
    const bw = BX1 - BX0, bh0 = BY1 - BY0;
    // the country fits inside the box less the room the labels hang below the south and the towns rise above the north
    const fit = { x: box.x + f * 0.5, y: box.y + f * 2.6, w: box.w - f, h: box.h - f * 2.6 - f * 3.4 };
    // portrait screens stretch the country a little taller, landscape ones tilt it like a table top
    const ky = Math.max(0.78, Math.min(1.22, (fit.h / fit.w) / (bh0 / bw)));
    const sc = Math.min(fit.w / bw, fit.h / (bh0 * ky));
    const ox = fit.x + (fit.w - bw * sc) / 2 - BX0 * sc, oy = fit.y + (fit.h - bh0 * ky * sc) / 2 - BY0 * ky * sc;
    const S0 = p => [ox + p[0] * sc, oy + p[1] * ky * sc];
    const n = towns.length, raw = towns.map(t => S0(world(...lonlat(t)))), nodes = raw.map(p => p.slice());
    // label blocks: badge and chip above the spot, name and CEFR band below it
    const blk = towns.map(t => ({ w: Math.max(textW(NRMAP.label(t), f, 600, 0.14), textW(t.cefr + ' · ★24', f * 0.88, 500, 0.06), f * 3.9) + f * 0.5, top: f * 2.45, bot: f * 4.5 }));
    const pad = f * 0.7, mx = f * 0.2;
    for (let it = 0; it < 500; it++) {
      let moved = false;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const a = nodes[i], b = nodes[j], dx = b[0] - a[0], dy = b[1] - a[1];
        const ox_ = (blk[i].w + blk[j].w) / 2 + pad - Math.abs(dx);
        const oy_ = (dy >= 0 ? blk[i].bot + blk[j].top : blk[j].bot + blk[i].top) + pad - Math.abs(dy);
        if (ox_ <= 0 || oy_ <= 0) continue;
        moved = true;
        if (oy_ < ox_ * 1.6) { const s = (dy >= 0 ? 1 : -1) * Math.min(oy_ / 2 + 0.5, f * 0.5); a[1] -= s; b[1] += s; }
        else { const s = (dx >= 0 ? 1 : -1) * Math.min(ox_ / 2 + 0.5, f * 0.5); a[0] -= s; b[0] += s; }
      }
      for (let i = 0; i < n; i++) {
        const p = nodes[i], B = blk[i];
        p[0] = Math.min(box.x + box.w - B.w / 2 - mx, Math.max(box.x + B.w / 2 + mx, p[0]));
        p[1] = Math.min(box.y + box.h - B.bot, Math.max(box.y + B.top + f * 1.6, p[1]));
      }
      if (!moved) break;
    }
    const field = makeField(raw, nodes, f * 3.4);
    const S = p => field(...S0(p));
    const P = (lon, lat) => S(world(lon, lat));
    const geo = {
      land: GEO.land.map(p => p.map(S)), lake: GEO.lake.map(S), flevo: GEO.flevo.map(S), wadden: GEO.wadden.map(S),
      dyke: GEO.dyke.map(S), barrier: GEO.barrier.map(S), dunes: GEO.dunes.map(p => p.map(S)),
      rivers: GEO.rivers.map(([w, p]) => [w, p.map(S)]), regions: GEO.regions.map(([k, p]) => [k, p.map(S)]),
      cities: GEO.cities.map(([x, y, k]) => [...S([x, y]), k]), lights: GEO.lights.map(([x, y, k]) => [...S([x, y]), k]),
    };
    // keep every orientation the same (clockwise on screen) so normals point out of the land
    for (const p of [...geo.land, geo.flevo]) if (area(p) < 0) p.reverse();
    if (area(geo.lake) < 0) geo.lake.reverse();
    const onLand = (x, y) => (geo.land.some(p => inPoly(p, x, y)) && !inPoly(geo.lake, x, y)) || inPoly(geo.flevo, x, y);
    // a town that still stands in the water steps onto the nearest land
    nodes.forEach(p => {
      if (onLand(p[0], p[1])) return;
      for (let r = 2; r < f * 5; r += 2) { let hit = null; for (let a = 0; a < 24 && !hit; a++) { const x = p[0] + Math.cos(a * TAU / 24) * r, y = p[1] + Math.sin(a * TAU / 24) * r; if (onLand(x, y)) hit = [x, y]; } if (hit) { p[0] = hit[0]; p[1] = hit[1]; return; } }
    });
    // vignette width per town: as wide as the neighbours and the title above allow
    const vw = nodes.map((p, i) => {
      let w = f * 11;
      for (; w > f * 4.4; w -= f * 0.25) {
        const x0 = p[0] - w / 2, x1 = p[0] + w / 2, y1 = p[1] - f * 1.2, y0 = y1 - w * 0.62;
        if (y0 < box.y - f * 0.5) continue;
        if (!nodes.some((q, j) => j !== i && q[0] + blk[j].w * 0.38 > x0 && q[0] - blk[j].w * 0.38 < x1 && q[1] + f * 1.4 > y0 && q[1] - f * 2.6 < y1)) break;
      }
      return w;
    });
    const lay = { W, H, box, sc, ky, f, P, S, nodes, raw, blk, vw, geo, onLand };
    lay.route = buildRoute(lay, towns);
    return lay;
  };

  function buildRoute(lay, towns) {
    const { nodes, f, P } = lay, segs = [];
    for (let i = 0; i + 1 < nodes.length; i++) {
      const a = nodes[i], b = nodes[i + 1];
      const via = (ROUTE_VIA[towns[i].id + '>' + towns[i + 1].id] || []).map(q => P(q[0], q[1]));
      let ctrl = [a, ...via, b];
      if (!via.length) {   // no road given: a gentle bow to the side with more room
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
        let best = null, bd = -1;
        for (const s of [1, -1]) {
          const m = [(a[0] + b[0]) / 2 + nx * s * len * 0.14, (a[1] + b[1]) / 2 + ny * s * len * 0.14];
          const d = Math.min(1e9, ...nodes.filter((q, j) => j !== i && j !== i + 1).map(q => Math.hypot(q[0] - m[0], q[1] - m[1])));
          if (d > bd) { bd = d; best = m; }
        }
        ctrl = [a, best, b];
      }
      // drop waypoints that crowd a town's badge
      ctrl = ctrl.filter((q, k) => k === 0 || k === ctrl.length - 1 || !nodes.some(m => Math.hypot(m[0] - q[0], m[1] - q[1]) < f * 2.2));
      segs.push(spline(ctrl, Math.max(2, f * 0.25)));
    }
    const pts = [], cum = [], nodeS = [0], idx = [0]; let s = 0;
    segs.forEach((seg, k) => {
      seg.forEach((p, j) => { if (k > 0 && j === 0) return; if (pts.length) s += Math.hypot(p[0] - pts[pts.length - 1][0], p[1] - pts[pts.length - 1][1]); pts.push(p); cum.push(s); });
      nodeS.push(s); idx.push(pts.length - 1);
    });
    if (!pts.length && nodes.length) { pts.push(nodes[0].slice()); cum.push(0); }
    return { pts, cum, nodeS, idx, total: s };
  }

  // ---------------------------------------------------------------- colours
  const SIL = '#0b1016', SIL2 = '#121921', BLD = '#131a22', BLD2 = '#18202a', ROOF = '#0e141b', WATER = '#0d141c';

  // ---------------------------------------------------------------- dressing silhouettes
  function tree(c, x, y, s, r) {
    c.fillStyle = SIL; c.fillRect(x - s * 0.05, y - s * 0.45, s * 0.1, s * 0.45);
    const k = 0.28 + r() * 0.14; c.beginPath();
    c.arc(x, y - s * 0.72, s * k, 0, TAU); c.arc(x - s * 0.17, y - s * 0.54, s * k * 0.8, 0, TAU); c.arc(x + s * 0.19, y - s * 0.56, s * k * 0.75, 0, TAU); c.fill();
  }
  function poplar(c, x, y, s) { c.fillStyle = SIL; c.beginPath(); c.ellipse(x, y - s * 0.72, s * 0.13, s * 0.66, 0, 0, TAU); c.fill(); c.fillRect(x - s * 0.03, y - s * 0.12, s * 0.06, s * 0.12); }
  function pine(c, x, y, s) { c.fillStyle = SIL; c.beginPath(); c.moveTo(x, y - s * 1.25); c.lineTo(x + s * 0.3, y - s * 0.15); c.lineTo(x - s * 0.3, y - s * 0.15); c.fill(); c.fillRect(x - s * 0.04, y - s * 0.2, s * 0.08, s * 0.2); }
  function mill(c, x, y, s, a, light, lights) {
    c.fillStyle = SIL; c.beginPath(); c.moveTo(x - s * 0.26, y); c.lineTo(x - s * 0.14, y - s * 1.15); c.lineTo(x + s * 0.14, y - s * 1.15); c.lineTo(x + s * 0.26, y); c.fill();
    c.beginPath(); c.moveTo(x - s * 0.19, y - s * 1.13); c.quadraticCurveTo(x, y - s * 1.42, x + s * 0.19, y - s * 1.13); c.fill();
    const hx = x, hy = y - s * 1.2; c.strokeStyle = SIL; c.lineCap = 'butt';
    for (let k = 0; k < 4; k++) {
      const ang = a + k * Math.PI / 2, ex = hx + Math.cos(ang) * s * 0.92, ey = hy + Math.sin(ang) * s * 0.92;
      c.lineWidth = Math.max(0.7, s * 0.045); c.beginPath(); c.moveTo(hx, hy); c.lineTo(ex, ey); c.stroke();
      const nx = -Math.sin(ang) * s * 0.1, ny = Math.cos(ang) * s * 0.1; c.lineWidth = Math.max(0.45, s * 0.022);
      c.beginPath(); c.moveTo(hx + Math.cos(ang) * s * 0.24 + nx, hy + Math.sin(ang) * s * 0.24 + ny); c.lineTo(ex + nx, ey + ny); c.lineTo(ex, ey); c.stroke();
      for (let q = 0.36; q < 0.95; q += 0.14) { const bx = hx + Math.cos(ang) * s * q, by = hy + Math.sin(ang) * s * q; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + nx, by + ny); c.stroke(); }
    }
    if (light) { c.fillStyle = '#e8a040'; c.fillRect(x - s * 0.04, y - s * 0.52, s * 0.08, s * 0.11); lights && lights.push([x, y - s * 0.47, s * 0.65, 0.32]); }
  }
  function cow(c, x, y, s, flip) {
    const d = flip ? -1 : 1; c.fillStyle = SIL; c.beginPath(); c.ellipse(x, y - s * 0.3, s * 0.3, s * 0.14, 0, 0, TAU); c.fill();
    c.fillRect(x + d * s * 0.24, y - s * 0.43, d * s * 0.15, s * 0.11);
    for (const lx of [-0.22, -0.11, 0.11, 0.2]) c.fillRect(x + lx * s, y - s * 0.19, s * 0.045, s * 0.19);
  }
  function sheep(c, x, y, s) { c.fillStyle = '#38424d'; c.beginPath(); c.ellipse(x, y - s * 0.18, s * 0.18, s * 0.11, 0, 0, TAU); c.fill(); c.fillStyle = SIL; c.fillRect(x + s * 0.14, y - s * 0.25, s * 0.07, s * 0.09); }
  function farm(c, x, y, s, r, lights) {
    const w = s * (0.7 + r() * 0.4), h = s * 0.42; c.fillStyle = SIL2; c.fillRect(x - w / 2, y - h, w, h);
    c.fillStyle = SIL; c.beginPath(); c.moveTo(x - w / 2 - s * 0.06, y - h); c.lineTo(x - w * 0.1, y - h - s * 0.5); c.lineTo(x + w / 2 + s * 0.06, y - h); c.fill();
    if (r() < 0.25) { c.fillStyle = '#f0a848'; c.fillRect(x - s * 0.08, y - h * 0.7, s * 0.09, s * 0.11); lights.push([x - s * 0.03, y - h * 0.6, s * 0.9, 0.28]); }
  }
  function chapel(c, x, y, s, r, lights) {
    c.fillStyle = SIL2; c.fillRect(x - s * 0.1, y - s * 0.45, s * 0.65, s * 0.45); c.fillStyle = SIL; c.beginPath(); c.moveTo(x - s * 0.1, y - s * 0.45); c.lineTo(x + s * 0.22, y - s * 0.75); c.lineTo(x + s * 0.55, y - s * 0.45); c.fill();
    c.fillRect(x - s * 0.28, y - s * 1.1, s * 0.22, s * 1.1); c.beginPath(); c.moveTo(x - s * 0.3, y - s * 1.1); c.lineTo(x - s * 0.17, y - s * 1.8); c.lineTo(x - s * 0.04, y - s * 1.1); c.fill();
    if (r() < 0.5) { c.fillStyle = '#e09a40'; c.fillRect(x + s * 0.1, y - s * 0.32, s * 0.06, s * 0.13); c.fillRect(x + s * 0.28, y - s * 0.32, s * 0.06, s * 0.13); lights.push([x + s * 0.2, y - s * 0.28, s * 0.8, 0.22]); }
  }
  function tulips(c, x, y, s, r) {
    const w = s * (1.8 + r() * 1.6), h = s * (0.7 + r() * 0.5), rows = Math.max(3, Math.round(h / (s * 0.17)));
    const hue = r(); const cols = hue < 0.55 ? ['176,40,40', '204,58,50'] : hue < 0.8 ? ['200,150,40', '226,184,70'] : ['160,60,120', '190,80,140'];
    c.save(); c.translate(x, y); c.transform(1, 0, -0.35, 1, 0, 0);
    c.fillStyle = 'rgba(30,14,16,.5)'; c.fillRect(-w / 2, -h, w, h);
    for (let i = 0; i < rows; i++) {
      const yy = -h + (i + 0.5) * h / rows; c.fillStyle = `rgba(${cols[i % 2]},.75)`;
      c.beginPath(); for (let xx = -w / 2 + s * 0.07; xx < w / 2; xx += s * 0.11) { c.moveTo(xx + s * 0.05, yy); c.arc(xx, yy, s * 0.05, 0, TAU); } c.fill();
    }
    c.restore();
  }
  function reeds(c, x, y, s, r) { c.strokeStyle = SIL; c.lineWidth = Math.max(0.5, s * 0.035); c.beginPath(); for (let i = 0; i < 6; i++) { const xx = x + (r() - 0.5) * s * 0.6; c.moveTo(xx, y); c.lineTo(xx + (r() - 0.5) * s * 0.15, y - s * (0.3 + r() * 0.35)); } c.stroke(); }
  function lamp(c, x, y, s, lights, a) { c.fillStyle = SIL; c.fillRect(x - s * 0.025, y - s * 0.8, s * 0.05, s * 0.8); c.fillStyle = '#ffd88a'; c.beginPath(); c.arc(x, y - s * 0.82, s * 0.06, 0, TAU); c.fill(); lights.push([x, y - s * 0.82, s * 1.1, a == null ? 0.5 : a]); }
  function boat(c, x, y, s, r, lights, flip) {
    const d = flip ? -1 : 1, sail = r() < 0.7;
    c.fillStyle = SIL; c.beginPath(); c.moveTo(x - s * 0.5, y); c.lineTo(x + s * 0.5, y); c.lineTo(x + s * 0.38, y + s * 0.13); c.lineTo(x - s * 0.4, y + s * 0.13); c.fill();
    if (sail) { c.beginPath(); c.moveTo(x + d * s * 0.02, y - s * 0.02); c.lineTo(x + d * s * 0.02, y - s * 1.1); c.lineTo(x + d * s * 0.4, y - s * 0.08); c.fill(); c.beginPath(); c.moveTo(x - d * s * 0.04, y - s * 0.1); c.lineTo(x - d * s * 0.04, y - s * 0.85); c.lineTo(x - d * s * 0.34, y - s * 0.1); c.fill(); }
    else { c.fillRect(x - s * 0.2, y - s * 0.24, s * 0.3, s * 0.24); c.fillRect(x - s * 0.02, y - s * 0.68, s * 0.04, s * 0.68); }
    if (r() < 0.5) { c.fillStyle = '#ffcf7a'; c.beginPath(); c.arc(x + s * 0.3, y - s * 0.1, Math.max(0.6, s * 0.04), 0, TAU); c.fill(); lights.push([x + s * 0.3, y - s * 0.1, s * 0.8, 0.4, null, true]); }
  }
  function lighthouseSmall(c, x, y, s, kind, lights) {
    c.fillStyle = kind === 1 ? '#3a1f1f' : '#2a323c'; c.beginPath(); c.moveTo(x - s * 0.16, y); c.lineTo(x - s * 0.09, y - s * 1.3); c.lineTo(x + s * 0.09, y - s * 1.3); c.lineTo(x + s * 0.16, y); c.fill();
    if (kind === 2) { c.fillStyle = '#4a2424'; for (let k = 0; k < 3; k++) c.fillRect(x - s * 0.14 + k * 0.02 * s, y - s * (0.3 + k * 0.36), s * (0.28 - k * 0.04), s * 0.16); }
    c.fillStyle = '#ffe6a8'; c.fillRect(x - s * 0.07, y - s * 1.46, s * 0.14, s * 0.16); c.fillStyle = SIL; c.beginPath(); c.moveTo(x - s * 0.11, y - s * 1.46); c.lineTo(x, y - s * 1.6); c.lineTo(x + s * 0.11, y - s * 1.46); c.fill();
    lights.push([x, y - s * 1.38, s * 1.6, 0.6, '255,226,160', true]);
  }
  function greenhouse(c, x, y, s, r, lights) {
    const w = s * (1 + r() * 0.8), h = s * 0.28; c.fillStyle = 'rgba(255,150,70,.55)'; c.fillRect(x - w / 2, y - h, w, h);
    c.fillStyle = 'rgba(255,190,110,.5)'; for (let i = 0; i < w / (s * 0.18); i++) c.fillRect(x - w / 2 + i * s * 0.18, y - h - s * 0.06, s * 0.09, s * 0.06);
    lights.push([x, y - h / 2, w * 0.9, 0.28, '255,150,70']);
  }
  function dune(c, x, y, s) { c.fillStyle = '#3c4753'; c.beginPath(); c.ellipse(x, y, s * 0.55, s * 0.24, 0, Math.PI, TAU); c.fill(); c.fillStyle = 'rgba(160,175,190,.10)'; c.beginPath(); c.ellipse(x - s * 0.1, y - s * 0.08, s * 0.3, s * 0.1, -0.2, Math.PI, TAU); c.fill(); }
  function city(c, x, y, s, n, r, lights) {
    for (let i = 0; i < 2 + n * 2; i++) {
      const bx = x + (r() - 0.5) * s * (1 + n * 0.7), by = y + (r() - 0.5) * s * 0.5, w = s * (0.25 + r() * 0.3), h = s * (0.3 + r() * 0.5 * n);
      c.fillStyle = r() < 0.5 ? SIL : SIL2; c.fillRect(bx - w / 2, by - h, w, h); c.beginPath(); c.moveTo(bx - w / 2, by - h); c.lineTo(bx, by - h - w * 0.6); c.lineTo(bx + w / 2, by - h); c.fill();
      if (r() < 0.7) { c.fillStyle = r() < 0.5 ? '#e8a448' : '#c98a3a'; c.fillRect(bx - s * 0.04, by - h * 0.6, s * 0.07, s * 0.08); lights.push([bx, by - h * 0.55, s * 0.9, 0.22]); }
    }
    if (n > 1) { c.fillStyle = SIL; c.fillRect(x - s * 0.06, y - s * 1.3, s * 0.12, s * 1.3); c.beginPath(); c.moveTo(x - s * 0.09, y - s * 1.3); c.lineTo(x, y - s * 1.9); c.lineTo(x + s * 0.09, y - s * 1.3); c.fill(); }
  }

  // ---------------------------------------------------------------- vignette pieces
  // Every piece draws on a ground line y at centre x in units of u; L carries the window light.
  function win(c, x, y, w, h, L, force) {
    const on = force || L.r() < L.lit;
    c.fillStyle = on ? (L.hot ? (L.r() < 0.5 ? '#ffd27a' : '#ffb347') : (L.r() < 0.5 ? '#e39a42' : '#c97c2c')) : '#1c232c';
    c.fillRect(x, y, w, h); if (on && L.r() < 0.35) L.lights.push([x + w / 2, y + h / 2, w * 4 + 2, L.hot ? 0.22 : 0.13]);
  }
  function grid(c, x0, y0, w, h, u, L, cols, rows) {
    const ww = u * 0.3, wh = u * 0.46, gx = w / cols, gy = h / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) win(c, x0 + gx * (i + 0.5) - ww / 2, y0 + gy * (j + 0.5) - wh / 2, ww, wh, L);
  }
  function gable(c, x, y, w, h, kind) {   // the outline of a Dutch house front, filled
    c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - h);
    if (kind === 0) c.lineTo(x, y - h - w * 0.62);
    else if (kind === 1) { const st = w / 5, s = w * 0.24; let xx = x - w / 2, yy = y - h; for (let i = 0; i < 2; i++) { yy -= s; c.lineTo(xx, yy); xx += st; c.lineTo(xx, yy); } yy -= s; c.lineTo(xx, yy); c.lineTo(x + w / 2 - 2 * st, yy); yy += s; c.lineTo(x + w / 2 - 2 * st, yy); c.lineTo(x + w / 2 - st, yy); yy += s; c.lineTo(x + w / 2 - st, yy); c.lineTo(x + w / 2, yy); }
    else if (kind === 2) { c.quadraticCurveTo(x - w / 2, y - h - w * 0.35, x - w * 0.2, y - h - w * 0.45); c.lineTo(x - w * 0.2, y - h - w * 0.72); c.arc(x, y - h - w * 0.72, w * 0.2, Math.PI, 0); c.lineTo(x + w * 0.2, y - h - w * 0.45); c.quadraticCurveTo(x + w / 2, y - h - w * 0.35, x + w / 2, y - h); }
    else { c.lineTo(x - w / 2 - w * 0.06, y - h); c.lineTo(x - w / 2 - w * 0.06, y - h - w * 0.14); c.lineTo(x + w / 2 + w * 0.06, y - h - w * 0.14); c.lineTo(x + w / 2 + w * 0.06, y - h); }
    c.lineTo(x + w / 2, y - h); c.lineTo(x + w / 2, y); c.closePath(); c.fill();
  }
  function house(c, x, y, w, h, kind, u, L) {
    c.fillStyle = L.r() < 0.5 ? BLD : BLD2; gable(c, x, y, w, h, kind);
    const cols = Math.max(1, Math.round(w / (u * 0.62))), rows = Math.max(1, Math.round(h / (u * 0.9)));
    grid(c, x - w / 2 + u * 0.08, y - h + u * 0.12, w - u * 0.16, h - u * 0.3, u, L, cols, rows);
  }
  function row(c, x0, x1, y, u, L, o) {   // a terrace of gabled houses from x0 to x1
    o = o || {}; let x = x0;
    while (x < x1 - u * 0.5) {
      const w = Math.min(x1 - x, u * ((o.w || 1.25) + L.r() * 0.45)), h = u * ((o.h || 2.2) + L.r() * (o.hv || 1.2));
      house(c, x + w / 2, y - (o.stagger ? (L.r() * 0.25 * u) : 0), w, h, o.kinds ? o.kinds[(L.r() * o.kinds.length) | 0] : (L.r() * 4) | 0, u, L); x += w + u * 0.04;
    }
  }
  function towerTop(c, x, ty, w, h, top, u, L) {   // the top above a square tower body, ty = top of the body
    c.fillStyle = BLD;
    if (top === 'spire') { c.beginPath(); c.moveTo(x - w * 0.55, ty); c.lineTo(x, ty - h); c.lineTo(x + w * 0.55, ty); c.fill(); }
    else if (top === 'flat') { for (let i = 0; i < 4; i++) c.fillRect(x - w / 2 + i * w / 3.4, ty - u * 0.4, w / 7, u * 0.4); }
    else if (top === 'lantern') {   // an open octagon stage with lights inside, then a small spire: the Dom, the Martini
      const s1 = h * 0.42; c.fillRect(x - w * 0.36, ty - s1, w * 0.72, s1);
      c.fillStyle = L.lit > 0.5 ? 'rgba(255,196,110,.9)' : 'rgba(170,110,55,.6)'; c.fillRect(x - w * 0.24, ty - s1 * 0.85, w * 0.14, s1 * 0.6); c.fillRect(x + w * 0.1, ty - s1 * 0.85, w * 0.14, s1 * 0.6);
      L.lights.push([x, ty - s1 * 0.55, w * 2.4, L.hot ? 0.34 : 0.18]);
      c.fillStyle = BLD; c.fillRect(x - w * 0.24, ty - s1 - h * 0.18, w * 0.48, h * 0.18);
      c.beginPath(); c.moveTo(x - w * 0.24, ty - s1 - h * 0.18); c.lineTo(x, ty - h); c.lineTo(x + w * 0.24, ty - s1 - h * 0.18); c.fill();
    } else if (top === 'crown') {   // the Westertoren: stacked stages and a crown
      const s1 = h * 0.3; c.fillRect(x - w * 0.38, ty - s1, w * 0.76, s1); win(c, x - w * 0.1, ty - s1 * 0.8, w * 0.2, s1 * 0.5, L, L.lit > 0.4);
      c.fillRect(x - w * 0.26, ty - s1 - h * 0.25, w * 0.52, h * 0.25); c.beginPath(); c.ellipse(x, ty - s1 - h * 0.27, w * 0.22, h * 0.1, 0, Math.PI, TAU); c.fill();
      c.fillStyle = '#2c3e52'; c.beginPath(); c.moveTo(x - w * 0.2, ty - s1 - h * 0.3); c.quadraticCurveTo(x, ty - s1 - h * 0.52, x + w * 0.2, ty - s1 - h * 0.3); c.fill();
      c.fillStyle = BLD; c.fillRect(x - u * 0.05, ty - h, u * 0.1, h * 0.25);
    } else if (top === 'onion') { const s1 = h * 0.35; c.fillRect(x - w * 0.34, ty - s1, w * 0.68, s1); c.beginPath(); c.ellipse(x, ty - s1 - h * 0.12, w * 0.3, h * 0.16, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(x - w * 0.1, ty - s1 - h * 0.2); c.lineTo(x, ty - h); c.lineTo(x + w * 0.1, ty - s1 - h * 0.2); c.fill(); }
    else if (top === 'hex') {   // Den Haag's Grote Kerk: a tall hexagonal tower with an open crown
      c.fillRect(x - w * 0.4, ty - h * 0.35, w * 0.8, h * 0.35); c.fillStyle = L.lit > 0.4 ? 'rgba(255,190,100,.8)' : 'rgba(150,100,55,.55)'; c.fillRect(x - w * 0.1, ty - h * 0.3, w * 0.2, h * 0.22);
      c.fillStyle = BLD; c.beginPath(); c.moveTo(x - w * 0.42, ty - h * 0.35); c.lineTo(x, ty - h); c.lineTo(x + w * 0.42, ty - h * 0.35); c.fill(); L.lights.push([x, ty - h * 0.22, w * 2, 0.2]);
    }
  }
  function tower(c, x, y, w, h, top, u, L, col) {
    const body = h * (top === 'flat' ? 0.92 : top === 'spire' ? 0.55 : 0.6);
    c.fillStyle = col || BLD2; c.fillRect(x - w / 2, y - body, w, body);
    grid(c, x - w / 2, y - body + u * 0.4, w, body * 0.75, u, L, 1, Math.max(2, Math.round(body / (u * 1.8))));
    towerTop(c, x, y - body, w, h - body, top, u, L);
  }
  function nave(c, x0, x1, y, h, u, L) {   // a church nave with a steep roof and tall arched windows
    c.fillStyle = BLD; c.fillRect(x0, y - h, x1 - x0, h); c.fillStyle = ROOF; c.beginPath(); c.moveTo(x0 - u * 0.1, y - h); c.lineTo(x0 + u * 0.5, y - h - u * 1.4); c.lineTo(x1 - u * 0.5, y - h - u * 1.4); c.lineTo(x1 + u * 0.1, y - h); c.fill();
    for (let wx = x0 + u * 0.45; wx < x1 - u * 0.4; wx += u * 0.95) {
      const on = L.r() < L.lit; c.fillStyle = on ? (L.hot ? '#ffc060' : '#c98030') : '#1c232c';
      c.beginPath(); c.moveTo(wx, y - u * 0.35); c.lineTo(wx, y - h + u * 0.8); c.arc(wx + u * 0.18, y - h + u * 0.8, u * 0.18, Math.PI, 0); c.lineTo(wx + u * 0.36, y - u * 0.35); c.fill();
      if (on && L.r() < 0.5) L.lights.push([wx + u * 0.18, y - h * 0.55, u * 1.7, L.hot ? 0.28 : 0.14]);
    }
  }
  function canal(c, x0, x1, y, h, L) {   // a strip of water with the lights of the row above in it
    c.fillStyle = WATER; c.fillRect(x0, y, x1 - x0, h); c.fillStyle = 'rgba(120,150,180,.12)'; c.fillRect(x0, y, x1 - x0, 1);
    for (let x = x0 + 2; x < x1 - 2; x += 3 + L.r() * 5) if (L.r() < L.lit) { c.fillStyle = `rgba(255,${170 + (L.r() * 40) | 0},80,${0.18 + L.r() * 0.25})`; for (let k = 0; k < 3; k++) c.fillRect(x + (L.r() - 0.5) * 1.5, y + 1.5 + k * h * 0.28, Math.max(1, 2.2 - k * 0.6), Math.max(1, h * 0.14)); }
  }


  // ---------------------------------------------------------------- landmarks
  function lighthouse(c, x, y, u, L, red) {
    const h = u * 6.4; c.fillStyle = red ? '#3e2020' : '#2f3741';
    c.beginPath(); c.moveTo(x - u * 0.7, y); c.lineTo(x - u * 0.4, y - h); c.lineTo(x + u * 0.4, y - h); c.lineTo(x + u * 0.7, y); c.fill();
    if (!red) { c.fillStyle = '#3e2020'; for (let k = 0; k < 2; k++) { const yy = y - h * (0.3 + k * 0.32); c.fillRect(x - u * 0.6 + k * u * 0.07, yy - u * 0.5, u * (1.2 - k * 0.14), u * 0.5); } }
    c.fillStyle = BLD; c.fillRect(x - u * 0.62, y - h - u * 0.28, u * 1.24, u * 0.28);
    c.fillStyle = '#ffe6a8'; c.fillRect(x - u * 0.36, y - h - u * 1.1, u * 0.72, u * 0.82);
    c.fillStyle = BLD; c.beginPath(); c.moveTo(x - u * 0.52, y - h - u * 1.1); c.lineTo(x, y - h - u * 1.7); c.lineTo(x + u * 0.52, y - h - u * 1.1); c.fill();
    L.lights.push([x, y - h - u * 0.7, u * 4.2, 0.75, '255,228,170']); L.beams.push([x, y - h - u * 0.7, u * 15, L.state]);
  }
  function erasmus(c, x, y, u, L) {   // the white bridge with the bent pylon over the Maas
    const w = u * 11, dy = y - u * 0.25, px = x - u * 1.6, top = dy - u * 7.4;
    c.fillStyle = '#1a222b'; c.fillRect(x - w / 2, dy, w, u * 0.32);
    c.strokeStyle = 'rgba(214,224,234,.55)'; c.lineWidth = Math.max(0.5, u * 0.05); c.beginPath();
    for (let i = 1; i <= 7; i++) { c.moveTo(px + u * 0.55, top + u * 0.3); c.lineTo(px + u * 0.6 + i * u * 0.78, dy); }
    for (let i = 1; i <= 3; i++) { c.moveTo(px + u * 0.45, top + u * 0.6); c.lineTo(px - i * u * 0.75, dy); }
    c.stroke();
    c.strokeStyle = '#d6e0ea'; c.lineWidth = u * 0.34; c.lineCap = 'round'; c.beginPath(); c.moveTo(px - u * 0.9, dy + u * 0.3); c.lineTo(px - u * 0.45, dy - u * 3.2); c.lineTo(px + u * 0.55, top); c.stroke(); c.lineCap = 'butt';
    c.fillStyle = '#ffe7b0'; for (let i = 0; i < 9; i++) c.fillRect(x - w / 2 + u * 0.4 + i * w / 9, dy - u * 0.12, Math.max(1, u * 0.14), Math.max(1, u * 0.14));
    L.lights.push([px, top + u * 3, u * 4, 0.22, '200,220,240'], [x, dy, w * 0.5, 0.18]);
  }
  function waalbrug(c, x, y, u, L) {   // Nijmegen's arch over the Waal, lit
    const w = u * 11.5, dy = y - u * 0.3, a0 = [x - w * 0.42, dy], a1 = [x + w * 0.42, dy], ac = [x, dy - u * 6.4];
    c.fillStyle = '#151c24'; c.fillRect(x - w / 2, dy, w, u * 0.38); for (const s of [-1, 1]) c.fillRect(x + s * w * 0.42 - u * 0.3, dy, u * 0.6, u * 1.2);
    const at = t => [(1 - t) * (1 - t) * a0[0] + 2 * t * (1 - t) * ac[0] + t * t * a1[0], (1 - t) * (1 - t) * a0[1] + 2 * t * (1 - t) * ac[1] + t * t * a1[1]];
    const lit = L.lit > 0.5;
    c.strokeStyle = lit ? 'rgba(232,170,80,.85)' : '#4a4030'; c.lineWidth = Math.max(0.5, u * 0.07); c.beginPath(); for (let i = 1; i < 12; i++) { const p = at(i / 12); c.moveTo(p[0], p[1]); c.lineTo(p[0], dy); } c.stroke();
    c.strokeStyle = lit ? '#f0b050' : '#6a5438'; c.lineWidth = u * 0.42; c.beginPath(); c.moveTo(a0[0], a0[1]); c.quadraticCurveTo(ac[0], ac[1], a1[0], a1[1]); c.stroke();
    for (let i = 1; i < 12; i++) { const p = at(i / 12); L.lights.push([p[0], p[1], u * 1.6, lit ? 0.32 : 0.1]); }
    L.lights.push([x, dy - u * 2.4, w * 0.5, lit ? 0.22 : 0.06]);
  }
  function cranes(c, x, y, u, L) {   // harbour cranes with red lamps on top
    c.strokeStyle = SIL; c.lineWidth = Math.max(0.8, u * 0.2);
    for (const [dx, h, d] of [[-1.3, 6, 1], [1.5, 5.2, 1]]) {
      const bx = x + dx * u; c.beginPath(); c.moveTo(bx - u * 0.6, y); c.lineTo(bx - u * 0.3, y - h * u); c.lineTo(bx + u * 0.3, y - h * u); c.lineTo(bx + u * 0.6, y);
      c.moveTo(bx - u * 1.8 * d, y - (h - 0.3) * u); c.lineTo(bx + u * 2.6 * d, y - (h - 0.3) * u); c.moveTo(bx, y - h * u); c.lineTo(bx, y - (h + 1.1) * u); c.stroke();
      c.fillStyle = '#ff6a50'; c.fillRect(bx - u * 0.12, y - (h + 1.2) * u, u * 0.24, u * 0.24); L.lights.push([bx, y - (h + 1.1) * u, u * 1.5, 0.4, '255,90,70']);
    }
  }
  function kotter(c, x, y, u, L, flip) {   // a fishing cutter with its booms up
    const d = flip ? -1 : 1; c.fillStyle = '#10161d';
    c.beginPath(); c.moveTo(x - u * 1.6 * d, y - u * 0.75); c.lineTo(x + u * 1.75 * d, y - u * 0.95); c.lineTo(x + u * 1.3 * d, y); c.lineTo(x - u * 1.3 * d, y); c.fill();
    c.fillRect(x - u * 0.2 * d - u * 0.45, y - u * 1.55, u * 0.9, u * 0.8); win(c, x - u * 0.2 * d - u * 0.25, y - u * 1.4, u * 0.22, u * 0.22, L, L.lit > 0.3); win(c, x - u * 0.2 * d + u * 0.05, y - u * 1.4, u * 0.22, u * 0.22, L);
    c.strokeStyle = '#10161d'; c.lineWidth = Math.max(0.6, u * 0.1); c.beginPath(); c.moveTo(x + u * 0.5 * d, y - u * 0.8); c.lineTo(x + u * 0.5 * d, y - u * 4); c.moveTo(x + u * 0.5 * d, y - u * 1.1); c.lineTo(x + u * 2.3 * d, y - u * 3.4); c.moveTo(x + u * 0.5 * d, y - u * 1.1); c.lineTo(x - u * 1.4 * d, y - u * 3.3); c.stroke();
    c.fillStyle = '#ffe2a0'; c.fillRect(x + u * 0.42 * d, y - u * 4.15, u * 0.18, u * 0.18); L.lights.push([x + u * 0.5 * d, y - u * 4.05, u * 1.4, 0.4], [x, y - u * 1.2, u * 2.2, 0.2]);
  }
  function ferry(c, x, y, u, L) {   // the Texel ferry, all windows lit
    c.fillStyle = '#121921'; c.beginPath(); c.moveTo(x - u * 4, y - u * 0.9); c.lineTo(x + u * 4.2, y - u * 0.9); c.lineTo(x + u * 3.6, y); c.lineTo(x - u * 3.6, y); c.fill();
    c.fillRect(x - u * 2.8, y - u * 1.9, u * 5.4, u * 1.0); c.fillRect(x - u * 1.6, y - u * 2.6, u * 3.4, u * 0.7); c.fillRect(x + u * 0.6, y - u * 3.4, u * 0.6, u * 0.8);
    for (let i = 0; i < 12; i++) win(c, x - u * 2.6 + i * u * 0.44, y - u * 1.65, u * 0.24, u * 0.3, L, L.lit > 0.3 && L.r() < 0.8);
    for (let i = 0; i < 6; i++) win(c, x - u * 1.4 + i * u * 0.5, y - u * 2.4, u * 0.24, u * 0.26, L);
    L.lights.push([x, y - u * 1.6, u * 5, 0.2]);
  }
  function cheese(c, x, y, u, L) {   // Gouda's wheels in stacks, warm in the lamp light
    for (const [ox, n] of [[-1.05, 3], [0, 4], [1.05, 2]]) for (let k = 0; k < n; k++) {
      const cx = x + ox * u, cy = y - k * u * 0.55;
      c.fillStyle = '#9a5c18'; c.beginPath(); c.ellipse(cx, cy, u * 0.5, u * 0.2, 0, 0, Math.PI); c.lineTo(cx - u * 0.5, cy - u * 0.35); c.ellipse(cx, cy - u * 0.35, u * 0.5, u * 0.2, 0, Math.PI, 0, true); c.closePath(); c.fill();
      c.fillStyle = L.lit > 0.4 ? '#e9ac48' : '#8a6a38'; c.beginPath(); c.ellipse(cx, cy - u * 0.35, u * 0.5, u * 0.2, 0, 0, TAU); c.fill();
    }
    L.lights.push([x, y - u * 1.2, u * 3.4, L.lit > 0.4 ? 0.34 : 0.1, '255,190,90']);
  }
  function barrier(c, x, y, u, L) {   // the Oosterscheldekering: piers, gates and lamps across the water
    const w = u * 9; canal(c, x - w / 2 - u * 0.4, x + w / 2 + u * 0.4, y - u * 0.1, u * 1.3, L);
    c.fillStyle = '#19212a'; c.fillRect(x - w / 2, y - u * 1.3, w, u * 0.32);
    for (let i = 0; i <= 8; i++) { const px = x - w / 2 + i * w / 8; c.fillStyle = BLD2; c.fillRect(px - u * 0.22, y - u * 2.2, u * 0.44, u * 2.3); if (i % 2 === 0) { c.fillStyle = '#ffd890'; c.fillRect(px - u * 0.08, y - u * 2.4, u * 0.16, u * 0.16); L.lights.push([px, y - u * 2.3, u * 1.4, 0.22 + 0.3 * L.lit]); } }
  }
  function stonebridge(c, x, y, u, L, n) {   // arches over the water: the Sint-Servaasbrug
    n = n || 5; const w = u * 9.5; canal(c, x - w / 2 - u * 0.5, x + w / 2 + u * 0.5, y - u * 0.15, u * 1.4, L);
    c.fillStyle = '#1d252f'; c.beginPath(); c.moveTo(x - w / 2, y + u * 0.2); c.lineTo(x - w / 2, y - u * 1.0); c.lineTo(x + w / 2, y - u * 1.0); c.lineTo(x + w / 2, y + u * 0.2);
    for (let i = n - 1; i >= 0; i--) { const ax = x - w / 2 + (i + 0.5) * w / n, r = w / n * 0.38; c.lineTo(ax + r, y + u * 0.2); c.arc(ax, y + u * 0.2, r, 0, Math.PI, true); }
    c.closePath(); c.fill();
    for (let i = 0; i <= n; i++) { const lx = x - w / 2 + i * w / n; c.fillStyle = '#ffd88a'; c.fillRect(lx - u * 0.06, y - u * 1.45, u * 0.12, u * 0.45); L.lights.push([lx, y - u * 1.4, u * 1.3, 0.2 + 0.25 * L.lit]); }
  }
  function magerebrug(c, x, y, u, L) {   // Amsterdam's white double drawbridge
    c.fillStyle = '#2a3440'; c.fillRect(x - u * 2.6, y - u * 0.6, u * 5.2, u * 0.3);
    c.strokeStyle = '#c8d0d8'; c.lineWidth = Math.max(0.6, u * 0.13);
    c.beginPath(); for (const s of [-1, 1]) { const bx = x + s * u * 0.9; c.moveTo(bx - u * 0.4, y - u * 0.6); c.lineTo(bx - u * 0.4, y - u * 2.4); c.lineTo(bx + u * 0.4, y - u * 2.4); c.lineTo(bx + u * 0.4, y - u * 0.6); c.moveTo(bx - u * 0.5, y - u * 2.4); c.lineTo(bx + s * u * 1.7, y - u * 1.7); } c.stroke();
    c.fillStyle = '#fff0c8'; for (let i = 0; i < 7; i++) { c.fillRect(x - u * 2.4 + i * u * 0.8, y - u * 0.78, Math.max(1, u * 0.12), Math.max(1, u * 0.12)); } L.lights.push([x, y - u * 1.2, u * 3.2, 0.26]);
  }
  function euromast(c, x, y, u, L) {
    c.fillStyle = BLD2; c.fillRect(x - u * 0.35, y - u * 9, u * 0.7, u * 9); c.fillStyle = BLD; c.beginPath(); c.ellipse(x, y - u * 6.2, u * 1.2, u * 0.4, 0, 0, TAU); c.fill();
    c.fillStyle = '#ffcf7a'; c.fillRect(x - u * 1.05, y - u * 6.25, u * 2.1, Math.max(1, u * 0.12)); c.fillStyle = BLD; c.fillRect(x - u * 0.12, y - u * 11.5, u * 0.24, u * 2.6);
    c.fillStyle = '#ff6a50'; c.fillRect(x - u * 0.1, y - u * 11.7, u * 0.2, u * 0.2); L.lights.push([x, y - u * 6.2, u * 3.2, 0.3], [x, y - u * 11.6, u * 1.2, 0.35, '255,90,70']);
  }
  function cubes(c, x, y, u, L) {   // the tilted cube houses
    for (let i = 0; i < 3; i++) { const cx = x + (i - 1) * u * 1.25, cy = y - u * 1.5; c.fillStyle = BLD2; c.fillRect(cx - u * 0.1, cy, u * 0.2, u * 1.5); c.fillStyle = i % 2 ? '#5c4a20' : '#4c3e1c'; c.beginPath(); c.moveTo(cx, cy - u * 1.15); c.lineTo(cx + u * 0.62, cy - u * 0.58); c.lineTo(cx, cy); c.lineTo(cx - u * 0.62, cy - u * 0.58); c.fill(); win(c, cx - u * 0.12, cy - u * 0.7, u * 0.24, u * 0.24, L); }
  }
  function blocks(c, x0, x1, y, u, L, hmin, hmax) {   // a modern skyline of lit towers
    let x = x0; while (x < x1 - u * 0.4) { const w = u * (0.9 + L.r() * 0.9), h = u * (hmin + L.r() * (hmax - hmin)); c.fillStyle = L.r() < 0.5 ? BLD : BLD2; c.fillRect(x, y - h, w, h); grid(c, x + u * 0.08, y - h + u * 0.2, w - u * 0.16, h - u * 0.4, u, L, Math.max(1, Math.round(w / (u * 0.45))), Math.max(2, Math.round(h / (u * 0.7)))); x += w + u * 0.15; }
  }
  function gatehouse(c, x, y, u, L) {   // the Helpoort: a gate between two round towers
    c.fillStyle = BLD2; c.fillRect(x - u * 1.2, y - u * 2.4, u * 2.4, u * 2.4); c.fillStyle = '#05080b'; c.beginPath(); c.moveTo(x - u * 0.45, y); c.lineTo(x - u * 0.45, y - u * 1.1); c.arc(x, y - u * 1.1, u * 0.45, Math.PI, 0); c.lineTo(x + u * 0.45, y); c.fill();
    for (const s of [-1, 1]) { c.fillStyle = BLD; c.fillRect(x + s * u * 1.3 - u * 0.55, y - u * 3.3, u * 1.1, u * 3.3); c.beginPath(); c.moveTo(x + s * u * 1.3 - u * 0.65, y - u * 3.3); c.lineTo(x + s * u * 1.3, y - u * 4.6); c.lineTo(x + s * u * 1.3 + u * 0.65, y - u * 3.3); c.fill(); win(c, x + s * u * 1.3 - u * 0.12, y - u * 2.5, u * 0.24, u * 0.4, L); }
    c.fillStyle = ROOF; c.beginPath(); c.moveTo(x - u * 1.3, y - u * 2.4); c.lineTo(x, y - u * 3.4); c.lineTo(x + u * 1.3, y - u * 2.4); c.fill();
  }
  function ridderzaal(c, x, y, u, L) {   // the Binnenhof hall: a great gable between two slim turrets, a lit rose window
    c.fillStyle = BLD2; c.beginPath(); c.moveTo(x - u * 2, y); c.lineTo(x - u * 2, y - u * 3); c.lineTo(x, y - u * 5.6); c.lineTo(x + u * 2, y - u * 3); c.lineTo(x + u * 2, y); c.fill();
    const on = L.lit > 0.35; c.fillStyle = on ? '#ffc868' : '#3a3024'; c.beginPath(); c.arc(x, y - u * 3.3, u * 0.6, 0, TAU); c.fill(); if (on) L.lights.push([x, y - u * 3.3, u * 2.4, L.hot ? 0.4 : 0.24]);
    grid(c, x - u * 1.8, y - u * 2.4, u * 3.6, u * 2.1, u, L, 4, 2);
    for (const s of [-1, 1]) { c.fillStyle = BLD; c.fillRect(x + s * u * 2.25 - u * 0.35, y - u * 4.6, u * 0.7, u * 4.6); c.beginPath(); c.moveTo(x + s * u * 2.25 - u * 0.42, y - u * 4.6); c.lineTo(x + s * u * 2.25, y - u * 6.2); c.lineTo(x + s * u * 2.25 + u * 0.42, y - u * 4.6); c.fill(); }
  }
  function ferris(c, x, y, u, L) {   // the wheel on the Scheveningen pier
    const r = u * 2, cy = y - r - u * 0.5; c.strokeStyle = '#2e3a46'; c.lineWidth = Math.max(0.6, u * 0.1); c.beginPath(); c.arc(x, cy, r, 0, TAU); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.moveTo(x, cy); c.lineTo(x + Math.cos(a) * r, cy + Math.sin(a) * r); } c.moveTo(x - u * 0.8, y); c.lineTo(x, cy); c.lineTo(x + u * 0.8, y); c.stroke();
    for (let i = 0; i < 8; i++) if (L.r() < L.lit + 0.2) { const a = i * Math.PI / 4; L.lights.push([x + Math.cos(a) * r, cy + Math.sin(a) * r, u * 0.9, 0.3, '255,210,150']); }
  }
  function barn(c, x, y, u, L) {   // the Texel schapenboet: the roof slopes down to the wind
    c.fillStyle = BLD; c.beginPath(); c.moveTo(x - u * 1.8, y); c.lineTo(x - u * 1.8, y - u * 0.5); c.lineTo(x + u * 0.4, y - u * 2.4); c.lineTo(x + u * 1.5, y - u * 1.3); c.lineTo(x + u * 1.5, y); c.fill(); win(c, x + u * 0.6, y - u * 0.8, u * 0.36, u * 0.36, L);
  }
  function dog(c, x, y, u) { c.fillStyle = '#06090c'; c.beginPath(); c.ellipse(x, y - u * 0.32, u * 0.36, u * 0.15, 0, 0, TAU); c.fill(); c.fillRect(x + u * 0.22, y - u * 0.62, u * 0.2, u * 0.26); c.fillRect(x - u * 0.28, y - u * 0.2, u * 0.07, u * 0.2); c.fillRect(x + u * 0.2, y - u * 0.2, u * 0.07, u * 0.2); c.beginPath(); c.moveTo(x - u * 0.34, y - u * 0.36); c.lineTo(x - u * 0.55, y - u * 0.62); c.lineTo(x - u * 0.5, y - u * 0.36); c.fill(); }

  // ---------------------------------------------------------------- one vignette per town
  // (c, x, y, u, L): x is the town's spot, y the ground line just above its badge, u = width / 16
  const V = {
    alblasserdam(c, x, y, u, L) {   // a dyke village on the Noord, the shipyard crane, the church, the mill, and home
      canal(c, x - 8.2 * u, x - 3.4 * u, y - 0.3 * u, 1.5 * u, L);
      c.fillStyle = '#1b232c'; c.beginPath(); c.moveTo(x - 3.6 * u, y + 0.3 * u); c.lineTo(x - 2.8 * u, y - 1.0 * u); c.lineTo(x + 7.6 * u, y - 1.0 * u); c.lineTo(x + 8.2 * u, y + 0.3 * u); c.fill();
      c.strokeStyle = SIL; c.lineWidth = Math.max(0.8, u * 0.18); c.beginPath(); c.moveTo(x - 7.4 * u, y - 0.2 * u); c.lineTo(x - 7.4 * u, y - 5.2 * u); c.moveTo(x - 4.6 * u, y - 0.2 * u); c.lineTo(x - 4.6 * u, y - 5.2 * u); c.moveTo(x - 7.9 * u, y - 5.2 * u); c.lineTo(x - 4.1 * u, y - 5.2 * u); c.stroke();
      c.fillStyle = BLD2; c.fillRect(x - 6.4 * u, y - 4.9 * u, 0.9 * u, 0.7 * u); c.fillStyle = '#ff6a50'; c.fillRect(x - 7.5 * u, y - 5.6 * u, 0.22 * u, 0.22 * u); L.lights.push([x - 7.4 * u, y - 5.5 * u, 1.4 * u, 0.35, '255,90,70']);
      row(c, x - 2.6 * u, x + 1.7 * u, y - 1.0 * u, u, L, { h: 1.5, hv: 0.6, w: 1.15, kinds: [0, 0, 1, 3] });
      tower(c, x + 2.7 * u, y - 1.0 * u, 1.2 * u, 7.2 * u, 'spire', u, L);
      row(c, x + 3.5 * u, x + 4.9 * u, y - 1.0 * u, u, L, { h: 1.3, hv: 0.4, kinds: [0, 3] });
      mill(c, x + 6.4 * u, y - 1.0 * u, 3.3 * u, 0.55, true, L.lights);
      c.fillStyle = BLD2; gable(c, x - 0.6 * u, y + 0.35 * u, 2.0 * u, 1.5 * u, 0);
      win(c, x - 1.25 * u, y - 0.75 * u, 0.42 * u, 0.5 * u, L, true); win(c, x - 0.25 * u, y - 0.75 * u, 0.42 * u, 0.5 * u, L, true);
      L.lights.push([x - 0.6 * u, y - 0.5 * u, 2.8 * u, 0.45, '255,200,110']);
      dog(c, x + 1.2 * u, y + 0.35 * u, u); dog(c, x + 2.0 * u, y + 0.4 * u, u * 0.85);
    },
    kinderdijk(c, x, y, u, L) {   // the mills along the water, Dordrecht's Grote Kerk behind
      tower(c, x + 5.6 * u, y - 1.4 * u, 2.4 * u, 6.2 * u, 'flat', u, L);
      c.fillStyle = '#ffe2a0'; c.beginPath(); c.arc(x + 5.6 * u, y - 6.4 * u, 0.42 * u, 0, TAU); c.fill(); L.lights.push([x + 5.6 * u, y - 6.4 * u, 1.6 * u, 0.3]);
      nave(c, x + 6.8 * u, x + 8.4 * u, y - 1.4 * u, 1.6 * u, u, L);
      c.fillStyle = WATER; c.beginPath(); c.moveTo(x - 8 * u, y + 0.5 * u); c.lineTo(x - 7 * u, y - 0.4 * u); c.lineTo(x + 4.2 * u, y - 1.6 * u); c.lineTo(x + 4.6 * u, y - 1.2 * u); c.lineTo(x - 5.5 * u, y + 0.6 * u); c.fill();
      const ms = [[-6.2, -0.1, 4.2, 0.2], [-3.2, -0.6, 3.7, 0.9], [-0.4, -1.0, 3.2, 0.5], [2.0, -1.4, 2.7, 1.2], [3.9, -1.7, 2.2, 0.3]];
      for (let i = ms.length - 1; i >= 0; i--) { const [mx, my, s, a] = ms[i]; mill(c, x + mx * u, y + my * u, s * u, a, L.r() < L.lit + 0.2, L.lights); }
      for (const [mx, my] of [[-6.2, -0.1], [-3.2, -0.6], [-0.4, -1.0]]) { c.fillStyle = 'rgba(255,170,70,.18)'; c.fillRect(x + mx * u - 0.1 * u, y + my * u + 0.35 * u, 0.2 * u, 0.9 * u); }
    },
    gouda(c, x, y, u, L) {   // the town hall alone on the square, the Sint-Jan, the Waag, cheese
      nave(c, x + 3.6 * u, x + 7.6 * u, y - 1.3 * u, 2.2 * u, u, L); tower(c, x + 3.4 * u, y - 1.3 * u, 1.3 * u, 5.4 * u, 'spire', u, L);
      row(c, x - 7.8 * u, x - 4.4 * u, y - 1.2 * u, u, L, { h: 2.0, hv: 0.8, kinds: [1, 2, 3] });
      c.fillStyle = BLD2; c.fillRect(x - 4.1 * u, y - 2.4 * u, 2.2 * u, 2.4 * u); c.fillStyle = ROOF; c.beginPath(); c.moveTo(x - 4.3 * u, y - 2.4 * u); c.lineTo(x - 3.0 * u, y - 3.3 * u); c.lineTo(x - 1.7 * u, y - 2.4 * u); c.fill(); grid(c, x - 4.0 * u, y - 2.2 * u, 2.0 * u, 1.8 * u, u, L, 3, 2);
      c.fillStyle = BLD; c.fillRect(x - 1.3 * u, y - 4.2 * u, 2.6 * u, 4.2 * u); gable(c, x, y - 4.2 * u, 2.6 * u, 0.01, 1);
      c.strokeStyle = BLD; c.lineWidth = Math.max(0.6, u * 0.12); c.beginPath(); for (const px of [-1.3, -0.78, -0.26, 0.26, 0.78, 1.3]) { c.moveTo(x + px * u, y - 4.2 * u - (1 - Math.abs(px) / 1.4) * 1.9 * u); c.lineTo(x + px * u, y - 4.9 * u - (1 - Math.abs(px) / 1.4) * 1.9 * u); } c.stroke();
      for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) { const wx = x - 0.95 * u + i * 0.75 * u, wy = y - 3.7 * u + j * 1.15 * u; win(c, wx, wy, 0.38 * u, 0.62 * u, L); c.fillStyle = '#7a2a24'; c.fillRect(wx - 0.12 * u, wy, 0.1 * u, 0.62 * u); c.fillStyle = '#b8b0a0'; c.fillRect(wx + 0.4 * u, wy, 0.1 * u, 0.62 * u); }
      cheese(c, x + 1.6 * u, y + 0.25 * u, u * 1.05, L); cheese(c, x - 2.4 * u, y + 0.45 * u, u * 0.8, L);
    },
    zeeland(c, x, y, u, L) {   // the storm barrier on the left, Zierikzee's Dikke Toren, Middelburg's Lange Jan, the harbour
      barrier(c, x - 4.4 * u, y + 0.1 * u, u * 0.85, L);
      tower(c, x + 0.8 * u, y - 1.2 * u, 2.3 * u, 5.0 * u, 'flat', u, L);
      row(c, x + 2.2 * u, x + 4.6 * u, y - 1.1 * u, u, L, { h: 1.7, hv: 0.7, kinds: [0, 1] });
      tower(c, x + 5.6 * u, y - 1.4 * u, 1.2 * u, 8.6 * u, 'lantern', u, L);
      canal(c, x + 1.2 * u, x + 7.8 * u, y - 0.15 * u, 1.2 * u, L);
      boat(c, x + 3.0 * u, y + 0.5 * u, 2.2 * u, L.r, L.lights, false); boat(c, x + 5.8 * u, y + 0.6 * u, 1.8 * u, L.r, L.lights, true);
    },
    utrecht(c, x, y, u, L) {   // the Dom alone, its church across the square, the Oudegracht with the wharf cellars
      row(c, x - 7.8 * u, x - 3.4 * u, y - 1.2 * u, u, L, { h: 2.2, hv: 0.9, kinds: [1, 2, 3] });
      tower(c, x - 1.6 * u, y - 1.3 * u, 2.0 * u, 11.2 * u, 'lantern', u, L);
      nave(c, x + 1.6 * u, x + 5.2 * u, y - 1.3 * u, 2.6 * u, u, L);
      row(c, x + 5.6 * u, x + 7.8 * u, y - 1.1 * u, u, L, { h: 2.0, hv: 0.6 });
      c.fillStyle = '#0a0f14'; c.fillRect(x - 8 * u, y - 0.3 * u, 16 * u, 1.6 * u); canal(c, x - 7.8 * u, x + 7.8 * u, y + 0.3 * u, 1.0 * u, L);
      for (let i = 0; i < 9; i++) { const ax = x - 7.2 * u + i * 1.7 * u; const on = L.r() < L.lit; c.fillStyle = on ? '#e39a42' : '#1c232c'; c.beginPath(); c.moveTo(ax, y + 0.25 * u); c.lineTo(ax, y - 0.05 * u); c.arc(ax + 0.3 * u, y - 0.05 * u, 0.3 * u, Math.PI, 0); c.lineTo(ax + 0.6 * u, y + 0.25 * u); c.fill(); if (on) L.lights.push([ax + 0.3 * u, y, 1.4 * u, 0.22]); }
    },
    denhaag(c, x, y, u, L) {   // the Ridderzaal and the Torentje on the Hofvijver, the Grote Kerk, the pier
      ferris(c, x - 6.8 * u, y - 1.2 * u, u * 0.9, L);
      tower(c, x + 4.8 * u, y - 1.5 * u, 1.8 * u, 9.4 * u, 'hex', u, L); nave(c, x + 5.6 * u, x + 8.0 * u, y - 1.5 * u, 2.3 * u, u, L);
      row(c, x - 5.0 * u, x - 2.6 * u, y - 1.3 * u, u, L, { h: 2.0, hv: 0.6, kinds: [3, 1] });
      ridderzaal(c, x, y - 1.1 * u, u, L);
      row(c, x + 2.4 * u, x + 4.0 * u, y - 1.1 * u, u, L, { h: 1.9, hv: 0.5, kinds: [3] });
      c.fillStyle = BLD2; c.fillRect(x - 3.1 * u, y - 2.4 * u, 1.0 * u, 1.6 * u); c.beginPath(); c.moveTo(x - 3.2 * u, y - 2.4 * u); c.lineTo(x - 2.6 * u, y - 3.5 * u); c.lineTo(x - 2.0 * u, y - 2.4 * u); c.fill(); win(c, x - 2.8 * u, y - 2.1 * u, 0.36 * u, 0.4 * u, L, L.lit > 0.3);
      canal(c, x - 6.0 * u, x + 4.6 * u, y - 0.7 * u, 1.6 * u, L);
    },
    rotterdam(c, x, y, u, L) {   // the Erasmusbrug over the Maas, the Euromast, towers, cranes, the cube houses
      euromast(c, x - 6.6 * u, y - 1.0 * u, u * 0.95, L);
      blocks(c, x - 5.2 * u, x + 3.4 * u, y - 1.6 * u, u, L, 3.0, 7.0);
      cubes(c, x + 4.4 * u, y - 1.2 * u, u * 0.9, L);
      cranes(c, x + 6.6 * u, y - 0.6 * u, u * 0.85, L);
      canal(c, x - 8 * u, x + 8 * u, y - 0.75 * u, 1.9 * u, L);
      erasmus(c, x, y - 0.1 * u, u * 0.95, L);
    },
    urk(c, x, y, u, L) {   // the old island: the harbour full of cutters, the lighthouse, the church on the dyke
      row(c, x - 3.4 * u, x + 1.4 * u, y - 1.4 * u, u, L, { h: 1.5, hv: 0.6, w: 1.1, kinds: [0, 0, 3] });
      c.fillStyle = '#1b232c'; c.fillRect(x + 1.6 * u, y - 1.6 * u, 6.4 * u, 0.7 * u);
      nave(c, x + 2.0 * u, x + 4.2 * u, y - 1.6 * u, 1.4 * u, u, L); tower(c, x + 2.0 * u, y - 1.6 * u, 0.9 * u, 3.6 * u, 'spire', u, L);
      lighthouse(c, x + 6.2 * u, y - 1.6 * u, u * 0.9, L, false);
      canal(c, x - 8 * u, x + 8 * u, y - 0.9 * u, 2.1 * u, L);
      kotter(c, x - 5.6 * u, y + 0.55 * u, u * 0.95, L, false); kotter(c, x - 1.8 * u, y + 0.75 * u, u * 1.05, L, true); kotter(c, x + 2.2 * u, y + 0.6 * u, u * 0.85, L, false);
    },
    texel(c, x, y, u, L) {   // the red lighthouse in the dunes, the schapenboet, sheep, the ferry
      c.fillStyle = '#3a4551'; c.beginPath(); c.ellipse(x - 4.2 * u, y - 1.0 * u, 3.6 * u, 1.3 * u, 0, Math.PI, TAU); c.fill(); c.beginPath(); c.ellipse(x - 0.8 * u, y - 0.9 * u, 2.4 * u, 0.9 * u, 0, Math.PI, TAU); c.fill();
      lighthouse(c, x - 4.6 * u, y - 1.9 * u, u, L, true);
      barn(c, x + 0.6 * u, y - 0.8 * u, u, L);
      for (const [sx, sy] of [[-1.6, 0], [-0.6, 0.3], [2.4, -0.4], [3.1, 0], [-2.6, 0.4]]) sheep(c, x + sx * u, y + sy * u, u * 1.6);
      canal(c, x + 2.4 * u, x + 8.2 * u, y - 0.6 * u, 1.9 * u, L);
      ferry(c, x + 5.4 * u, y + 0.6 * u, u * 0.7, L);
    },
    groningen(c, x, y, u, L) {   // the Martinitoren over the Grote Markt, the Academiegebouw, the gold museum tower
      row(c, x - 7.8 * u, x - 2.8 * u, y - 1.1 * u, u, L, { h: 2.2, hv: 1.0, kinds: [1, 2, 3, 3] });
      tower(c, x - 1.4 * u, y - 1.4 * u, 1.8 * u, 11.6 * u, 'lantern', u, L); nave(c, x - 0.4 * u, x + 2.0 * u, y - 1.4 * u, 2.2 * u, u, L);
      c.fillStyle = BLD2; c.fillRect(x + 2.4 * u, y - 3.0 * u, 3.6 * u, 3.0 * u); grid(c, x + 2.5 * u, y - 2.8 * u, 3.4 * u, 2.6 * u, u, L, 5, 3);
      c.fillStyle = BLD; c.fillRect(x + 3.75 * u, y - 4.6 * u, 0.9 * u, 1.6 * u); c.beginPath(); c.arc(x + 4.2 * u, y - 4.6 * u, 0.45 * u, Math.PI, 0); c.fill();
      c.fillStyle = '#7d6a2c'; c.fillRect(x + 6.4 * u, y - 4.2 * u, 1.2 * u, 3.8 * u); c.fillStyle = '#3a4a5a'; c.beginPath(); c.moveTo(x + 6.0 * u, y - 0.4 * u); c.lineTo(x + 6.2 * u, y - 2.2 * u); c.lineTo(x + 7.9 * u, y - 1.6 * u); c.lineTo(x + 7.9 * u, y - 0.4 * u); c.fill();
      L.lights.push([x + 7.0 * u, y - 3.2 * u, 2 * u, 0.2, '230,200,120']);
    },
    maastricht(c, x, y, u, L) {   // the Sint-Janskerk's red tower and Sint-Servaas on the Vrijthof, the Helpoort, the old bridge
      gatehouse(c, x - 5.6 * u, y - 1.5 * u, u * 0.85, L);
      row(c, x - 3.8 * u, x - 0.6 * u, y - 1.4 * u, u, L, { h: 1.9, hv: 0.7, kinds: [3, 1] });
      tower(c, x + 0.4 * u, y - 1.6 * u, 1.5 * u, 9.6 * u, 'spire', u, L, '#3c1f1c'); nave(c, x + 1.2 * u, x + 3.0 * u, y - 1.6 * u, 2.0 * u, u, L);
      c.fillStyle = BLD; c.fillRect(x + 3.4 * u, y - 4.6 * u, 3.6 * u, 3.0 * u); for (const s of [3.8, 6.6]) { c.fillRect(x + s * u - 0.45 * u, y - 6.2 * u, 0.9 * u, 1.8 * u); c.beginPath(); c.moveTo(x + s * u - 0.55 * u, y - 6.2 * u); c.lineTo(x + s * u, y - 7.6 * u); c.lineTo(x + s * u + 0.55 * u, y - 6.2 * u); c.fill(); }
      c.beginPath(); c.moveTo(x + 4.3 * u, y - 4.6 * u); c.lineTo(x + 5.2 * u, y - 5.8 * u); c.lineTo(x + 6.1 * u, y - 4.6 * u); c.fill(); grid(c, x + 3.6 * u, y - 4.3 * u, 3.2 * u, 2.6 * u, u, L, 4, 2);
      stonebridge(c, x - 2.6 * u, y + 0.15 * u, u * 0.95, L, 6);
    },
    nijmegen(c, x, y, u, L) {   // the Waalbrug lit over the river, the Stevenskerk, the Valkhof chapel
      row(c, x + 1.2 * u, x + 4.4 * u, y - 1.6 * u, u, L, { h: 2.0, hv: 0.7 });
      tower(c, x + 5.6 * u, y - 1.8 * u, 1.6 * u, 8.6 * u, 'lantern', u, L); nave(c, x + 6.3 * u, x + 8.1 * u, y - 1.8 * u, 1.9 * u, u, L);
      c.fillStyle = BLD2; c.beginPath(); c.arc(x - 6.4 * u, y - 2.2 * u, 0.9 * u, Math.PI, 0); c.lineTo(x - 5.5 * u, y - 1.4 * u); c.lineTo(x - 7.3 * u, y - 1.4 * u); c.fill(); c.fillStyle = BLD; c.beginPath(); c.moveTo(x - 7.4 * u, y - 2.2 * u); c.lineTo(x - 6.4 * u, y - 3.6 * u); c.lineTo(x - 5.4 * u, y - 2.2 * u); c.fill();
      canal(c, x - 8 * u, x + 8 * u, y - 0.8 * u, 2.0 * u, L);
      waalbrug(c, x - 1.6 * u, y + 0.2 * u, u * 0.9, L);
    },
    amsterdam(c, x, y, u, L) {   // gabled canal houses on the water, the Westertoren, the Magere Brug
      row(c, x - 5.6 * u, x + 7.9 * u, y - 1.5 * u, u, L, { w: 0.95, h: 3.0, hv: 1.4, kinds: [1, 2, 2, 0, 3] });
      tower(c, x - 6.6 * u, y - 1.7 * u, 1.5 * u, 10.0 * u, 'crown', u, L);
      row(c, x - 8.0 * u, x - 7.4 * u, y - 1.5 * u, u, L, { w: 0.6, h: 2.4 });
      canal(c, x - 8 * u, x + 8 * u, y - 1.0 * u, 2.0 * u, L);
      magerebrug(c, x + 3.6 * u, y + 0.25 * u, u * 0.95, L);
      boat(c, x - 3.6 * u, y + 0.5 * u, 1.9 * u, L.r, L.lights, false);
    },
  };
  // any other town (another country, a town added later): a terrace and a church
  function genericTown(c, x, y, u, L) {
    row(c, x - 7 * u, x - 1.2 * u, y - 1.1 * u, u, L, { h: 2.0, hv: 1.0 });
    tower(c, x, y - 1.3 * u, 1.4 * u, 7 * u, 'spire', u, L); nave(c, x + 0.7 * u, x + 3.4 * u, y - 1.3 * u, 2 * u, u, L);
    row(c, x + 3.8 * u, x + 7 * u, y - 1.1 * u, u, L, { h: 1.8, hv: 0.8 });
  }

  // ---------------------------------------------------------------- the painting
  // Order, back to front: sea and its hatch, shallows, the slab's shadow, light reflections in
  // the water; then the land layer (side faces, top, texture, lakes and rivers cut out, Flevoland,
  // rim light, dressing, roads, the towns y-sorted); then window glow and mist.
  let cacheKey = '', FX = null, BASE = null;
  const riverW = (wk, f) => Math.max(2, wk * f * 0.27);
  NRMAP.paint = function (canvas, lay, towns, states) {
    const dpr = Math.min(2, window.devicePixelRatio || 1), { W, H, f, geo, nodes, box } = lay, R = lay.route;
    const baseKey = [W, H, dpr, nodes.map(n => n.map(v => v | 0).join(':')).join(',')].join('|'), key = baseKey + '|' + states.join(',');
    const cw = Math.round(W * dpr), ch = Math.round(H * dpr);
    if (key === cacheKey && canvas.width === cw && FX) { lay.fx = FX; return; }
    cacheKey = key; const t0 = performance.now();
    const layer = () => { const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); return [cv, x]; };
    const D = Math.max(5, Math.min(15, f * 0.9)), DL = Math.max(3, D * 0.5);
    const segLit = k => k + 1 < states.length && states[k + 1] !== 'locked';
    // the sea, the land and its dressing depend only on the layout: painted once per size, kept across progress
    if (!BASE || BASE.key !== baseKey) {
    const r = mulberry(1953), lights = [];
    const [seaCv, c] = layer(), [Lc, l] = layer();

    // ---- masks: what is land, and where the dressing must leave room
    const ms = 0.5, mw = Math.ceil(W * ms), mh = Math.ceil(H * ms);
    const Mc = document.createElement('canvas'); Mc.width = mw; Mc.height = mh; const m = Mc.getContext('2d', { willReadFrequently: true }); m.setTransform(ms, 0, 0, ms, 0, 0);
    geo.land.forEach((p, i) => { m.fillStyle = `rgb(${(i + 1) * 20},0,0)`; m.beginPath(); poly(m, p); m.fill(); });
    m.fillStyle = 'rgb(0,255,0)'; m.beginPath(); poly(m, geo.lake); m.fill();
    m.fillStyle = 'rgb(240,0,0)'; m.beginPath(); poly(m, geo.flevo); m.fill();
    m.strokeStyle = 'rgb(0,0,255)'; m.lineCap = m.lineJoin = 'round';
    for (const [wk, pts] of geo.rivers) { m.lineWidth = riverW(wk, f) + 3; m.beginPath(); line(m, pts); m.stroke(); }
    const md = m.getImageData(0, 0, mw, mh).data;
    const Bc = document.createElement('canvas'); Bc.width = mw; Bc.height = mh; const bm = Bc.getContext('2d', { willReadFrequently: true }); bm.setTransform(ms, 0, 0, ms, 0, 0);
    bm.fillStyle = bm.strokeStyle = '#fff';
    nodes.forEach((p, i) => { const vw = lay.vw[i]; bm.fillRect(p[0] - vw * 0.48, p[1] - f * 1.2 - vw * 0.6, vw * 0.96, vw * 0.6 + f * 0.9); bm.beginPath(); bm.arc(p[0], p[1], f * 1.7, 0, TAU); bm.fill(); bm.fillRect(p[0] - lay.blk[i].w * 0.36, p[1] + f * 1.7, lay.blk[i].w * 0.72, f * 2.4); });
    bm.lineWidth = f * 0.8; bm.lineCap = bm.lineJoin = 'round'; if (R.pts.length > 1) { bm.beginPath(); line(bm, R.pts); bm.stroke(); }
    const bd = bm.getImageData(0, 0, mw, mh).data;
    const cell = (x, y) => { const xi = (x * ms) | 0, yi = (y * ms) | 0; return xi < 0 || yi < 0 || xi >= mw || yi >= mh ? -1 : (yi * mw + xi) * 4; };
    const isLand = (x, y) => { const i = cell(x, y); return i >= 0 && md[i] > 10 && md[i + 1] < 100 && md[i + 2] < 100; };
    const isRiver = (x, y) => { const i = cell(x, y); return i >= 0 && md[i + 2] > 100; };
    const inLake = (x, y) => { const i = cell(x, y); return i >= 0 && md[i + 1] > 100 && md[i] < 10; };
    const landId = (x, y) => { const i = cell(x, y); return i < 0 ? 0 : Math.round(md[i] / 20); };
    const busy = (x, y) => { const i = cell(x, y); return i < 0 || bd[i + 3] > 40; };
    const regionAt = (x, y) => { for (const [k, p] of geo.regions) if (inPoly(p, x, y)) return k; return null; };

    // ---- the sea
    const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0c1219'); bg.addColorStop(0.45, '#0f171f'); bg.addColorStop(1, '#0a0f15');
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    const vg = c.createRadialGradient(W / 2, H * 0.5, Math.min(W, H) * 0.15, W / 2, H * 0.5, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(34,48,62,.30)'); vg.addColorStop(1, 'rgba(0,0,0,.30)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
    // the shallows: a pale halo along every coast, the Waddenzee behind the islands
    c.save(); c.fillStyle = 'rgba(38,56,74,.30)'; c.beginPath(); poly(c, geo.wadden); c.fill(); c.restore();
    c.save(); c.shadowColor = 'rgba(62,92,122,.42)'; c.shadowBlur = f * 2.4 * dpr; c.fillStyle = '#152029'; c.beginPath(); for (const p of geo.land) poly(c, p); c.fill(); c.restore();
    // the wave hatch, dithered: short strokes where a slow noise beats a Bayer threshold
    const bay = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], hatch = [[], [], []];
    for (let y = 1; y < H; y += 3) for (let x = ((y * 7) % 11); x < W; x += 4 + r() * 9) {
      const nz = 0.5 + 0.5 * Math.sin(x * 0.012 + Math.sin(y * 0.019) * 2.4) * Math.cos(y * 0.016 - x * 0.004);
      if (nz * 17 < bay[(((y / 3) | 0) % 4) * 4 + (((x / 5) | 0) % 4)]) continue;
      hatch[nz > 0.75 ? 2 : nz > 0.5 ? 1 : 0].push([x, y, 2 + r() * 7]);
    }
    hatch.forEach((list, k) => { c.fillStyle = `rgba(128,158,188,${[0.028, 0.048, 0.072][k]})`; c.beginPath(); for (const [x, y, w] of list) c.rect(x, y, w, 1); c.fill(); });
    // the lakes are water too, a shade calmer
    c.fillStyle = 'rgba(14,22,30,.55)'; c.beginPath(); poly(c, geo.lake); c.fill();
    // the slab's shadow and its dark reflection, only on the open water
    c.save(); c.beginPath(); c.rect(0, 0, W, H); for (const p of geo.land) poly(c, p); c.clip('evenodd');
    c.filter = `blur(${(D * 0.4).toFixed(1)}px)`; c.fillStyle = 'rgba(2,5,8,.62)'; c.beginPath(); for (const p of geo.land) poly(c, p, 0, D * 2.0); c.fill(); c.filter = 'none';
    c.strokeStyle = 'rgba(120,150,180,.10)'; c.lineWidth = 1; c.beginPath(); for (const p of geo.land) poly(c, p, 0, D + 1.5); c.stroke();
    c.restore();

    // ---- the land layer
    const thick = geo.land.map(p => { const b = bbox(p); return Math.max(2, Math.min(D, (b.y1 - b.y0) * 0.3)); });
    for (let k = Math.ceil(D); k >= 1; k--) {
      const t = k / D; l.fillStyle = `rgb(${Math.round(30 - 19 * t)},${Math.round(38 - 24 * t)},${Math.round(48 - 30 * t)})`;
      l.beginPath(); geo.land.forEach((p, i) => { if (k <= thick[i] + 0.5) poly(l, p, 0, k); }); l.fill();
    }
    const top = l.createLinearGradient(box.x, box.y, box.x + box.w * 0.45, box.y + box.h);
    top.addColorStop(0, '#333d48'); top.addColorStop(0.5, '#29313b'); top.addColorStop(1, '#222932');
    l.fillStyle = top; l.beginPath(); for (const p of geo.land) poly(l, p); l.fill();
    // texture: polder parcels, ditches, speckle
    l.save(); l.beginPath(); for (const p of geo.land) poly(l, p); l.clip();
    for (let i = 0; i < W * H / 480; i++) {
      const x = r() * W, y = r() * H, a = ((Math.floor(x / (f * 11)) + Math.floor(y / (f * 9))) % 3 - 1) * 0.42;
      l.save(); l.translate(x, y); l.rotate(a); l.fillStyle = r() < 0.5 ? `rgba(255,255,255,${(0.01 + r() * 0.022).toFixed(3)})` : `rgba(0,0,0,${(0.03 + r() * 0.05).toFixed(3)})`;
      l.fillRect(0, 0, f * (1.2 + r() * 3), f * (0.25 + r() * 0.6)); l.restore();
    }
    l.strokeStyle = 'rgba(10,15,21,.32)'; l.lineWidth = 1; l.beginPath();
    for (let i = 0; i < W * H / 2600; i++) { const x = r() * W, y = r() * H, a = ((Math.floor(x / (f * 11)) + Math.floor(y / (f * 9))) % 3 - 1) * 0.42 + (r() < 0.5 ? 0 : Math.PI / 2), len = f * (1.2 + r() * 3); l.moveTo(x, y); l.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); }
    l.stroke(); l.restore();
    // the lake: the wall shows on its north bank, the rest is cut out so the water shows through
    l.fillStyle = '#121920'; l.beginPath(); poly(l, geo.lake); l.fill();
    l.save(); l.beginPath(); poly(l, geo.lake); l.clip(); l.globalCompositeOperation = 'destination-out'; l.beginPath(); poly(l, geo.lake, 0, DL); l.fill(); l.restore();
    // rivers cut into the land, with a dark bank on their north side
    l.lineJoin = l.lineCap = 'round';
    for (const [wk, pts] of geo.rivers) { const w = riverW(wk, f); l.strokeStyle = '#10161d'; l.lineWidth = w + 1.6; l.beginPath(); line(l, pts); l.stroke(); }
    l.save(); l.globalCompositeOperation = 'destination-out'; for (const [wk, pts] of geo.rivers) { l.lineWidth = riverW(wk, f); l.beginPath(); line(l, pts, 0, 0.9); l.stroke(); } l.restore();
    // Flevoland, the new land: a lower slab in the lake with straight polder lines
    for (let k = Math.ceil(DL); k >= 1; k--) { const t = k / DL; l.fillStyle = `rgb(${Math.round(30 - 19 * t)},${Math.round(38 - 24 * t)},${Math.round(48 - 30 * t)})`; l.beginPath(); poly(l, geo.flevo, 0, k); l.fill(); }
    l.fillStyle = top; l.beginPath(); poly(l, geo.flevo); l.fill();
    l.save(); l.beginPath(); poly(l, geo.flevo); l.clip(); const fb = bbox(geo.flevo); l.strokeStyle = 'rgba(12,18,25,.35)'; l.lineWidth = 1; l.beginPath();
    for (let k = -12; k < 24; k++) { const x0 = fb.x0 + k * f * 1.1; l.moveTo(x0, fb.y0); l.lineTo(x0 + (fb.y1 - fb.y0) * 0.7, fb.y1); }
    l.stroke(); l.restore();
    // dykes: the Houtribdijk across the lake, the storm barrier in Zeeland
    l.strokeStyle = '#0e141a'; l.lineWidth = Math.max(2, f * 0.32); l.beginPath(); line(l, geo.dyke, 0, 1.5); l.stroke();
    l.strokeStyle = '#3b4652'; l.lineWidth = Math.max(1.2, f * 0.2); l.beginPath(); line(l, geo.dyke); l.stroke();
    l.strokeStyle = '#2c3640'; l.lineWidth = Math.max(1.2, f * 0.16); l.beginPath(); line(l, geo.barrier); l.stroke();
    // the rim: one lit pixel on every edge that faces the moon (north-west)
    const LD = [-0.42, -0.91], rimB = [[], [], []];
    const rim = (p, inv) => { for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length], dx = b[0] - a[0], dy = b[1] - a[1], L_ = Math.hypot(dx, dy) || 1; let nx = dy / L_, ny = -dx / L_; if (inv) { nx = -nx; ny = -ny; } const d = nx * LD[0] + ny * LD[1]; if (d > 0.2) rimB[d > 0.75 ? 2 : d > 0.5 ? 1 : 0].push(a, b); } };
    for (const p of geo.land) rim(p); rim(geo.flevo); rim(geo.lake, true);
    rimB.forEach((list, k) => { l.strokeStyle = `rgba(178,198,218,${[0.16, 0.28, 0.42][k]})`; l.lineWidth = 1; l.beginPath(); for (let i = 0; i < list.length; i += 2) { l.moveTo(list[i][0], list[i][1]); l.lineTo(list[i + 1][0], list[i + 1][1]); } l.stroke(); });

    // ---- the dressing
    const s = Math.max(7, f * 1.0);
    for (const dl of geo.dunes) {   // pale dunes just inland of the sea
      let acc = 0;
      for (let i = 1; i < dl.length; i++) {
        const a = dl[i - 1], b = dl[i], seg = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, tx = (b[0] - a[0]) / seg, ty = (b[1] - a[1]) / seg;
        for (; acc < seg; acc += s * 0.55) {
          const x = a[0] + tx * acc, y = a[1] + ty * acc; let nx = ty, ny = -tx; if (!isLand(x + nx * s * 0.7, y + ny * s * 0.7)) { nx = -nx; ny = -ny; }
          const px = x + nx * s * 0.42, py = y + ny * s * 0.42 + s * 0.15; if (isLand(px, py) && !busy(px, py)) dune(l, px, py, s * (0.75 + r() * 0.5));
        }
        acc -= seg;
      }
    }
    const items = [], fields = [], g = s * 1.3;
    for (let y = box.y - g * 2; y < box.y + box.h + g * 2; y += g) for (let x = box.x - g * 3; x < box.x + box.w + g * 3; x += g) {
      const px = x + r() * g, py = y + r() * g, id = landId(px, py);
      if (!id || !isLand(px, py) || !isLand(px, py - s * 0.6) || busy(px, py) || busy(px, py - s * 0.7)) continue;
      const reg = regionAt(px, py), q = r(), wad = id >= 7 && id <= 11;
      let k = null;
      if (wad) k = q < 0.34 ? 'sheep' : q < 0.42 ? 'tree' : null;
      else if (reg === 'forest') k = q < 0.42 ? 'pine' : q < 0.68 ? 'tree' : null;
      else if (reg === 'tulips') { if (q < 0.22) fields.push([px, py]); else if (q < 0.3) k = 'farm'; else if (q < 0.35) k = 'mill'; }
      else if (reg === 'mills') k = q < 0.2 ? 'mill' : q < 0.32 ? 'cow' : q < 0.38 ? 'farm' : q < 0.46 ? 'tree' : null;
      else if (reg === 'glass') k = q < 0.5 ? 'glass' : null;
      else if (reg === 'orchard') k = q < 0.45 ? 'orchard' : q < 0.5 ? 'farm' : null;
      else if (id === 12) { if (q < 0.18) fields.push([px, py]); else if (q < 0.26) k = 'farm'; else if (q < 0.32) k = 'poplar'; }
      else k = q < 0.13 ? 'tree' : q < 0.18 ? 'poplar' : q < 0.25 ? 'cow' : q < 0.31 ? 'farm' : q < 0.335 ? 'mill' : q < 0.345 ? 'chapel' : q < 0.355 ? 'sheep' : null;
      if (k) items.push({ k, x: px, y: py, s: s * (0.8 + r() * 0.45), a: r() * 6, f: r() < 0.5 });
    }
    for (const [x, y] of fields) tulips(l, x, y, s, r);
    items.sort((a, b) => a.y - b.y);
    for (const it of items) {
      const { x, y } = it, z = it.s;
      if (it.k === 'tree') tree(l, x, y, z * 1.1, r); else if (it.k === 'pine') { pine(l, x, y, z); if (r() < 0.5) pine(l, x + z * 0.35, y + z * 0.12, z * 0.85); }
      else if (it.k === 'poplar') { poplar(l, x, y, z); poplar(l, x + z * 0.32, y + z * 0.08, z * 0.9); poplar(l, x + z * 0.64, y + z * 0.16, z * 0.85); }
      else if (it.k === 'mill') mill(l, x, y, z * 1.05, it.a, r() < 0.15, lights);
      else if (it.k === 'cow') { cow(l, x, y, z, it.f); if (r() < 0.5) cow(l, x + z * 0.6, y + z * 0.2, z * 0.9, !it.f); }
      else if (it.k === 'sheep') { sheep(l, x, y, z); sheep(l, x + z * 0.4, y + z * 0.15, z); }
      else if (it.k === 'farm') farm(l, x, y, z, r, lights); else if (it.k === 'chapel') chapel(l, x, y, z * 0.9, r, lights);
      else if (it.k === 'glass') greenhouse(l, x, y, z, r, lights);
      else if (it.k === 'orchard') { for (let q = 0; q < 3; q++) { l.fillStyle = SIL; l.beginPath(); l.arc(x + q * z * 0.36, y - z * 0.25 + q * z * 0.06, z * 0.15, 0, TAU); l.fill(); } }
    }
    for (const [x, y, n] of geo.cities) if (isLand(x, y) && !busy(x, y)) city(l, x, y, s * 0.95, n, r, lights);
    for (const [x, y, k] of geo.lights) if (!busy(x, y)) lighthouseSmall(l, x, y, s * 1.15, k, lights);
    // lamps along the Afsluitdijk and the Houtribdijk
    for (const [a, b, n] of [[[5.05, 52.937], [5.33, 53.066], 9], [[5.3, 52.69], [5.42, 52.545], 5]]) for (let i = 0; i <= n; i++) {
      const p = lay.P(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n); if (busy(p[0], p[1])) continue;
      l.fillStyle = '#ffdc96'; l.fillRect(p[0] - 0.8, p[1] - 0.8, 1.6, 1.6); lights.push([p[0], p[1], f * 0.9, 0.35, null, true]);
    }
    // boats on the sea near the coast, and on the lake
    let nb = 0;
    for (let i = 0; i < 4000 && nb < 20; i++) {
      const x = box.x - f * 3 + r() * (box.w + f * 6), y = box.y + r() * box.h;
      if (isLand(x, y) || isLand(x, y - s) || isLand(x, y + s * 0.4) || isRiver(x, y) || busy(x, y)) continue;
      const near = [[-1, 0], [1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, -0.7]].some(([dx, dy]) => isLand(x + dx * s * 3, y + dy * s * 3));
      if (!near && !inLake(x, y)) continue;
      boat(l, x, y, s * (0.9 + r() * 0.4), r, lights, r() < 0.5); nb++;
    }

    BASE = { key: baseKey, sea: seaCv, land: Lc, lights, items: items.length, isLand, isRiver, busy };
    }
    const { isLand, isRiver, busy } = BASE, r = mulberry(7), lights = BASE.lights.slice(), beams = [];
    canvas.width = cw; canvas.height = ch;
    const c = canvas.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const [Lc, l] = layer();

    // ---- the roads, town to town in tier order
    const lamps = [];
    for (let k = 0; k + 1 < R.idx.length; k++) {
      const pts = R.pts.slice(R.idx[k], R.idx[k + 1] + 1), on = segLit(k); if (pts.length < 2) continue;
      const wet = pts.map(p => !isLand(p[0], p[1]) && !isRiver(p[0], p[1]));
      const runs = []; let cur = [pts[0]], cw_ = wet[0];
      for (let i = 1; i < pts.length; i++) { cur.push(pts[i]); if (wet[i] !== cw_) { runs.push([cw_, cur]); cur = [pts[i]]; cw_ = wet[i]; } }
      runs.push([cw_, cur]);
      l.lineCap = 'round'; l.lineJoin = 'round';
      for (const [w, run] of runs) if (!w && run.length > 1) { l.strokeStyle = on ? 'rgba(8,11,15,.55)' : 'rgba(8,11,15,.28)'; l.lineWidth = f * (on ? 0.52 : 0.4); l.setLineDash([]); l.beginPath(); line(l, run); l.stroke(); }
      if (on) { l.save(); l.globalCompositeOperation = 'lighter'; for (const [w, run] of runs) { if (w || run.length < 2) continue; l.strokeStyle = 'rgba(255,168,70,.09)'; l.lineWidth = f * 1.3; l.beginPath(); line(l, run); l.stroke(); l.strokeStyle = 'rgba(255,190,100,.13)'; l.lineWidth = f * 0.55; l.beginPath(); line(l, run); l.stroke(); } l.restore(); }
      for (const [w, run] of runs) {
        if (run.length < 2) continue;
        if (w) { l.setLineDash([f * 0.1, f * 0.42]); l.strokeStyle = on ? 'rgba(255,214,150,.85)' : 'rgba(140,132,116,.45)'; l.lineWidth = f * 0.17; }
        else { l.setLineDash(on ? [f * 0.62, f * 0.55] : [f * 0.4, f * 0.75]); l.strokeStyle = on ? '#ffd896' : 'rgba(150,140,122,.34)'; l.lineWidth = on ? f * 0.2 : f * 0.12; }
        l.beginPath(); line(l, run); l.stroke();
      }
      l.setLineDash([]);
      // lamps along the road, not inside a town
      const s0 = R.nodeS[k] + f * 2.6, s1 = R.nodeS[k + 1] - f * 2.6, n = Math.max(0, Math.floor((s1 - s0) / (f * 4.4)));
      for (let q = 0; q <= n; q++) {
        const sp = n ? s0 + (s1 - s0) * q / n : (s0 + s1) / 2; if (s1 < s0) break;
        const p = NRMAP.at(R, sp);
        if (nodes.some((m_, j) => { const vw = lay.vw[j], B = lay.blk[j], dx = Math.abs(p.x - m_[0]), dy = p.y - m_[1]; return Math.hypot(dx, dy) < f * 2.3 || (dx < B.w * 0.42 && dy > f * 1.6 && dy < f * 4.3) || (dx < vw * 0.4 && dy > -f * 1.25 - vw * 0.5 && dy < -f * 1.25); })) continue;
        const water = !isLand(p.x, p.y) && !isRiver(p.x, p.y);
        if (on) lamps.push({ x: p.x, y: p.y, r: f * 1.25, c: Math.max(0.9, f * 0.17), w: 1.5 + r() * 2.5, ph: r() * TAU, water });
        else { l.fillStyle = 'rgba(122,112,92,.75)'; l.beginPath(); l.arc(p.x, p.y, Math.max(0.8, f * 0.13), 0, TAU); l.fill(); }
      }
    }

    // ---- the towns, back to front; each is also kept as a sprite so the cyclist can pass behind it
    const order = nodes.map((p, i) => i).sort((a, b) => nodes[a][1] - nodes[b][1]), sprs = [];
    for (const i of order) {
      const t = towns[i], nx = nodes[i][0], ny = nodes[i][1], vw = lay.vw[i], u = vw / 16, gy = ny - f * 1.25, st = states[i];
      const x0 = nx - vw * 0.62, x1 = nx + vw * 0.62, y0 = gy - vw * 0.88, y1 = ny + f * 0.9;
      const cv = document.createElement('canvas'); cv.width = Math.max(1, Math.ceil((x1 - x0) * dpr)); cv.height = Math.max(1, Math.ceil((y1 - y0) * dpr));
      const v = cv.getContext('2d'); v.setTransform(dpr, 0, 0, dpr, -x0 * dpr, -y0 * dpr);
      const tl = [], L = { r: mulberry(77 + i * 131), lit: st === 'saved' ? 0.92 : st === 'open' ? 0.6 : 0.2, hot: st === 'saved', lights: tl, beams, state: st };
      const sh = v.createRadialGradient(nx, gy, 0, nx, gy, vw * 0.55); sh.addColorStop(0, 'rgba(6,9,13,.42)'); sh.addColorStop(1, 'rgba(6,9,13,0)');
      v.save(); v.translate(0, gy * 0.6); v.scale(1, 0.4); v.fillStyle = sh; v.fillRect(nx - vw * 0.6, gy - vw * 0.6, vw * 1.2, vw * 1.2); v.restore();
      (V[t.id] || genericTown)(v, nx, gy, u, L);
      if (st === 'locked') { v.globalCompositeOperation = 'source-atop'; v.fillStyle = 'rgba(88,102,118,.46)'; v.fillRect(x0, y0, x1 - x0, y1 - y0); v.globalCompositeOperation = 'source-over'; }
      for (const q of tl) lights.push(st === 'locked' ? [q[0], q[1], q[2], q[3] * 0.3, q[4], q[5]] : q);
      l.drawImage(cv, x0, y0, x1 - x0, y1 - y0);
      sprs.push({ cv, x: x0, y: y0, w: x1 - x0, h: y1 - y0, gy, i });
    }

    // ---- composite: reflections in the water, the land, then the light
    c.drawImage(BASE.sea, 0, 0, W, H);
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const q of lights) {
      const [x, y, rr, a, col] = q; if (a < 0.14) continue;
      const len = Math.min(f * 4.2, rr * 1.8 + f * 1.0), cc = col || '255,168,76';
      for (let k = 0; k < 6; k++) { const w = Math.max(1, rr * (0.55 - k * 0.07)); c.fillStyle = `rgba(${cc},${(a * 0.62 * (1 - k / 6)).toFixed(3)})`; c.fillRect(x - w / 2 + ((k % 2) - 0.5) * 1.6, y + D * 0.25 + k * len / 6, w, Math.max(1, len / 13)); }
    }
    c.restore();
    c.drawImage(BASE.land, 0, 0, W, H); c.drawImage(Lc, 0, 0, W, H);
    c.save(); c.globalCompositeOperation = 'lighter'; for (const [x, y, rr, a, col] of lights) glow(c, x, y, rr, a, col); c.restore();
    // mist in bands between the rows, over the land only, and a cold veil over the towns not yet open
    c.save(); c.beginPath(); for (const p of geo.land) poly(c, p, 0, -f); c.clip(); c.globalCompositeOperation = 'screen';
    for (let b = 0; b < 4; b++) {
      const yb = box.y + box.h * (0.16 + b * 0.24);
      for (let k = 0; k < 6; k++) { const xb = box.x + r() * box.w, rx = box.w * (0.08 + r() * 0.12), ry = Math.max(5, box.h * 0.026); c.save(); c.translate(xb, yb + (r() - 0.5) * ry * 2); c.scale(1, ry / rx); const gr = c.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, 'rgba(118,138,158,.06)'); gr.addColorStop(1, 'rgba(118,138,158,0)'); c.fillStyle = gr; c.fillRect(-rx, -rx, rx * 2, rx * 2); c.restore(); }
    }
    c.restore(); c.save();
    nodes.forEach((p, i) => { if (states[i] !== 'locked') return; const vw = lay.vw[i]; c.save(); c.translate(p[0], p[1] - f * 1.25 - vw * 0.25); c.scale(1, 0.6); const gr = c.createRadialGradient(0, 0, 0, 0, 0, vw * 0.8); gr.addColorStop(0, 'rgba(112,128,146,.16)'); gr.addColorStop(1, 'rgba(112,128,146,0)'); c.fillStyle = gr; c.fillRect(-vw, -vw, vw * 2, vw * 2); c.restore(); });
    c.restore();

    const glows = nodes.map((p, i) => { const st = states[i], vw = lay.vw[i]; return { x: p[0], y: p[1] - f * 1.25 - vw * 0.22, rx: vw * 0.8, ry: vw * 0.45, a: st === 'saved' ? 0.3 : st === 'open' ? 0.18 : 0.06, spr: st === 'locked' ? 'cold' : 'warm', w: 1.1 + r() * 0.9, ph: r() * TAU }; });
    FX = { cw, ch, dpr, f, glows, lamps, beams: beams.filter(b => b[3] !== 'locked'), sprites: sprs, nodes: nodes.map(p => p.slice()) };
    lay.fx = FX;
    NRMAP.ms = { paint: Math.round(performance.now() - t0), lights: lights.length, lamps: lamps.length, items: BASE.items };
  };

  // ---------------------------------------------------------------- the cyclist (canvas, facing right, wheels on y)
  function cyclist(c, x, y, f, flip, t, moving) {
    const k = f / 13; c.save(); c.translate(x, y); c.scale(flip ? -k : k, k); c.lineCap = 'round'; c.lineJoin = 'round';
    const a0 = moving ? t * 11 : 0.7;
    c.strokeStyle = '#05070a'; c.lineWidth = 2.6; c.beginPath(); c.arc(-8, -6, 6, 0, TAU); c.moveTo(15, -6); c.arc(9, -6, 6, 0, TAU); c.stroke();
    c.strokeStyle = 'rgba(242,192,106,.85)'; c.lineWidth = 0.9; c.beginPath(); c.arc(-8, -6, 6, 0, TAU); c.moveTo(15, -6); c.arc(9, -6, 6, 0, TAU); c.stroke();
    c.strokeStyle = 'rgba(242,192,106,.32)'; c.lineWidth = 0.5; c.beginPath();
    for (const cx of [-8, 9]) for (let q = 0; q < 3; q++) { const a = a0 + q * Math.PI / 3, dx = Math.cos(a) * 5.3, dy = Math.sin(a) * 5.3; c.moveTo(cx + dx, -6 + dy); c.lineTo(cx - dx, -6 - dy); }
    c.stroke();
    const leg = (ph, col) => {   // two-bone leg from the saddle to the turning pedal
      const fx = Math.cos(a0 + ph) * 3, fy = -6 + Math.sin(a0 + ph) * 3, hx = -1.2, hy = -17.2, dx = fx - hx, dy = fy - hy, d = Math.min(12.9, Math.hypot(dx, dy)) || 1;
      const h = Math.sqrt(Math.max(0, 6.6 * 6.6 - d * d / 4)); let px = -dy / d, py = dx / d; if (px < 0) { px = -px; py = -py; }
      c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + dx / 2 + px * h, hy + dy / 2 + py * h); c.lineTo(fx, fy); c.stroke();
    };
    leg(Math.PI, '#0b0f14');
    c.strokeStyle = '#05070a'; c.lineWidth = 2.1; c.beginPath();
    c.moveTo(-8, -6); c.lineTo(-2, -15); c.lineTo(0, -6); c.lineTo(5.5, -14); c.lineTo(9, -6); c.moveTo(-8, -6); c.lineTo(0, -6);
    c.moveTo(-2, -15); c.lineTo(-1.3, -17); c.moveTo(-3.8, -17.2); c.lineTo(0.9, -17.2); c.moveTo(5.5, -14); c.lineTo(5, -19.6); c.lineTo(8.8, -19.9); c.stroke();
    c.fillStyle = '#c9542b'; c.beginPath(); c.moveTo(-2.6, -16.8); c.lineTo(-0.8, -28.2); c.lineTo(3.8, -27.6); c.lineTo(3.4, -18.4); c.closePath(); c.fill();
    c.strokeStyle = '#8c3519'; c.lineWidth = 2.1; c.beginPath(); c.moveTo(2.8, -26); c.lineTo(6.2, -22); c.lineTo(8.3, -19.8); c.stroke();
    c.fillStyle = '#05070a'; c.beginPath(); c.arc(1.5, -31.2, 3.1, 0, TAU); c.fill();
    leg(0, '#151b22');
    c.fillStyle = '#fff2c4'; c.beginPath(); c.arc(9.6, -18.2, 1.35, 0, TAU); c.fill();
    c.restore();
  }

  // ---------------------------------------------------------------- one animated frame
  // Only light moves: each town's glow breathes on its own phase, the road lamps flicker, their
  // reflections shimmer, the lighthouse turns, and the cyclist rides. Everything else is the cache.
  NRMAP.fx = function (canvas, lay, t, bike) {
    const F = lay && lay.fx; if (!F) return; const SP = sprites(), f = F.f;
    if (canvas.width !== F.cw || canvas.height !== F.ch) { canvas.width = F.cw; canvas.height = F.ch; }
    const c = canvas.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, F.cw, F.ch); c.setTransform(F.dpr, 0, 0, F.dpr, 0, 0);
    c.globalCompositeOperation = 'lighter';
    for (const g of F.glows) { c.globalAlpha = Math.max(0, Math.min(1, g.a * (0.76 + 0.24 * Math.sin(t * g.w + g.ph)))); c.drawImage(SP[g.spr], g.x - g.rx, g.y - g.ry, g.rx * 2, g.ry * 2); }
    if (bike && !bike.moving && F.nodes[bike.cur]) { const p = F.nodes[bike.cur]; c.globalAlpha = 0.4 + 0.18 * Math.sin(t * 2.2); c.drawImage(SP.green, p[0] - f * 3.2, p[1] - f * 3.2, f * 6.4, f * 6.4); }
    for (const p of F.lamps) {
      c.globalAlpha = 0.72 + 0.28 * Math.sin(t * p.w + p.ph) * Math.sin(t * p.w * 0.43 + p.ph * 1.7);
      c.drawImage(SP.lamp, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      if (p.water) for (let k = 0; k < 4; k++) { const sh = Math.sin(t * 3.3 + p.ph + k * 1.9); c.globalAlpha = 0.3 * (1 - k / 4) * (0.55 + 0.45 * sh); c.drawImage(SP.lamp, p.x - p.r * 0.32 + sh * 1.3, p.y + f * 0.4 + k * f * 0.34, p.r * 0.64, Math.max(1.5, f * 0.16)); }
    }
    for (const b of F.beams) {
      const [x, y, len] = b, a = t * 0.8 + x * 0.013;
      for (const off of [0, Math.PI]) { const ang = a + off, cs = Math.cos(ang); c.save(); c.translate(x, y); c.rotate(Math.atan2(Math.sin(ang) * 0.3, cs)); c.globalAlpha = 0.25 + 0.4 * Math.abs(cs); c.drawImage(SP.beam, 0, -len * 0.08, len * (0.45 + 0.55 * Math.abs(cs)), len * 0.16); c.restore(); }
    }
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    if (F.lamps.length) { c.fillStyle = '#fff3d2'; c.beginPath(); for (const p of F.lamps) { c.moveTo(p.x + p.c, p.y); c.arc(p.x, p.y, p.c, 0, TAU); } c.fill(); }
    if (bike && bike.x != null) {
      const dir = bike.flip ? -1 : 1, k = f / 13;
      c.globalCompositeOperation = 'lighter'; c.globalAlpha = 0.55; c.drawImage(SP.lamp, bike.x + dir * (9.6 * k + f * 0.9) - f * 1.4, bike.y - 18.2 * k - f * 0.9, f * 2.8, f * 1.8); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
      cyclist(c, bike.x, bike.y, f, bike.flip, t, bike.moving);
      for (const s of F.sprites) {   // a town the rider passes behind covers him
        if (s.i === bike.from || s.i === bike.to || s.i === bike.cur || bike.y > s.gy - f * 0.15) continue;
        if (bike.x + f * 1.3 < s.x || bike.x - f * 1.3 > s.x + s.w || bike.y < s.y || bike.y - f * 3 > s.y + s.h) continue;
        c.drawImage(s.cv, s.x, s.y, s.w, s.h);
      }
    }
  };

  // ---------------------------------------------------------------- overlay helpers (SVG strings, px)
  const LOCK = 'M-3.8,-0.4 h7.6 v6 h-7.6 z', SHACKLE = 'M-2.3,-0.4 v-2 a2.3,2.3 0 0 1 4.6,0 v2', SHACKLE_OPEN = 'M-2.3,-0.4 v-2.4 a2.3,2.3 0 0 1 4.5,-0.6';
  const HOUSE = 'M-5.6,0.4 L0,-5 L5.6,0.4 M-3.8,-1.2 v6.2 h7.6 v-6.2 M-1.2,5 v-3.2 h2.4 v3.2';
  const LANTERN = 'M0,-7 v1.4 M-2.6,-3.6 L-1.6,-5.6 h3.2 L2.6,-3.6 Z M-2.6,-3.6 h5.2 v6.2 h-5.2 Z M-3.4,2.6 h6.8 v1.5 h-6.8 Z';
  NRMAP.badge = function (t, i, state, cur, f, col) {
    const R = f * 1.3, home = t.tier === 1, locked = state === 'locked', saved = state === 'saved', green = '#7fd36a';
    const ring = cur ? green : locked ? '#7c8695' : saved ? '#ffc65a' : (col || '#c9b78f');
    const fill = cur ? '#14231a' : locked ? '#19202a' : saved ? '#2a2114' : '#1c2531', ink = locked ? '#c4cbd5' : saved ? '#ffe3a6' : '#f2e2b8', k = (R / 11) * 1.25;
    let icon;
    if (home) icon = `<path d="${HOUSE}" transform="scale(${k})" fill="none" stroke="${cur ? '#eaffdf' : ink}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    else if (saved) icon = `<g transform="scale(${k})"><path d="${LANTERN}" fill="#ffcf6a" stroke="#ffe7b0" stroke-width=".9" stroke-linejoin="round"/><rect x="-1.4" y="-2.6" width="2.8" height="4.2" fill="#fff4cf"/></g>`;
    else icon = `<g transform="scale(${k})"><path d="${locked ? SHACKLE : SHACKLE_OPEN}" fill="none" stroke="${cur ? '#eaffdf' : ink}" stroke-width="1.5" stroke-linecap="round"/><path d="${LOCK}" fill="${cur ? '#eaffdf' : ink}"/><circle cy="2.4" r=".9" fill="#1b2430"/></g>`;
    return (cur ? `<circle r="${R * 2.1}" fill="url(#nrgreen)"/>` : `<circle r="${R * 1.6}" fill="url(#nrshade)"/>`) +
      (saved && !cur ? `<circle r="${R * 1.9}" fill="url(#nrwarm)"/>` : '') +
      `<circle r="${R}" fill="${fill}" stroke="${ring}" stroke-width="${cur ? 2.6 : saved ? 2 : 1.5}"/>` + icon +
      `<g transform="translate(${(-R * 1.1).toFixed(1)} ${(-R * 1.05).toFixed(1)})"><circle r="${f * 0.85}" fill="#0b0f15" stroke="rgba(255,255,255,.22)" stroke-width="1"/><text class="num" y="${(f * 0.33).toFixed(1)}" text-anchor="middle" style="font-size:${(f * 0.95).toFixed(1)}px">${t.tier}</text></g>`;
  };
  NRMAP.defs = `<radialGradient id="nrgreen"><stop offset="0" stop-color="#8fe07a" stop-opacity=".5"/><stop offset=".5" stop-color="#7fd36a" stop-opacity=".16"/><stop offset="1" stop-color="#7fd36a" stop-opacity="0"/></radialGradient>
    <radialGradient id="nrwarm"><stop offset="0" stop-color="#ffc060" stop-opacity=".32"/><stop offset=".55" stop-color="#ffb347" stop-opacity=".1"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    <radialGradient id="nrshade"><stop offset=".5" stop-color="#05080c" stop-opacity=".55"/><stop offset="1" stop-color="#05080c" stop-opacity="0"/></radialGradient>`;
})();
