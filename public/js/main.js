
const remove = async function (event) {
  event.preventDefault();

  const response = await fetch("/remove", {
    method: "DELETE"
  });
//fetch new array and wait for it

const contentType = response.headers.get("content-type");
const deleteStatus = document.querySelector("#nameDisplay");

        if (contentType && contentType.includes("application/json")) {
            try {
                const data = await response.json();
                if (response.status === 200) {
                  deleteStatus.textContent = `${data.username} Found and Removed Successfully`;
                } else if (response.status === 202) {
                    deleteStatus.textContent = "Permission denied: Cannot Remove Admin";
                } else if (response.status === 201){
                  deleteStatus.textContent = `${data.username} Not Found`;
                }
            } catch (error) {
                console.error("Error while parsing JSON:", error);
                console.log("Response as HTML:", await response.text());
                // You might display the HTML response or handle it differently.
            }
        } else if (contentType && contentType.includes("text/html")) {
            // Handle the HTML response
            const htmlResponse = await response.text();
            // Display the HTML response or handle it as needed
            // For example, you can set the content of an element with the HTML
           document.documentElement.innerHTML = htmlResponse;
           window.location.replace('/login.html');
        } else {
            console.error("Unexpected content type:", contentType);
            console.log("Response as text:", await response.text());
            // Handle other unexpected content types here.
        }
    }

const deposit = async function (event) {
  event.preventDefault();
//define income and username values from input
  const incomeInput = document.querySelector("#wd");

  const income = parseFloat(incomeInput.value);
  
    // create new deposit variable
    const depositData = {
      amount: income
    };
//pass new deposit data to server and wait for response
    const response = await fetch("/deposit", {
      method: "POST",
      body: JSON.stringify(depositData)
    });
    const data = await response.json();

    const depositStatus = document.querySelector("#nameDisplay");
    if (response.status === 200) {// success
      depositStatus.textContent = `Deposit Successful For ${data.username}. New Balance: ${data.balance}`;
    } else if (response.status === 404) 
    depositStatus.textContent = `User '${data.username}' Not Found.`; // not found
    
  }


const withdraw = async function (event) {
  event.preventDefault();
// define username and expenses data
  const expensesInput = document.querySelector("#wd");
  const expenses = parseFloat(expensesInput.value);


    // create new withdraw array
    const withdrawData = {
      amount: expenses, // Use the non-empty amount
    };

  //pass the new array to the server and wait for a response
    const response = await fetch("/withdraw", {
      method: "POST",
      body: JSON.stringify(withdrawData)
    });

    const data = await response.json();

    const withdrawStatus = document.querySelector("#nameDisplay");
    if (response.status === 200) {//success
      withdrawStatus.textContent = `Withdrawal Successful For ${data.username}. New Balance: ${data.balance}`;
    } else if (response.status === 400) {//balance < input
      withdrawStatus.textContent = `Insufficient Balance For ${data.username}. Current Balance: ${data.balance}`;
    } else if (response.status === 404) { //user not found
      withdrawStatus.textContent = `User '${data.username}' Not Found.`;
    }
  }


window.onload = function () {

  //get input values if they are submitted
  const removeButton = document.querySelector("#remove");
  const depositButton = document.querySelector("#deposit");
  const withdrawButton = document.querySelector("#withdraw");

  //onclick, do something
  removeButton.onclick = remove;
  depositButton.onclick = deposit;
  withdrawButton.onclick = withdraw;
  
  
};
