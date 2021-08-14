const employeeMain = document.getElementsByClassName('employees');
const grid = document.getElementsByClassName('grid')[0];
const hidden = document.getElementsByClassName('hidden')[0];
const modalContent = document.getElementsByClassName('modal-content')[0];
const closeButton = document.getElementsByTagName('button')[0];
const leftArrow = document.getElementsByClassName('modal-left')[0];
const rightArrow = document.getElementsByClassName('modal-right')[0];
const profileDiv = document.getElementsByClassName('profile');
const search = document.getElementsByClassName('search')[0];
// example of array data stored in employeeProfile @ line 230.
let employeeProfile = {};
let employeePic = '';
let employeeName = '';
let employeeEmail = '';
let employeeCell = '';
let employeeAddress = '';
let employeeDob = '';
let classVar = '';
let classPass = '';
const employeesUrl = 'https://randomuser.me/api/?results=12';


//=======================================================================<<
//fetches data from server and formats it to JSON. passes data to divGen for extracting and formatting data.
async function profileGen(url) {
    await fetch(url)
        .then(employeeData => employeeData.json())
        .then(employeeData => employeeData = employeeData.results)
        .then(divGen);
}

//=======================================================================<<
//formats employeeProfile array into variables.
const employeeFormating = (data) => {
    employeePic = [data.picture.medium, data.picture.large];
    employeeName = `${data.name.first} ${data.name.last}`;
    employeeEmail = `${data.name.first}@example.com`;
    employeeCell = data.cell;
    employeeAddress = [data.location.street, data.location.city, data.location.state, data.location.postcode];
    employeeDob = [data.dob];
};

//=======================================================================<<
//generates innerHTML for all 12 profiles in grid.
const divGen = (data) => {
//stores fetched data in var for additional manipulation and calls later.
    employeeProfile = data;
//extracts needed data from employeeprofile array and iterates over all array items converting to variables for use in template Literal innerHTML.
    for (i=0;i<data.length;i++) {
    employeeFormating(data[i]);
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
//generates the first modal screen, display is set to none on first pass. this stops errors from being thrown in other functions before modal view is created.
    modalGen();
};

//=======================================================================<<
//reformats phone numbers for modal view.
const phoneFormat = (phone) => {
//removes punctuation and whitespaces from phone numbers. example: (012)-34 56-78-9 converts to => 123456789
    let punctuationless = phone.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    phone = punctuationless.replace(/\s+/g, '');
//checks and modifys phone number strings. if phone number has less then 10 digits, add additional '0' till phone number is 10digits. example: 01234567 converts to => 0123456700
    if (phone.length<10) {
        for(i=phone.length; i<10; i++) {
        phone = `${phone}0`;
        }
//checks and modifys phone number strings. if phone number has more then 10 digits, extracts first 10 digits and removes the rest. example: 01234567890123 converts to => 0123456789
    } else {
        phone = phone.substring(0,10);
    }
//formats a string of 10 numbers into phone format. example: 0123456789 converts to =>(012) 345-6789
    employeeCell = `(${phone.substring(0,3)}) ${phone.substring(3,6)}-${phone.substring(6,11)}`;
};

//=======================================================================<<
//takes and reformats birthday display for modal view.
const birthdayFormat = (dob) => {
//slices the length of digits from employeeProfile for the dob.
    dob = dob[0].date.slice(0, 10);
//removes hyphens from dob.
    dob = dob.replace(/-/g, "");
//reformats the dob. example => 20003112 converts to => 12/31/2002
    dobFormat = `${dob.substring(4,6)}/${dob.substring(6,8)}/${dob.substring(0,4)}`;
};

//=======================================================================<<
//generates innerHTML for modal viewer based on information passed from grid eventhandler.
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
};

//=======================================================================<<
//handles the generation of modal view based on clicked profile.
grid.addEventListener('click', (e) => {
    let data = employeeProfile;
//sets the initial classVar for additional click handles in the left and right arrow event listeners.
    classVar = e.target.className;
    for(i=0;i<profileDiv.length;i++) {
        if (e.target.classList.contains(`event${i}`)) {
        employeeFormating(data[i]);
        hidden.style.display = 'block';
        modalGen(employeeProfile[i]);
        }
    }
//handles initial display of right arrow in modal view.
    if(classVar.includes('event11')) {
        rightArrow.style.display = 'none';
    } else {
        rightArrow.style.display = '';
}
//handles initial display of left arrow in modal view.
    if(classVar.includes('event0')) {
        leftArrow.style.display = 'none';
    } else {
        leftArrow.style.display = '';
}
});

