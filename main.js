leftLineX = document.getElementById('leftLine').getBoundingClientRect().left;
leftLineY = document.getElementById('leftLine').getBoundingClientRect().top;
rightLineX = document.getElementById('rightLine').getBoundingClientRect().left;
rightLineY = document.getElementById('rightLine').getBoundingClientRect().top;


startButton = null;
offset = 50


function showMessage(message) {
    document.getElementById('message').textContent = message;
}

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    var redBlocks = document.getElementById('redBlocks').value; // Get the number value from the input field
    var greenBlocks = document.getElementById('greenBlocks').value; 
    showMessage("There are " + redBlocks + " red blocks and " + greenBlocks + " green blocks.");

    var numOfBlocks = parseInt(redBlocks) + parseInt(greenBlocks);
    // You can add more JavaScript code here to use the number as needed
    createBlocks(redBlocks, greenBlocks);
    document.getElementById('container1').style.visibility = "visible";

}

const blocksContainer = document.getElementById('blocksContainer');



function createBlocks(redNum, greenNum) {
    blocksContainer.style.position = 'relative'; // Set the container to relative position
    blocksContainer.innerHTML = ''; // Clear the container first
    
    for (var i = 0; i < greenNum; i++) 
       createSingleBlock('green');
    
    for (var i = 0; i < redNum; i++) 
        createSingleBlock('red');
}

function createSingleBlock(color)
{
    var block = document.createElement('div');
    block.className = 'block';
    block.style.backgroundColor = color;
    blocksContainer.appendChild(block);
}   


function movingLastBlock(button) {
    startButton = button;
    startButton.disabled = true;

    const lastBlock = blocksContainer.lastElementChild;
    const endPosition = blocksContainer.offsetWidth - lastBlock.getBoundingClientRect().left; // End position
    lastBlock.style.transform = `translateX(${endPosition}px)`; // Apply the transformation
    lastBlock.addEventListener('transitionend', () => {
        lastBlock.remove(); // Remove the last block
        const color = lastBlock.style.backgroundColor;
        
        // movingLine(color, color == 'red');

        leftLineY += offset;
        rightLineY += offset;

        if(color == 'red')
        {
            const backLineColor = 'rgb(255, 217, 0)'
            moveLine('red', leftLineX, leftLineY, rightLineX, rightLineY, 1, () => {
                moveLine(backLineColor, rightLineX, leftLineY, leftLineX, leftLineY + 40, 1, () => {
                    enableButton();
                });
            });
        }
        else
        {
            moveLine('green',  leftLineX, rightLineY,rightLineX, rightLineY, 1, () => {
                enableButton();
            });
        }
    });
}


function moveLine(color, fromX, fromY, toX, toY, duration, callback) {
    const rightDiv = document.getElementById('rightSide');
    var line = document.createElement('div');
    line.className = 'line';
    rightDiv.appendChild(line);

    var arrow = document.createElement('div');
    arrow.className = 'triangle';
    line.appendChild(arrow);


    line.style.left = fromX + 'px';
    line.style.top = fromY + 'px';
    line.style.backgroundColor = color;

    extendLineTo(toX, toY, line, arrow, duration)
    line.addEventListener('transitionend', callback);

}


function enableButton()
{
    if(startButton == null) return;
    startButton.disabled = false;

}
function extendLineTo(x, y, line, arrow, duration) {
    const lineLeft = line.getBoundingClientRect().left;
    const lineTop = line.getBoundingClientRect().top;

    const deltaX = x - lineLeft;
    const deltaY = y - lineTop;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Apply the animation to the line
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transition = `width ${duration}s linear`;
    
    arrow.style.transform = `rotateX(${angle + 90}deg)`;
    arrow.style.transform = `translateX(${length}px)`;
    arrow.style.transition = `transform ${duration}s linear`;
    console.log(line)
}

