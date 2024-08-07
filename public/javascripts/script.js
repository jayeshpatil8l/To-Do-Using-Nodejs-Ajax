
var taskInput = document.getElementById("new-task"); //new-task
var addButton = document.getElementsByTagName("button")[0]; //first button
var incompleteTasksHolder = document.getElementById("incomplete-tasks"); //incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks"); //completed-tasks

//New Task List Item
var createNewTaskElement = function(taskString) {
	//Create List Item
	var listItem = document.createElement("li");

	//input (checkbox)
	var checkBox = document.createElement("input"); // checkbox
	//label
	var label = document.createElement("label");
	//button.delete
	var deleteButton = document.createElement("button");

	//Each element needs modifying

	checkBox.type = "checkbox";
	
	deleteButton.innerText = "Delete";
	deleteButton.className = "delete";

	label.innerText = taskString;

	//Each element needs appending
	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(deleteButton);

	return listItem;
}

//Add a new task
var addTask = function() {

	const name = taskInput.value;
	const completed = false;

	fetch('/tasks', {
		method: 'POST',
		headers: {
            'Content-Type': 'application/json'
        },
		body: JSON.stringify({ name, completed })
	})
	.then((response) => response.json())	
	.then((data) => {
		console.log("Added task...");
		var listItem = createNewTaskElement(data.name);
		//Append listItem to incompleteTasksHolder
		incompleteTasksHolder.appendChild(listItem);
		bindTaskEvents(listItem, taskCompleted);

		taskInput.value = "";
	});
	
	//Create a new list item with the text from #new-task:
	
}

//Edit an existing task
var editTask = function() {
	console.log("Edit task...");

	var listItem = this.parentNode;

	var editInput = listItem.querySelector("input[type=text]");
	var label = listItem.querySelector("label");

	var containsClass = listItem.classList.contains("editMode");

	//if the class of the parent is .editMode
	if (containsClass) {
		//Switch from .editMode
		//label text become the input's value
		label.innerText = editInput.value;
	} else {
		//Switch to .editMode
		//input value becomes the label's text
		// listItem.classList.toggle("editMode");
		editInput.value = label.innerText;
	}

	//Toggle .editMode on the list item
	listItem.classList.toggle("editMode");

}

//Delete an existing task
var deleteTask = function() {
	// console.log("Delete task...");
	var listItem = this.parentNode;
	
	const name = listItem.querySelector('label').innerText;

	fetch(`/tasks/${name}`, {
		method: 'DELETE',
		headers: {
			'Content-Type':'application/json'
		}
	})
	.then(response => response.json())
	.then(() => console.log('Task Deleted...'))
	
	//Remove the parent list item from the ul
	var ul = listItem.parentNode;
	ul.removeChild(listItem);
	console.log('Task Deleted...');
	location.reload;
}

//Mark a task as complete
var taskCompleted = async function() {
	
	//Append the task list item to the #completed-tasks
	var listItem = this.parentNode;
	const name = listItem.querySelector('label').innerText;
	const completed = true;
	await updateTasks(name, completed);
	completedTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskIncomplete);
	console.log("Task complete...");
}

//Mark a task as incomplete
var taskIncomplete = async function() {
	//Append the task list item to the #incomplete-tasks
	var listItem = this.parentNode;
	const name = listItem.querySelector('label').innerText;
	const completed = false;
	await updateTasks(name, completed);
	incompleteTasksHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);
	console.log("Task incomplete...");
}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
	//console.log("Bind list item events");
	//select taskListItem's children
	var checkBox = taskListItem.querySelector("input[type=checkbox]");
	var editButton = taskListItem.querySelector("button.edit");
	var deleteButton = taskListItem.querySelector("button.delete");

	//bind editTask to edit button
	// editButton.onclick = editTask;

	//bind deleteTask to delete button
	deleteButton.onclick = deleteTask;

	//bind checkBoxEventHandler to checkbox
	checkBox.onchange = checkBoxEventHandler;
}

// var ajaxRequest = function() {
// 	console.log("AJAX request");
// }

//Set the click handler to the addTask function
addButton.addEventListener("click", addTask);
//addButton.addEventListener("click", ajaxRequest);

//cycle over incompleteTasksHolder ul list items
for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
	//bind events to list item's children (taskCompleted)
	bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

//cycle over completedTasksHolder ul list items
for (var i = 0; i < completedTasksHolder.children.length; i++) {
	//bind events to list item's children (taskIncomplete)
	bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}

function fetchTasks(){
	fetch('/fetch')
	.then(response => response.json())
	.then(data => {
		console.log("data received");
		data.forEach(task => {
			const item = createNewTaskElement(task.name);
			if(task.completed) {
				completedTasksHolder.appendChild(item);
				item.querySelector("input[type=checkbox]").checked = true;
				bindTaskEvents(item, taskIncomplete);
			}
			else {
				incompleteTasksHolder.appendChild(item);
				bindTaskEvents(item, taskCompleted);
			}
		})
	})
}

function updateTasks(name, completed){
	fetch(`/tasks/${name}`, {
		method : 'PUT',
		headers: {
			'Content-Type':'application/json'
		},
		body: JSON.stringify({completed})
	})
	.then(response => response.json())
	.then(() => console.log("Task updated..."));
}

document.addEventListener('DOMContentLoaded', () => {
	fetchTasks();
});
