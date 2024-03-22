// JQuery for the peter pan themed hang man game - Assignment 9

// Set image paths
const $image1 = './images/hangman-1.png';
const $image2 = './images/hangman-2.png';
const $image3 = './images/hangman-3.png';
const $image4 = './images/hangman-4.png';
const $image5 = './images/hangman-5.png';
const $image6 = './images/hangman-6.png';

//                      FETCH REQUEST
// ------------------------------------------------------------------
// fetch JSON words from file
const $fetchFileURL = './json/words.json';

fetch($fetchFileURL)
.then(function( response ){
    if(response.ok){
        return response.json();
    }else{
        console.log("network error: fetch failed");
    }
})
.then(function( incomingData ){
    //const $jsonWords = JSON.parse( incomingData );
    $arrayOfWords = incomingData.map( words => words.word.toUpperCase() );
    //const $jsonHints = JSON.parse( incomingData );
    $arrayOfHints = incomingData.map( hints => hints.hint );

//                          SET UP
// --------------------------------------------------------------------
// generate a random number from 0 to 25 inclusive
let $randomNum = Math.floor((Math.random() * 25) + 1);
let $hint = $arrayOfHints[$randomNum];
let $word = $arrayOfWords[$randomNum].split('');

// use .slice to copy an array to a new variable without pointing to the same location
let $lettersTillWin = $word.slice();
let $guessesRemaining = 6;
let $lettersRemaining = $word.slice();
let $found = false;

// create div for each letter
const $wordLength = $word.length;
for( let i = 0; i < $wordLength; i++ ){
    $("#secret-word").append(`<div id='div${i}'></div>`);
}
$('h3').text(`Hint: ${$hint}`);


//                          CHECK GUESSES
// ------------------------------------------------------------------
// if guess is wrong, change image
$("button").click(function(){
    // boolean flag to keep track whether a guess is correct or not
    $found = false;

    // only check letter if there are still letters to be guessed
    if( $lettersTillWin.length > 0 ){
        $found = checkLetter( $(this).attr('value') );
    }

    $(this).css('background-color', 'grey');
    $(this).prop('disabled', true);
    
    // Check how many wrong guesses remain
    if( $guessesRemaining > 1 && $found == false ){
        $guessesRemaining--
        $('h2').text(`Guesses Remaining: ${$guessesRemaining}`);

        // check what guess were on and adjust image
        if( $guessesRemaining == 1 ){
            $('#aligator-captain').attr('src', $image6);
            $('#aligator-captain').css('top', '20%');
        }
        if( $guessesRemaining == 2 ){
            $('#aligator-captain').attr('src', $image5);
            $('#aligator-captain').css('top', '10%');
        }
        if( $guessesRemaining == 3 ){
            $('#captain').toggleClass('hide');
            $('#aligator').toggleClass('hide');
            $('#aligator-captain').toggleClass('hide');
        }  
        if( $guessesRemaining == 4 ){
            $('#aligator').attr('src', $image3 );
            $('#aligator').css('top', '20%');
        }
        if( $guessesRemaining == 5 ){
            $('#aligator').toggleClass('hide');
        }
    }
    else if( $guessesRemaining == 1 && $found == false) {
        Animation( 'YOU LOSE!', './images/loser.webp' );
    }  
});

//                          RESET EVERYTHING
// -----------------------------------------------------------------
$("#play-again").click(function(){
    // reset everything to play again
    $word = [];
    $hint = '';

    $randomNum = Math.floor((Math.random() * 25) + 1);
    $hint = $arrayOfHints[$randomNum];
    $word = $arrayOfWords[$randomNum].split('');

    // Reset word and hint
    $('#secret-word div').remove();
    const $wordLength = $word.length;
    for( let i = 0; i < $wordLength; i++ ){
        $("#secret-word").append(`<div id='div${i}'></div>`);
    }
    $('h3').text(`Hint: ${$hint}`);

    $lettersTillWin = $word.slice();
    $guessesRemaining = 6;
    $lettersRemaining = $word.slice();
    $found = false;

    $('h2').text(`Guesses Remaining: ${$guessesRemaining}`);
    $('button').prop('disabled', false);
    $('button').css('background-color', '#b15e74');
    $('.pop-up').css('display', 'none');

    // reset images
    $('#captain').removeClass('hide');
    $('#aligator').removeClass('hide');
    $('#aligator-captain').removeClass('hide');

    $('#aligator').addClass('hide');
    $('#aligator-captain').addClass('hide');

    $('#aligator').attr('src', $image2);
    $('#aligator-captain').attr('src', $image4);
    $('#aligator').css('top', '30%');
    $('#aligator-captain').css('top', '1%');
});

//                           FUNCTIONS
// -----------------------------------------------------------------
// Check if guess is correct and add letter to the word
function checkLetter( $letter ){
    $index1 = $.inArray( $letter, $lettersRemaining );
    $index2 = $.inArray( $letter, $lettersTillWin );

    if( $index1 > -1 ){
        $found = true;
        // write the correct guess to the DOM
        let $divindex = 'div'+$index1;
        $(`#${$divindex}`).text( $letter );
        $lettersRemaining.splice( $index1, 1, " " );
        $lettersTillWin.splice( $index2, 1 );
        checkLetter ( $letter );

        if( $lettersTillWin.length == 0 ){
            // animate slow popup
            Animation('YOU WIN!', './images/winner.gif');
        }
    }
    return $found;
}

function Animation( text, imageLink ){
    $('h2').text( text );
    $('.overlay img').attr('src', imageLink );
    $('.pop-up').fadeIn(2000);
}

})
.catch(function( error ){
    console.log( error );
})