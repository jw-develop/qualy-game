# **Game Specification: Formula 1 Prediction Challenge**

## **1\. Project Overview**

This document outlines the specifications for a web-based game where users predict the finishing order of 20 Formula 1 drivers for a race. The user makes their predictions, saves them to a Google Sheet, and can later input the actual race results to have their predictions automatically scored.

The application should be built with vanilla HTML, CSS, and JavaScript to maintain simplicity. It will consist of two main phases: the **Prediction Phase** and the **Results Phase**.

## **2\. Technology Stack**

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)  
* **Frameworks:** None. Use plain, vanilla JS.  
* **APIs:** Google Sheets API (for data export)

## **3\. Data Structure**

The application will need a core data structure for the F1 drivers. This should be an array of objects in JavaScript. Each object represents a driver and should contain the following properties:

* id: A unique identifier (e.g., VER).  
* firstName: Driver's first name.  
* lastName: Driver's last name.  
* team: The name of the driver's team.  
* teamColor: A hex color code for the driver's team.  
* portraitUrl: A URL to a small portrait image of the driver.

**Example Data Structure:**

const drivers \= \[  
    { id: 'VER', firstName: 'Max', lastName: 'Verstappen', team: 'Red Bull Racing', teamColor: '\#0600EF', portraitUrl: '\[https://placehold.co/100x100/0600EF/FFFFFF?text=MV\](https://placehold.co/100x100/0600EF/FFFFFF?text=MV)' },  
    { id: 'PER', firstName: 'Sergio', lastName: 'Perez', team: 'Red Bull Racing', teamColor: '\#0600EF', portraitUrl: '\[https://placehold.co/100x100/0600EF/FFFFFF?text=SP\](https://placehold.co/100x100/0600EF/FFFFFF?text=SP)' },  
    { id: 'LEC', firstName: 'Charles', lastName: 'Leclerc', team: 'Ferrari', teamColor: '\#D40000', portraitUrl: '\[https://placehold.co/100x100/D40000/FFFFFF?text=CL\](https://placehold.co/100x100/D40000/FFFFFF?text=CL)' },  
    { id: 'SAI', firstName: 'Carlos', lastName: 'Sainz', team: 'Ferrari', teamColor: '\#D40000', portraitUrl: '\[https://placehold.co/100x100/D40000/FFFFFF?text=CS\](https://placehold.co/100x100/D40000/FFFFFF?text=CS)' },  
    { id: 'HAM', firstName: 'Lewis', lastName: 'Hamilton', team: 'Mercedes', teamColor: '\#00D2BE', portraitUrl: '\[https://placehold.co/100x100/00D2BE/FFFFFF?text=LH\](https://placehold.co/100x100/00D2BE/FFFFFF?text=LH)' },  
    { id: 'RUS', firstName: 'George', lastName: 'Russell', team: 'Mercedes', teamColor: '\#00D2BE', portraitUrl: '\[https://placehold.co/100x100/00D2BE/FFFFFF?text=GR\](https://placehold.co/100x100/00D2BE/FFFFFF?text=GR)' },  
    { id: 'NOR', firstName: 'Lando', lastName: 'Norris', team: 'McLaren', teamColor: '\#FF8700', portraitUrl: '\[https://placehold.co/100x100/FF8700/FFFFFF?text=LN\](https://placehold.co/100x100/FF8700/FFFFFF?text=LN)' },  
    { id: 'PIA', firstName: 'Oscar', lastName: 'Piastri', team: 'McLaren', teamColor: '\#FF8700', portraitUrl: '\[https://placehold.co/100x100/FF8700/FFFFFF?text=OP\](https://placehold.co/100x100/FF8700/FFFFFF?text=OP)' },  
    { id: 'ALO', firstName: 'Fernando', lastName: 'Alonso', team: 'Aston Martin', teamColor: '\#006F62', portraitUrl: '\[https://placehold.co/100x100/006F62/FFFFFF?text=FA\](https://placehold.co/100x100/006F62/FFFFFF?text=FA)' },  
    { id: 'STR', firstName: 'Lance', lastName: 'Stroll', team: 'Aston Martin', teamColor: '\#006F62', portraitUrl: '\[https://placehold.co/100x100/006F62/FFFFFF?text=LS\](https://placehold.co/100x100/006F62/FFFFFF?text=LS)' },  
    { id: 'GAS', firstName: 'Pierre', lastName: 'Gasly', team: 'Alpine', teamColor: '\#0090FF', portraitUrl: '\[https://placehold.co/100x100/0090FF/FFFFFF?text=PG\](https://placehold.co/100x100/0090FF/FFFFFF?text=PG)' },  
    { id: 'OCO', firstName: 'Esteban', lastName: 'Ocon', team: 'Alpine', teamColor: '\#0090FF', portraitUrl: '\[https://placehold.co/100x100/0090FF/FFFFFF?text=EO\](https://placehold.co/100x100/0090FF/FFFFFF?text=EO)' },  
    { id: 'ALB', firstName: 'Alexander', lastName: 'Albon', team: 'Williams', teamColor: '\#005AFF', portraitUrl: '\[https://placehold.co/100x100/005AFF/FFFFFF?text=AA\](https://placehold.co/100x100/005AFF/FFFFFF?text=AA)' },  
    { id: 'SAR', firstName: 'Logan', lastName: 'Sargeant', team: 'Williams', teamColor: '\#005AFF', portraitUrl: '\[https://placehold.co/100x100/005AFF/FFFFFF?text=LS\](https://placehold.co/100x100/005AFF/FFFFFF?text=LS)' },  
    { id: 'TSU', firstName: 'Yuki', lastName: 'Tsunoda', team: 'RB', teamColor: '\#00293F', portraitUrl: '\[https://placehold.co/100x100/00293F/FFFFFF?text=YT\](https://placehold.co/100x100/00293F/FFFFFF?text=YT)' },  
    { id: 'RIC', firstName: 'Daniel', lastName: 'Ricciardo', team: 'RB', teamColor: '\#00293F', portraitUrl: '\[https://placehold.co/100x100/00293F/FFFFFF?text=DR\](https://placehold.co/100x100/00293F/FFFFFF?text=DR)' },  
    { id: 'BOT', firstName: 'Valtteri', lastName: 'Bottas', team: 'Sauber', teamColor: '\#00E900', portraitUrl: '\[https://placehold.co/100x100/00E900/FFFFFF?text=VB\](https://placehold.co/100x100/00E900/FFFFFF?text=VB)' },  
    { id: 'ZHO', firstName: 'Guanyu', lastName: 'Zhou', team: 'Sauber', teamColor: '\#00E900', portraitUrl: '\[https://placehold.co/100x100/00E900/FFFFFF?text=GZ\](https://placehold.co/100x100/00E900/FFFFFF?text=GZ)' },  
    { id: 'MAG', firstName: 'Kevin', lastName: 'Magnussen', team: 'Haas', teamColor: '\#B6B6B6', portraitUrl: '\[https://placehold.co/100x100/B6B6B6/FFFFFF?text=KM\](https://placehold.co/100x100/B6B6B6/FFFFFF?text=KM)' },  
    { id: 'HUL', firstName: 'Nico', lastName: 'Hulkenberg', team: 'Haas', teamColor: '\#B6B6B6', portraitUrl: '\[https://placehold.co/100x100/B6B6B6/FFFFFF?text=NH\](https://placehold.co/100x100/B6B6B6/FFFFFF?text=NH)' }  
\];

