let add = document.querySelector("form button");
let section = document.querySelector("section");

add.addEventListener("click", (e) => {
  //停止送出網頁
  e.preventDefault();

  //取得資料
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let month = form.children[1].value;
  let day = form.children[2].value;
  let done = ""; //始始化done這個屬性，這樣鑄造物件時才抓得到這個變數

  if (todoText === "" || month === "" || day === "") {
    alert("請填入待辦事項及日期");
    return;
  }

  if (month > 13 || day > 31) {
    alert("請輸入正確日期");
    return;
  }

  //製作todo區的內容
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  let date = document.createElement("p");
  date.classList.add("todo-date");
  date.innerText = month + "/" + day;
  todo.appendChild(text);
  todo.appendChild(date);

  // 製作按鍵圖示
  // 完成鍵
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");

    // 更新localStorage內的狀態(只有這區塊是連load那邊都要加入的)
    let todoText = todoItem.querySelector(".todo-text").innerText;
    let MyListArray = JSON.parse(localStorage.getItem("list"));
    MyListArray.forEach((item) => {
      if (item.todoText === todoText) {
        item.done = todoItem.classList.contains("done");
        localStorage.setItem("list", JSON.stringify(MyListArray));
      }
    });
  });

  //刪除鍵
  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", () => {
      // 把資料從localStorage中刪除
      let text = todoItem.children[0].innerText;
      let MyListArray = JSON.parse(localStorage.getItem("list"));
      MyListArray.forEach((item, index) => {
        if (item.todoText === text) {
          MyListArray.splice(index, 1);
          // 更新localStorage
          localStorage.setItem("list", JSON.stringify(MyListArray));
        }
      });
      todoItem.remove();
    });
    // 加入刪除動畫
    todoItem.style.animation = "scaleDown 0.3s forwards";
  });

  // 加入todo
  todo.appendChild(completeButton);
  todo.appendChild(trashButton);

  //   加入"加入動畫"
  todo.style.animation = "scaleUp 0.3s forwards";

  //   清空輸入框
  form.children[0].value = "";
  form.children[1].value = "1";
  form.children[2].value = "1";

  //   把todo作成一個object
  let myTodo = {
    todoText: todoText,
    todoMonth: month,
    todoDate: day,
    done: done, //加入一個屬性存放true or false
  };

  //   把object存進array再存進localStorage
  let myList = localStorage.getItem("list");
  if (myList === null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let MyListArray = JSON.parse(myList);
    MyListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(MyListArray));
  }

  // 完成加入todolist
  section.appendChild(todo);
});

function loadData() {
  // 讀取locaoStorage內的資料和按鍵
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    // 如果myList內不是空值，則產生一個todo區塊
    let MyListArray = JSON.parse(myList);

    MyListArray.forEach((item) => {
      let todo = document.createElement("div");
      todo.classList.add("todo");
      //把資料從localStorage叫出來的時候確認是否為true，是的話就把done加進class裡
      if (item.done) {
        todo.classList.add("done");
      }
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      let date = document.createElement("p");
      date.classList.add("todo-date");
      date.innerText = item.todoMonth + "/" + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(date);

      // 製作按鍵圖示
      // 完成鍵
      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");

        // 更新localStorage內的狀態
        let todoText = todoItem.querySelector(".todo-text").innerText; //網頁上的innerText
        let MyListArray = JSON.parse(localStorage.getItem("list")); //localStorage內的innerText
        MyListArray.forEach((item) => {
          //比對兩者是否一樣，如果是一樣的話localsotorage內的done屬性就會因為todoItem.ClassList內有沒有done這個值決定是true還是false
          if (item.todoText === todoText) {
            item.done = todoItem.classList.contains("done");
            localStorage.setItem("list", JSON.stringify(MyListArray)); //存回localstorage內
          }
        });
      });

      // 刪除鍵
      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;

        todoItem.addEventListener("animationend", () => {
          // 把資料從localStorage中刪除
          let text = todoItem.children[0].innerText;
          let MyListArray = JSON.parse(localStorage.getItem("list"));
          MyListArray.forEach((item, index) => {
            if (item.todoText === text) {
              MyListArray.splice(index, 1);
              // 更新localStorage
              localStorage.setItem("list", JSON.stringify(MyListArray));
            }
          });
          todoItem.remove();
        });
        // 加入刪除動畫
        todoItem.style.animation = "scaleDown 0.3s forwards";
      });

      // 加入todo
      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      // 完成加入todolist
      section.appendChild(todo);
    });
  }

  // 確保月份和日期不會超過數值
  let form = document.querySelector("form");
  let inputs = form.querySelectorAll("input");
  // 月份
  inputs[1].addEventListener("input", function () {
    let inputedMonth = parseInt(this.value, 10);
    let maxMonth = parseInt(this.max, 10);

    if (inputedMonth > maxMonth) {
      alert("請輸入用效月份");
      this.value = "";
    }
  });
  // 日期
  inputs[2].addEventListener("input", function () {
    let inputeddDate = parseInt(this.value, 10);
    let maxDate = parseInt(this.max, 10);
    let monthValue = parseInt(inputs[1].value, 10);

    if (
      [1, 3, 5, 7, 8, 10, 12].includes(monthValue) &&
      inputeddDate > maxDate
    ) {
      alert("請輸入有效日期");
      this.value = "";
    } else if (monthValue === 2) {
      let maxDate = 29;
      if (inputeddDate > maxDate) {
        alert("請輸入有效日期");
        this.value = "";
      }
    } else if ([4, 6, 9, 11].includes(monthValue)) {
      let maxDate = 30;
      if (inputeddDate > maxDate) {
        alert("請輸入有效日期");
        this.value = "";
      }
    }
  });
}

loadData();

function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) === Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length == 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

// 排序按鈕
let sortBtn = document.querySelector("div.sortBtn button");
sortBtn.addEventListener("click", () => {
  // 排列資料
  // 取得被排列過的資料
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  // 再把排好的資料放回locaoStorage
  localStorage.setItem("list", JSON.stringify(sortedArray));

  //移除資料list的資料
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  //讀取localStorage中已經被排好的資料到div.list中
  loadData();
});
