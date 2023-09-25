// FRONT-END (CLIENT) JAVASCRIPT HERE
let selectedRow = -1;
let idArray = [];

function updateTable() {
	let table = document.getElementById("list");
	let oldBody = table.getElementsByTagName("tbody");
	if (oldBody[0] !== undefined) {
		table.removeChild(oldBody[0]);
	}
	idArray = [];
	let index = -1;
	let body = document.createElement("tbody");
	fetch('/docs', {method: 'GET'}).then((response) => response.json())
		.then((data) => {
			data.forEach((item) => {
				index++;
				idArray.push(item._id);
				item.id = index;
				let tr = document.createElement("tr");
				tr.onclick = function () {
					selectedRow = item.id;
					updateSelection();
				};
				let name = document.createElement("td");
				name.innerText = item.CreatureName;
				tr.appendChild(name);
				let hp = document.createElement("td");
				hp.innerText = item.CurrHP;
				tr.appendChild(hp);
				let condition = document.createElement("td");
				condition.innerText = item.status;
				tr.appendChild(condition);
				let armorClass = document.createElement("td");
				armorClass.innerText = item.AC;
				tr.appendChild(armorClass);
				let desc = document.createElement("td");
				desc.innerText = item.Description;
				tr.appendChild(desc);
				body.appendChild(tr);
			})
		});
	table.appendChild(body);
}

function clearFields(event) {
	event.preventDefault();
	let fields = document.querySelectorAll('input[type=text]');
	fields.forEach((field) => field.value = "");
	document.getElementById("CurrHP").value = 0;
	document.getElementById("MaxHP").value = 0;
	document.getElementById("AC").value = 10;
}

async function deleteEntry(event) {
	if (selectedRow !== -1) {
		event.preventDefault();
		const body = idArray[selectedRow];
		await fetch('/remove', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({"_id": body})
		})
		selectedRow--;
		updateSelection();
		updateTable();
	}
}

function updateSelection() {
	let select = "";
	if (selectedRow >= 0) {
		select = document.getElementsByTagName("tbody")[0]
			.getElementsByTagName("tr")[selectedRow]
			.getElementsByTagName("td")[0].innerText;
		document.getElementById("selectedName").value = select;
		//console.log(select);
	}
	document.getElementById("selectedName").value = select;
}

function deselect() {
	selectedRow = -1;
	updateSelection();
}

const submit = async function (event) {
	event.preventDefault()

	const nameInput = document.querySelector('#Name'),
		hpInput = document.querySelector('#CurrHP'),
		maxHpInput = document.querySelector('#MaxHP'),
		acInput = document.querySelector('#AC'),
		descInput = document.querySelector('#Desc'),
		json = {
			CreatureName: nameInput.value,
			MaxHP: maxHpInput.value,
			CurrHP: hpInput.value,
			status: status(hpInput.value, maxHpInput.value),
			AC: acInput.value,
			Description: descInput.value
		},
		bodyString = JSON.stringify(json)

	await fetch('/add', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: bodyString
	})

	updateTable()
}

const status = function (currHP, maxHP) {
	let percent = currHP / maxHP;
	if (percent > 0.50) {
		return "Normal";
	} else if (percent > 0.25) {
		return "Bloodied";
	} else if (percent > 0) {
		return "Very Bloodied";
	} else {
		return "Dead";
	}
}

window.onload = function () {
	const submitButton = document.getElementById("submit");
	submitButton.onclick = submit;
	const clearButton = document.getElementById("clear");
	clearButton.onclick = clearFields;
	const deleteButton = document.getElementById("selectDelete");
	deleteButton.onclick = deleteEntry;
	const deselectButton = document.getElementById("deselect");
	deselectButton.onclick = deselect;
	updateTable();
}