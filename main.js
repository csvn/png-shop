document.addEventListener('DOMContentLoaded', init);


const IMAGE_X = 'imageX';
const IMAGE_Y = 'imageY';
const IMAGE_ANCHOR = 'imageAnchor';
const CANVAS_X = 'canvasX';
const CANVAS_Y = 'canvasY';
const CANVAS_ANCHOR = 'canvasAnchor';

let currentImage;

function init() {
  on('#select', 'click', () => qs('#file').click());
  on('#controls', 'input', redrawCanvas);
  on('#file', 'change', loadImage);
  on('html', 'dragover', dragOver);
  on('html', 'drop', fileDrop);
}

function on(selector, eventType, handler) {
  qs(selector).addEventListener(eventType, handler);

  return () => {
    qs(selector).removeEventListener(eventType, handler);
  };
}

function qs(selector) {
  return document.querySelector(selector);
}

function dragOver(e) {
  e.preventDefault();

  const overlay = qs('.overlay.dragging');
  overlay.classList.add('active');

  if (dragOver.timer) clearTimeout(dragOver.timer);

  dragOver.timer = setTimeout(() => {
    dragOver.timer = null;

    const cl = overlay.classList;

    cl.remove('active');
    cl.add('active-remove');

    setTimeout(() => cl.remove('active-remove'), 400);
  }, 200);
}

function fileDrop(e) {
  e.preventDefault();
  document.querySelector('#file').files = e.dataTransfer.files;
}

function loadImage() {
  const img = currentImage = document.createElement('img');

  img.src = window.URL.createObjectURL(this.files[0]);
  img.addEventListener('load', updateControls);
}

function updateControls() {
  const controls = qs('#controls');
  controls[IMAGE_X].value = this.width;
  controls[IMAGE_Y].value = this.height;
  controls[CANVAS_X].value = this.width;
  controls[CANVAS_Y].value = this.height;

  redrawCanvas(this);
}

function redrawCanvas() {
  if (!currentImage) return;

  const img = currentImage;
  const d = new FormData(qs('#controls'));
  const canvas = document.querySelector('#canvas');

  const width = canvas.width = d.get(CANVAS_X);
  const height = canvas.height = d.get(CANVAS_Y);
  const resizeX = d.get(IMAGE_X);
  const resizeY = d.get(IMAGE_Y);

  const { x, y } = offset(d.get(CANVAS_ANCHOR), { width, height }, img);
  const { x: x2, y: y2 } = offset(d.get(IMAGE_ANCHOR), img, { width: resizeX, height: resizeY });
  console.log(x, x2, y, y2);

  canvas.getContext('2d').drawImage(img, x + x2, y + y2, resizeX, resizeY);
}

function offset([xPos, yPos], { width: w, height: h }, { width: w2, height: h2 }) {
  let x = 0;
  let y = 0;

  if (xPos === 'c') {
    x += (w - w2) / 2;
  } else if (xPos === 'r') {
    x += w - w2;
  }

  if (yPos === 'c') {
    y += (h - h2) / 2;
  } else if (yPos === 'b') {
    y += h - h2;
  }

  return { x, y };
}

function raf(next, ...rest) {
  requestAnimationFrame(() => {
    next();
    if (rest.length) raf(...rest);
  });
}
