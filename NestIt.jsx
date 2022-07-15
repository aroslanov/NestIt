function createUI(thisObj){
var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "NestIt!", undefined, {resizeable:true}); // create a new window

    myPanel.text = "Nest selected footage"; // set the title of the window
    myPanel.orientation = "column"; // set the orientation to a column
    myPanel.alignChildren = ["center","top"]; 
    myPanel.spacing = 10; // set the spacing between the elements of the window
    myPanel.margins = 16; // set the margins of the window

    statictext1 = myPanel.add("statictext", [10,10,250,30],"Select footage item in project panel"); // add a static text control

    btnNestIt = myPanel.add("button", [10,35,180,55]); // add a button control
    btnNestIt.helpTip = "Hit me!"; // set the tool tip text
    btnNestIt.text = "Nest It!"; // set the button label

btnNestIt.onClick = btnNestItOnClick; // add a click event handler to the button

return myPanel; // return the window
}

var myWindowPanel = createUI(this); // create the UI

//find all instances in all comps of selected footage item and replace them with a newly created comp from the selected footage item
function replaceSelectedFootageItemWithNewComp() {


    app.beginUndoGroup("Nest It!"); //create undo group

    var selectedItem = app.project.selection[0]; //get selected item
    var newComp = app.project.items.addComp(selectedItem.name, selectedItem.width, selectedItem.height, 1, selectedItem.duration, selectedItem.frameRate); //create new comp from selected footage item
    newComp.layers.add(selectedItem); //add selected footage item to new comp
    var allComps = app.project.items; //get all comps in project

    for (var i = 1; i <= allComps.length; i++) { //loop through all comps
        if (allComps[i].name != newComp.name) { //if current comp is not the new comp
            if (allComps[i] instanceof CompItem) { //if current comp is a comp
                var allLayers = allComps[i].layers; //get all layers in current comp
                for (var j = 1; j <= allLayers.length; j++) { //loop through all layers
                    if (allLayers[j] instanceof AVLayer) { //if current layer is an AVLayer
                        if (allLayers[j].source == selectedItem) { //if current layer's source is the selected footage item
                            allLayers[j].replaceSource(newComp, false); //replace current layer with new comp
                        }
                    }
                }
            }
        }
    }


    app.endUndoGroup(); //end undo group

}

function btnNestItOnClick() {

    //if selected object in project is not a footageitem - show message box and end script, if it is: run the function replaceSelectedFootageItemWithNewComp()
    if (app.project.activeItem instanceof FootageItem) { //if selected object in project is a footageitem
        replaceSelectedFootageItemWithNewComp(); 
    } else {
        alert("Please select footage item in project panel"); //show message box
    }

}