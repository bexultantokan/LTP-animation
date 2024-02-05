leftLineX = document.getElementById('leftLine').getBoundingClientRect().left;
        leftLineY = document.getElementById('leftLine').getBoundingClientRect().top;
        rightLineX = document.getElementById('rightLine').getBoundingClientRect().left;
        rightLineY = document.getElementById('rightLine').getBoundingClientRect().top;

        function showMessage(message) {
            document.getElementById('message').textContent = message;
        }

        function handleFormSubmit(event) {
            event.preventDefault(); // Prevent the default form submission

            var redBlocks = document.getElementById('redBlocks').value; // Get the number value from the input field
            var greenBlocks = document.getElementById('greenBlocks').value; 
            showMessage("There are " + redBlocks + " red blocks and " + greenBlocks + " green blocks.");
            // You can add more JavaScript code here to use the number as needed
            createBlocks(redBlocks, greenBlocks);
            document.getElementById('container1').style.visibility = "visible";

        }

        function createBlocks(redNum, greenNum) {
            var blocksContainer = document.getElementById('blocksContainer');
            blocksContainer.style.position = 'relative'; // Set the container to relative position
            blocksContainer.innerHTML = ''; // Clear the container first
            
            for (var i = 0; i < greenNum; i++) {
                var block = document.createElement('div');
                block.className = 'block';
                block.style.backgroundColor = 'green';
                blocksContainer.appendChild(block);
            }
            for (var i = 0; i < redNum; i++) {
                var block = document.createElement('div');
                block.className = 'block';
                block.style.backgroundColor = 'red';
                blocksContainer.appendChild(block);
            }


        }
        
        function movingLastBlock() {
          
          let position = 0; // Start position of the transformation
          const moveInterval = 4; // Pixels to move each frame
          const container = document.getElementById('blocksContainer');
          const lastBlock = container.lastElementChild;
          

          const endPosition = container.offsetWidth - lastBlock.getBoundingClientRect().left; // End position
          function moveBlock() {

            //   if (position < endPosition) {
            //       position += moveInterval; // Increment the position
            //       lastBlock.style.transform = `translateX(${position}px)`; // Apply the transformation
            //       requestAnimationFrame(moveBlock); // Continue the animation
            //   }
            //   else {
            //       const color = lastBlock.style.backgroundColor;
            //       lastBlock.remove(); // Remove the last block
            //       movingLine(color);
            //   }

                lastBlock.style.transform = `translateX(${endPosition}px)`; // Apply the transformation
          }

          moveBlock(); // Start the animation
        }

        function extendLineTo(x, y, line) {
            const lineLeft = line.getBoundingClientRect().left;
            const lineTop = line.getBoundingClientRect().top;


            // Calculate length and angle
            const deltaX = x - lineLeft;
            const deltaY = y - lineTop;
            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            const keyframes = `
                @keyframes extendLine {
                    from {
                        width: 0;
                        transform: rotate(${angle}deg);
                    }
                    to {
                        width: ${length}px;
                        transform: rotate(${angle}deg);
                    }
                }
            `;

            const styleSheet = document.createElement('style');
            // styleSheet.type = 'text/css';
            styleSheet.innerHTML = keyframes;
            document.head.appendChild(styleSheet);
            
            // Apply the animation to the line
            line.style.animation = `extendLine 2s forwards`;
            console.log(line)
        }

   

    // Example: Extend line to position (150, 100)


        function movingLine(color) {
          const rightDiv = document.getElementById('rightSide');
          var line = document.createElement('div');
          line.className = 'line';
          rightDiv.appendChild(line);
          line.style.left = leftLineX + 'px';
          line.style.top = leftLineY + 40 + 'px';
          line.style.backgroundColor = color;
          console.log(line);
          extendLineTo(rightLineX, rightLineY + 70, line)
          leftLineY = leftLineY + 40;
          rightLineY = rightLineY + 40;
        }
