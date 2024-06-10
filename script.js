document.addEventListener('DOMContentLoaded', function () {
    const html = document.querySelector('html');
    const botoes = document.querySelectorAll('.app__card-button');
    const btIniciar = document.querySelector('.app__card-primary-button');
    const btStartPause = document.getElementById('start-pause');
    const musicaInput = document.getElementById('alternar-musica');
    const foto = document.querySelector('.app__image');
    const frase = document.querySelector('.app__title');
    const musica = new Audio('/sons/luna-rise-part-one.mp3');
    const beep = new Audio('/sons/beep.mp3');
    const timer = document.querySelector('#timer');
    const playMusic = new Audio('/sons/play.wav');
    const pauseMusic = new Audio('/sons/pause.mp3');
    const IniciarOuPausarbt = document.querySelector('#start-pause span');
    const IniciarOuPausarbtIcone = document.querySelector('.app__card-primary-button-icon');
    const tempoTela = document.getElementById('timer');
    let intervaloId = null;
    musica.loop = true;

    const tFoco = 1500;
    const tDescansoCurto = 300;
    const tDescansoLongo = 900;
    let tempoDecorridoEmSegundos = tFoco;

    musicaInput.addEventListener('change', alternarMusica);

    function alternarMusica() {
        if (musica.paused) {
            musica.play();
        } else {
            musica.pause();
        }
    }

    function zerar() {
        clearInterval(intervaloId);
        IniciarOuPausarbt.textContent = 'Comecar';
        IniciarOuPausarbtIcone.setAttribute('src', `/imagens/play_arrow.png`);
        intervaloId = null;
    }

    const contagemRegressiva = () => {
        if (tempoDecorridoEmSegundos <= 0) {
            beep.play();
            alert('tempo finalizado');
            const focoAtivo = html.getAttribute('data-contexto') == 'foco';
            if (focoAtivo) {
                const evento = new CustomEvent('FocoFinalizado');
                document.dispatchEvent(evento);
            }
            zerar();
            return;
        }
        tempoDecorridoEmSegundos -= 1;
        mostraTempo();
    }

    const IniciarOuPausar = () => {
        if (intervaloId) {
            pauseMusic.play();
            zerar();
            return;
        }
        playMusic.play();
        intervaloId = setInterval(contagemRegressiva, 1000);
        IniciarOuPausarbt.textContent = 'Pausar';
        IniciarOuPausarbtIcone.setAttribute('src', `/imagens/pause.png`);
    }

    btStartPause.addEventListener('click', IniciarOuPausar);

    function atualizarContexto(contexto) {
        switch (contexto) {
            case 'foco':
                frase.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`;
                tempoDecorridoEmSegundos = tFoco;
                break;
            case 'descanso-curto':
                frase.innerHTML = `Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
                tempoDecorridoEmSegundos = tDescansoCurto;
                break;
            case 'descanso-longo':
                frase.innerHTML = `Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
                tempoDecorridoEmSegundos = tDescansoLongo;
                break;
            default:
                break;
        }
        mostraTempo();
    }

    function alterarContexto(contexto) {
        botoes.forEach(botao => {
            botao.classList.remove('active');
        });
        html.setAttribute('data-contexto', contexto);
        foto.setAttribute('src', `imagens/${contexto}.png`);
        atualizarContexto(contexto);
    }

    botoes.forEach(botao => {
        const contexto = botao.classList[2];
        botao.addEventListener('click', () => {
            alterarContexto(contexto);
            botao.classList.add('active');
        });
    });

    function mostraTempo() {
        const minutos = Math.floor(tempoDecorridoEmSegundos / 60).toString().padStart(2, '0');
        const segundos = (tempoDecorridoEmSegundos % 60).toString().padStart(2, '0');
        tempoTela.textContent = `${minutos}:${segundos}`;
    }

    mostraTempo();
});
