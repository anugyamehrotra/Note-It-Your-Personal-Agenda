// declare variables
var noteTitle = [];
var noteDescription = [];
var noteDate = [];
var noteTime = [];

var noteTags = [];

// arrange forms between create/edit, call functions
var formArrange = document.getElementById("postCreateForm");
if (formArrange) {
    if (window.location.pathname.includes("editReminder.html")) {
        formArrange.addEventListener("submit", function(performEventOfLoad) {
            performEventOfLoad.preventDefault(); 
            saveEditedNote();
        });
    } else {
        formArrange.addEventListener("submit", function(performEventOfLoad) {
            performEventOfLoad.preventDefault(); 
            addNewNoteFunction(performEventOfLoad);
        });
    }
}

// add new note section
function addNewNoteFunction(createNewNote) {
    if (createNewNote && createNewNote.preventDefault) createNewNote.preventDefault();
    console.log("Created by Anugya Mehrotra (https://github.com/anugyamehrotra), inspired by Todoist (https://app.todoist.com/)");


    var form = document.getElementById("postCreateForm");
    if (!form) {
        console.error("postCreateForm err;;;");
        return;
    }

    // CHECK IF ARRAYS ARE EMPTY/NULL
    if (JSON.parse(localStorage.getItem("addTitle")) != null) {
        
        noteTitle = JSON.parse(localStorage.getItem("addTitle"));
        noteDescription = JSON.parse(localStorage.getItem("addNoteDesc"));
        noteDate = JSON.parse(localStorage.getItem("addDate"));
        noteTime = JSON.parse(localStorage.getItem("addTime"));

        noteTags = JSON.parse(localStorage.getItem("addTags")) || [];
        
    } else {
        noteTitle = [];
        noteDescription = [];
        noteDate = [];
        noteTime = [];
        noteTags = [];
    }

    // ADD NEW NOTE
    var newNoteTitle = form.elements["noteTitle"].value;
    var newNoteDescription = form.elements["noteDescription"].value;
    var newNoteDate = form.elements["noteDate"].value;
    var newNoteTime = form.elements["noteTime"].value;

    var tagSelectOptions = form.elements["noteTags"]; 
    var newNoteTags = [];

    
    for (var i = 0; i < tagSelectOptions.length; i++) {
        if (tagSelectOptions[i].checked) {
            newNoteTags.push(tagSelectOptions[i].value);
        }
    }

    var customTagInput = document.getElementById("customTagInput");
    if (customTagInput && customTagInput.value.trim() !== "") {
        var customTag = customTagInput.value.trim();
        if (!newNoteTags.includes(customTag)) {
            newNoteTags.push(customTag);
        }
    }

    if (newNoteTitle && newNoteDescription && newNoteDate && newNoteTime) {
        noteTitle.push(newNoteTitle);
        noteDescription.push(newNoteDescription);
        noteDate.push(newNoteDate);
        noteTime.push(newNoteTime);
        noteTags.push(newNoteTags);
        
        localStorage.setItem("addTitle", JSON.stringify(noteTitle));
        localStorage.setItem("addNoteDesc", JSON.stringify(noteDescription));
        localStorage.setItem("addDate", JSON.stringify(noteDate));
        localStorage.setItem("addTime", JSON.stringify(noteTime));
        localStorage.setItem("addTags", JSON.stringify(noteTags));

        alert("New Note Added Successfully!");
        form.reset();
    } else {
        alert("Please fill in all fields.");
    }
}

// display notes seciton
function loadTodayView() {
    displayNotes("today");
}

function loadWeeklyView() {
    displayNotes("week");
    console.log("Created by Anugya Mehrotra (https://github.com/anugyamehrotra), inspired by Todoist (https://app.todoist.com/)");

}

function showImportantView() {
    displayNotes("important");
}


// search notes
function searchNotes() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const notes = document.getElementsByClassName("note");

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const title = note.getElementsByTagName("h2")[0].innerText.toLowerCase();
        const description = note.getElementsByTagName("p")[0].innerText.toLowerCase();

        if (title.includes(searchInput) || description.includes(searchInput)) {
            note.style.display = "";
        } else {
            note.style.display = "none";
        }
    }

    console.log("Created by Anugya Mehrotra (https://github.com/anugyamehrotra), inspired by Todoist (https://app.todoist.com/)");


}

