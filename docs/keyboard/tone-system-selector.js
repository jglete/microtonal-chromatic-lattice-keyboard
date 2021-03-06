(function setKeyboardLayoutControl() {

    function setTet(system) {
        let currentRow = 0;
        let currentX = system.startingMidiNote;
        let currentFirst = currentX;
        const names = system.names;
        const bigRowIncrement = system.bigRowIncrement;
        const smallRowIncrement = system.smallRowIncrement;
        const rightIncrement = system.rightIncrement;
        keyboardHandler.rows.labelKeys(function (cell) {
            if (currentRow != cell.row) {
                currentRow = cell.row;
                let increment = (keyboardHandler.rows[cell.row].length % 2) == 0 ? bigRowIncrement : smallRowIncrement;
                currentX = increment + currentFirst;
                currentFirst = currentX;
            } //if
            cell.note = currentX;
            cell.tone = currentX * 12 / system.names.length;
            const result = names[currentX % names.length];
            currentX += rightIncrement;
            return result;
        });
    } //setTet

    elements.radioTet.radio12et.onclick = function (event) {
        if (event.target.checked)
            setTet(notes.tet12);
        elements.legend19et.style.visibility = "hidden";
        elements.legend31et.style.visibility = "hidden";
    };
    elements.radioTet.radio12etJanko.onclick = function (event) {
        if (event.target.checked)
            setTet(notes.tet12Janko);
        elements.legend19et.style.visibility = "hidden";
        elements.legend31et.style.visibility = "hidden";
    };
    elements.radioTet.radio19et.onclick = function (event) {
        if (event.target.checked)
            setTet(notes.tet19);
        elements.legend19et.style.visibility = "visible";
        elements.legend31et.style.visibility = "hidden";
    };
    elements.radioTet.radio31et.onclick = function (event) {
        if (event.target.checked)
            setTet(notes.tet31);
        elements.legend19et.style.visibility = "hidden";
        elements.legend31et.style.visibility = "visible";
    };
    elements.radioTet.radio31et.checked = true;
    setTet(notes.tet31);
    elements.legend31et.style.visibility = "visible";

    (function setHardwareKeyboardControl() {
        const keyDictionary = {};
        const keyHandler = function(event, doActivate) {
            if (event.ctrlKey) return true;
            if (event.altKey) return true;
            if (event.metaKey) return true;
            const keyCode = event.keyCode || event.which;
            if (event.shiftKey && keyCode != 16) return; //16 is shift
            const cell = keyDictionary[keyCode]; 
            if (!cell) return true;
            cell.activate(cell, doActivate);
            event.preventDefault();
            return false;
        }; //keyHandler
        window.onkeydown = function(event) { keyHandler(event, true); }
        window.onkeyup = function(event) { keyHandler(event, false); }
        const startingRow = definitionSet.hardwareKeyboardControl.startingRow;
        let rowIndex = startingRow;
        let xShift = 0;
        for (row of hardwareKeyboard.rows) {
            let xIndex = definitionSet.hardwareKeyboardControl.keyShift;
            if (keyboardHandler.rows[rowIndex].length % 2 > 0)
                xShift++;
                xIndex -= rowIndex - xShift;
            for (key of row) { 
                const cell = keyboardHandler.rows[rowIndex][xIndex];
                keyDictionary[key] = cell;
                cell.currentColor = definitionSet.highlightHardwareKey;
                cell.rectangle.style.fill = cell.currentColor;
                ++xIndex;
            } //loop xIndex
            ++rowIndex
        } //loop rowIndex
        for (substitutionIndex in hardwareKeyboard.substitutions) {
            const substitution = hardwareKeyboard.substitutions[substitutionIndex];
            keyDictionary[substitutionIndex] = keyDictionary[substitution];
        } //loop hardwareKeyboard.substitutions
    })();

})();
