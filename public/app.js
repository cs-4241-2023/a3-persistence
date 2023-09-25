const submit = function (event) {
    event.preventDefault()
    const title = document.getElementById("title").value
    const author = document.getElementById("author").value
    const started = document.getElementById("started").value
    const finished = document.getElementById("finished").value
    const rating = document.getElementById("rating").value

    if (title == '' || author == '' || started == '' || finished == '' || rating == '') {
        alert('Please fill in all fields');
        return false;
    }
    json = {
        title: title,
        author: author,
        started: started,
        finished: finished,
        daysTaken: daysTaken(started, finished),
        rating: rating,
    },
        body = JSON.stringify(json)

    fetch('/add', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body
    }).then(response => response.json())
        .then(json => {
            updateTable(json)
        })
}
const removeRow = function (bookTitle) {
    let json = { title: bookTitle }
    let body = JSON.stringify(json)
    fetch('/remove', {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body
    }).then(response => response.json());
    updateTable();
    return false;
}
const updateTable = function () {

    fetch('/data', {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        })
        .then(data => {
            let table = document.getElementById("table");

            if (table.rows.length >= 0) {
                for (let i = table.rows.length - 1; i >= 1; i--) {
                    table.removeChild(document.getElementsByTagName('tbody')[i])
                }
            }
            data.forEach(entry => {
                table.innerHTML +=
                    `<tr> <td>${entry.title}</td> <td>${entry.author}</td> <td>${entry.started}</td> <td>${entry.finished}</td> <td>${entry.daysTaken}</td> <td>${entry.rating}</td><td><button onclick="removeRow(\'${entry.title}\')">Delete</button></td><td><button onclick="displayEdit(\'${entry.title}\', \'${entry.rating}\')">Edit</button></td></tr>`

            })
        })
}
const daysTaken = (startDate, endDate) => {
    console.log(startDate + endDate)
    let start = getDate(startDate);
    let end = getDate(endDate);

    if (start.getDate() && end.getDate()) {
        if (start.getTime() > end.getTime()) {
            console.log("Error, start must be before end.")
            return -1;
        }
        let timeDifference = start.getTime() - end.getTime();
        let dayDifference = Math.abs(timeDifference / (1000 * 3600 * 24));
        console.log(dayDifference)
        return dayDifference;
    }
}
function displayEdit(title, rating) {
    let modal = document.getElementById("editModal");
    let modalTitle = document.getElementById("modalTitle");
    modalTitle.textContent = title;
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.setAttribute('aria-modal', true);
    modal.setAttribute('aria-hidden', false);
}

function updateRating() {
    updateTable();
    let title = document.getElementById("modalTitle").textContent;
    let rating = document.getElementById("editRating").value;
    console.log(title + rating)
    let json = { title: title, rating: rating }
    let body = JSON.stringify(json)
    fetch('/update', {
        method: 'PUT',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body
    }).then(response => response.json());
    closeModal();
    updateTable();
}

function closeModal() {
    let modal = document.getElementById("editModal");
    modal.style.display = "none";
}

function getDate(stringDate) {
    var yearMonthDate = stringDate.split('-');
    return new Date(yearMonthDate[0], yearMonthDate[1], yearMonthDate[2]);
}
