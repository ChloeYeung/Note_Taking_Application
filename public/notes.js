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

const reloadNotes = (notes) => {
  let ar = [];
  idStore = [];
  for (let i = 0; i < notes.length; i++) {
    idStore.push(notes[i].id);
    ar.push(notes[i].content);
  }

  $("#notes").html(notesTemplate({ notes: ar }));
};

const beginSaving = () => {
  axios.get("/api/notes", {}).then((res) => {
    reloadNotes(res.data);
  });
};

beginSaving();

const endSaving = (target) => {
  axios.get("/api/notes", {}).then((res) => {
    reloadNotes(res.data);
  });
};

$(() => {
  $("#add").submit((e) => {
    e.preventDefault();

    let da = $("#textBox").val();
    axios.post("/api/notes", { note: da }).then((res) => {
      reloadNotes(res.data);
    });
  });

  $("#notes").on("blur", "textarea", (event) => {
    console.log(idStore);

    console.log(Number(event.currentTarget.dataset.id));
    console.log(idStore[Number(event.currentTarget.dataset.id)]);

    axios
      .put("/api/notes", {
        note: $(`textarea[data-id=${event.currentTarget.dataset.id}]`).val(),
        index: idStore[Number(event.currentTarget.dataset.id)],
      })
      .then((res) => {
        reloadNotes(res.data);
      });
  });

  $("#notes").on("click", ".remove", (event) => {
    axios
      .delete("/api/notes", {
        data: {
          index: idStore[Number(event.currentTarget.dataset.id)],
        },
      })
      .then((res) => {
        reloadNotes(res.data);
      });
  });
});
