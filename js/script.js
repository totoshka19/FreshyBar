const API_URL = "https://sunny-hazel-zebu.glitch.me/";

// Получение данных с сервера
const getData = async () => {
    const response = await fetch(API_URL + "api/goods");
    const data = await response.json();
    return data;
}

// Функция создания карточек
const createCard = (item) => {
    const cocktail = document.createElement("article");
    cocktail.classList.add("cocktail");

    // Вставляем верстку
    cocktail.innerHTML = `
    <img
     src="${API_URL}${item.image}" 
     alt="Коктейль ${item.title}" 
     class="cocktail__img"
    >
    <div class="cocktail__content">
      <div class="cocktail__text">
        <h3 class="cocktail__title">${item.title}</h3>
        <p class="cocktail__price text-red">${item.price} &#x20bd;</p>
        <p class="cocktail__size">${item.size}</p>
      </div>
      <button class="btn cocktail__btn cocktail__btn_add" data-id="${item.id}">Добавить</button>
    </div>
    `;

    return cocktail;
}

// Запрет скрола при открытом модальном окне
const scrollService = {
    scrollPosition: 0,
    disabledScroll: function() {
        this.scrollPosition = window.scrollY;
        document.documentElement.style.scrollBehavior = "auto";
        document.body.style.cssText = `
        overflow: hidden;
        position: fixed;
        top: -${this.scrollPosition}px;
        left: 0;
        height: 100vh;
        width: 100vw;
        padding-right: ${window.innerWidth - document.body.offsetWidth}px;
        `;
    },
    enabledScroll: function() {
        document.body.style.cssText = "";
        window.scroll({ top: this.scrollPosition });
        document.documentElement.style.scrollBehavior = "";
    },
};

// Скрипт для открытия/закрытия модальных окон
const modalController = ({ modal, btnOpen, time = 300 }) => {
    const buttonElems = document.querySelectorAll(btnOpen);
    const modalElem = document.querySelector(modal);

    modalElem.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity ${time}ms ease-in-out;
    `;

    const closeModal = (event) => {
        const target = event.target;
        const code = event.code;

        if (target === modalElem || code === "Escape") {
            modalElem.style.opacity = "0";

            setTimeout(() => {
                modalElem.style.visibility = "hidden";
                scrollService.enabledScroll();
            }, time);

            window.removeEventListener("keydown", closeModal);
        }
    };

    const openModal = () => {
        modalElem.style.visibility = "visible";
        modalElem.style.opacity = "1";
        window.addEventListener("keydown", closeModal);
        scrollService.disabledScroll();
    };

    buttonElems.forEach(buttonElem => {
        buttonElem.addEventListener("click", openModal);
    });

    modalElem.addEventListener("click", closeModal);

    return { openModal, closeModal };
}

// Получение html элемента goods__list
const init = async () => {
    modalController({
        modal: ".modal__order",
        btnOpen: ".header__btn-order"
    });

    const goodsListElem = document.querySelector(".goods__list");
    const data = await getData();

    // Получение всех карточек с коктейлями
    const cardsCocktail = data.map((item) => {
        const li = document.createElement("li");
        li.classList.add("goods__item");
        li.append(createCard(item));
        return li;
    });

    goodsListElem.append(...cardsCocktail);

    modalController({
        modal: ".modal__make-your-own",
        btnOpen: ".cocktail__btn_make"
    });

    modalController( {
        modal: ".modal__add",
        btnOpen: ".cocktail__btn_add"
    });
};

init();
