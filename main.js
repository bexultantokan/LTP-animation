packetsToBeDelivered = 0;
leftLineX = document.getElementById('leftLine').getBoundingClientRect().right;
leftLineY = document.getElementById('leftLine').getBoundingClientRect().top;
rightLineX = document.getElementById('rightLine').getBoundingClientRect().left;
rightLineY = document.getElementById('rightLine').getBoundingClientRect().top;
var passed = new Array();
leftLine = document.getElementById('leftLine');
rightLine = document.getElementById('rightLine');


timeOutInterval = 3000;
idCounter = 0
duration = 2
offset = 20 // between the lines
incline = 10 // Y offset for the right line

let leftTimerResolve;
let rightTimerResolve;
let breakLeftLoop;
blocks = 0
startButton = null;
var receivedRA = false
var connectionEnded = false
var rightSatteliteTriggered = false
var RSreceived = false
var leftPackets = [], rightPackets = [];
var leftTimer, rightTimer;
var arrOfUndelivered = Array();
var numbersToDeliver = Array()
dictionaryOfLines = {}

function makeLineStruct(dataNum, isCP, type, requiredNums) {
    this['dataNum'] = dataNum;
    this['isCP'] = isCP;
    this['type'] = type;
    this['requiredNums'] = requiredNums;
}
function showMessage(message) {
    document.getElementById('message').textContent = message;
}

async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission
    blocks = parseInt(document.getElementById('2blocks').value); 
    showMessage("There are " + blocks + " blocks to transmit.");
    document.getElementById('container1').style.visibility = "visible";
    leftLine.style.height = Math.max(blocks * (offset + 50) , 60) + 'px';
    rightLine.style.height = Math.max(blocks * (offset + 50) , 60) + 'px';

    document.querySelectorAll('.line').forEach(e => e.remove());
    leftLineY = leftLine.getBoundingClientRect().top;
    rightLineY = rightLine.getBoundingClientRect().top;
    numbersToDeliver = Array.from({ length: blocks }, (_, i) => i + 1);
    packetsToBeDelivered = blocks;
    await leftSattelite();
    // do {
    //     console.log("Packets to be delivered: ", packetsToBeDelivered);
    //     console.log(numbersToDeliver);
    //     total = packetsToBeDelivered
    //     for (var i = 0; i < total; i++) {
    //         labelNum = numbersToDeliver.shift();
    //         console.log("num: "+labelNum);
    //         if (i == total - 1){
    //             dictionaryOfLines[idCounter] = new makeLineStruct(labelNum, true, 'data', []);
    //         } else {
    //             dictionaryOfLines[idCounter] = new makeLineStruct(labelNum, false, 'data', []);
    //         }
    //         await moveLine('blue', leftLineX, leftLineY, rightLineX, rightLineY + incline, 1, labelNum, () => {});
    //         packetsToBeDelivered -= 1;
    //     }
    //     dictionaryOfLines[idCounter] = new makeLineStruct(-1, false, 'RS', [].concat(numbersToDeliver));
    //     await moveLine('yellow', rightLineX, rightLineY, leftLineX , leftLineY + 15, 1, -1, () => {});
    // } 
    // while (packetsToBeDelivered != 0);
    // dictionaryOfLines[idCounter] = new makeLineStruct(-1, false, 'RA', []);
    // await moveLine('red', leftLineX, leftLineY, rightLineX, rightLineY + 15, 1, -1, () => {});
}

async function sendBatch() {
    arrOfUndelivered = Array();
    total = numbersToDeliver.length

    for (var i = 0; i < total; i++) {
        labelNum = numbersToDeliver[i];
        console.log("num: "+labelNum);                                                               
        if (i == total - 1){
            dictionaryOfLines[idCounter] = new makeLineStruct(labelNum, true, 'data', []);
            moveLine('blue', leftLineX, leftLineY, rightLineX, rightLineY + incline, duration, labelNum, callbackCP);
        } else {
            dictionaryOfLines[idCounter] = new makeLineStruct(labelNum, false, 'data', []);
            moveLine('blue', leftLineX, leftLineY, rightLineX, rightLineY + incline, duration, labelNum, () => {});
        }
        await waitForDuration();
        packetsToBeDelivered -= 1;
    }  
}

async function leftSattelite() {
    leftLineY = leftLine.getBoundingClientRect().top;
    rightLineY = rightLine.getBoundingClientRect().top;
    blocks = parseInt(document.getElementById('2blocks').value); 
    numbersToDeliver = Array.from({ length: blocks }, (_, i) => i + 1);
    packetsToBeDelivered = blocks;

    
    do {
        // make a while loop which sends last packet with CP while RA was not sent
        console.log('before sending batch', numbersToDeliver)
        await sendBatch();
        RSreceived = false;
        await waitForTimeout();
        console.log('RSreceived', RSreceived)
        while (RSreceived == false && numbersToDeliver.length > 0) {
            moveLine('blue', leftLineX, leftLineY, rightLineX, rightLineY + incline, duration, numbersToDeliver[numbersToDeliver.length - 1], callbackCP);
            await waitForDuration()
            await waitForTimeout();
            console.log('inside loop', numbersToDeliver)
        }
        console.log('numbers to send', numbersToDeliver)
    }
    while (numbersToDeliver.length > 0) // every time RA was sent
    // while (connectionEnded == false) {
    //     console.log('try to end connection')
    //     moveLine('yellow', leftLineX, leftLineY, rightLineX, rightLineY + incline, duration, -1, () => {RSreceived = true});
    //     await waitForDuration();
    //     await waitForTimeout();
    // }
    console.log('leftSattelite finished')
}

// function endConnection() {
//     connectionEnded = true;
// }

