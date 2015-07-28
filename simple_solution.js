var net = require('net');
var fs = require('fs');

var password = "kittens"

var server = net.createServer(function(connection) {

  connection.on('connect', function(arg) {
    console.log(arg)
  })

  connection.on('data', function(data) {
    
    // Grab user input & process it
    var input = data.toString().trim()
    var inputArray = input.split(" "); // splits our data on spaces
    var command = inputArray.splice(0,1)[0]; // grabs the first word/element the user entered, removes it and saves it to the "command" variable

    switch (command) {
      // User wants to leave a new message
      case "leave":
        var newMessage = inputArray.join(" "); // joins all the words in inputArray
        
        // read in and parse our data
        var data = fs.readFileSync('./data.json', 'utf8')
        arrayOfMessages = JSON.parse(data);

        // setting our new ID up to be unique
        var lastIndex = arrayOfMessages.length - 1;
        var newId = parseInt(arrayOfMessages[lastIndex].id) + 1; // sets the new ID to one greater than the last element's ID - prevents duplication of IDs

        // Add user's NEW message to the array of objects we read in & parsed
        var userMessage = { message: newMessage, id: newId };
        arrayOfMessages.push(userMessage);

        // "Deflate" (stringify) the arrayOfMessages object and save it back to the same file!
        var stringifiedMessages = JSON.stringify(arrayOfMessages);
        fs.writeFileSync('./data.json', stringifiedMessages)

        //send a cheerful confirmation!
        connection.write('Message added! Thankz\n');
        break;
      
      // User wants to see all messages
      case "list":
        // read in and parse our data
        var data = fs.readFileSync('./data.json', 'utf8');
        arrayOfMessages = JSON.parse(data);

        // send over dem messages
        connection.write('         All messages\n¸.·´¯`·.´¯`·.¸¸.·´¯`·.¸><(((º>\n\n');
        arrayOfMessages.forEach(function(el) {
          connection.write('  ' + el.id + '. ' + el.message + '\n');
        })
        break;

      // User wants to delete a specific message
      case "delete":
        // grab the ID of message to delete
        var idToDelete = parseInt(inputArray[0]);

        // read in and parse our data
        var data = fs.readFileSync('./data.json', 'utf8');
        arrayOfMessages = JSON.parse(data);
        
        // Iterate through our data, find the record with the id entered by the user, and remove it
        arrayOfMessages.forEach(function(el, index) {
          if (el.id === idToDelete) {
            console.log("Deleting message " + el.id + "!\n")
            arrayOfMessages.splice(index, 1);
            connection.write("Message " + idToDelete + " deleted.\n")
          }
        });

        // Stringificate and save!
        var stringifiedMessages = JSON.stringify(arrayOfMessages)
        fs.writeFileSync('./data.json', stringifiedMessages)

        break;

      //in case the user wants to get rid of all their files
      case "clear":
        // check to see if password is correct
        if (inputArray[0] === password) {
          // Overwrite the json file with an empty array - effectively clears out all messages
          fs.writeFileSync('./data.json', '[]')
          connection.write("All messages cleared! Like your Chrome history.\n")
        } else {
          // Deny access if password is incorrect.
          connection.write("Wrong passwerd, GO AWAY HAX0R\n")
        }
        break;
      
      default:
        connection.write("\n*-------------------------*\n            wat            \n*-------------------------*\nI didn't understand that. Please enter one of the following commands:\n  leave YOUR MESSAGE HERE\n  list\n  delete ID_NUMBER_HERE\n  clear PASSWORD\n*-------------------------*\n\n");
    }
  
  });
});

server.listen(3000, function() {
  console.log("Leestening")
});