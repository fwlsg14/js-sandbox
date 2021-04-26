// <⚠️ DONT DELETE THIS ⚠️>
// import "./styles.css";
// <⚠️ /DONT DELETE THIS ⚠️>
const pending = "PENDING";
const finished = "FINISHED";
//초기 실행
function init() {
  getNewTask();
  loadAllTasks();
}
//새로운 항목 받기
function getNewTask() {
  document.querySelector(`#new-task`).addEventListener("submit", handleNewTask);
}
//새로운 항목 처리
function handleNewTask(event) {
  event.preventDefault();
  const target = event.target;
  const timeStamp = event.timeStamp;
  const input = target.children[0];
  const value = input.value;
  const position = pending;
  const object = putInObject(value, timeStamp);
  saveTask(object, position);
  paintTask(object, position);
  input.value = "";
}
//객체에 넣기
function putInObject(text, timeStamp) {
  const object = {
    id: timeStamp,
    text: text,
  };
  return object;
}
//로컬 스토리지 저장
function saveTask(object, position) {
  const localItem = JSON.parse(localStorage.getItem(position));
  if (localItem === null) {
    const array = [object];
    localStorage.setItem(position, JSON.stringify(array));
  } else {
    localItem.push(object);
    localStorage.setItem(position, JSON.stringify(localItem));
  }
}
//화면에 출력
function paintTask(object, position) {
  const id = object.id;
  const text = object.text;
  const list = document.createElement("li");
  const span = document.createElement("span");
  const deleteButton = document.createElement("button");
  deleteButton.addEventListener("mousedown", handleDeleteButton);
  list.id = id;
  span.innerText = text;
  deleteButton.innerText = "❌";
  list.appendChild(span);
  list.appendChild(deleteButton);
  if (position === pending) {
    const ul = document.querySelector(`#${pending}`);
    const finishButton = document.createElement("button");
    finishButton.addEventListener("mousedown", handleFinishButton);
    finishButton.innerText = "✔️";
    list.appendChild(finishButton);
    ul.appendChild(list);
  } else {
    const ul = document.querySelector(`#${finished}`);
    const backwardButton = document.createElement("button");
    backwardButton.addEventListener("mousedown", handleBackwardButton);
    backwardButton.innerText = "⏪";
    list.appendChild(backwardButton);
    ul.appendChild(list);
  }
}
//delete버튼 처리
function handleDeleteButton(event) {
  const target = event.target;
  target.removeEventListener("mousedown", handleDeleteButton);
  const object = deleteLink(target);
  const id = object.id;
  const position = object.position;
  removeTask(id, position);
}
//타겟 li 지우기
function deleteLink(target) {
  const list = target.parentNode;
  const listId = list.id;
  const ul = list.parentNode;
  const ulId = ul.id;
  ul.removeChild(list);
  return { id: listId, position: ulId };
}
//로컬스토리지에서 지우기
function removeTask(id, position) {
  const before = JSON.parse(localStorage.getItem(position));
  const after = before.filter(function (object) {
    return object.id !== parseFloat(id);
  });
  localStorage.setItem(position, JSON.stringify(after));
}
//finish 버튼 처리
function handleFinishButton(event) {
  const target = event.target;
  target.removeEventListener("mousedown", handleFinishButton);
  const id = deleteLink(target).id;
  const object = loadTask(id, pending);
  saveTask(object, finished);
  paintTask(object, finished);
  removeTask(id, pending);
}
//backward 버튼 처리
function handleBackwardButton(event) {
  const target = event.target;
  target.removeEventListener("mousedown", handleBackwardButton);
  const id = deleteLink(target).id;
  const object = loadTask(id, finished);
  saveTask(object, pending);
  paintTask(object, pending);
  removeTask(id, finished);
}
//특정 id 로컬스토리지에서 불러오기
function loadTask(id, position) {
  const array = JSON.parse(localStorage.getItem(position));
  const filtered = array.filter(function (object) {
    return object.id === parseFloat(id);
  });
  return filtered[0];
}
//전체 로컬스토리지 불러오기
function loadAllTasks() {
  const array1 = JSON.parse(localStorage.getItem(pending));
  const array2 = JSON.parse(localStorage.getItem(finished));
  array1 &&
    array1.forEach((object) => {
      paintTask(object, pending);
    });
  array2 &&
    array2.forEach((object) => {
      paintTask(object, finished);
    });
}

init();