async function sendRS() {
    dictionaryOfLines[idCounter] = new makeLineStruct(-1, false, 'RS', arrOfUndelivered);
    moveLine('red', rightLineX, rightLineY, leftLineX, leftLineY + incline, duration, -1, callbackRA);
    await waitForDuration();
}

async function sendRA() {
    dictionaryOfLines[idCounter] = new makeLineStruct(-1, false, 'RA', []);
    moveLine('yellow', leftLineX, leftLineY, rightLineX, rightLineY + incline, duration, -1, () => {receivedRA = true});
    await waitForDuration();
}

async function rightSattelite() { // TODO
    while (arrOfUndelivered.length > 0) {
        console.log('arrOfUndelivered', arrOfUndelivered)
        await sendRS();
        await waitForRightTimeout()
    }
    // while RA isn't received
    while (receivedRA == false) {
        await sendRS();
        await waitForRightTimeout()
    }        

    console.log('rightSattelite finished', receivedRA)
    // leftLineY = leftLine.getBoundingClientRect().top;
    // rightLineY = rightLine.getBoundingClientRect().top;
    // packetsToBeDelivered = blocks;
}

function waitForTimeout() {
    return new Promise(resolve => {
        leftTimerResolve = resolve;
        leftTimer = setTimeout(() => {
            resolve();
        }, timeOutInterval);
    });
}

function waitForRightTimeout() {
    return new Promise(resolve => {
        rightTimerResolve = resolve;
        rightTimer = setTimeout(() => {
            resolve();
        }, timeOutInterval);
    });
}

function waitForDuration() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, duration * 1000);
    });
}

function callbackRA(line) { // TODO
    console.log("RA callback, RSreceived", RSreceived);
    RSreceived = true;
    console.log("RA callback, new RSreceived", RSreceived);
    id = parseInt(line.id);
    console.log("RA callback, id", id);
    // console.log(line.id, dictionaryOfLines)
    // console.log("arr from RA", dictionaryOfLines[id]['requiredNums'])
    console.log("arr from RA", dictionaryOfLines[id]['requiredNums'])
    numbersToDeliver = dictionaryOfLines[id]['requiredNums']
    console.log("numbersToDeliver", numbersToDeliver)
    if (numbersToDeliver.length == 0){
        sendRA();
    }
    else {
    clearTimeout(leftTimer);
        if (leftTimerResolve) {
            leftTimerResolve();  // Resolve the promise if it exists
            leftTimerResolve = null;  // Reset the resolve function
        }
    }
}

function callbackCP() { // TODO
    console.log("CP callback");
    if (rightSatteliteTriggered == false){
        rightSatteliteTriggered = true;
        rightSattelite();
    }
    else{
        clearTimeout(rightTimer);
        if (rightTimerResolve) {
            rightTimerResolve();  // Resolve the promise if it exists
            rightTimerResolve = null;  // Reset the resolve function
        }
    }
}

function moveLine(color, fromX, fromY, toX, toY, duration, labelNum, callback) {
    leftLineY += offset;
    rightLineY += offset;

    if (labelNum != -1) {
        const container = document.getElementById('rightSide');
        const newElement = document.createElement('div');
        newElement.classList.add('text-element');
        newElement.textContent = labelNum;
        newElement.style.position = 'absolute';
        newElement.style.left = String(fromX - 20) + 'px';
        newElement.style.top = String(fromY - 10) + 'px';

        container.appendChild(newElement);
    }

    return new Promise(resolve => {

        const rightDiv = document.getElementById('rightSide');
        var line = document.createElement('div');
        line.id = idCounter;
        // console.log(dictionaryOfLines[idCounter])
        idCounter += 1
        line.className = 'line';
        rightDiv.appendChild(line);
        line.style.left = fromX + 'px';
        line.style.top = fromY + 'px';
        line.style.backgroundColor = color;
        line.style.position = 'absolute'; // Ensure the line is positioned absolutely for movement.

        // Function to stop line movement
        line.addEventListener('click', function() {
            if (passed.includes(line.id)){
                return;
            }  
            this.style.width = `${this.offsetWidth}px`; // Set the width to its current value
            this.style.transition = 'none'; // Remove any transitions
            packetsToBeDelivered += 1;
            
            if (labelNum != -1)
                arrOfUndelivered.push(labelNum)

            const src = 'mark.png';
            const x = this.style.left;
            const y = this.style.top;
            var img = document.createElement('img');
            img.src = src;
            img.style.position = 'absolute';         // Use absolute positioning
            img.style.left = event.pageX + 'px';               // Set the horizontal position
            img.style.top = event.pageY + 'px';  
            img.style.width = '18px';
            document.getElementById('rightSide').appendChild(img);

            // console.log('Line movement stopped at width:', this.style.width);
            resolve();
        });

        extendLineTo(toX, toY, line, duration); // Changed the function signature for simplicity

        line.addEventListener('transitionend', () => {
            passed.push(line.id);
            if (arrOfUndelivered.includes(labelNum)){
                arrOfUndelivered.splice(arrOfUndelivered.indexOf(labelNum), 1); 
            } 
            callback(line);
            resolve(); // Resolve the promise when the transition ends
        });
    });
}


function enableButton()
{
    if(startButton == null) return;
    startButton.disabled = false;

}   

function extendLineTo(x, y, line, duration) {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const lineStartX = line.getBoundingClientRect().left + scrollX;
    const lineStartY = line.getBoundingClientRect().top + scrollY;

    const deltaX = x - lineStartX;
    const deltaY = y - lineStartY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    line.style.transform = `rotate(${angle}deg)`;
    line.style.width = `${length}px`;
    line.style.transition = `width ${duration}s linear`;
}