// load forms
function loadCreateForm() {
    window.location.href = "createReminder.html";
}

function displayNotes(filter = "all") {
    const noteTitle = JSON.parse(localStorage.getItem("addTitle")) || [];
    const noteDescription = JSON.parse(localStorage.getItem("addNoteDesc")) || [];
    const noteDate = JSON.parse(localStorage.getItem("addDate")) || [];
    const noteTime = JSON.parse(localStorage.getItem("addTime")) || [];
    const noteTags = JSON.parse(localStorage.getItem("addTags")) || [];

    let displaySection = "";

    const currentDate = Date.now();
    const weekDuration = 7 * 24 * 60 * 60 * 1000;

    for (let i =  noteTitle.length - 1; i>=0; i--) {
        if (!noteTitle[i] || !noteDescription[i] || !noteDate[i] || !noteTime[i]) continue;

        const noteDateTime = new Date(`${noteDate[i]}T${noteTime[i]}`).getTime();
        let shouldDisplay = false;

        if (filter === "all") {
            shouldDisplay = true;
        } else if (filter === "today") {
            const todayStr = new Date().toISOString().split("T")[0];
            shouldDisplay = noteDate[i] === todayStr;
        } else if (filter === "week") {
            shouldDisplay =
                noteDateTime >= currentDate && noteDateTime <= currentDate + weekDuration;
        } else if (filter === "important") {
            shouldDisplay = noteTags[i]?.includes("Important");
        }

        if (shouldDisplay) {
            displaySection += `
                <div class="note">
                    <h2>${noteTitle[i]}</h2>
                    <p>${noteDescription[i]}</p>
                    <p>Date: ${noteDate[i]}</p>
                    <p>Time: ${noteTime[i]}</p>
                    <p>Tags: ${(noteTags[i] || []).join(", ")}</p>
                    <br>
                    <button class="css-editButton" onclick="editButton(${i})">Edit</button>
                    <button class="css-deleteButton" onclick="deleteButton(${i})">Delete</button>
                    <br>
                </div>
            `;
        }

        console.log("Created by Anugya Mehrotra (https://github.com/anugyamehrotra), inspired by Todoist (https://app.todoist.com/)");

    }

    const displaySectionPostedNotes = document.getElementById("postContainerView");
    if (displaySectionPostedNotes) {
        displaySectionPostedNotes.innerHTML = displaySection;
    } else {
        console.error("displaySection element not found");
    }

    // count tasks (side bar var)
    let personalCount = 0;
    let importantCount = 0;
    let schoolCount = 0;
    let workCount = 0;
    let otherCount = 0;

    for (let i = 0; i < noteTags.length; i++) {
        const tags = noteTags[i] || []; 

        for (let z = 0; z < tags.length; z++) {
            const tag = tags[z].toLowerCase();

            if (tag === "personal") personalCount++;
            else if (tag === "important") importantCount++;
            else if (tag === "school") schoolCount++;
            else if (tag === "work") workCount++;
            else otherCount++;
        }
    }


    document.getElementById("countPersonal").textContent = personalCount;
    document.getElementById("countImportant").textContent = importantCount;
    document.getElementById("countSchool").textContent = schoolCount;
    document.getElementById("countWork").textContent = workCount;
    document.getElementById("countOther").textContent = otherCount;
}



// edit & delete section
function editButton(index) {
    localStorage.setItem("editIndex", index);

    window.location.href = "editReminder.html";    
}

function loadEditForm() {
    const index = localStorage.getItem("editIndex");
    if (index === null) return;

    const noteTitle = JSON.parse(localStorage.getItem("addTitle")) || [];
    const noteDescription = JSON.parse(localStorage.getItem("addNoteDesc")) || [];
    const noteDate = JSON.parse(localStorage.getItem("addDate")) || [];
    const noteTime = JSON.parse(localStorage.getItem("addTime")) || [];
    const noteTags = JSON.parse(localStorage.getItem("addTags")) || [];

    document.getElementById("postTitle").value = noteTitle[index];
    document.getElementById("postContent").value = noteDescription[index];
    document.getElementById("postDate").value = noteDate[index];
    document.getElementById("postTime").value = noteTime[index];

 
    const tagCheckboxes = document.getElementsByName("noteTags");
    for (const checkboxesSelectedVar of tagCheckboxes) {
        checkboxesSelectedVar.checked = false;
    }
    document.getElementById("customTagInput").value = "";

   
    const savedTags = noteTags[index] || [];
    for (let i = 0; i < savedTags.length; i++) {
        let tag = savedTags[i];
        let checkbox = null;

        for (let b = 0; b < tagCheckboxes.length; b++) {
            if (tagCheckboxes[b].value === tag) {
                checkbox = tagCheckboxes[b];
                break;
            }
        }

        if (checkbox) {
            checkbox.checked = true;
        } else {
            document.getElementById("customTagInput").value = tag;
        }
    }

    console.log("Created by Anugya Mehrotra (https://github.com/anugyamehrotra), inspired by Todoist (https://app.todoist.com/)");


}

