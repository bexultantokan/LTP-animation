packetsToBeDelivered = 0;
leftLineX = document.getElementById('leftLine').getBoundingClientRect().right;
leftLineY = document.getElementById('leftLine').getBoundingClientRect().top;
rightLineX = document.getElementById('rightLine').getBoundingClientRect().left;
rightLineY = document.getElementById('rightLine').getBoundingClientRect().top;
passed = new Set();
toBePassed = new Set();
leftLine = document.getElementById('leftLine');
rightLine = document.getElementById('rightLine');



startButton = null;
offset = 20 // between the lines
incline = 10 // Y offset for the right line
blocks = 0
var leftPackets = [], rightPackets = [];

function showMessage(message) {
    document.getElementById('message').textContent = message;
}

// function handleFormSubmit(event) {
//     event.preventDefault(); // Prevent the default form submission

//     var redBlocks = document.getElementById('redBlocks').value; // Get the number value from the input field
//     var greenBlocks = document.getElementById('greenBlocks').value; 
//     showMessage("There are " + redBlocks + " red blocks and " + greenBlocks + " green blocks.");

//     var numOfBlocks = parseInt(redBlocks) + parseInt(greenBlocks);
//     leftLine.style.height = Math.max(numOfBlocks * (offset + 50) , 60) + 'px';
//     rightLine.style.height = Math.max(numOfBlocks * (offset + 50) , 60) + 'px';

//     document.querySelectorAll('.line').forEach(e => e.remove());
//     leftLineY = leftLine.getBoundingClientRect().top;
//     rightLineY = rightLine.getBoundingClientRect().top;
//     // You can add more JavaScript code here to use the number as needed
//     createBlocks(redBlocks, greenBlocks);  
//     enableButton();
//     document.getElementById('container1').style.visibility = "visible";

// }

async function handleFormSubmit2(event) {
    event.preventDefault(); // Prevent the default form submission
    blocks = parseInt(document.getElementById('2blocks').value); 
    showMessage("There are " + blocks + " blocks to transmit.");
    document.getElementById('container1').style.visibility = "visible";
    leftLine.style.height = Math.max(blocks * (offset + 50) , 60) + 'px';
    rightLine.style.height = Math.max(blocks * (offset + 50) , 60) + 'px';

    document.querySelectorAll('.line').forEach(e => e.remove());
    leftLineY = leftLine.getBoundingClientRect().top;
    rightLineY = rightLine.getBoundingClientRect().top;

    packetsToBeDelivered = blocks;
    // for (var i = 0; i < blocks; i++) {
    //     toBePassed.add(i);
    // }
    // do {
    //     console.log("Packets to be delivered: ", packetsToBeDelivered);
    //     total = new Set(toBePassed) 
    //     for (var i = 0; i < total; i++) {
    //         await moveLine('blue', leftLineX, leftLineY, rightLineX, rightLineY + incline, 1, () => {});
    //         packetsToBeDelivered -= 1;
    //     }
    //     await moveLine('yellow', rightLineX, rightLineY, leftLineX , leftLineY + 15, 1, () => {});
    // } 
    // while (toBePassed.length != 0);

    do {
        console.log("Packets to be delivered: ", packetsToBeDelivered);
        total = packetsToBeDelivered
        for (var i = 0; i < total; i++) {
            await moveLine('blue', leftLineX, leftLineY, rightLineX, rightLineY + incline, 1, () => {});
            packetsToBeDelivered -= 1;
        }
        await moveLine('yellow', rightLineX, rightLineY, leftLineX , leftLineY + 15, 1, () => {});
    } 
    while (packetsToBeDelivered != 0);

}


const blocksContainer = document.getElementById('blocksContainer');



// function createBlocks(redNum, greenNum) {
//     blocksContainer.style.position = 'relative'; // Set the container to relative position
//     blocksContainer.innerHTML = ''; // Clear the container first
    
//     for (var i = 0; i < redNum; i++) 
//         createSingleBlock('red');

//     for (var i = 0; i < greenNum; i++) 
//         createSingleBlock('green');
// }

// function createSingleBlock(color)
// {
//     var block = document.createElement('div');
//     block.className = 'block';
//     block.style.backgroundColor = color;
//     blocksContainer.appendChild(block);
// }   


// function movingLastBlock(button) {
//     startButton = button;
//     startButton.disabled = true;

//     const lastBlock = blocksContainer.lastElementChild;
//     const endPosition = blocksContainer.offsetWidth - lastBlock.getBoundingClientRect().left; // End position
//     lastBlock.style.transform = `translateX(${endPosition}px)`; // Apply the transformation
//     lastBlock.addEventListener('transitionend', () => {
//         lastBlock.remove(); // Remove the last block
//         const color = lastBlock.style.backgroundColor;
        