## **4\. Phase 1: Prediction UI & Logic**

### **4.1. Layout**

* The main view should display 20 prediction slots, ordered from 1st to 20th.  
* These slots should be visually grouped into four quartiles:  
  * Group 1: Positions 1-5  
  * Group 2: Positions 6-10  
  * Group 3: Positions 11-15  
  * Group 4: Positions 16-20  
* Each prediction slot consists of a label (e.g., "P1"), a dropdown menu, and an empty container for a driver portrait.

### **4.2. Dropdown Functionality**

* Each dropdown should be populated with the list of drivers from the data structure.  
* Each option in the dropdown should display the driver's full name (firstName \+ lastName).  
* The background color of each \<option\> element should be set to the driver's teamColor.

### **4.3. Interaction Logic**

* When a driver is selected in any dropdown, that driver must be removed as an option from all *other* 19 dropdowns.  
* If a user changes a selection in a dropdown, the previously selected driver should become available again in all other dropdowns.  
* When a driver is selected, their portraitUrl image should be displayed in the container next to the corresponding dropdown.

### **4.4. Saving**

* A "Save Predictions" button should be present.  
* When clicked, this button will trigger the Google Sheets export process (see Section 6). The button should be disabled until all 20 slots have a driver selected.

## **5\. Phase 2: Results & Scoring UI**

