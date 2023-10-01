let total = 0.0;
let localItems = [];
const submit = async function (event) {
  event.preventDefault();

  let err = document.getElementsByClassName("errorMsg")[0];
  const itemin = document.querySelector("#item"),
    pricein = document.querySelector("#price"),
    json = { item: { itemName: itemin.value, price: pricein.value } },
    body = JSON.stringify(json);
  if (isNaN(parseFloat(json.item.price))) {
    err.style.display = "flex";
    err.style.visibility = "visible";
    return false;
  } else {
    err.style.display = "none";
    err.style.visibility = "hidden";
  }

  const response = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });

  console.log(response)
  const data = await response.json();

  addList(data);
};

const modify = async function (event) {
  event.preventDefault();
  let idxs = [];
  let list = [].slice.call(document.getElementById("groceryList").children);
  list = list.splice(1);
  list.forEach((element) => {
    if (element.getElementsByClassName("modbox").length === 1) {
      if (element.getElementsByClassName("modbox")[0].checked) {
        idxs.push(element.getAttribute("dbid"));
        console.log(element.getAttribute("dbid"));
      }
    }
  });

  let err = document.getElementsByClassName("errorMsg")[0];
  const pricein = document.querySelector("#price"),
    json = { items: idxs, price: pricein.value },
    body = JSON.stringify(json);
  if (isNaN(parseFloat(json.price))) {
    err.style.display = "flex";
    err.style.visibility = "visible";
    return false;
  } else {
    err.style.display = "none";
    err.style.visibility = "hidden";
  }

  const response = await fetch("/modify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });

  const data = await response.json();

  updateList(data);
};

const reset = async function (event) {
  event.preventDefault();
  workingTotal = 0.0;
  let body = JSON.stringify({ id: "reset" });

  const resetResponse = await fetch("/reset", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: body,
  });

  let list;
  if (document.getElementById("groceryList") === null) {
    list = document.createElement("ul");
    list.setAttribute("id", "groceryList");
    list.appendChild(defaultListItem);
    document.getElementById("lists-container").appendChild(list);
  } else {
    list = document.getElementById("groceryList");
    list.innerHTML = "";
  }
  list.appendChild(defaultListItem);

  let tp = document.getElementById("tpNum");
  tp.innerText = `$0.00`;
  tp = document.getElementById("icNum");
  tp.innerText = `$0.00`;
  tp = document.getElementById("difNum");
  tp.innerText = `$0.00`;

  document.getElementById("cartList").innerHTML = "";

};
const addList = function (data) {
  let list;
  let tmp = [];
  if (document.getElementById("groceryList") === null) {
    list = document.createElement("ul");
    list.setAttribute("id", "groceryList");
  } else {
    list = document.getElementById("groceryList");
    tmp = [].slice.call(list.children);
  }
  console.log(tmp)
  if (tmp[0].innerText == "Item Name: Price($)") {
    console.log(tmp[0]);
    list.removeChild(tmp[0]);
    const li = document.createElement("li");
    const myIn = document.createElement("input");
    const inTwo = document.createElement("input");
    const checkLabel = document.createElement("label");
    checkLabel.appendChild(
      document.createTextNode(
        data.groceryList[0].itemName[0].toUpperCase() +
          data.groceryList[0].itemName.slice(1) +
          `: $${data.groceryList[0].price}`
      )
    );
    myIn.setAttribute("type", "checkbox");
    myIn.className = "giBox";
    inTwo.setAttribute("type", "checkbox");
    inTwo.className = "modbox";
    li.className = "groceryItem";
    li.setAttribute("dbid", data.groceryList[0]._id)
    li.appendChild(myIn);
    li.appendChild(checkLabel);
    li.appendChild(inTwo);
    li.id = "item-0";
    list.appendChild(li);
  }
  for (let i = 1; i < data.groceryList.length; i++) {
    console.log(i, tmp.length);
    if (i === tmp.length) {
      const li = document.createElement("li");
      const myIn = document.createElement("input");
      const inTwo = document.createElement("input");
      const checkLabel = document.createElement("label");
      checkLabel.appendChild(
        document.createTextNode(
          data.groceryList[i].itemName[0].toUpperCase() +
            data.groceryList[i].itemName.slice(1) +
            `: $${data.groceryList[i].price}`
        )
      );
      myIn.setAttribute("type", "checkbox");
      myIn.className = "giBox";
      inTwo.setAttribute("type", "checkbox");
      inTwo.className = "modbox";
      li.className = "groceryItem";
      li.setAttribute("dbid", data.groceryList[i]._id)
      li.id = `item-${i}`;
      li.appendChild(myIn);
      li.appendChild(checkLabel);
      li.appendChild(inTwo);
      list.appendChild(li);
    }
  }
  let tp = document.getElementById("tpNum");
  tp.innerText = `$${data.totalPrice.totalPrice.toFixed(2)}`;
  total = parseFloat(data.totalPrice.totalPrice.toFixed(2));

};

