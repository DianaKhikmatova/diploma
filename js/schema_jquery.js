const blockWidth = 180;
const blockMargin = 15;

let objectsArray = [];
function GraphicalObject(renderedObject, ancestor, level, position, type, relations) {
    this.renderedObject = renderedObject;
    this.ancestor = ancestor;
    this.inheritors = [];
    this.level = level;
    this.position = position;
    this.type = type;
    this.relations = relations;
    this.selected = false;
    this.idName = 'type-' +  level + '-' + position;
    this.pushInheritor = function(inheritor) {
        return this.inheritors.push(inheritor);
    };
    this.getInheritorsLength = function() {
        return this.inheritors.length;
    };
    this.decreaseLevel = function() {
        return this.level--;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    
    //document.getElementById("create-simple-schema-btn").addEventListener("click", createSimpleSchema(), false);
    $('body').on('dblclick', '[data-editable]', function(){
        
        let $el = $(this);
                    
        let $input = $('<input/>').val( $el.text() );
        $input.css('width', '95%');
        $input.css('margin-top', '10px');
        $el.replaceWith( $input );
        
        let save = function(){
            let $p = $('<p data-editable />').text( $input.val() );
            $p.addClass('simple-text');
            $input.replaceWith( $p );
        };
        
        $input.one('blur', save).focus();
        
        });


        let blockQuantity = 0;
        
        let selectedItem = "";
        let selection = false;

    $('#add-item').click(function(){
        createSimpleSchema();
    });

    $('#remove-item').click(function(){
        removeItem()
    });

    function removeItem() {
        let item = $('#' + selectedItem);
        let itemAncestor = null;
        let itemObject = null;
        for (let i = 0; i < objectsArray.length; i++) {
            if (objectsArray[i].renderedObject.attr('id') === selectedItem) {
                itemObject = objectsArray[i];
                if (objectsArray[i].ancestor !== null) {
                    itemAncestor = objectsArray[i].ancestor;
                    let itemAncestorId = itemAncestor.attr('id');
                    for (let i = 0; i < objectsArray.length; i++) {
                        if (objectsArray[i].renderedObject.attr('id') === itemAncestorId) {
                            itemAncestor = objectsArray[i];
                        }
                    }
                }
            }
        }
        if (itemAncestor !== null && item.inheritors !== undefined) {
            for(let i = 0; i < itemAncestor.inheritors.length; i++) {
                if (itemAncestor.inheritors[i].renderedObject.attr('id') === itemObject.renderedObject.attr('id')) {
                    itemAncestor.inheritors.pop(i);
                }
            }
        }
        // for (let i = 0; i < itemObject.inheritors.length; i++) {
        //     console.log(itemObject.inheritors[i].level);
        //     itemObject.inheritors[i].decreaseLevel();
        //     console.log(itemObject.inheritors[i].level);
        //     itemObject.inheritors[i].renderedObject.css('top', '' + itemObject.inheritors[i].level * 100 + 'px');
        // }
        for (let i = 0; i < objectsArray.length; i++) {
            if (objectsArray[i] === itemObject) {
                objectsArray.splice(i, 1);
            }
        }
        item.remove();
        selectedItem = "";
    }

    function createSimpleSchema() {

        let block = $("<div></div>");
        block.addClass('simple-block');
        block.addClass('draggable');
        block.attr('id', "block" + (blockQuantity + 1));
        block.click(function (event) {
            if (event !== null) {
                let item = event.target;
                for (let i = 0; i < objectsArray.length; i++) {
                    if (objectsArray[i].renderedObject.attr('id') === item.id && objectsArray[i].selected === false) {
                        objectsArray[i].renderedObject.removeClass('default-block');
                        objectsArray[i].renderedObject.addClass('selected-block');
                        objectsArray[i].selected = true;
                        selectedItem = item.id;
                    } else {
                        objectsArray[i].renderedObject.removeClass('selected-block');
                        objectsArray[i].renderedObject.addClass('default-block');
                        if (objectsArray[i].renderedObject.attr('id') === item.id && objectsArray[i].selected === true) {
                            selectedItem = "";
                            console.log(selectedItem);
                        } 
                        objectsArray[i].selected = false;
                    }
                }
            }
        })

        let mainText = $("<p data-editable></p>");
        mainText.text("Text-" + blockQuantity);
        mainText.addClass('simple-text');
        block.append(mainText);
        let blockObject = null;
        let ancestorObject = null;
        if (selectedItem === "") {
            blockObject = new GraphicalObject(block, null, 0, 1, 'block', 'none');
            let itemsWithCurrentLevel = findByLevel(blockObject.level, objectsArray);
            changePositionOfSiblings(blockObject, objectsArray, itemsWithCurrentLevel.length + 1);
        } else {
            let ancestor = $("#" + selectedItem);
            for (let i = 0; i < objectsArray.length; i++) {
                if (objectsArray[i].renderedObject.attr('id') === selectedItem) {
                    ancestorObject = objectsArray[i];
                }
            }
            blockObject = new GraphicalObject(block, ancestor, ancestorObject.level + 1, 1, 'block', 'none');
            blockObject.ancestor.children(".simple-text").text(blockObject.ancestor.children().text() + " Parent of " + blockObject.renderedObject.attr('id'));   
            ancestorObject.pushInheritor(blockObject); 
            let itemsWithCurrentLevel = findByLevel(blockObject.level, objectsArray);
            changePositionOfSiblings(blockObject, objectsArray, itemsWithCurrentLevel.length + 1);
        }

        block.css('top', blockObject.level * 100 + 'px');
        objectsArray.push(blockObject);
        $("#canvas").append(block);
        if (selectedItem !== "") {

            let blockPosition = block.position();
            let ancestorPosition = ancestorObject.renderedObject.position();
            let blockHeight = block.innerHeight();
            let ancestorHeight = ancestorObject.renderedObject.innerHeight();

            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            let svgNS = svg.namespaceURI;
            let lineColor = block.css('border-color');

            // let rect = document.createElementNS(svgNS,'rect');
            // rect.setAttribute('x', 0);
            // rect.setAttribute('y', 0);
            // rect.setAttribute('width', 20);
            // rect.setAttribute('height', 20);
            // rect.setAttribute('fill', lineColor);
            // let figure = rect;
            // svg.setAttribute('height', figure.getAttribute('height'));
            // svg.setAttribute('width', figure.getAttribute('width'));

            // svg.style.top = blockPosition.top;
            // svg.style.left = blockPosition.left + getWidth(block) / 2 + figure.getAttribute('width') / 2;
            // svg.appendChild(rect);

            // document.getElementById('canvas').appendChild(svg);

            let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            let line = document.createElementNS(svgNS,'line');
            // line.setAttribute('x1', ancestorPosition.left + getWidth(block) / 2);
            // line.setAttribute('y1',  ancestorPosition.top + ancestorHeight);
            // line.setAttribute('x2', blockPosition.left + getWidth(block) / 2 + figure.getAttribute('width') / 2);
            // line.setAttribute('y2', blockPosition.top);

            let lineLeft = ancestorPosition.left + getWidth(block) / 2 + parseInt(block.css('margin-top').slice(0, -2) * 2);
            let lineTop = ancestorPosition.top + ancestorHeight + parseInt(block.css('margin-top').slice(0, -2));
            line.setAttribute('x1', 0);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', blockPosition.left - lineLeft / 2 - getWidth(block) / 2 - blockMargin * 2 - 4);
            line.setAttribute('y2', 100 - ancestorHeight);
            line.setAttribute('stroke', lineColor);
            line.setAttribute('srtoke-width', 3);
            figure = line;
            svg1.setAttribute('height', Math.abs(figure.getAttribute('y2') - figure.getAttribute('y1')));
            svg1.setAttribute('width', Math.abs(figure.getAttribute('x2') - figure.getAttribute('x1') + 2));
            
            svg1.style.top = lineTop;
            svg1.style.left = lineLeft;
            svg1.appendChild(line);


            document.getElementById('canvas').appendChild(svg1);
        }
        blockQuantity += 1;
    }
});

function getWidth(object) {
    let widthInString = object.css('width');
    return parseInt(widthInString.slice(0, -2));
}

function findByLevel(level, objectsArray) {
    let objectsWithCurrentLevelArray = [];
    for (let i = 0; i < objectsArray.length; i++) {
        if (objectsArray[i].level === level) {
            objectsWithCurrentLevelArray.push(objectsArray[i]);
        }
    }
    return objectsWithCurrentLevelArray;
}

function changePositionOfSiblings(object, objectsArray, itemsQuantity) {
    let canvasWidth = getWidth($("#canvas"));
    let totalItemsWidth = blockWidth * itemsQuantity + blockMargin * (itemsQuantity - 1);
    let shift = canvasWidth / 2 - totalItemsWidth / 2;
    if (itemsQuantity === 1) {
        object.renderedObject.css('left', shift + 'px');
    } else {
        shift -= blockMargin;
    for (let i = 0; i < objectsArray.length; i++) {
        if (objectsArray[i].level === object.level) {
            objectsArray[i].renderedObject.css('left', shift + 'px');
            shift += blockWidth + blockMargin * 2;
        }
        object.renderedObject.css('left', shift  + 'px');  
    }
}
}