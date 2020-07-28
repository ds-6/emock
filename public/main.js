/****************Global Function**********************/
function _fn(id){
    return document.querySelector(id);
}
function _fnAll(id){
    return document.querySelectorAll(id);
}
/*************Materialize Init********************/
document.addEventListener('DOMContentLoaded', function() {
   M.Dropdown.init(_fnAll('.dropdown-trigger'));
   M.Sidenav.init(_fnAll('.sidenav'));
  });