const rebuild = function (data){
  let list;
  //let info = []
  if (document.getElementById("groceryList") === null) {
    list = document.createElement("ul");
    list.setAttribute("id", "groceryList");
    document.getElementById("lists-container").appendChild(list);
  } else {
    list = document.getElementById("groceryList");
    list.innerHTML = "";
  }

  for(let i = 0; i < data.groceryList.length; i++){
    const li = document.createElement("li");
    const myIn = document.createElement("input");
    const inTwo = document.createElement("input");
    const checkLabel = document.createElement("label");
    checkLabel.appendChild(
      document.createTextNode(
        data.groceryList[i].itemName[0].toUpperCase() +
          data.groceryList[i].itemName.slice(1) +
          `: $${data.groceryList[i].price}`
      )
    );
    myIn.setAttribute("type", "checkbox");
    myIn.className = "giBox";
    inTwo.setAttribute("type", "checkbox");
    inTwo.className = "modbox";
    li.className = "groceryItem";
    li.setAttribute("dbid", data.groceryList[i]._id)
    li.id = `item-${i}`;
    li.appendChild(myIn);
    li.appendChild(checkLabel);
    li.appendChild(inTwo);
    list.appendChild(li);
  }
  let tp = document.getElementById("tpNum");
  tp.innerText = `$${data.totalPrice.totalPrice.toFixed(2)}`;
  total = parseFloat(data.totalPrice.totalPrice.toFixed(2));
}

const delItems = async function (event) {
  event.preventDefault();

  let idxs = [];
  let list = [].slice.call(document.getElementById("groceryList").children);

  list.forEach((element) => {
    if (element.getElementsByClassName("modbox").length === 1) {
      if (element.getElementsByClassName("modbox")[0].checked) {
        idxs.push(element.getAttribute("dbid"));
      }
    }

  });

  const json = { items: idxs },
    body = JSON.stringify(json);
  const response = await fetch("/del", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: body,
  });

  const data = await response.json();

  rebuild(data);
};

const updateList = function (data) {
  let list;
  let tmp;
  if (document.getElementById("groceryList") === null) {
    list = document.createElement("ul");
    list.setAttribute("id", "groceryList");
  } else {
    list = document.getElementById("groceryList");
    tmp = [].slice.call(list.children);
  }
  //console.log(tmp)
  if (tmp[0].innerText == "Item Name: Price($) ") {
    console.log(tmp[0]);
    list.removeChild(tmp[0]);
    const li = document.createElement("li");
    const myIn = document.createElement("input");
    const inTwo = document.createElement("input");
    const checkLabel = document.createElement("label");
    checkLabel.appendChild(
      document.createTextNode(
        data.groceryList[0].itemName[0].toUpperCase() +
          data.groceryList[0].itemName.slice(1) +
          `: $${data.groceryList[0].price}`
      )
    );
    myIn.setAttribute("type", "checkbox");
    myIn.className = "giBox";
    inTwo.setAttribute("type", "checkbox");
    inTwo.className = "modbox";
    li.className = "groceryItem";
    li.appendChild(myIn);
    li.appendChild(checkLabel);
    li.appendChild(inTwo);
    li.id = "item-0";
    li.setAttribute("dbid", data.groceryList[0]._id)
    list.appendChild(li);
  }
  for (let i = 1; i < data.groceryList.length; i++) {
    const li = document.createElement("li");
    const myIn = document.createElement("input");
    const inTwo = document.createElement("input");
    const checkLabel = document.createElement("label");
    checkLabel.appendChild(
      document.createTextNode(
        data.groceryList[i].itemName[0].toUpperCase() +
          data.groceryList[i].itemName.slice(1) +
          `: $${data.groceryList[i].price}`
      )
    );
    myIn.setAttribute("type", "checkbox");
    myIn.className = "giBox";
    console.log(tmp[i].getElementsByClassName("giBox")[0].checked);
    myIn.checked = tmp[i].getElementsByClassName("giBox")[0].checked;
    inTwo.setAttribute("type", "checkbox");
    inTwo.className = "modbox";
    li.className = "groceryItem";
    li.setAttribute("dbid", data.groceryList[i]._id)
    li.id = `item-${i}`;
    li.appendChild(myIn);
    li.appendChild(checkLabel);
    li.appendChild(inTwo);
    list.removeChild(tmp[i]);
    list.appendChild(li);
  }
  let tp = document.getElementById("tpNum");
  tp.innerText = `$${data.totalPrice.totalPrice.toFixed(2)}`;
  total = parseFloat(data.totalPrice.totalPrice.toFixed(2));
};

