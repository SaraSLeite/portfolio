// Animação de seções
const sections = document.getElementsByTagName("section");
const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }

    });

}, {
    threshold: 0.2
});

for (let section of sections) {
    observer.observe(section);
}

const botao = document.getElementById("tema");

const icone =
    botao.getElementsByTagName("span")[0];

if (localStorage.getItem("tema") === "dark") {

    document.body.classList.add("dark");

    icone.textContent = "dark_mode";

} else {

    icone.textContent = "light_mode";

}

botao.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("tema", "dark");

        icone.textContent = "dark_mode";

    } else {

        localStorage.setItem("tema", "light");

        icone.textContent = "light_mode";

    }

});

//Audiodescrição

const botaoLer =
    document.getElementById("lerTexto");

botaoLer.addEventListener("click", () => {

    speechSynthesis.cancel();

    const texto =
        document
            .getElementsByClassName("sobre")[0]
            .getElementsByTagName("p")[0]
            .textContent;

    const fala =
        new SpeechSynthesisUtterance(texto);

    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;
    fala.volume = 1;

    speechSynthesis.speak(fala);

});



// modal de atividades
const pessoas = [
    {
        nome: 'sara',
        title: 'Atividades de Sara',
        subtitle: 'Desenvolvedora de Sistemas',
        text: 'Sara foi responsável pelas artes, desenvolvendo grande parte das sprites necessárias pra dar vida ao jogo.',
        social: `
        <a href="mailto:saraleite2708@gmail.com" target="_blank">
            <i class="fa-solid fa-envelope"></i>
        </a>

        <a href="https://wa.me/5514997842273?text=Olá,%20vim%20pelo%20site!" target="_blank">  
            <i class="fa-brands fa-whatsapp"></i>
        </a>
    `,
        imgSrc: 'img/saraModal.jpeg'
    }
];


function abrirModalAtividades(nome) {
    const pessoa = pessoas.find(p => p.nome === nome);


    document.getElementById('modalAtividadesNome').textContent = pessoa.title;
    document.getElementById('modalAtividadesCargo').textContent = pessoa.subtitle;
    document.getElementById('modalAtividadesDescricao').textContent = pessoa.text;
    document.querySelector('.social-icons').innerHTML = pessoa.social;
    document.querySelector('.modalAtividadesImg').src = pessoa.imgSrc;
    document.getElementById('modalAtividades').style.display = 'flex';
}

function closeModalAtividades() {
    document.getElementById('modalAtividades').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeModalAtividades');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModalAtividades);
    }

    const modal = document.getElementById('modalAtividades');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModalAtividades();
            }
        });
    }
});

window.abrirModalAtividades = abrirModalAtividades;
window.closeModalAtividades = closeModalAtividades;

//timeline scroll horizontal
const timeline = document.getElementById("timeline");

timeline.addEventListener("wheel", (event) => {
    event.preventDefault();

    timeline.scrollLeft += event.deltaY * 0.8;
});


// Touch para mobile (swipe)
let touchStartX = 0;
let touchScrollLeft = 0;

timeline.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = timeline.scrollLeft;
});

timeline.addEventListener('touchmove', (e) => {
    const touchCurrentX = e.touches[0].pageX;
    const walk = (touchStartX - touchCurrentX) * 1.5;
    timeline.scrollLeft = touchScrollLeft + walk;
});