//         // movingLine(color, color == 'red');


//         if(color == 'red')
//         {
//             const backLineColor = 'rgb(255, 217, 0)'
//             for (var i = 0; i < 8; i++) {
//                 if (i == 7)
//                     moveLine('red', leftLineX, leftLineY + i * 4, rightLineX, rightLineY + 10 + i * 4, 1, () => {
//                         moveLine(backLineColor, rightLineX, rightLineY + i * 4 + 10, leftLineX, leftLineY + i * 4 + 40, 1, () => {
//                             enableButton();
//                             leftLineY += i * 8 + 40;
//                             rightLineY += i * 8 + 40;
//                         });
//                     });
//                 else
//                     moveLine('red', leftLineX, leftLineY + i * 4, rightLineX, rightLineY + 10 + i * 4, 1, () => {});
//             }
//             // moveLine('red', leftLineX, leftLineY, rightLineX, rightLineY + 10, 0.5, () => {
//             //     moveLine(backLineColor, rightLineX, rightLineY + 10, leftLineX, leftLineY + 40, 0.5, () => {
//             //         enableButton();
//             //         leftLineY += offset;
//             //         rightLineY += offset;
//             //     });
//             // });
//         }
//         else
//         {
//             for (var i = 0; i < 8; i++) {
//                 if (i == 7)
//                     moveLine('green', leftLineX, leftLineY + i * 4, rightLineX, rightLineY + 10 + i * 4, 1, () => {
//                             enableButton();
//                             leftLineY += offset + 4 * 8;
//                             rightLineY += offset + 4 * 8;
//                     });
//                 else
//                     moveLine('green', leftLineX, leftLineY + i * 4, rightLineX, rightLineY + 10 + i * 4, 1, () => {});
//             }

//             // moveLine('green',  leftLineX, rightLineY,rightLineX, rightLineY + 10, 0.5, () => {
//             //     enableButton();
//             //     leftLineY += offset;
//             //     rightLineY += offset;
//             // });
//         }
//         document.querySelector('.line').addEventListener('click', function() {
//             alert('Object clicked during transition!');
//         });
//     });
// }


// function moveLine(color, fromX, fromY, toX, toY, duration, callback) {
//     const rightDiv = document.getElementById('rightSide');
//     var line = document.createElement('div');
//     line.className = 'line';
//     rightDiv.appendChild(line);

//     var arrow = document.createElement('div');
//     // arrow.className = 'triangle';
//     // line.appendChild(arrow);

    
//     line.style.left = fromX + 'px';
//     line.style.top = fromY + 'px';
//     line.style.backgroundColor = color;

//     extendLineTo(toX, toY, line, arrow, duration)
//     line.addEventListener('transitionend', callback);

// }

function moveLine(color, fromX, fromY, toX, toY, duration, callback) {
    leftLineY += offset;
    rightLineY += offset;
    return new Promise(resolve => {

        const rightDiv = document.getElementById('rightSide');
        var line = document.createElement('div');
        line.className = 'line';
        rightDiv.appendChild(line);

        line.style.left = fromX + 'px';
        line.style.top = fromY + 'px';
        line.style.backgroundColor = color;
        line.style.position = 'absolute'; // Ensure the line is positioned absolutely for movement.

        // Function to stop line movement
        line.addEventListener('click', function() {
            if (this.style.width == '373px')
                return;
            this.style.width = `${this.offsetWidth}px`; // Set the width to its current value
            this.style.transition = 'none'; // Remove any transitions
            packetsToBeDelivered += 1;
            

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

            console.log('Line movement stopped at width:', this.style.width);
            resolve();
        });

        extendLineTo(toX, toY, line, duration); // Changed the function signature for simplicity

        line.addEventListener('transitionend', () => {
            callback();
            resolve(); // Resolve the promise when the transition ends
        });
    });
}


function enableButton()
{
    if(startButton == null) return;
    startButton.disabled = false;

}   
// function extendLineTo(x, y, line, arrow, duration) {
//     const scrollY = window.scrollY;
//     const scrollX = window.scrollX;
//     const lineLeft = line.getBoundingClientRect().left + scrollX;
//     const lineTop = line.getBoundingClientRect().top + scrollY;

//     const deltaX = x - lineLeft;
//     const deltaY = y - lineTop;
//     const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
//     const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

//     // Apply the animation to the line
//     line.style.width = `${length}px`;
//     line.style.transform = `rotate(${angle}deg)`;
//     line.style.transition = `width ${duration}s linear`;
    
//     arrow.style.transform = `rotateX(${angle + 90}deg)`;
//     arrow.style.transform = `translateX(${length}px)`;
//     arrow.style.transition = `transform ${duration}s linear`;
//     console.log(line)
// }
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