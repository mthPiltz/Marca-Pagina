const btnActive = document.getElementById('active');
const btnClean = document.getElementById('clean');
const selectedColor = document.getElementById('selectColor');

const defineTextButton = JSON.parse(localStorage.getItem(`mark`));
setText(defineTextButton);

const active = (args) =>{
  const reset = (oldOrNew) => {
    const resetColor = JSON.parse(localStorage.getItem(`mark/${oldOrNew}`));
    if(resetColor){
      let searchP = document.querySelectorAll('p');
      searchP[resetColor.id].style.backgroundColor = resetColor.color;
    }
  }

  const activeItem = JSON.parse(localStorage.getItem(`mark/old`));
  if(activeItem){
    activeItem.active = true;
    localStorage.setItem(`mark/old`, JSON.stringify(activeItem));
  }

  let paragraphs = [];
  let pageParagraphs = document.querySelectorAll('p');
  let page = document.querySelector('body');
  
  reset('current');

  pageParagraphs.forEach((paragraph, index) => {
    paragraphs.push({
      tagP : paragraph,
      id : index
    });
  });

  const listenerClick = (e) => {    
    const verifyActived = JSON.parse(localStorage.getItem(`mark/old`));
    if(verifyActived == undefined || verifyActived.active) {   

      x = e.clientX;
      y = e.clientY;
      marcked = document.elementFromPoint(x, y);

      if(marcked.tagName !== 'P'){
        return
      }

      reset('old');

      paragraphs.forEach(p => {
        if(p.tagP.innerHTML == marcked.innerHTML){
          const oldColor = {
            id : p.id,
            pagP : marcked,
            color : marcked.style.backgroundColor,
            active : true
          }
          
          localStorage.setItem(`mark/old`, JSON.stringify(oldColor));      
          marcked.style.backgroundColor = args.color;

          const currentColor = {
            id : p.id,
            pagP : marcked,
            color : marcked.style.backgroundColor
          }
          localStorage.setItem(`mark/current`, JSON.stringify(currentColor));
        }
      });
    }
  };
  
  page.addEventListener('click', listenerClick);
}

const desactive = () =>{
  const resetColor = JSON.parse(localStorage.getItem(`mark/old`));
  if(resetColor){
    resetColor.active = false;
    let searchP = document.querySelectorAll('p');
    searchP[resetColor.id].style.backgroundColor = resetColor.color;
    localStorage.setItem(`mark/old`, JSON.stringify(resetColor))
  }
}

const clean = () => {
  const resetColor = JSON.parse(localStorage.getItem(`mark/old`));
  if(resetColor){
    let searchP = document.querySelectorAll('p');
    searchP[resetColor.id].style.backgroundColor = resetColor.color;
    console.log(searchP[resetColor.id]);
  }

  localStorage.removeItem('mark/old');
  localStorage.removeItem('mark/current');
  
}

btnActive.addEventListener('click', async (e) =>{
  const isActive = btnActive.innerText  === "Ativar";
  
  localStorage.setItem(`mark`, JSON.stringify(isActive));

  const [tab] = await chrome.tabs.query({ active : true, currentWindow : true });

  chrome.scripting.executeScript({
    target : { tabId : tab.id },
    function : isActive ? active : desactive,
    args : [{
      color : selectedColor.value,
      actived : isActive
    }]
  });

  
  setText(isActive);
});

btnClean.addEventListener('click', async (e) =>{
  const [tab] = await chrome.tabs.query({ active : true, currentWindow : true });
  chrome.scripting.executeScript({
    target : { tabId : tab.id },
    function : clean,
    args : []
  });

});

function setText(actived){
  btnActive.innerText = actived ? "Desativar" : "Ativar";
}