(function(){
  var PREFIX = window.__ASSET_PREFIX__ || "";
  var index = window.__SEARCH_INDEX__ || [];
  var input = document.getElementById("site-search");
  var box = document.getElementById("search-results");
  if (!input || !box) return;
  var active = -1;

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return c==="&"?"&amp;":c==="<"?"&lt;":c===">"?"&gt;":"&quot;";});}

  function search(q){
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if(!terms.length) return [];
    var out = [];
    for(var i=0;i<index.length;i++){
      var e = index[i];
      var titleLc = e.title.toLowerCase();
      var headLc = (e.headings||[]).join(" ").toLowerCase();
      var hay = titleLc + " " + headLc + " " + (e.text||"");
      var ok = true, s = 0;
      for(var j=0;j<terms.length;j++){
        var t = terms[j];
        if(hay.indexOf(t)===-1){ok=false;break;}
        if(titleLc.indexOf(t)!==-1) s+=100;
        if(headLc.indexOf(t)!==-1) s+=20;
        var c=0, from=0;
        while((from=hay.indexOf(t,from))!==-1 && c<5){c++;from+=t.length;}
        s+=c;
      }
      if(ok) out.push({e:e,s:s});
    }
    out.sort(function(a,b){return b.s-a.s;});
    return out.slice(0,8).map(function(x){return x.e;});
  }

  function render(items){
    active = -1;
    if(!items.length){
      if(input.value.trim()){ box.innerHTML='<div class="search-empty">No matching pages</div>'; box.classList.add("open"); }
      else { box.innerHTML=""; box.classList.remove("open"); }
      return;
    }
    box.innerHTML = items.map(function(e){
      var cat = e.category ? '<span class="sr-cat">'+esc(e.category)+'</span>' : "";
      return '<a class="sr-item" role="option" href="'+esc(PREFIX+e.href)+'"><span class="sr-title">'+esc(e.title)+'</span>'+cat+'</a>';
    }).join("");
    box.classList.add("open");
  }

  function setActive(n){
    var items = box.querySelectorAll(".sr-item");
    if(!items.length) return;
    if(n<0) n = items.length-1;
    if(n>=items.length) n = 0;
    active = n;
    for(var i=0;i<items.length;i++){ items[i].classList.toggle("active", i===active); }
    items[active].scrollIntoView({block:"nearest"});
  }

  input.addEventListener("input", function(){ render(search(input.value)); });
  input.addEventListener("focus", function(){ if(input.value) render(search(input.value)); });
  input.addEventListener("keydown", function(ev){
    if(ev.key==="ArrowDown"){ ev.preventDefault(); setActive(active+1); }
    else if(ev.key==="ArrowUp"){ ev.preventDefault(); setActive(active-1); }
    else if(ev.key==="Enter"){
      var items = box.querySelectorAll(".sr-item");
      var pick = (active>=0 && items[active]) ? items[active] : items[0];
      if(pick) window.location.href = pick.getAttribute("href");
    } else if(ev.key==="Escape"){ box.classList.remove("open"); input.blur(); }
  });
  document.addEventListener("click", function(ev){
    if(!box.contains(ev.target) && ev.target!==input){ box.classList.remove("open"); }
  });
})();
