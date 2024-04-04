leftLineX = document.getElementById('leftLine').getBoundingClientRect().right;
leftLineY = document.getElementById('leftLine').getBoundingClientRect().top;
rightLineX = document.getElementById('rightLine').getBoundingClientRect().left;
rightLineY = document.getElementById('rightLine').getBoundingClientRect().top;

leftLine = document.getElementById('leftLine');
rightLine = document.getElementById('rightLine');



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
    leftLine.style.height = Math.max(numOfBlocks * offset, 60) + 'px';
    rightLine.style.height = Math.max(numOfBlocks * offset, 60) + 'px';

    document.querySelectorAll('.line').forEach(e => e.remove());
    leftLineY = leftLine.getBoundingClientRect().top;
    rightLineY = rightLine.getBoundingClientRect().top;
    // You can add more JavaScript code here to use the number as needed
    createBlocks(redBlocks, greenBlocks);
    enableButton();
    document.getElementById('container1').style.visibility = "visible";

}

const blocksContainer = document.getElementById('blocksContainer');



function createBlocks(redNum, greenNum) {
    blocksContainer.style.position = 'relative'; // Set the container to relative position
    blocksContainer.innerHTML = ''; // Clear the container first
    
    for (var i = 0; i < redNum; i++) 
        createSingleBlock('red');

    for (var i = 0; i < greenNum; i++) 
        createSingleBlock('green');
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


        if(color == 'red')
        {
            const backLineColor = 'rgb(255, 217, 0)'
            moveLine('red', leftLineX, leftLineY, rightLineX, rightLineY, 0.5, () => {
                moveLine(backLineColor, rightLineX, rightLineY, leftLineX, leftLineY + 40, 0.5, () => {
                    enableButton();
                    leftLineY += offset;
                    rightLineY += offset;
                });
            });
        }
        else
        {
            moveLine('green',  leftLineX, rightLineY,rightLineX, rightLineY, 0.5, () => {
                enableButton();
                leftLineY += offset;
                rightLineY += offset;
            });
        }
        document.querySelector('.line').addEventListener('click', function() {
            alert('Object clicked during transition!');
        });
    });
}


function moveLine(color, fromX, fromY, toX, toY, duration, callback) {
    const rightDiv = document.getElementById('rightSide');
    var line = document.createElement('div');
    line.className = 'line';
    rightDiv.appendChild(line);

    var arrow = document.createElement('div');
    // arrow.className = 'triangle';
    // line.appendChild(arrow);

    
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
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const lineLeft = line.getBoundingClientRect().left + scrollX;
    const lineTop = line.getBoundingClientRect().top + scrollY;

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