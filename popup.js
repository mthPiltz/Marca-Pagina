const btnActive = document.getElementById('active');
const btnClean = document.getElementById('clean');
const selectedColor = document.getElementById('selectColor');

const active = (args) =>{
  const reset = (oldOrNew) => {
    const resetColor = JSON.parse(localStorage.getItem(`mark/${oldOrNew}`));
    if(resetColor){
      let searchP = document.querySelectorAll('p');
      searchP[resetColor.id].style.backgroundColor = resetColor.color;
    }
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
  };
  
  if(args.actived){
    page.addEventListener('click', listenerClick);
  }
  else{
    page.removeEventListener('click', listenerClick);
  
    const resetColor = JSON.parse(localStorage.getItem(`mark/old`));
    if(resetColor){
      let searchP = document.querySelectorAll('p');
      searchP[resetColor.id].style.backgroundColor = resetColor.color;
    }
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

  const [tab] = await chrome.tabs.query({ active : true, currentWindow : true });

  chrome.scripting.executeScript({
    target : { tabId : tab.id },
    function : active,
    args : [{
      color : selectedColor.value,
      actived : isActive
    }]
  });

  
  btnActive.innerText = isActive ? "Desativar" : "Ativar";
});

btnClean.addEventListener('click', async (e) =>{
  const [tab] = await chrome.tabs.query({ active : true, currentWindow : true });
  chrome.scripting.executeScript({
    target : { tabId : tab.id },
    function : clean,
    args : []
  });

})