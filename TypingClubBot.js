/**
 * This script types for you automatically on typingclub.
 */

// NOTE: When delay (in ms between two strokes) is too low, the site might bug out and the result page will not be shown
var minDelay = 60;
var maxDelay = 60;

/**
 * @see https://stackoverflow.com/questions/8942678/keyboardevent-in-chrome-keycode-is-0/12522752#12522752
 */
function simulateKey(chr, el) {
  _simulateKey(chr, 'keydown', el);
  _simulateKey(chr, 'keypress', el);
  _simulateKey(chr, 'keyup', el);  // Added this line to ensure the keyup event is also triggered
}

function _simulateKey(chr, type, el) {
  var eventObj = document.createEventObject ?
    document.createEventObject() : document.createEvent("Events");

  if (eventObj.initEvent) {
    eventObj.initEvent(type || "keydown", true, true);
  }

  let keyCode = chr.charCodeAt(0);
  if (chr === ' ') {
    keyCode = 32;  // Added this condition to handle the space key explicitly
  }

  eventObj.key = chr[0];
  eventObj.keyCode = keyCode;
  eventObj.which = keyCode;
  eventObj.isTrusted = true;

  el = el || document.body;

  el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("on" + type, eventObj);  // Adjusted to dynamically handle event type
}

const keyOverrides = {
  ' ': ' '    // convert hardspace to normal space
};

function getTargetCharacters() {
  const els = Array.from(document.querySelectorAll('.token span.token_unit'));
  const chrs = els
    .map(el => el.textContent[0]) // get individual letters to type
    .map(c => keyOverrides.hasOwnProperty(c) ? keyOverrides[c] : c); // convert special characters
  return chrs;
}

function recordKey(chr) {
  window.core.record_keydown_time(chr);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function autoPlay(finish) {
  const chrs = getTargetCharacters();
  for (let i = 0; i < chrs.length - (!finish); ++i) {
    const c = chrs[i];
    simulateKey(c);
    recordKey(c);
    await sleep(Math.random() * (maxDelay - minDelay) + minDelay);
  }
}

autoPlay(true);
