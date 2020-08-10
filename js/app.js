var synth = window.speechSynthesis;

var form = document.querySelector('form');
var input = document.querySelector('#text-area');
var voiceSelect = document.querySelector('select');
var pitch = document.querySelector('#pitch');
var rate = document.querySelector('#rate');
document.querySelector('.p-val').textContent = pitch.value;
document.querySelector('.r-val').textContent = rate.value;
//Add voices on the device to a list and add to select

var voices = [];
function getVoiceList(){
    voices = synth.getVoices();
    voices.forEach(voice => {
        var option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`
        if(voice.default) option.textContent += '---Default';
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
}

getVoiceList();
if(speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = getVoiceList;
}

// Event listener

function speak(e){
    e.preventDefault();
    var text = input.value;
    if(!synth.speaking && text !== ''){
        document.querySelector('.wrapper').classList.add('blur');
        document.querySelector('.modal').classList.add('active');
        var utter = new SpeechSynthesisUtterance(text);
        var selected = voiceSelect.selectedOptions[0].getAttribute('data-name');
        voices.forEach( voice => {
            if(voice.name === selected) utter.voice = voice;
        });
        utter.pitch = pitch.value;
        utter.rate = rate.value;
        synth.speak(utter);
        utter.onend = e =>{
            document.querySelector('.wrapper').classList.remove('blur');
            document.querySelector('.modal').classList.remove('active');
        };
        input.blur();
    }
}

form.addEventListener('submit', speak);
voiceSelect.addEventListener('change', speak);
pitch.addEventListener('change', e => {
    document.querySelector('.p-val').textContent = pitch.value;
    speak(e);
});
rate.addEventListener('change', e => {
    document.querySelector('.r-val').textContent = rate.value;
    speak(e);
});
