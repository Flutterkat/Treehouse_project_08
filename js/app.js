const employeeMain = document.getElementsByClassName('employees');
const grid = document.getElementsByClassName('grid')[0];
const hidden = document.getElementsByClassName('hidden')[0];
const modalContent = document.getElementsByClassName('modal-content')[0];
const closeButton = document.getElementsByTagName('button')[0];
const leftArrow = document.getElementsByClassName('modal-left')[0];
const rightArrow = document.getElementsByClassName('modal-right')[0];
const profileDiv = document.getElementsByClassName('profile');
const search = document.getElementsByClassName('search')[0];
let employeeProfile = {};
let reducedProfile = '';
let employeePic = '';
let employeeName = '';
let employeeEmail = '';
let employeeCell = '';
let employeeAddress = '';
let employeeDob = '';
let classVar = '';
let classPass = '';
const employeesUrl = 'https://randomuser.me/api/?results=12';


//fetches data from server and formats it to JSON. passes data to divGen for extracting and formatting data
async function profileGen(url) {
    await fetch(url)
        .then(employeeData => employeeData.json())
        .then(employeeData => employeeData = employeeData.results)
        .then(divGen);
};



//generates innerHTML for profiles in grid.
const divGen = (data) => {
//stores fetched data in var for additional manipulation and calls later.
    employeeProfile = data;
    for (i=0;i<data.length;i++) {
//extracts needed data into variables for use in template Literal innerHTML.
    employeePic = [data[i].picture.medium, data[i].picture.large];
    employeeName = `${data[i].name.first} ${data[i].name.last}`;
    employeeEmail = `${data[i].name.first}@example.com`;
    employeeCell = data[i].cell;
    employeeAddress = [data[i].location.street, data[i].location.city, data[i].location.state, data[i].location.postcode];
    employeeDob = [data[i].dob];
    employeeMain[0].innerHTML += `
    <div class='profile event${i}'>
        <img src='${employeePic[0]}' alt='user image' class="userImage event${i}">
        <div class='info event${i}'>
        <h3 class='name event${i}'>${employeeName}</h3>
        <p class='info event${i}'>${employeeEmail}</p>
        <p class='info event${i}'>${employeeAddress[1]}</p>
        </div>
    </div>
    `;
    }
//generates the first modal screen, display is set to none on first pass. this stops errors from being thrown in other functions before modal view is created
    modalGen();
}

//reformats phone numbers for modal view.
const phoneFormat = (phone) => {
//removes punctuation and whitespaces from phone numbers.
    let punctuationless = phone.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    phone = punctuationless.replace(/\s+/g, '');
//checks and modifys phone number strings and returns a 10 digit number
    if (phone.length<10) {
        for(i=phone.length; i<10; i++) {
        phone = `${phone}0`
        };
    } else {
        phone = phone.substring(0,10);
    }
//formats a string of 10 numbers into phone format. example: (555) 555-555
    employeeCell = `(${phone.substring(0,3)}) ${phone.substring(3,6)}-${phone.substring(6,11)}`
}

//takes and reformats birthday display for modal view.
const birthdayFormat = (dob) => {
    dob = dob[0].date.slice(0, 10);
    dob = dob.replace(/-/g, "");
    dobFormat = `${dob.substring(4,6)}/${dob.substring(6,8)}/${dob.substring(0,4)}`;
}

//generates innerHTML for modal viewer based on information passed from grid eventhandler
const modalGen = () => {
    employeeCell.toString();
    phoneFormat(employeeCell);
    birthdayFormat(employeeDob);
    modalContent.innerHTML = `
        <img src='${employeePic[1]}' alt='user image' class="modal-userImage">
        <div class='modal-info-wrapper'>
        <h3 class='modal-name'>${employeeName}</h3>
        <p class='modal-info'>${employeeEmail}</p>
        <p class='modal-info'>${employeeAddress[1]}</p>
        <div class='divide'></div>
        <p class='modal-info'>${employeeCell}</p>
        <p class='modal-info'>${employeeAddress[0].number} ${employeeAddress[0].name}, ${employeeAddress[2]} ${employeeAddress[3]}</p>
        <p class='modal-info'>Birthday: ${dobFormat}</p>
        </div>
    `;
}

