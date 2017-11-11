var APP_ID = "YOUR API ID HERE"; 
var AlexaSkill = require('./AlexaSkill');
var valueSlot;

var DecToBin = function(){
    AlexaSkill.call(this, APP_ID);
};

DecToBin.prototype = Object.create(AlexaSkill.prototype);
DecToBin.prototype.constructor = DecToBin;

DecToBin.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session){};
DecToBin.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session){};

DecToBin.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
    handleNewConvertRequest(response);
};

DecToBin.prototype.intentHandlers = {
    
    "DecimalToBinary" : function (intent, session, response){
        valueSlot = DecToBinary(intent.slots.DecimalValue.value);
		handleNewValueRequest(response);
    },
    "BinaryToDecimal" : function (intent, session, response){
        valueSlot = BinToDec(intent.slots.BinaryValue.value);
		handleNewValueRequest(response);
    },
    "DecimalToHex" : function (intent, session, response){
        valueSlot = DecToHex(intent.slots.myDecimalValue.value);
        handleNewValueRequest(response);
    },
    "BinaryToHex": function(intent, session, response){
        valueSlot = binaryToHex(intent.slots.myBinaryValue.value);
        handleNewValueRequest(response);
    },
    "Tutorial": function(intent, session, response){
        response.tell( " Tell me a binary or decimal value and I will convert it to binary, decimal, or hexidecimal. For example; say Alexa ask"+
                        "binary calculator convert binary to decimal 1 1 0 0 1. Your result is 25.");
    },
    "ListCommands": function(intent, session, response){
        response.tell("Say the following commands followed by your value. "+ 
                      "binary to decimal.  say your binary value. "+
                      "decimal to binary. say your decimal value. "+
                      "decimal to hexidecimal. say your decimal value. "+
                      "binary to hexidecimal. your binary value. "+
                      "Tutorial. I will give you an example of using the skill. ")
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can convert from binary to decimal, decimal to hexidecimal, decimal to binary,  binary to hexidecimal.  say tutorial to get an example."+
                     "Say list commands to hear the different types of commands.");
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye Thank you for using binary calculator";
        response.tell(speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye Thank you for using binary calculator";
        response.tell(speechOutput);
    }
};

function DecToHex(stringValue){

    var passedValue = parseInt(stringValue);
    var returnString = "";

    while (passedValue > 0){
        var divisionResult = Math.floor(passedValue/16);
        var remainder = passedValue%16;
        
        if(remainder > 9){
            switch(remainder)
            {
                case 10:
                    remainder = 'A';
                    break;
                case 11:
                    remainder = 'B';
                    break;
                case 12:
                    remainder = 'C';
                    break;
                case 13:
                    remainder = 'D';
                    break;
                case 14:
                    remainder = 'E';
                    break;
                case 15:
                    remainder = 'F';
                    break;
                default:
                    remainder = 'ERROR'
            }
        }
        returnString += remainder;
        passedValue= divisionResult;
    }

    var splitReturnString = returnString.split("");
    splitReturnString = splitReturnString.reverse();
    passedValue = splitReturnString.join('');
    
    return passedValue; 
}

function BinToDec(stringValue){
    var splitReturnString = stringValue;
    var myArray = splitReturnString.split("");
    myArray = myArray.reverse();
    
    var sum = 0;
    var power = 1;
    myArray.forEach(function(element){
        var currentValue = parseInt(element);
        sum += (power * element);
        power = (power * 2);
    })
    return sum;
}

function DecToBinary(stringValue){
    var passedValue = parseInt(stringValue);
    var returnString = "";

    while (passedValue > 0){
        var divisionResult = Math.floor(passedValue/2);
        var remainder = passedValue%2;
        if(remainder == 0)
        {
            returnString +="0";
        }
        else
        {
            returnString += "1";
        }
        passedValue= divisionResult;
    }
    
    passedValue= returnString;
    var splitReturnString = returnString.split("");
    splitReturnString = splitReturnString.reverse();

    while(splitReturnString.length < 4 || splitReturnString.length %4 != 0){
        splitReturnString.unshift(" 0");
    }

    passedValue = splitReturnString.join(" ");
    return passedValue;
}

function binaryToHex(userBinary){

    var entryBinary = userBinary;

    var length = userBinary.length;

    while(length % 4 != 0)
    {
        entryBinary = "0"+entryBinary;
        length = entryBinary.length;
    }

    var numberOfDigits = length/4;
    var binaryCounter = 0;
    var hexResult = '';

    for(i = 0; i < numberOfDigits; i++)
    {
        var binaryString = entryBinary.slice(binaryCounter, binaryCounter+4);
        var result = BinToDec(binaryString);
        if(result > 9){
            switch(result){
                case 10:
                    result = 'A'
                    break;
                case 11:
                    result = 'B'
                    break;
                case 12:
                    result = 'C'
                    break;
                case 13:
                    result = 'D'
                    break;
                case 14:
                    result = 'E'
                    break;
                case 15:   
                    result = 'F'
                    break;
                default:
                    result = 'ERROR'
            }
        }

        hexResult += (' '+result);
        binaryCounter += 4;
    }
    return hexResult;
}

function handleNewValueRequest(response){
    var speechOutput = "The result is : "+ valueSlot;
    var cardTitle = "The result is : ";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

exports.handler = function (event, context){
    var returnVal = new DecToBin();
    returnVal.execute(event, context);
}