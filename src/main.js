document.addEventListener('DOMContentLoaded', init);


function init() {
  on('#file', 'change', loadImage);
  on('#dropzone', 'dragover', e => e.preventDefault());
  on('#dropzone', 'dragenter', classToggleFactory(true, 'dragging'));
  on('#dropzone', 'dragleave', classToggleFactory(false, 'dragging'));
  on('#dropzone', 'drop', classToggleFactory(false, 'dragging'));
  on('#dropzone', 'drop', fileDrop);
}

function on(selector, eventType, handler) {
  const elem = document.querySelector(selector);

  elem.addEventListener(eventType, handler);

  return () => {
    elem.removeEventListener(eventType, handler);
  };
}

function classToggleFactory(add, className) {
  return function() {
    this.classList.toggle(className, add);
  };
}

function fileDrop(e) {
  e.preventDefault();
  document.querySelector('#file').files = e.dataTransfer.files;
}

function loadImage() {
  const img = document.createElement('img');
  img.src = window.URL.createObjectURL(this.files[0]);
  img.addEventListener('load', loadCanvas);

  document.querySelector('#img').src = img.src;
}

function loadCanvas() {
  const canvas = document.querySelector('#canvas');
  const canvasPad = 100;

  canvas.width = this.width + canvasPad;
  canvas.height = this.height + canvasPad;
  canvas.getContext('2d').drawImage(this, canvasPad / 2, canvasPad / 2);
}