This phase requires a separate UI view, which can be a different section on the same page or a separate page entirely. This view is for inputting the actual race results and calculating the user's score.

### **5.1. Layout**

* Display the user's saved predictions in a read-only list from 1-20.  
* Next to each predicted driver, provide a dropdown menu for the user to select the *actual* finishing driver for that position.  
* A prominent display area should show the "Live Total Score", which starts at 0\.

### **5.2. Staged Result Entry**

The result entry dropdowns should be enabled in stages:

1. Once all dropdowns are filled, a "Submit 16-20" button is clicked. The score is updated.
2. Once the "Submit 16-20" button is clicked, a "Submit 11-15" button is enabled and clicked. The score is updated.
3. Once the "Submit 11-15" button is clicked, a "Submit 1-10" button is enabled and clicked. The score is updated.
4. Finally, a "Submit Final Results" button is clicked to finalize the score.


### **5.3. Scoring Logic**

The score is calculated as results are submitted:

* **Exact Match (3 points):** If the user's predicted driver for a position is the same as the actual driver for that position.  
  * *Example:* Predicted P1: Verstappen, Actual P1: Verstappen \-\> \+3 points.  
* **Quartile Match (1 point):** If the user's predicted driver for a position is *not* an exact match, but the actual finishing position of that driver is within the same quartile as the prediction.  
  * Quartile 1: Positions 1-5  
  * Quartile 2: Positions 6-10  
  * Quartile 3: Positions 11-15  
  * Quartile 4: Positions 16-20  
  * *Example:* Predicted P3 for Norris. Actual result for Norris is P5. Both P3 and P5 are in Quartile 1 \-\> \+1 point.  
* **No Match (0 points):** All other scenarios.  
  * *Example:* Predicted P3 for Norris. Actual result for Norris is P6. P3 is in Quartile 1, P6 is in Quartile 2 \-\> 0 points.

The "Live Total Score" must be updated after each stage of results is submitted.

## **6\. Phase 3: Google Sheets Integration**

### **6.1. Authentication**

* The application must implement OAuth 2.0 to allow users to grant permission for the app to create and write to new sheets in their Google Drive.

### **6.2. Prediction Export**

* When the "Save Predictions" button is clicked in Phase 1:  
  1. Authenticate the user with Google.  
  2. Create a new sheet within a specified Google Sheets document. The sheet should be named with the current date/event name (e.g., "Predictions \- YYYY-MM-DD").  
  3. Write the list of 20 predicted drivers to the new sheet, in order, in Column A.

### **6.3. Results & Score Export**

* After the final results are submitted in Phase 2:  
  1. Create another new sheet in the same Google Sheets document (e.g., "Results \- YYYY-MM-DD").  
  2. Populate the sheet with the following columns:  
     * A: Position (1-20)  
     * B: Your Prediction  
     * C: Actual Result  
     * D: Points Awarded  
  3. At the bottom, sum the total points.