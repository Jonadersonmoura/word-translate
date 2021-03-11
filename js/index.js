const inputSearch = document.querySelector("#searchWord")
const divAccordionWords = document.querySelector('#accordionWords');

const buttonModal = document.querySelector("#openModal")
const closeModal = document.querySelector("#closeModal")

const modal = document.querySelector("#modalCustom")
const modalMain = document.querySelector("#modalMain")

const inputWord = document.querySelector("#inputWord")
const inputTranslate = document.querySelector("#inputTranslate")
const inputNotes = document.querySelector("#inputNotes")
const buttonRegister = document.querySelector("#submitRegister")

const alert = document.querySelector("#alert")

let data;
let id;
let edit = false;
const URL = 'http://localhost:3000/word'

function getData() {
    axios.get(URL)
        .then(response => {
            const data = response.data;
            this.data = data;
            mountDataHtml(data)
            return data;
        })
}

function mountDataHtml(data) {
    let html = '';
    divAccordionWords.innerHTML = '';
    data.map(item => {
        html = `            
            <h2 class="accordion-header"
                id="heading${item._id}">
                <button class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse${item._id}"
                        aria-expanded="false"
                        aria-controls="collapse${item._id}">
                    ${item.word}
                </button>
            </h2>
            <div id="collapse${item._id}"
                class="accordion-collapse collapse"
                aria-labelledby="heading${item._id}"
                data-bs-parent="#accordionWords">
                <div class="accordion-body">
                    <div>
                        <strong>Translate: </strong>${item.translate}<br>
                        <strong>Notes: </strong>${item.notes}                     
                    </div>
                    <div class="buttons">                  
                        <img class="icon-edit" src="./img/icons/edit.svg" data-id=${item._id} onclick="editWord(this)" alt="">
                        <img class="icon-remove" src="./img/icons/trash-2.svg" data-id=${item._id} onclick="removeWord(this)" alt="">                        
                    </div>              
                </div>
            </div>  
        `
        let divAccordionItem = document.createElement('div');
        divAccordionItem.classList.add('accordion-item')
        divAccordionItem.innerHTML = html;
        divAccordionWords.appendChild(divAccordionItem)
    })
}

function editWord(element) {
    edit = true;
    id = element.getAttribute('data-id')
    const currentEdit = this.data.filter(item => {
        return item._id === id;
    })[0]
    inputWord.value = currentEdit.word
    inputTranslate.value = currentEdit.translate
    inputNotes.value = currentEdit.notes
    openCloseModal()
}

function removeWord(element) {
    const id = element.getAttribute('data-id')
    axios.delete(`${URL}/${id}`)
        .then(data => {
            getData()
            option = {
                animation: true,
                delay: 2000
            }
            const htmlToast = document.querySelector('#toastElement')
            const elementToast = new bootstrap.Toast(htmlToast, option)
            elementToast.show()
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

function alertMesseger(alertType) {
    switch (alertType) {
        case 'SUCCESS':
            return `
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

        case 'ERROR':
            return `
                <div
                    class="float-start w-100 alert alert-danger alert-dismissible fade show"
                    role="alert">
                <strong>Error!!!!</strong><br>
                    Something wrong happened. Sorry!!!
                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"></button>
                </div>
            `
    }
}

function alertCreate(alert) {
    let html = document.createElement('div');
    html.classList.add('mb-3', 'div-alert')
    html.innerHTML = alertMesseger(alert);
    modalMain.appendChild(html);

    if (alert === 'SUCCESS') {
        setTimeout(() => {
            const alertContainer = document.querySelector('.div-alert')
            modalMain.removeChild(alertContainer)
        }, 3000)
    }
}

buttonModal.addEventListener('click', () => {
    openCloseModal()
})

closeModal.addEventListener('click', () => {
    edit = false;
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
    const form = {
        word: inputWord.value,
        translate: inputTranslate.value,
        notes: inputNotes.value
    }

    if (edit) {
        axios.put(`${URL}/${id}`, form).then(data => {
            alertCreate('SUCCESS')
            formClear();
            getData();
        }).catch(error => {
            alertCreate('ERROR')
        })
    } else {
        axios.post(URL, form).then(data => {
            alertCreate('SUCCESS')
            formClear();
            getData();
        }).catch(error => {
            alertCreate('ERROR')
        })
    }
})

getData();