const mainForm = document.querySelector("#mainForm");
const secondForm = document.querySelector("#knowMore");
const infoDiv = document.querySelector("#info");

const secondFormPath = document.querySelector(`[name="path"]`);

const cechy = ["Siła", "Zręczność", "Kondycja", "Inteligencja", "Mądrość", "Charyzma"]

let currentStep=0;

const getDataFromApi = async (information) => {
    const dataUnReadAble = await fetch("https://www.dnd5eapi.co/api/"+information+"/")
    const data = await dataUnReadAble.json();
    
    return data;
}

getDataFromApiURL = async (i) => {
    const dataUnReadAble = await fetch("https://www.dnd5eapi.co"+i)
    const data = await dataUnReadAble.json()
    
    return data;
}

const resultDataRaces = [];
const resultDataClasses = [];

getDataFromApi("races").then(e=>{
    resultDataRaces.push(...e.results);
})

getDataFromApi("classes").then(e=>{
    resultDataClasses.push(...e.results);
})

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


const getPath = () => {
    return secondFormPath.value;
}

const setPath = (data) => {
    secondFormPath.value=data;
}

secondForm.addEventListener('submit', e=>{
    e.preventDefault();
    
    getDataFromApiURL(`${getPath()}`).then(e=>{
        console.log(e)
        let finalAnswer=`
        <p>name: ${e.name}</p>
        <p>speed: ${e.speed}</p>
        <p>aligment: ${e.alignment}</p>
        <p>about language: ${e.language_desc}</p>
        <p>size: ${e.size}</p>
        <p>size description: ${e.size_description}</p>
        <p>speed: ${e.speed}</p>
        <ul>
        ability bonuses:`;
        e.ability_bonuses.forEach(el=>{
            finalAnswer+=`<li>${el.ability_score.name} | +${el.bonus}</li>`;
            console.log(el.ability_score)
        })
        finalAnswer+=`
        </ul>
        `;
        e.traits.forEach(el=>{
            getDataFromApiURL(el.url).then(element=>{
                finalAnswer+=`<li>${element.name}</li>`
                console.log(element);
                console.log(finalAnswer)
            });
        })

        finalAnswer+=`<ul>`;

        // console.log(finalAnswer);

        infoDiv.innerHTML=finalAnswer;

        infoDiv.style.display="block";
    })

})

const submitForm = () => {
    return `<input type="submit" value="dalej">`;
}

const generateFirstStep = () => {
    const name=getCookie("name");
    mainForm.innerHTML = `<label for="characterName">Character Name: <input type="text" name="characterName" id="characterName" value="${name}"></label>${submitForm()}`;
}

const generateSecondStep = async () => {

    console.log(resultDataRaces);

    let finalAnswer=`<select name="races" id="races">`;

    // console.log(resultData);

    resultDataRaces.forEach(e=>{
        finalAnswer+=`<option value="${e.url}">${e.name}</option>`;
    });

    finalAnswer+= `</select>`;

    finalAnswer+=submitForm();

    mainForm.innerHTML=finalAnswer;

    const racesSelect = document.querySelector('select');
 
    racesSelect.addEventListener('change', e=>{
        const racesSelect2 = document.querySelector('select');
        setPath(racesSelect2.value);
    })

    setPath(racesSelect.value);
    
    secondForm.style.display="block";
    

}

const generateThirdStep = () => {
    let finalAnswer = "";
    secondForm.style.display="none";
    infoDiv.style.display="none";
    resultDataClasses.forEach(el=>{
       
        getDataFromApiURL(el.url).then(e=>{
            finalAnswer+=`<div class='simpleClass'><div><span>${el.name}</span><input type="hidden" name="classData" value="${el.name}">${submitForm()}</div><ul>`
            const rel = e.proficiencies;
            rel.forEach(element=>{
                finalAnswer+=`<li>${element.name}</li>`;
                
            })
            finalAnswer+=`</ul></div>`;
            mainForm.innerHTML=finalAnswer;
        });
         
    });

}

const randomNumber = (firstNumber, lastNumber) => {
    const wynik = Math.floor(Math.random() * lastNumber);
    return firstNumber>wynik ? firstNumber : wynik;
}

const generateFourStep = () => {
    let finalAnswer = "";

    

    for(let i=0; i<6; i++){
        finalAnswer+=`<div class='simpleRandom'><span>${randomNumber(1, 20)}</span><span>${cechy[i]}</span></div>`;
    }

    finalAnswer+="<div class='reRenderFourStep'>Przerzuc</div>";

    finalAnswer+=submitForm();

    mainForm.innerHTML=finalAnswer;

    const reRenderFourStep = document.querySelector(".reRenderFourStep");

    reRenderFourStep.addEventListener('click', e=>{
        generateFourStep();
    })

    

}

const generateLastStep = () => {
    let finalAnswer = "";

    finalAnswer+=`<div class="kartaPostaci"><div class="dataKP"><span>Name: <b>${getCookie("name")}</b></span> <span>Race: ${getCookie("race")}</span> <span>Class: ${getCookie("class")}</span></div><div class="conKP">`

    for(let i=0; i<6; i++){
        finalAnswer+=`<div><span>${getCookie(cechy[i])}</span><span>${cechy[i]}</span></div>`
    }

    finalAnswer+=`</div></div>`

    mainForm.innerHTML=finalAnswer;

}

const generateStep = (hereStep) => {
    switch(hereStep){
        case 0:
            generateFirstStep();
            break;
        case 1:
            generateSecondStep();
            break;
        case 2:
            generateThirdStep();
            break;
        case 3:
            generateFourStep();
            break;
        case 4:
            generateLastStep();
            break;
        default:
            generateThirdStep();
    }
}

mainForm.addEventListener("submit",e=>{
    e.preventDefault();

    if(currentStep==0){
        setCookie("name", mainForm.querySelector(`[name="characterName"]`).value, 1);
    }

    if(currentStep==1){
        setCookie("race", mainForm.querySelector("select").children[mainForm.querySelector("select").selectedIndex].innerHTML, 1);
    }

    if(currentStep==2){
        setCookie("class", e.submitter.parentElement.querySelector("span").innerHTML, 1);
    }

    if(currentStep==3){
        for(let i=0; i<6; i++){
            setCookie(cechy[i], mainForm.children[i].children[0].innerHTML, 1);
        }
    }

    currentStep++;
    // console.log(currentStep);
    generateStep(currentStep);
})

/*

    ToDo:

    - Zrobic wybieranie klasy - k
    - Zrobic generowanie cech - k
    - Stworzyc szablon karty postaci - k
    - Utworzyc pliki cookie ze sesji - k
    - Do szablonu postaci importowac dane z pliku cookie - 1/2 k
    - Dodac opcje "cofnij"
    - Ostylowac strone

*/