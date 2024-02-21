// ==UserScript==
// @name         Nico ExamTopics Print Questions
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Inserts a custom button next to existing buttons and executes a custom print when clicked
// @author       Nico
// @match        https://www.examtopics.com/exams/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=examtopics.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the custom button element
    const customButton = document.createElement('a');
    customButton.href = '#';
    customButton.className = 'btn btn-primary';
    customButton.textContent = 'Print to Console';

    // Find the neighboring buttons with the "paid-access-modal-open" class
    const neighboringButtons = document.querySelectorAll('.paid-access-modal-open');

    // Find the parent element of the neighboring buttons
    const parentElement = neighboringButtons[0].parentNode;

    // Insert the custom button after the neighboring buttons
    parentElement.insertBefore(customButton, neighboringButtons[0].nextSibling);

    // Add an event listener to the custom button to execute the custom function when clicked
    customButton.addEventListener('click', customFunction);


    // Function to execute when the custom button is clicked
    function customFunction() {
        // Your custom function code here
        console.log('Custom function executed!');
        // Select all question cards
        const questionCards = document.querySelectorAll('.questions-container .exam-question-card');
        let finalPrint = '';

        // Loop through each question card
        questionCards.forEach((questionCard, index) => {
            // Extract question number and title
            const questionHeader = questionCard.querySelector('.card-header').innerText.trim();
            const questionNumber = questionHeader.match(/\d+/)[0];
            const questionId = questionCard.querySelector('.card-body').getAttribute('data-id');

            // Initialize a string to store all the details for this question
            let questionDetails = '';

            // Add question
            const question = questionCard.querySelector('.card-text').textContent.trim();
            questionDetails += `${question}\n\n`;

            // Extract and add each choice to the question details string
            const choices = questionCard.querySelectorAll('.question-choices-container .multi-choice-item');
            choices.forEach(choice => {
                const letter = choice.querySelector('.multi-choice-letter').textContent.trim();
                const text = choice.textContent.trim().replace(letter, '').trim();
                // Remove "Most Voted" badge if it exists
                const choiceText = text.split('Most Voted')[0].trim();
                questionDetails += `${letter}: ${choiceText}\n`;
            });

            // Extract correct answer and community vote distribution
            const correctAnswer = questionCard.querySelector('.question-answer .correct-answer').textContent.trim();
            const answerDescription = questionCard.querySelector('.question-answer .answer-description').textContent.trim();
            const voteDistribution = questionCard.querySelectorAll('.vote-distribution-bar .vote-bar[style*="display: flex;"]');
            const distributionDetails = Array.from(voteDistribution).map(bar => {
                const display = bar.textContent.trim();
                const count = bar.getAttribute('data-original-title')
                return `${display} (${count})`;
            }).join(', ');

            // Add correct answer and vote distribution to the question details string
            questionDetails += `\nCorrect Answer: ${correctAnswer}\n`;
            questionDetails += `${answerDescription}\n`;
            questionDetails += `Community Vote Distribution: ${distributionDetails}\n`;

            // Print all details of the question in a single console output line with a blank separation between parts
            finalPrint += `Question ${questionNumber}: ${questionId}\n\n${questionDetails}\n\n`;

        });
        console.log(finalPrint);
    }

})();