const getItems = async function(){
  let temp575 = await fetch("/items", {
    method: "GET"
  })

  let data = await temp575.json();
  if(data.groceryList.length > 0) rebuild(data);
}

const defaultListItem = document.createElement("li");
const defaultIn = document.createElement("input");
const defaultLabel = document.createElement("label");
const cartLabel = document.createElement("label");
const listLabel = document.createElement("label");
const modLab = document.createElement("label");

let workingTotal = 0.0;
let glist;
window.onload = function () {
  defaultLabel.appendChild(document.createTextNode("Item Name: Price($)"));
  defaultIn.setAttribute("type", "checkbox");
  defaultListItem.className = "groceryItem";
  defaultListItem.appendChild(defaultIn);
  defaultListItem.appendChild(defaultLabel);
  modLab.appendChild(document.createTextNode("Check to Modify/Delete"))
  modLab.id = "modbox-label"
  listLabel.appendChild(document.createTextNode("Check items In Cart"));
  listLabel.appendChild(modLab)
  listLabel.id = "glist-lab";
  cartLabel.appendChild(document.createTextNode("In Your Cart"));
  cartLabel.id = "cart-lab";

  getItems()

  const button = document.getElementById("submit");
  const resetBut = document.getElementById("reset");
  const modBut = document.getElementById("modify");
  const delBut = document.getElementById("delete");
  const lgout = document.getElementById("logout");
  lgout.onclick =  async function (e) {
    e.preventDefault()
    let lgout =  await fetch("/logout", {
      method: "GET"
    });

    window.location.href = "/";
  };
  modBut.onclick = modify;
  button.onclick = submit;
  resetBut.onclick = reset;
  delBut.onclick = delItems;

  gList = document.getElementById("groceryList");

  gList.addEventListener("change", function (e) {
    if (e.target.classList.contains("giBox")) {
      let myLi = e.target.parentElement;
      let cartList = document.getElementById("cartList");
      if (e.target.checked) {
        let temp = myLi.cloneNode();
        let txt = myLi.innerText;
        let num = txt.slice(txt.indexOf("$") + 1);
        if (isNaN(parseFloat(num))) {
          //workingTotal+= parseFloat(num.slice(num.indexOf("$")))
          console.log(parseFloat(num.slice(num.indexOf(" "))));
          console.log(num.slice(num.indexOf("$") + 1), "NaN");
          console.log(workingTotal);
        } else {
          workingTotal += parseFloat(num);
          console.log(parseFloat(num), "Num");
          console.log(workingTotal);
        }
        document.getElementById("icNum").innerText = `$${workingTotal.toFixed(
          2
        )}`;
        document.getElementById("difNum").innerText = `$${(
          total - workingTotal
        ).toFixed(2)}`;
        temp.innerHTML = "";
        temp.innerText = txt;
        cartList.appendChild(temp);
      } else {
        let arr = [].slice.call(cartList.children);
        arr.every((i) => {
          if (i.innerText === myLi.innerText) {
            let tnum = i.innerText.slice(i.innerText.indexOf("$") + 1);
            if (isNaN(parseFloat(tnum))) {
              workingTotal -= parseFloat(tnum.slice(tnum.indexOf(" ") + 1));
            } else {
              workingTotal -= parseFloat(tnum);
            }
            document.getElementById(
              "icNum"
            ).innerText = `$${workingTotal.toFixed(2)}`;
            document.getElementById("difNum").innerText = `$${(workingTotal !== 0)?Math.abs(
              (total - workingTotal).toFixed(2)
            ): 0.00.toFixed(2)}`;
            i.remove();
            return false;
          }
          return true;
        });
      }
    }
  });
};
