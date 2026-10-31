/* Web delivery copies; original pictures and explanation targets stay unchanged. */
(function () {
  'use strict';
  const variants = {
  "assets/generated/ai-lab-hero.png": "assets/optimized/ai-lab-hero.webp",
  "assets/generated/chinese-room-concept-v3.png": "assets/optimized/chinese-room-concept-v3.webp",
  "assets/generated/fuzzy-control-cover-v7.png": "assets/optimized/fuzzy-control-cover-v7.webp",
  "assets/generated/genetic-algorithm-cover-v9.png": "assets/optimized/genetic-algorithm-cover-v9.webp",
  "assets/generated/knowledge-model-cover.png": "assets/optimized/knowledge-model-cover.webp",
  "assets/generated/machine-vision-bench.png": "assets/optimized/machine-vision-bench.webp",
  "assets/generated/ml-equipment-flow-v3.png": "assets/optimized/ml-equipment-flow-v3.webp",
  "assets/generated/rule-model-v6.png": "assets/optimized/rule-model-v6.webp",
  "assets/generated/search-strategy-cover-v8.png": "assets/optimized/search-strategy-cover-v8.webp",
  "assets/generated/swarm-intelligence-cover-v10.png": "assets/optimized/swarm-intelligence-cover-v10.webp",
  "assets/photos/cadre-mars-yard-v8.jpg": "assets/optimized/cadre-mars-yard-v8.webp",
  "assets/photos/deep-blue-2011.jpg": "assets/optimized/deep-blue-2011.webp",
  "assets/photos/eniac.jpg": "assets/optimized/eniac.webp",
  "assets/photos/human-neuron-v3.jpg": "assets/optimized/human-neuron-v3.webp",
  "assets/photos/leafcutter-ants-v10.jpg": "assets/optimized/leafcutter-ants-v10.webp",
  "assets/photos/lotfi-zadeh-2005-v7.jpg": "assets/optimized/lotfi-zadeh-2005-v7.webp",
  "assets/photos/maize-diversity-v9.jpg": "assets/optimized/maize-diversity-v9.webp",
  "assets/photos/mars-whale-rock-v6.jpg": "assets/optimized/mars-whale-rock-v6.webp",
  "assets/photos/microlab.jpg": "assets/optimized/microlab.webp",
  "assets/photos/nasa-thermocouple-probes-1977-v7.jpg": "assets/optimized/nasa-thermocouple-probes-1977-v7.webp",
  "assets/photos/road-interchange-v8.jpg": "assets/optimized/road-interchange-v8.webp",
  "assets/photos/robot-arm-research-v3.jpg": "assets/optimized/robot-arm-research-v3.webp",
  "assets/photos/shakey-sri-1972-v6.jpg": "assets/optimized/shakey-sri-1972-v6.webp",
  "assets/photos/starling-murmuration-v10.jpg": "assets/optimized/starling-murmuration-v10.webp"
};
  function render(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    template.content.querySelectorAll('img').forEach(img => {
      const original = img.getAttribute('src');
      if (variants[original]) {
        img.dataset.displaySource = original;
        img.setAttribute('src', variants[original]);
      }
      img.decoding = 'async';
    });
    return template.innerHTML;
  }
  window.CourseImages = {render};
})();
