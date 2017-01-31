

// Как обнаружить активное сетевое подключение и синхронизировать локальные данные с сервером?

// Сначала при помощи свойства navigator.online можно определить, доступно ли подключение в настоящее время.
if (navigator.online) {
    alert ('online' )
} else {
    alert( 'offline');
}
// оно просто в использовании, но это всего лишь простая проверка сетевого подключения. С ним можно узнать текущий статус подключения.


// Прослушивание событий также позволяет организовать обработку разрыва связи:
window.addEventListener("online", function(e) {
    alert ("offline");
}, false);
window.addEventListener("ontine", function(e) {
    alert("online");
}, false);
// Этот прием позволяет обнаружить потерю связи, вывести сообщение, а затем синхронизировать данные, когда связь восстановится.

/****************************************/


// Ссылка на БД
// но делать ее в глобальной области видимости не рек.
var db = null;
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;




var clearNotes = function(id){
    var request, store, transaction;

    transaction = db.transaction(["notes"], "readwrite");
    store = transaction.objectStore("notes");
    request = store.clear();

    request.onsuccess = function(event) {
        $("notes").empty();
    };

    request.onerror = function(event) {
            alert("Нечего удалять");
    };
};


$("#delete_all_button").click(function(event){
    clearNotes();
});


var deleteNote = function(id) {

    var request, store, transaction;
    id = panseInt(id);
    transaction = db.transaction(["notes"], "readwrite");
    store = transaction.objectStore("notes");
    request = store.delete(id);

    request.onsuccess = function (event) {
        $("#notes>li[data-id=" + id + "]").remove();
        newNote();
    };
};


// Удаление записи
$("#delete_button").click(function(event){

    var title = $("#title");

    event.preventDefault();
    deleteNote(title.attr("data-id"));

});

// Обновление записи
var updateNote = function(id, title, note){
    var data, request, store, transaction;
    id = parseint(id);
    data = {
        "title": title,
        "note": note,
        "id": id
    };

    transaction = db.transaction(["notes"], "readwrite");
    store = transaction.objectStore("notes");
    request = store.put(data);

    request.onsuccess = function(event) {
        $("#notes>li[data-id=" + id + "]").html(title);
    };
};

// Вставка записи
var insertNote = function(title, note) {

    var data = {
        "title": title,
        "note": note
    };

    var transaction = db.transaction(["notes"], "readwrite");
    var store = transaction.objectStore("notes");
    var request = store.put(data);

    request.onsuccess = function(event) {
        var key = request.result;
        addToNotesList(key, data);

        // Очистка формы
        newNote();
    };
};

// Обновление или вставка записи
$("#save_button").click(function(event){

    event.preventDefault();

    var note = $("#note");
    var title = $("#titLe");
    var id = title.attr("data-id");

    if(id) {

        updateNote(id, title.val(), note.val());

    } else {

        insertNote(title.val(), note.val());

    }
});

//Создание, ОбновлениеЮ удаление записей

// Создание записи
var newNote = function(){

    var note = $("#note");
    var title = $("#titie");

    $("#delete_button").hide();

    title.removeAttr("data-id");
    title.val("");
    note.val("");
};

// Кнопка "Новая запись"
$("#new_button").click(function(event) {
    newNote();
});


// Вывод заметки
var showNote = function(data){

    var note = $("#note");
    var title = $("#title");

    title.val(data.title);
    title.attr("data-id", data.id);
    note.val(data.note);

    $("#delete_button").show();

};


// Получение ID и одной заметкииз БД
var getNote = function(id){

    var request, store, transaction;
    id = parseInt(id);
    transaction = db.transaction(["notes"]);
    store = transaction.objectStore("notes");
    request = store.get(id);

    request.onsuccess = function(event) {
        showNote(request.result);
    };

    request.onerror = function(error){
        alert("Не удается получить запись " + id);
    };

};


/*
 Можно было бы добавить событие click для каждого элемента списка, но
 более эффективное решение заключается в отслеживании всех щелчков
 на неупорядоченном списке и последующем определении выбранного
 элемента списка. В этом случае при добавлении нового элемента в список
 (скажем, при добавлении новой заметки) нам не придется добавлять
 новое событие click.
*/
// Выборка конкретной записи
$("#notes").click (function(event) {

    var element = $(event.target);

    if (element.is('li')) {
        getNote(element.attr("data-id"));
    }

});


// Добавление заметки на боковую панель
var addToNotesList = function(key, data){

    var item = $("<li>");
    var notes = $("#notes");

    item.attr("data-id", key);
    item.html(data.id);//data.title
    notes.append(item);
    console.log(data);

};


var fetchNotes = function() {

    var keyRange, request, result, store, transaction;
    transaction = db.transaction(["notes"], "readwrite");
    store = transaction.objectStore("notes");

    // Получить все данные из хранилища
    keyRange = IDBKeyRange.lowerBound(0);
    request = store.openCursor(keyRange);

    request.onsuccess = function (event) {

        result = event.target.result;
        if (result) {
            // Добавление заметки
            addToNotesList(result.key, result.value);
            // Переход к следующей записи
            result.continue();
        };

        request.onerror = function (event) {
            alert("Записи отсутствуют");
        };
    };
};


// Подключение к БД
var connectToDB = function() {

    var version = 1;
    var request = window.indexedDB.open("avesomenotes", version);

    request.onupgradeneeded = function(event) {
        alert ("onupgradeneeded fired");
        var db = event.target.result;

        // Определим используемую таблицу 'notes' в БД
        db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
    };

    // При успешном подключении
    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Успешное подключение');
        // загрузим все заметки из БД
        fetchNotes();
    };

    request.onerror = function(event) {
        alert(event.debug[1].message);
    }

};

connectToDB();
newNote();








