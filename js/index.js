const buttonModal = document.querySelector("#openModal")
const closeModal = document.querySelector("#closeModal")
const modal = document.querySelector("#modalCustom")
const modalMain = document.querySelector("#modalMain")
const buttonRegister = document.querySelector("#submitRegister")
const inputWord = document.querySelector("#inputWord")
const inputTranslate = document.querySelector("#inputTranslate")
const inputNotes = document.querySelector("#inputNotes")
const alert = document.querySelector("#alert")
const inputSearch = document.querySelector("#searchWord")
const divAccordionWords = document.querySelector('#accordionWords');

let data;

function returnData() {
    return fetch('http://localhost:3000/words')
        .then(response => {
            return response.json()
        })
        .then(data => {
            return data;
        })
}

function getData() {
    returnData().then(data => {
        this.data = data
        mountDataHtml(data)
    })
}

function mountDataHtml(data) {
    let html = '';
    divAccordionWords.innerHTML = '';
    data.map(item => {
        html = `            
            <h2 class="accordion-header"
                id="heading${item.id}">
                <button class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse${item.id}"
                        aria-expanded="false"
                        aria-controls="collapse${item.id}">
                    ${item.word}
                </button>
            </h2>
            <div id="collapse${item.id}"
                class="accordion-collapse collapse"
                aria-labelledby="heading${item.id}"
                data-bs-parent="#accordionWords">
                <div class="accordion-body">
                    ${item.translate}
                </div>
            </div>                 
        `
        let divAccordionItem = document.createElement('div');
        divAccordionItem.classList.add('accordion-item')
        divAccordionItem.innerHTML = html;
        divAccordionWords.appendChild(divAccordionItem)
    })
}

function openCloseModal() {
    if (modal.classList.value.includes('opened')) {
        modal.classList.remove('opened')
    } else {
        modal.classList.add('opened')
    }
}

function changeRegister() {
    if (inputWord.value.length > 0 && inputTranslate.value.length > 0) {
        buttonRegister.removeAttribute('disabled', '')
    } else {
        buttonRegister.setAttribute('disabled', '')
    }
}

function filterData(value, args) {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();

    return value.filter(function (item) {
        return JSON.stringify(item).toLowerCase().includes(args);
    });
}

function formClear() {
    inputWord.value = ''
    inputTranslate.value = ''
    inputNotes.value = ''
}

buttonModal.addEventListener('click', () => {
    openCloseModal()
})

closeModal.addEventListener('click', () => {
    formClear()
    openCloseModal()
})

inputWord.addEventListener('keyup', () => {
    changeRegister()
})
inputTranslate.addEventListener('keyup', () => {
    changeRegister()
})

inputNotes.addEventListener('keyup', () => {
    changeRegister()
})

inputSearch.addEventListener('keyup', (event) => {
    let value = event.target.value;
    const filter = filterData(this.data, value);
    mountDataHtml(filter)
})

buttonRegister.addEventListener('click', () => {
    const divAlert = `
            <div
                class="float-start w-100 alert alert-success alert-dismissible fade show"
                role="alert">
            <strong>Success!!!!</strong><br>
            Word ${inputWord.value} register with Success!
            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"></button>
            </div>
        `
    let html = document.createElement('div');
    html.classList.add('mb-3', 'div-alert')
    html.innerHTML = divAlert;
    modalMain.appendChild(html);

    formClear()

    setTimeout(() => {
        const alertContainer = document.querySelector('.div-alert')
        modalMain.removeChild(alertContainer)
    }, 3000)
})

// getData();