// Author: Jasper Lyons 
// Date Last Edited: Tuesday, January 3, 2019

class Entity {
    constructor(_position, _scale, _static, _velocity, _acceleration, _density) {
        //// Member variables
        // Transformations
        this.position = _position;
        this.baseScale = 25; // Flat size of every entity
        this.scale = _scale; // Decimal scale value 
        
        // Physics
        this.baseDensity = _density;
        this.baseGravityStrength = 1.0;
        this.density = _density;
        this.mass = pow((this.baseScale * this.scale) / 2, 2) * PI * this.density;    
        this.velocity = _velocity;
        this.acceleration = _acceleration;
        this.gravityDiameter = (this.baseScale * this.scale) * this.mass / 2;
        this.gravityStrength = 1.0;
        this.static = _static;
        
        // Other
        this.durability = pow((this.baseScale * this.scale) / 2, 2) * PI * this.density;       
        this.history = []; // for trail
        this.maxHistoryLength = 200; // for trail
        this.beingDestroyed = false; // flag for destruction              
        this.trailColour = createVector(random(0, 255), random(0, 255), random(0, 255));        

        /* Update Function - Handles the generic updating of the entity*/
        this.update = function() {
            if (this.static != true) {
                // add previous location to history
                var previous = createVector(this.position.x, this.position.y);
                this.history.push(previous);
                // remove element if history too long
                while (this.history.length > this.maxHistoryLength) {
                    this.history.shift(); // removes first element of array
                }
            }
            // add velocity to position
            this.position.add(this.velocity);
            // add acceleration to velocity
            this.velocity.add(this.acceleration);
        }

        /* Show Function - Handles the display of the entity*/
        this.show = function() {
            // Set stroke and stroke weight
            strokeWeight(1);
            stroke(255);

            // enable fill
            fill(255);

            // Draw planet
            ellipse(this.position.x,
                this.position.y,
                this.baseScale * this.scale,
                this.baseScale * this.scale);

            // Set stroke and stroke weight
            strokeWeight(1);
            stroke(75);

            // disable fill
            noFill();

            // Draw field of gravity
            ellipse(this.position.x,
                this.position.y,
                this.gravityDiameter,
                this.gravityDiameter);

            // Set stroke and stroke weight
            strokeWeight(1);
            stroke(this.trailColour.x, this.trailColour.y, this.trailColour.z);

            // disable fill
            noFill();

            // Draw history/trail
            beginShape();
            for (var i = 0; i < this.history.length; i++) {
                var pos = this.history[i];
                curveVertex(pos.x, pos.y);
            }
            endShape();
        }

        /* Process Gravity Function - Handles the processing and calculation of gravity forces between two entites*/
        this.processGravity = function(_entity1, _distance) {
            // Check if temp entity is close enough to have entity's gravity applied
            if (_distance < (this.gravityDiameter) / 2) {
                var direction = p5.Vector.sub(this.position, _entity1.position).normalize();
                direction.set(p5.Vector.mult(direction, this.mass));
                direction.set(p5.Vector.div(direction, _distance / this.gravityStrength));
                direction.set(p5.Vector.mult(direction, 1 / this.mass));
                _entity1.velocity.add(direction);
            }
        }
        
        /* Process Collision Function - Process the collisiion of an entity with this*/
        this.processCollision = function(_entity1) {
            // Apply damages to entity from the collision
            
        	print(this.durability);
            this.durability = this.durability - (_entity1.mass * p5.Vector.mag(_entity1.velocity));		
            
       		print(this.durability);
            // Destroy entities if durability reaches 0
            if (this.durability <= 0) {
                this.beingDestroyed = true;
            }
        }

        /* Checks the position of this and flags it for destruction if it's off the screen*/
        this.checkBoundary = function() {
            // Flag entity for destruction if it's far from the center    
            var d = 0.0;
            d = p5.Vector.dist(this.position, createVector(width / 2, height / 2));
            if (d > 600) {
                this.beingDestroyed = true;
            }
        }
        
        /* Updates computed/calculated variables*/
        this.updateCalculatedVariables = function() {
            this.mass = pow((this.baseScale * this.scale) / 2, 2) * PI * this.density;        
        	this.durability = pow((this.baseScale * this.scale) / 2, 2) * PI * this.density;
        	this.gravityDiameter = (this.baseScale * this.scale) * this.mass / 2;
        }
    }
}