//=======================================================================<<
//close button click handler for modal view.
closeButton.addEventListener('click', () => {
    hidden.style.display = 'none';
});

//=======================================================================<<
//increments user profile data for modal view left arrow.
leftArrow.addEventListener('click', () => {
    let data = employeeProfile;
    for(i=0;i<profileDiv.length;i++) {
        if (classVar.includes(`event${i}`)) {
            employeeFormating(data[i-1]);
//assigns new string to classVar for next click handler event.
            classPass = `event${i-1}`;
    }
}
//work around for event handler where classVar.includes(`event${i}`) was passing the for loop's 'if' statement on first pass when classVar was set to event10 or event11. 
    if (classVar.includes(`event10`)) {
    classPass = `event9`;
} else if (classVar.includes(`event11`)) {
    classPass = `event10`;
}
//calls modalGen() with updated variables.
    modalGen();
//assigns updated string to classVar for next click handler event.
    classVar = classPass;

//handles display of arrows hides and shows them based on position in modal view.
    if(classVar.includes('event0')) {
        leftArrow.style.display = 'none';
    } else {
        leftArrow.style.display = '';
        rightArrow.style.display = '';
}
});

//=======================================================================<<
//increments user profile data for modal view right arrow.
rightArrow.addEventListener('click', () => {
    let data = employeeProfile;
    for(i=0;i<profileDiv.length;i++) {
        if (classVar.includes(`event${i}`)) {
            employeeFormating(data[i+1]);
//assigns updated string to pass to classVar.
            classPass = `event${i+1}`;
//calls modalGen() with updated variables.
            modalGen();
        }
 //work around for event handler where classVar.includes(`event${i}`) was passing the for loop's 'if' statement on first pass when classVar was set to event10.
        if (classVar.includes(`event10`)) {
            classPass = `event11`;
        }
    }
//assigns updated string to classVar for next click handler event.
    classVar = classPass;
//handles display of arrows. hides and shows them based on position in modal view.
    if(classVar.includes('event11')) {
        rightArrow.style.display = 'none';
    } else {
        rightArrow.style.display = '';
        leftArrow.style.display = '';
}
});

//=======================================================================<<
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

//=======================================================================<<
//calls profileGen() with url to generate employee profiles on first pass.
profileGen(employeesUrl);


/* 
example of employeeData[x] array; where x = # between 0 and 11;
VVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

{
    "gender": "male",
    "name": {
        "title": "Mr",
        "first": "Ross",
        "last": "Jordan"
    },
    "location": {
        "street": {
            "number": 6581,
            "name": "W Gray St"
        },
        "city": "Carrollton",
        "state": "Montana",
        "country": "United States",
        "postcode": 65306,
        "coordinates": {
            "latitude": "21.6883",
            "longitude": "129.5805"
        },
        "timezone": {
            "offset": "-2:00",
            "description": "Mid-Atlantic"
        }
    },
    "email": "ross.jordan@example.com",
    "login": {
        "uuid": "811b0985-82f7-4d76-ae28-90a1a82a976a",
        "username": "greenmouse431",
        "password": "iceberg",
        "salt": "dNeNGjNJ",
        "md5": "74f010e720254dae7b7ff902f97a5eef",
        "sha1": "02f12f06fafd7f26daef9dffdef3112a5492f2ac",
        "sha256": "62ff42cc5a75fd9ed75babadf4a7d83c86bab23fc7174c941f22c269d6f8b777"
    },
    "dob": {
        "date": "1997-05-14T00:37:01.563Z",
        "age": 24
    },
    "registered": {
        "date": "2015-06-07T19:55:52.709Z",
        "age": 6
    },
    "phone": "(940)-918-0206",
    "cell": "(097)-067-9839",
    "id": {
        "name": "SSN",
        "value": "257-55-2515"
    },
    "picture": {
        "large": "https://randomuser.me/api/portraits/men/44.jpg",
        "medium": "https://randomuser.me/api/portraits/med/men/44.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/men/44.jpg"
    },
    "nat": "US"
}

*/