function saveEditedNote() {
    const index = localStorage.getItem("editIndex");
    if (index === null) return;

    const noteTitle = JSON.parse(localStorage.getItem("addTitle")) || [];
    const noteDescription = JSON.parse(localStorage.getItem("addNoteDesc")) || [];
    const noteDate = JSON.parse(localStorage.getItem("addDate")) || [];
    const noteTime = JSON.parse(localStorage.getItem("addTime")) || [];
    const noteTags = JSON.parse(localStorage.getItem("addTags")) || [];

    noteTitle[index] = document.getElementById("postTitle").value;
    noteDescription[index] = document.getElementById("postContent").value;
    noteDate[index] = document.getElementById("postDate").value;
    noteTime[index] = document.getElementById("postTime").value;

    
    const tagCheckboxes = document.getElementsByName("noteTags");
    const newTags = [];
    for (const checkboxesSelectedVar of tagCheckboxes) {
        if (checkboxesSelectedVar.checked) newTags.push(checkboxesSelectedVar.value);
    }
    
    const customTag = document.getElementById("customTagInput").value.trim();
    if (customTag && !newTags.includes(customTag)) {
        newTags.push(customTag);
    }
    noteTags[index] = newTags;

    localStorage.setItem("addTitle", JSON.stringify(noteTitle));
    localStorage.setItem("addNoteDesc", JSON.stringify(noteDescription));
    localStorage.setItem("addDate", JSON.stringify(noteDate));
    localStorage.setItem("addTime", JSON.stringify(noteTime));
    localStorage.setItem("addTags", JSON.stringify(noteTags));

    alert("Note updated successfully!");
    window.location.href = "index.html"; 
}

function deleteButton(index) {
    if (index === undefined || index === null) {
        alert("Invalid note index");
        return;
    }

    alert("Are you sure you want to delete this note? This action cannot be undone.");

    const noteTitle = JSON.parse(localStorage.getItem("addTitle")) || [];
    const noteDescription = JSON.parse(localStorage.getItem("addNoteDesc")) || [];
    const noteDate = JSON.parse(localStorage.getItem("addDate")) || [];
    const noteTime = JSON.parse(localStorage.getItem("addTime")) || [];
    const noteTags = JSON.parse(localStorage.getItem("addTags")) || [];

    
    noteTitle.splice(index, 1);
    noteDescription.splice(index, 1);
    noteDate.splice(index, 1);
    noteTime.splice(index, 1);
    noteTags.splice(index, 1);


    localStorage.setItem("addTitle", JSON.stringify(noteTitle));
    localStorage.setItem("addNoteDesc", JSON.stringify(noteDescription));
    localStorage.setItem("addDate", JSON.stringify(noteDate));
    localStorage.setItem("addTime", JSON.stringify(noteTime));
    localStorage.setItem("addTags", JSON.stringify(noteTags));

    alert("Note deleted successfully!");


    displayNotes();
}


// load numbe of tasks on index.html on load
function loadNumberOfTasks() {
    const noteTitle = JSON.parse(localStorage.getItem("addTitle")) || [];
    const numberOfTasks = noteTitle.length;

    const taskCountElement = document.getElementById("taskCount");
    if (taskCountElement) {
        taskCountElement.textContent = `Total Tasks: ${numberOfTasks}`;
    } else {
        console.error("Task count element not found");
    }

    console.log("Created by Anugya Mehrotra (https://github.com/anugyamehrotra), inspired by Todoist (https://app.todoist.com/)");

}