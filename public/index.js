let box = document.querySelector("#box");

let data = [];

function updateItems(arr) {
  arr.forEach((element) => {
    let li = document.createElement("li");
    let button = document.createElement("button");
    button.setAttribute("id", element.id);
    button.setAttribute('onclick', "deleteTodo(event)")
    li.innerHTML = element.task;
    button.innerHTML = "Delete";
    box.appendChild(li);
    box.appendChild(button);
  });
}

async function deleteTodo(ele) {
  try {
    const response = await fetch(`http://localhost:3000/delete-todo/${ele.target.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      console.log("data deleted");
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
}

const getData = async () => {
  let response = await fetch("http://localhost:3000/get-data");
  data = await response.json();

  updateItems(data);
};
getData();
