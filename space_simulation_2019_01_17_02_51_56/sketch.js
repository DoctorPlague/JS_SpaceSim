// Author: Jasper Lyons 
// Date Last Edited: Tuesday, January 3, 2019

const entityArray = [];
var deltaTime = 0.0;
var clickPos;
var currentPos;
var releasePos;
var sliderDensity;
var sliderGStrength;
var buttonDensity;
var buttonGStrength;
var canvas;
var offScreen;

function setup() {
    canvas = createCanvas(800, 800);
    canvas.mouseOut(function() {
    	offScreen = true;
    });
    canvas.mouseOver(function() {
        offScreen = false; 
    });
    
    // User Interface
    buttonDensity = createButton("Density");   
    sliderDensity = createSlider(1.0, 200.0, 100.0);
    sliderDensity.changed(densitySlider);
    buttonGStrength = createButton("Gravity");
    sliderGStrength = createSlider(100.0, 1000.0, 100.0);
    sliderGStrength.changed(gstrengthSlider);
    
    // create entity
    entityArray.push(
        new Entity(
            createVector(width / 2, height / 2), // Position
            0.55, // Scale
            true, // Static
            createVector(0, 0), // Velocity
            createVector(0, 0), // Acceleration
            0.3 // Density
        ));   
    

    clickPos = createVector();
    currentPos = createVector();
    releasePos = createVector();
    
    
}

function draw() {

    // Clear backbuffer or something
    background(54);

    if (clickPos != currentPos && mouseIsPressed && offScreen == false) {
        // draw a line to show the sling direction
        // Set stroke and stroke weight
        strokeWeight(1);
        stroke(255);

        line(clickPos.x, clickPos.y, currentPos.x, currentPos.y);
    }

    // Draw entities   
    for (let entity of entityArray) {
        entity.show();
    }

    // Update entites      
    for (let entity of entityArray) {
        entity.update();

        // Perform processes that involve checking the entity against other entities
        for (let tempEntity of entityArray) {
            // Check to ignore self
            if (tempEntity == entity) continue;

            // Check if object is static/immovable
            if (tempEntity.static == true) continue;

            // Calculate distance between two entities 
            var distance = 0.0;
            distance = p5.Vector.dist(entity.position, tempEntity.position);

            // Damage entities on collision
            if (distance < ((entity.baseScale * entity.scale) / 2 + (tempEntity.baseScale * tempEntity.scale) / 2)) {
                entity.processCollision(tempEntity);                
            }

            entity.processGravity(tempEntity, distance);

        }

        entity.checkBoundary();


        // Check if entity is flagged for destruction
        if (entity.beingDestroyed == true) {
            entityArray.splice(entityArray.indexOf(entity), 1);
        }
    }
}

function mousePressed() {
    // if mouse is on screen
    if (offScreen == false) {
    	// Set click pos and current pos to mouse coords
   	 	clickPos.set(mouseX, mouseY);
    	currentPos.set(mouseX, mouseY);
    }    
}

function mouseDragged() {
    // if mouse is on screen
    if (offScreen == false) {
    	currentPos.set(mouseX, mouseY);
    }
    //print("dragged");
}

function mouseReleased() {
    // if mouse is on screen
    if (offScreen == false) {
        releasePos.set(mouseX, mouseY);    
        
        if (mouseButton === LEFT) {        
            let direction = p5.Vector.sub(clickPos, releasePos);
            entityArray.push(
                new Entity(
                    createVector(clickPos.x, clickPos.y), // Position
                    0.30, // Scale
                    false, // Static
                    p5.Vector.div(direction, 50), // Velocity
                    createVector(0, 0), // Acceleration
                    0.01 // Density
                ));                   
        }
        if (mouseButton === RIGHT) {
            entityArray.push(
            new Entity(
                createVector(clickPos.x, clickPos.y), // Position
                0.55, // Scale
                true, // Static
                createVector(0, 0), // Velocity
                createVector(0, 0), // Acceleration
                0.3 // Density
            ));     
            
            densitySlider();
            gstrengthSlider();
        }
    }
}

function densitySlider() {
    for (let entity of entityArray) {
        var d = entity.baseDensity;
     	entity.density = sliderDensity.value() / 100 * d;
        entity.updateCalculatedVariables();
    }
}

function gstrengthSlider() {
    for (let entity of entityArray) {
        var gs = entity.baseGravityStrength;
     	entity.gravityStrength = sliderGStrength.value() / 100 * gs;
    }
}


//function mouseClicked() {
//entityArray.push(
//    new Entity(
//        createVector(mouseX, mouseY), // Position
//        0.20, // Scale
//        false, // Static
//        p5.Vector.mult(p5.Vector.random2D(), random(0.5, 1.5)), // Velocity
//        createVector(0, 0), // Acceleration
//        0.001 // Density
//    ));
//}