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
      <button class="btn cocktail__btn" data-id="${item.id}">Добавить</button>
    </div>
    `;

    return cocktail;
}

// Скрипт для открытия/закрытия модальных окон
const modalController = ({ modal, btnOpen, time = 300 }) => {
    const buttonElem = document.querySelector(btnOpen);
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
            }, time);

            window.removeEventListener("keydown", closeModal);
        }
    };

    const openModal = () => {
        modalElem.style.visibility = "visible";
        modalElem.style.opacity = "1";
        window.addEventListener("keydown", closeModal);
    };

    buttonElem.addEventListener("click", openModal);
    modalElem.addEventListener("click", closeModal);

    return { openModal, closeModal };
}

// Получение html элемента goods__list
const init = async () => {
    modalController({
        modal: ".modal__order",
        btnOpen: ".header__btn-order",
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
};

init();