//handles the generation of modal view based on clicked profile.
grid.addEventListener('click', (e) => {
    let data = employeeProfile;
//sets the initial classVar for additional click handles in the left and right arrow event listeners.
    classVar = e.target.className;
    for(i=0;i<profileDiv.length;i++) {
        if (e.target.classList.contains(`event${i}`)) {
        employeePic = [data[i].picture.medium, data[i].picture.large];
        employeeName = `${data[i].name.first} ${data[i].name.last}`;
        employeeEmail = `${data[i].name.first}@example.com`;
        employeeCell = data[i].cell;
        employeeAddress = [data[i].location.street, data[i].location.city, data[i].location.state, data[i].location.postcode];
        employeeDob = [data[i].dob];
        hidden.style.display = 'block';
        modalGen(employeeProfile[i]);
        }
    }
//handles initial display of left and right arrows in modal view.
    if(classVar.includes('event11')) {
        rightArrow.style.display = 'none';
    } else {
        rightArrow.style.display = '';
}
    if(classVar.includes('event0')) {
        leftArrow.style.display = 'none';
    } else {
        leftArrow.style.display = '';
}
});

//close button click handler for modal view
closeButton.addEventListener('click', () => {
    hidden.style.display = 'none';
});


//increments user profile data for modal view left arrow.
leftArrow.addEventListener('click', () => {
    let data = employeeProfile;
    for(i=0;i<profileDiv.length;i++) {
    if (classVar.includes(`event${i}`)) {
    employeePic = [data[i-1].picture.medium, data[i-1].picture.large];
    employeeName = `${data[i-1].name.first} ${data[i-1].name.last}`;
    employeeEmail = `${data[i-1].name.first}@example.com`;
    employeeCell = data[i-1].cell;
    employeeAddress = [data[i-1].location.street, data[i-1].location.city, data[i-1].location.state, data[i-1].location.postcode];
    employeeDob = [data[i-1].dob];
//assigns new className to pass to classVar for next click handler event
    classPass = `event${i-1}`;
    }
}
//work around for event handler where classVar.includes(`event${i}`) was passing the for loop's if statement on first pass when classVar was set to event10 or event11.
    if (classVar.includes(`event10`)) {
    classPass = `event9`;
} else if (classVar.includes(`event11`)) {
    classPass = `event10`
}
//passes new employeeProfile to modalGen() for extracting and formatting profile data.
    modalGen();
    classVar = classPass;

//handles display of arrows hides and shows them based on position in modal view.
    if(classVar.includes('event0')) {
        leftArrow.style.display = 'none';
    } else {
        leftArrow.style.display = '';
        rightArrow.style.display = '';
}
});

//increments user profile data for modal view right arrow.
rightArrow.addEventListener('click', () => {
    let data = employeeProfile;
    for(i=0;i<profileDiv.length;i++) {
        if (classVar.includes(`event${i}`)) {
            employeePic = [data[i+1].picture.medium, data[i+1].picture.large];
            employeeName = `${data[i+1].name.first} ${data[i+1].name.last}`;
            employeeEmail = `${data[i+1].name.first}@example.com`;
            employeeCell = data[i+1].cell;
            employeeAddress = [data[i+1].location.street, data[i+1].location.city, data[i+1].location.state, data[i+1].location.postcode];
            employeeDob = [data[i+1].dob];
//assigns new className to pass to classVar for next click handler event
            classPass = `event${i+1}`;
            modalGen();
        }
    }
    classVar = classPass;
//handles display of arrows hides and shows them based on position in modal view.
    if(classVar.includes('event11')) {
        rightArrow.style.display = 'none';
    } else {
        rightArrow.style.display = '';
        leftArrow.style.display = '';
}
});


//searches and filters results via user input in searchfield.
search.addEventListener('input', () => {
    for(i=0;i<profileDiv.length;i++) {
        if (search.value == '') {
            profileDiv[i].style.display = 'flex';
        }
        employeeName = `${employeeProfile[i].name.first} ${employeeProfile[i].name.last}`;
        searchValue = search.value.toLowerCase();
        for(x=0;x<searchValue.length;x++) {
    if (employeeName.toLowerCase().indexOf(searchValue) > -1) {
            profileDiv[i].style.display = 'flex';
            } else profileDiv[i].style.display = 'none';
        }
    }
});

//calls profileGen() with url to generate employee profiles on first pass.
profileGen(employeesUrl);