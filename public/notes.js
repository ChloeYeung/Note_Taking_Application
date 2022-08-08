// This notesTemplate uses Handlebars.compile, this means we are leveraging the handlebars cdn which we have on the layout of our page.
// The note template will render out this text area, with the index position of the note as the data-id, the note itself {{ this }} within the text area so it is rendered to the screen.
//We also generate a button for each note, which again has the index position of the note as the data-id. so that if you press the button we will be able to delete the note which the button refers to.
let idStore = [];
var notesTemplate = Handlebars.compile(
  `
        {{#each notes}}
        <div class="note">
            <span class="input"><textarea data-horse="pony" data-id="{{ @index }}">{{ this }}</textarea></span>
            <button class="remove btn btn-xs" data-id="{{ @index }}"><i class = "fa fa-trash" aria-hidden="true"></i></button>
            </div>
            {{/each}}
        `
);

// This function is responsible of re-rendering the page every time we update our notes. It recieves the array of notes and then forces each note (each element within the array) into the notes template, which iterates through the array rendering all the notes to the DOM in the same format.
const reloadNotes = (notes) => {
  // code here
  let ar = [];
  idStore = [];
  for (let i = 0; i < notes.length; i++) {
    idStore.push(notes[i].id)
    ar.push(notes[i].content)
  }

  $("#notes").html(notesTemplate({ notes: ar }));
};



// This function is used and defined to make a message appear on the dom when saving our note.
const beginSaving = () => {
  // code here
  axios.get('/api/notes', {})
    .then((res) => { reloadNotes(res.data) })
};


beginSaving();
// This function is used and defined to make a message disappear on the dom after saving our note.
const endSaving = (target) => {
  // code here
  axios.get('/api/notes', {})
    .then((res) => { reloadNotes(res.data) })
};

// Document on ready function, when the document has fully loaded we can do everything within this block of code.
$(() => {

  // Add an event listener on the add button, such then when we press the button we grab the value from our text box and then send that value to our server in our post request, then we receive the new data from our server and reload all of our notes.
  $("#add").submit((e) => {

    e.preventDefault();
    // after grabbing the value from the textbox, use axios to make a post request and send the value
    // Example: axios.post("/api/notes", {note: value})
    // code here
    let da = $("#textBox").val();
    axios.post('/api/notes', { note: da })
      .then((res) => { reloadNotes(res.data) })

  });

  // Add an event listener to our div (it has an id of notes) which encapsulates our text-areas, we specify we are targeting the text areas. When we blur (lose focus on the text area), we begin saving our new note (make the message appear on the DOM)
  $("#notes").on("blur", "textarea", (event) => {
    // code here
    console.log(idStore)

    console.log(Number(event.currentTarget.dataset.id))
    console.log(idStore[Number(event.currentTarget.dataset.id)])

    axios.put("/api/notes", {

      note: $(`textarea[data-id=${event.currentTarget.dataset.id}]`).val(),
      index: idStore[Number(event.currentTarget.dataset.id)]

    }).then((res) => { reloadNotes(res.data) });

  });

  // Add an event listener onto the buttons that we generate along with each note, we target the class remove and listen for a click event.
  $("#notes").on("click", ".remove", (event) => {
    // show saving message on DOM
    // code here
    axios.delete("/api/notes", {
      data: {
        index: idStore[Number(event.currentTarget.dataset.id)]
      }
    }).then((res) => { reloadNotes(res.data) });
  });
});
