


// Добавление вкладки в историю просмотра
var addTabToHistory = function(target){

    var tab = target.attr("href");

    // Объект, используемый для сохранения идентификатра вкладки
    var stateObject = {tab: tab};
    console.log(tab);

    // Сохранение состояния просмотра
    window.history.pushState(stateObject, tab);

};

// При клике по ссылке методу addTabToHistory() передается вкладка, по которой щелкнул пользователь
// и происходит добавление в историю просмотра
$("nav ul").click(function(event){

    var target = $(event.target);

    if(target.is("a")){

        event.preventDefault();

        if ( $(target.attr("href")).attr("aria-hidden")){

            addTabToHistory(target);
            activateTab(target.attr("href"));

        };
    };
});


var configurePopState = function(){

    // событие window.onpopstate() происходит после клика по кнопке Back браузера
    window.onpopstate = function(event) {

        // отобразим вкладку, сохраненную в объекте состояния
        if(event.state){
            var tab = (event.state["tab"]);
            activateTab(tab);
        }
    };
};

var activateDefaultTab = function(){

    // Если значение location.hash отсутствует, мы присваиваем значение по умолчанию.
    var tab = window.location.hash || "Welcome";
    activateTab(tab);

    // history. replaceState() используется для выбора вкладки. Он работает аналогично pushState(), но вместо добавления нового элемента заменяется текущий элемент.
    window.history.replaceState({tab: tab}, "", tab);
};


var init = function(){
    configureTabSelection();
    configurePopState();
    activateDefaultTab();
};

init();













