
/**
 * @class SGNet
 * Main class that contains the GUI functionality of Super-system design and Network Graph
 * @constructor
 * Creates a new instance of SGNet
 * @param holder Name of div
 * @param w Width
 * @param h Height
 */


function SGNet(holder, w,h) {
    /** list for nodes */
    var nodeList = [];
    /** width of drawing area */
    var width = w;
    /** height of drawing area */
    var height = h;
    /** radius of nodes */
    var rad;
    /** paper (Raphael) */
    var r = Raphael(holder, w,h);
    $('#'+holder).bind('contextmenu',function(e){return false;});
    /** @member SGNet
     * Provides rounded rectange created with path
     * @param x Coordinate  of center (x)
     * @param y Coordinate  of center (y)
     * @param w Width
     * @param h Height
     * @param r1 Curve radius at corner 1
     * @param r2 Curve radius at corner 2
     * @param r3 Curve radius at corner 3
     * @param r4 Curve radius at corner 4
     */
    Raphael.fn.roundedRectangle = function (x, y, w, h, r1, r2, r3, r4){
        var array = [];
        array = array.concat(["M",x,r1+y, "Q",x,y, x+r1,y]); //A
        array = array.concat(["L",x+w-r2,y, "Q",x+w,y, x+w,y+r2]); //B
        array = array.concat(["L",x+w,y+h-r3, "Q",x+w,y+h, x+w-r3,y+h]); //C
        array = array.concat(["L",x+r4,y+h, "Q",x,y+h, x,y+h-r4, "Z"]); //D

        return this.path(array);
    };
    // implementation of designButton
    dBrad = Math.min(w,h)/20;
    dBx = dBrad*1.1;
    /** design mode flag */
    var designMod = false;
    /** binding mode flag */
    var bindingMod = false;
    /** flag indicating destination node is detected*/
    var toNodeFound = false;
    /** name of source node */
    var fromNode = '';
    /** name of destination node */
    var toNode = '';
    /** source node object */
    var fromNObj;
    /** destination node object */
    var toNObj;

    /** node element design mode flag */
    var elDesignMod = false;
    /** node element binding mode flag */
    var elBindingMod = false;
    /** node element flag indicating destination node is detected*/
    var elToNodeFound = false;
    /** name of source node (node element) */
    var elFromNode = '';
    /** name of destination node (node element) */
    var elToNode = '';

    /** List for steps (connectors) */
    var stepList =[];
    /** Dictionary for present step*/
    var presentStep = {};
    /** step counter */
    var stepInd = -1;
    /**
     * @method getStepList
     * getter function for stepList Array
     * @return {Array}
     */
    this.getStepList= function(){
        return stepList;
    }
    /**
     * Initiates design mode when clicked
     */
    var designButton = r.circle(dBx,dBx,dBrad).attr({fill:"#aabbcc"});
    toolPath = "M28.537,9.859c-0.473-0.259-1.127-0.252-1.609-0.523c-0.943-0.534-1.186-1.316-1.226-2.475c-2.059-2.215-5.138-4.176-9.424-4.114c-1.162,0.017-2.256-0.035-3.158,0.435c-0.258,0.354-0.004,0.516,0.288,0.599c-0.29,0.138-0.692,0.147-0.626,0.697c2.72-0.383,7.475,0.624,7.116,2.966c-0.08,0.521-0.735,1.076-1.179,1.563c-1.263,1.382-2.599,2.45-3.761,3.667l0.336,0.336c0.742-0.521,1.446-0.785,2.104-0.785c0.707,0,1.121,0.297,1.276,0.433c0.575-0.618,1.166-1.244,1.839-1.853c0.488-0.444,1.047-1.099,1.566-1.178l0.949-0.101c1.156,0.047,1.937,0.29,2.471,1.232c0.27,0.481,0.262,1.139,0.521,1.613c0.175,0.324,0.937,1.218,1.316,1.228c0.294,0.009,0.603-0.199,0.899-0.49l1.033-1.034c0.291-0.294,0.501-0.6,0.492-0.896C29.754,10.801,28.861,10.035,28.537,9.859zM13.021,15.353l-0.741-0.741c-3.139,2.643-6.52,5.738-9.531,8.589c-0.473,0.443-1.452,1.021-1.506,1.539c-0.083,0.781,0.95,1.465,1.506,2c0.556,0.533,1.212,1.602,1.994,1.51c0.509-0.043,1.095-1.029,1.544-1.502c2.255-2.374,4.664-4.976,6.883-7.509c-0.312-0.371-0.498-0.596-0.498-0.596C12.535,18.451,11.779,17.272,13.021,15.353zM20.64,15.643c-0.366-0.318-1.466,0.143-1.777-0.122c-0.311-0.266,0.171-1.259-0.061-1.455c-0.482-0.406-0.77-0.646-0.77-0.646s-0.862-0.829-2.812,0.928L7.44,6.569C7.045,6.173,7.203,4.746,7.203,4.746L3.517,2.646L2.623,3.541l2.1,3.686c0,0,1.428-0.158,1.824,0.237l7.792,7.793c-1.548,1.831-0.895,2.752-0.895,2.752s0.238,0.288,0.646,0.771c0.196,0.23,1.188-0.249,1.455,0.061c0.264,0.312-0.196,1.41,0.12,1.777c2.666,3.064,6.926,7.736,8.125,7.736c0.892,0,2.021-0.724,2.948-1.64c0.925-0.917,1.639-2.055,1.639-2.947C28.377,22.567,23.704,18.309,20.64,15.643z"
    /**
     * Design mode icon
     */
    var designIcon = r.path(toolPath).attr({fill:"#aabbff", stroke:"#000"}).hide();

    dIconW = designIcon.getBBox().width;
    dIconH = designIcon.getBBox().height;
    dIx = dBx - dIconW/2;
    toolPath = Raphael.transformPath(toolPath,"T"+dIx+","+dIx);
    designIcon = r.path(toolPath).attr({fill:"#aabbff", stroke:"#000"});
    dScale = 2*dBrad*.6/dIconW;
    designIcon.scale(dScale,dScale,dBx,dBx);
    designIcon.mouseover(function(){
        if (!designMod) this.animate({fill:"#ddbbaa",'transform':"s "+1},250);
    });
    designIcon.mouseout(function(){
        if (!designMod) {
            this.animate({fill:"#aabbaa",'transform':"s "+dScale},250);
        }
    });

    /**
     * @method
     * evaluates if the object is empty
     * @return {Boolean}
     */
    var isEmpty = function(obj) {
        return Object.keys(obj).length === 0;
    }
    /**
     * @event mousedown
     * triggered if designIcon is clicked
     */
    designIcon.mousedown(function(){
        if (designMod) {
            designMod = false;
            if (!isEmpty(presentStep)){
                stepList.push(presentStep);
                stepInd++;
                presentStep = {};
            }
        }
        else {
            designMod = true;
            this.attr({fill:"#ff9977"});
        }
    });

    /**
     * @method
     * Detects the coordinate range (x and y) if the graph info is provided with coordinates
     * @param nodeData
     * @return {Object} containing minX,maxX, minY and maxY
     */
    var getRangeXY = function(nodeData){
        var xL = [];
        var yL = [];
        for(var t = 0; t < nodeData.length;t++) {
            xL.push(nodeData[t][1]);
            yL.push(nodeData[t][2]);
        }
        return {
            minX:Math.min.apply(null,xL),
            maxX:Math.max.apply(null,xL),
            minY:Math.min.apply(null,yL),
            maxY:Math.max.apply(null,yL)
        };
    };
//    this.addNode = function(node) {
//        nodeList.push(node);
//    }

    /**
     * @method resetNodes
     * Resets nodeList, nodeString and removes nodes and their labels
     */
    this.resetNodes = function() {
       nodeList = [];
        nodeString = '';
        if (nodeSet){
            nodeSet.hide();
            nodeSet.remove();
            textSet.hide();
            textSet.remove();
        }
    }

    /**
     * @method resetArcs
     * Resets arcList and removes arcSet
     */
    this.resetArcs = function(){
        arcList = [];
        if (arcSet) arcSet.hide();
    }

    /**
     * @method convertCoor
     * converts the x or y of coordinate into one suitable for given x and y range
     * @param o Origin
     * @param rXY Object returned b getRangeXY
     * @param isX Flag if X coordinated requested (False means Y requested)
     * @return {Number} new coordinate
     */
    var convertCoor= function(o, rXY,isX ){
        if ((rXY.maxX == rXY.minX && isX) || (rXY.maxY == rXY.minY && !isX)){
            return 0;
        }
        else
            return isX ? (o - rXY.minX)/(rXY.maxX - rXY.minX):(o - rXY.minY)/(rXY.maxY - rXY.minY);
    };

    /**
     * @method generateNodes
     * Generates list of node information using nodeData
     * @param nodeData Object containing all nodes' information
     * @return {Array} List of necessary information (needed for drawing and responding to events)
     */
    var generateNodes = function(nodeData) {
        var nodes = [];
        var rangeXY;
        var rndX, rndY;

        rad = Math.min(Math.min(width, height)/(nodeData.length * 2.5), 20);
        //checking if coordinate data available
        var withCoor = (nodeData[0].length > 2);
        if (withCoor) {
            rangeXY = getRangeXY(nodeData);
    //            alert(rangeXY.minY);
    //            alert(rangeXY.maxY);
            for (var n = 0; n < nodeData.length; n++) {
                nodes.push({ name: nodeData[n][0], color :Raphael.getColor(),
                    x:30 + rad +(width-2 *rad-60)*convertCoor(nodeData[n][1],rangeXY,true),
                    y:30 + rad +(height-2 *rad-60)*convertCoor(nodeData[n][2],rangeXY,false),
                    info: nodeData[n][3]}); //contains metadata

            }

        } else {
            for (var n = 0; n < nodeData.length; n++) {
                rndX = rad + Math.random()*(width-2 *rad);
                rndY = rad + Math.random()*(height-2 *rad);
                if (nodeData.length<5) {
                    for (var m=0; m<n;m++){
                        dst = getDistance(nodes[m].x,nodes[m].y,rndX,rndY);
//                    //DEBUGconsole.log("dist:" + dst + '?' + 6 * rad);
                        if (dst< 3 * rad){
//                        //DEBUGconsole.log("m:",m);
//                        //DEBUGconsole.log('name:', nodeData[n][0]);
                            rndX = rad + Math.random()*(width-2 *rad);
                            rndY = rad + Math.random()*(height-2 *rad);
                            m = -1;
                        }
                    }
                }
                if (n == 0) {
                    rndX = 11*width/16.0;
                    rndY = 12*height/16.0;
                } else if(n==1){
                    rndX = 6*width/16.0;
                    rndY = 4*height/16.0;
                }

                nodes.push({ name: nodeData[n][0], color :Raphael.getColor(),
                    x:rndX,
                    y:rndY,
                    info: nodeData[n][1]});//contains metadata
//                alert(nodeData[n][1]);
//                //DEBUGconsole.log("node:",nodeData[n][0],"x:", rndX, "y:", rndY);
            }
        }

        return nodes;
    };
    /**
     * @method generateArcs
     * Generates list containing arc information using arcData object
     * @param arcData Object containing all arcs' information
     * @return {Array} List of information for each arc needed for drawing and events
     */
    var generateArcs = function(arcData) {
        var arcs = [];
        for (var a = 0; a < arcData.length; a++ ) {
            arcs.push({from:arcData[a][0], to:arcData[a][1] , color: "#00f"});

        }
        return arcs;
    };

    /**
     * @method getNodeXY
     * Yields node's x and y coordinate looking up the node name
     * @param nodeName Node Name
     * @param nList node list containing node info
     * @return {Array} containing node x and y
     */
    var getNodeXY = function (nodeName, nList) {
        for (var nd = 0; nd < nList.length; nd++) {
            if (nList[nd].name == nodeName) return [nList[nd].x, nList[nd].y ]
        }
        return [0, 0];
    };
    /**
     *
     * @constructor
     * Element object that will represent elements of a node
     * @param x X coordinate
     * @param y Y coordinate
     * @param txt Label
     * @param fontSize Font size
     * @param ref Reference
     * @param col Color
     * @param mName Model Name
     * @return Raphael Object (roundedRectangle)
     *
     */
    var Element = function(x,y,txt, fontSize,ref,col, mName){
        this.x = x;
        this.y = y;
        this.name = txt;
        this.mName = mName;
        //DEBUGconsole.log("*****************", mName);
        /** @property eText
         * Element Label object
         * @member Element
         */
        eText = r.text(x,y,txt).attr({fill:'#fff',opacity:1, 'font-size': fontSize, 'font-weight':'bold'});
        //getting width and height with x1.2 scaling
        this.txtH = eText.getBBox().height*1.2;
        this.txtW = eText.getBBox().width*1.2+this.txtH*1.2;
        //var showing location reference
        isRefL = (ref=="L");
        padding = this.txtH*.6;
        shift = Math.pow(-1,isRefL)*padding;
        if (ref) {
            eText.remove();
            if (ref=="R") {
                this.x -= this.txtW/2.4;
                this.y -= this.txtH/2.4;
            }
            if (ref=="L") {
                this.x += this.txtW/2.4;
                this.y += this.txtH/2.4;
            }
            eText = r.text(this.x+shift,this.y,txt).attr({fill:'#fff',opacity:1, 'font-size': fontSize, 'font-weight':'bold'});
        }
        this.x+=shift;
        rct = r.roundedRectangle(this.x-this.txtW/2+isRefL*padding,this.y-this.txtH/2,
            this.txtW-padding, this.txtH,this.txtH/3,0,this.txtH/3,0).attr({fill:"#000"});
        bNodeX = (ref=="R")?this.x-this.txtW/2+this.txtH/2.5:this.x-this.txtW/2+this.txtW-this.txtH/2.5;
        /**
         * @property bindNode
         * Connection point of element
         * @member Element
         */
        var bindNode = r.circle(bNodeX,this.y, this.txtH/3).attr({fill:col});
        bindNode.name = this.name;
        bindNode.mName = this.mName;
        bindNode.clr = col;
        /**
         * @property overrideArc
         * Arc representing the override process (from source to destination)
         * @member bindNode
         *
         */
        bindNode.overrideArc = r.path().attr({stroke:'#94204A', 'stroke-width':3, opacity:0.8,'arrow-end': 'block-medium-long'});
        /**
         * @event drag
         * drag event for bindNode (Element connection point)
         * @param move Move callback function
         * @param up Up callback function
         * @param down callback function
         * @member bindNode
         */
        bindNode.drag(move,up,down);
        /**
         * @method updateConnection
         * @member bindNode
         * @param dx Change in x axis
         * @param dy Change in y axis
         */
        bindNode.updateConnection = function(dx,dy){
            //DEBUGconsole.log("connect to:",dx,dy);
            cx = this.attr('cx');
            cy = this.attr('cy');
            this.toX = cx + dx;
            this.toY = cy + dy;
            //DEBUGconsole.log("toX",this.toX);
            path = ["M",cx,cy,"L",this.toX,this.toY];
            this.overrideArc.attr({path:path});
        }
        /**
         * @method move
         * callback function for drag function
         * @param dx Change in x axis
         * @param dy Change in y axis
         * @member bindNode
         */
        function move(dx,dy){
            if (designMod&elDesignMod) {
                elBindingMod = true;
                this.fromNode = true;
                //DEBUGconsole.log("fromNode", this.fromNode);
                elFromNode = this.mName+'$'+this.name;
                //DEBUGconsole.log("checking from name", fromNode);
                //DEBUGconsole.log(dx,dy);
                if (this.updateConnection) this.updateConnection(dx,dy);
            }
        }
        /**
         * @method up
         * callback function for drag function
         * @member bindNode
         */
        function up(){
            this.highlight();
//            bindingMod = true;
        }
        /**
         * @method down
         * callback function for drag function
         * @member bindNode
         */
        function down(){
            //DEBUGconsole.log("down");

            this.fromNode = false;
            elBindingMod = false;
            //DEBUGconsole.log("toFOund???", elToNodeFound);
            if (!elToNodeFound){
                this.highlightOff();
                if (this.updateConnection) this.updateConnection(0,0);
            }
        }

        /**
         * @event mouseup
         * Mouse up event
         * @member bindNode
         */
        bindNode.mouseup(function(){
            //DEBUGconsole.log('released@', this.name);
            if (elToNodeFound&&elBindingMod) { // making sure its the first element of group
                elToNode = this.mName+'$'+this.name;
                //DEBUGconsole.log("checking to name", toNode);

                //DEBUGconsole.log("########")
                //DEBUGconsole.log("override",elFromNode,'->', elToNode);
                presentStep['pretask'].push({'var':elToNode,'func':'override', 'value':elFromNode});
            }
            elBindingMod = false;
        });
        /**
         * @method highlight
         * Highlights the bindNode
         * @member bindNode
         */
        bindNode.highlight = function(){
            this.attr({fill:'#EEDD82'});
        };
        /**
         * @method highlightOff
         * Turns off highlight for the bindNode
         * @member bindNode
         */
        bindNode.highlightOff = function(){
            this.attr({fill:this.clr});
        };
        /**
         * @event mouseout
         * Mouseout event for bindNode
         * @member bindNode
         */
        bindNode.mouseout(function(){
            if (designMod && elBindingMod) {
                if (this.highlightOff) {
                    this.highlightOff();
                    this.toNode = false;
                    elToNodeFound = false;


                }

            }
//            alert("out");
        });
        /**
         * @event mouseover
         * Mouseover event for bindNode
         * @member bindNode
         *
         */
        bindNode.mouseover(function(){
            if (designMod && elBindingMod) {
                if (this.highlight) {
                    this.highlight();
                    elToNodeFound = true;
                    //DEBUGconsole.log("toNode detected");
                }

            } else {
                this.animate({fill:"#f45"}, 250);
            }
            //DEBUGconsole.log(this.mName+'$'+this.name);

        });


        eText.toFront();
        /**
         * @event mouseover
         * Mouse over event for eText
         * @member eText
         */
        eText.mouseover(function(){
//            alert("OK");
            this.animate({fill:"#FF4500"},200);
        });
        /**
         * @event mouseout
         * Mouse out event for eText
         * @member eText
         */
        eText.mouseout(function(){
            this.animate({fill:"#fff"},1);
        });
        /**
         * @property group
         * group object holding Element, its label and bindNode
         * @member Element
         */
        group = r.set(eText,rct,bindNode, bindNode.overrideArc);
        /**
         * @event mouseover
         * Mouse over event for group
         * @member Element
         */
        group.mouseover(function(){
//            alert("OK");
            eText.animate({fill:"#FF4500"},200);
        });
        /**
         * @event mouseout
         * Mouse out event for group
         * @member Element
         */
        group.mouseout(function(){
            eText.animate({fill:"#fff"},1);
        });
        return group;

    };
    /**
     * @constructor
     * Node Object drawn on holder
     * @param x X coordinate
     * @param y  coordinate
     * @param rad Radius
     * @param model Flag indicating if the node is representing a "model"
     * @param info Node information
     *
     */

    var CNode = function(x,y,rad, model, info){
        oAttr = {fill:Raphael.getColor(), stroke:"#000" };
        cX = x;
        cY = y;
        /** model info */
        this.info = info;
        /** node(model) name */
        this.name = '';
        var name='';
        /** Circle representing the node */
        this.main = r.circle(cX, cY,rad);
        /** elements */
        var el = [];
        /** input elements */
        var elIn = [];
        /** output elements */
        var elOut = [];
        /** arcs to input elements */
        var arcIn = [];
        /** arcs to output elements */
        var arcOut = [];
        /** number of output elements */
        var numElOut = 0;
        /** number of input elements */
        var numElIn = 0;
        /** set Icon */
        var setIcon;
//        uTheta = (Math.PI *.8)/numEl;
//

        if (info){

            $.each(info, function(key, value){
                if (key =='modelName') {
                    name = value;

                }
                if (key=='input files' || key=='parameters'){
                    if (value instanceof Array){
                        for (var k =0; k<value.length; k++ ){
                            numElIn++;
                        }
                    }
                    else numElIn++;
                }
                if (key=='output files'){
                    if (value instanceof Array){
                        for (var k =0; k<value.length; k++ ){
                            numElOut++;
                        }
                    }
                    else numElOut++;
                }
            });
        } else {
            designButton.hide();
            designIcon.hide();
        }
        this.name = name;
        //DEBUGconsole.log(':::###:::',this.name);

        totalElIn = numElIn;
        fontSizeIn = 15 - (numElIn/15.0)*10;
        elInInd = 0;
        totalElOut = numElOut;
        fontSizeOut = 15 - (numElOut/15.0)*10;
        elOutInd = 0;

        //DEBUGconsole.log("totalElOut", numElOut);
        //DEBUGconsole.log("totalElIn", numElIn);
        /**
         * @method getCirIn
         * Yields the x or y coordinate for each input element by calculating angle of each element to y axis
         * @param eInd Element Index
         * @param tElem Total number of Elements
         * @param giveX True if X is requested o/w False
         * @return x or y coordinate (depending on giveX)
         */
        getCirIn = function(eInd, tElem, giveX){
            unitTheta = (Math.PI *.8)/(tElem+1);
            theta = -Math.PI/2 -(Math.PI *.1)- (eInd+1) * unitTheta;
            ciX = 80*Math.cos(theta);
            ciY = 80*Math.sin(theta);
            if (giveX)
                return ciX;
            else
                return ciY;
        }
        /**
         * @method getCirIn
         * Yields the x or y coordinate for each output element by calculating angle of each element to y axis
         * @param eInd Element Index
         * @param tElem Total number of Elements
         * @param giveX True if X is requested o/w False
         * @return x or y coordinate (depending on giveX)
         */
        getCirOut = function(eInd, tElem, giveX){
            unitTheta = (Math.PI *.8)/(tElem+1);
            theta = -Math.PI/2 +(Math.PI *.1)+ (eInd+1) * unitTheta;
            ciX = 80*Math.cos(theta);
            ciY = 80*Math.sin(theta);
            if (giveX)
                return ciX;
            else
                return ciY;
        }


        if (info){
            $.each(info, function(key, value){
                //DEBUGconsole.log("#key:", key);
                //DEBUGconsole.log("#value:", value);
                if (key=='input files'|| key=='parameters'){
                    if (key=='input files') elColor = "#87CEFA"; else elColor= "#FF83FA";
                    if (value instanceof Array){
                        for (var k =0; k<value.length; k++ ){
                            cirX = getCirIn(elInInd,totalElIn,true);
                            cirY = getCirIn(elInInd,totalElIn,false);
//                            theta =Math.PI/2 +(Math.PI *.1)+ elInd * unitTheta;
//                            cirX = 80*Math.cos(theta);
//                            cirY = 80*Math.sin(theta);
                            elIn[elInInd] = new Element(cX+cirX,cY+cirY ,value[k],fontSizeIn,"R",elColor,name).hide();
                            arcIn[elInInd] = r.path("M"+cX+','+cY+"L"+(cX+cirX)+','+(cY+cirY)).attr({opacity:.6}).toBack().hide();
                            elInInd++;
                            //DEBUGconsole.log("numElOut",numElIn);

                        }
                    } else {
//                        theta =Math.PI/2 +(Math.PI *.1)+ elInd * unitTheta;;
//                        cirX = 80*Math.cos(theta);
//                        cirY = 80*Math.sin(theta);
                        cirX = getCirIn(elInInd,totalElIn,true);
                        cirY = getCirIn(elInInd,totalElIn,false);
                        elIn[elInInd] = new Element(cX+cirX,cY+cirY ,value,fontSize,"R",elColor,name).hide();
                        arcIn[elInInd] = r.path("M"+cX+','+cY+"L"+cirX+','+cirY).attr({opacity:.6}).toBack().hide();
                        elInInd++;
                    }
                }
                if (key=='output files'){
                    elColor= "#C0FF3E";
                    if (value instanceof Array){
                        for (var k =0; k<value.length; k++ ){
                            cirX = getCirOut(elOutInd,totalElOut,true);
                            cirY = getCirOut(elOutInd,totalElOut,false);
//                            theta =Math.PI/2 +(Math.PI *.1)+ elInd * unitTheta;
//                            cirX = 80*Math.cos(theta);
//                            cirY = 80*Math.sin(theta);
                            elOut[elOutInd] = new Element(cX+cirX,cY+cirY ,value[k],fontSizeOut,"L",elColor,name).hide();
                            arcOut[elOutInd] = r.path("M"+cX+','+cY+"L"+(cX+cirX)+','+(cY+cirY)).attr({opacity:.6}).toBack().hide();
                            elOutInd++;
                            //DEBUGconsole.log("numElOut",numElOut);

                        }
                    } else {
//                        theta =Math.PI/2 +(Math.PI *.1)+ elInd * unitTheta;;
//                        cirX = 80*Math.cos(theta);
//                        cirY = 80*Math.sin(theta);
                        cirX = getCirOut(elOutInd,totalElOut,true);
                        cirY = getCirOut(elOutInd,totalElOut,false);
                        elOut[elOutInd] = new Element(cX+cirX,cY+cirY ,value,fontSize,"L",elColor,name).hide();
                        arcOut[elOutInd] = r.path("M"+cX+','+cY+"L"+(cX+cirX)+','+(cY+cirY)).attr({opacity:.6}).toBack().hide();
                        elOutInd++;
                    }
                }
            });
        }


//        for (var i =0;i<numEl;i++){
//            theta =-Math.PI/2 -(Math.PI *.1)- i * uTheta;
//            cirX = 80*Math.cos(theta);
//            cirY = 80*Math.sin(theta);
//
//
//
//            //                            if (value instanceof Array){
////                                for (var k =0; k<value.length; k++ ){
////                                    msg += ((k)?"\t- ":"\n\t- ")+ value[k]+"\n";
////                                }
////                            } else {
////                                msg +=value+"\n";
////                            }
//
//
//
//            el[i] = new Element(cX+cirX,cY+cirY ,"selcuk",fontSize);
//            el[i].hide();
//
//        }
        this.main.attr(oAttr);
        if (model) {
            path = "M26.974,16.514l3.765-1.991c-0.074-0.738-0.217-1.454-0.396-2.157l-4.182-0.579c-0.362-0.872-0.84-1.681-1.402-2.423l1.594-3.921c-0.524-0.511-1.09-0.977-1.686-1.406l-3.551,2.229c-0.833-0.438-1.73-0.77-2.672-0.984l-1.283-3.976c-0.364-0.027-0.728-0.056-1.099-0.056s-0.734,0.028-1.099,0.056l-1.271,3.941c-0.967,0.207-1.884,0.543-2.738,0.986L7.458,4.037C6.863,4.466,6.297,4.932,5.773,5.443l1.55,3.812c-0.604,0.775-1.11,1.629-1.49,2.55l-4.05,0.56c-0.178,0.703-0.322,1.418-0.395,2.157l3.635,1.923c0.041,1.013,0.209,1.994,0.506,2.918l-2.742,3.032c0.319,0.661,0.674,1.303,1.085,1.905l4.037-0.867c0.662,0.72,1.416,1.351,2.248,1.873l-0.153,4.131c0.663,0.299,1.352,0.549,2.062,0.749l2.554-3.283C15.073,26.961,15.532,27,16,27c0.507,0,1.003-0.046,1.491-0.113l2.567,3.301c0.711-0.2,1.399-0.45,2.062-0.749l-0.156-4.205c0.793-0.513,1.512-1.127,2.146-1.821l4.142,0.889c0.411-0.602,0.766-1.243,1.085-1.905l-2.831-3.131C26.778,18.391,26.93,17.467,26.974,16.514zM20.717,21.297l-1.785,1.162l-1.098-1.687c-0.571,0.22-1.186,0.353-1.834,0.353c-2.831,0-5.125-2.295-5.125-5.125c0-2.831,2.294-5.125,5.125-5.125c2.83,0,5.125,2.294,5.125,5.125c0,1.414-0.573,2.693-1.499,3.621L20.717,21.297z";
//            path="M25.545,23.328,17.918,15.623,25.534,8.007,27.391,9.864,29.649,1.436,21.222,3.694,23.058,5.53,15.455,13.134,7.942,5.543,9.809,3.696,1.393,1.394,3.608,9.833,5.456,8.005,12.98,15.608,5.465,23.123,3.609,21.268,1.351,29.695,9.779,27.438,7.941,25.6,15.443,18.098,23.057,25.791,21.19,27.638,29.606,29.939,27.393,21.5z"
            setIcon = r.path(path).attr({fill:"#aabbff", stroke:"#000"}).hide();
            iconW = setIcon.getBBox().width;
            setIcon.remove();
//        alert(iconW);
            newX = cX-iconW/2;
            newY = cY-iconW/2;

            newPath = Raphael.transformPath(path,"T"+newX+","+newY);
            setIcon = r.path(newPath).attr({fill:"#aabbff", stroke:"#000"});
            scale = 2*rad*.8/iconW;
            setIcon.scale(scale,scale,cX,cY);
            setIcon.animate({transform: "r" + 150}, 2000);

        }
//        sanity check needed here!!!
        /**
         * @propert group
         * Group holding node, icon and label
         * @member CNode
         *
         */
        var group = r.set();
        group.name = '';


        if (setIcon) {
            group.push(
                this.main,
                setIcon
            );
            group[1].highlight = function(){
                group[0].highlight;
            };
            group[1].highlightOff = function(){
                group[0].highlightOff;
            };

        } else {
            group.push(
                this.main
            );

        }
        group[0].fromNode = false;
        toNodeFound = false;
        /**
         * @method highlight
         * Highlight the outer curve of circle
         * @member CNode
         */
        group[0].highlight = function(){
            this.attr({stroke:'#FF4500'});
        };
        /**
         * @method highlightOff
         * Turn off the highlight for the outer curve of circle
         * @member CNode
         */

        group[0].highlightOff = function(){
            this.attr({stroke:'#000'});
        };
        /**
         * @event mouseover
         * Mouseover event for group
         * @member CNode
         */
        group.mouseover(function(){
            if (designMod && bindingMod) {
                if (this.highlight) {
                    this.highlight();
                    toNodeFound = true;
                    //DEBUGconsole.log("toNode detected");
                }

            }

        });
        /**
         * @event mouseout
         * Mouseout event for group
         * @member CNode
         */
        group.mouseout(function(){
            if (designMod && bindingMod) {
                if (this.highlightOff) {
                    this.highlightOff();
                    this.toNode = false;
                    toNodeFound = false;
                }

            }
//            alert("out");
        });
        /**
         * @method getName
         * Yields the name of the node
         * @member CNode
         * @return name of the node
         */
        function getName(){
            return group.name;
        }

        /**
         * @event mousedown
         * Mouse down eevent for group(CNode)
         * @member CNode
         */
        group.mousedown(function(){
//            alert("down");
            this.showEl();
//            alert(self.info.toString());

        });
        group[0].isShown =false;
        /**
         * @method showEl
         * Shows the elements of the node
         * @member CNode
         */
        group[0].showEl =function(){
            for (var i =0;i<numElIn;i++){
                elIn[i].show();
                arcIn[i].show();
            }
            for (var o =0;o<numElOut;o++){
                elOut[o].show();
                arcOut[o].show();
            }
            this.isShown =true;
        }
        if (group.length>1) {
            group[1].isShown =false;
            group[1].showEl = function(){
                for (var i =0;i<numElIn;i++){
                    elIn[i].show();
                    arcIn[i].show();
                }
                for (var o =0;o<numElOut;o++){
                    elOut[o].show();
                    arcOut[o].show();
                }
                this.isShown =true;
            }
        }
        /**
         * @method hideEl
         * Hides the elements of the node
         * @member CNode
         */
        group[0].hideEl =function(){
            for (var i =0;i<numElIn;i++){
                elIn[i].hide();
                arcIn[i].hide();
            }
            for (var o =0;o<numElOut;o++){
                elOut[o].hide();
                arcOut[o].hide();
            }
            this.isShown =false;

        }
        if (group.length>1) {
            group[1].hideEl = function(){
                for (var i =0;i<numElIn;i++){
                    elIn[i].hide();
                    arcIn[i].hide();
                }
                for (var o =0;o<numElOut;o++){
                    elOut[o].hide();
                    arcOut[o].hide();
                }
                this.isShown =false;

            }

        }
        /**
         * @event mouseup
         * Mouse up event for group(CNode)
         * @member CNode
         */
        group.mouseup(function(){
//            alert("down");
            this.hideEl();
//            alert(self.info.toString());


            if (toNodeFound&&bindingMod) { // making sure its the first element of group
                toNode = getName();
                toNObj = this;
                fromNObj.stepArc.toNObj = this;
                //DEBUGconsole.log("checking to name", toNode);

                //DEBUGconsole.log("########")
                //DEBUGconsole.log("step",fromNode,'->', toNode);
                presentStep = {'from':fromNode,'to':toNode, pretask:[], posttask:[]};
            }
            bindingMod = false;

        });

        /**
         * @event drag
         * Drag event for group
         * @param move Move callback function
         * @param up Up callback function
         * @param down Down callback function
         * @member CNode
         */
        group.drag(move, up, down);
        /**
         * @method move
         * Move call back function for drag function
         * @param dx Change in x axis
         * @param dy Change in y axis
         * @member CNode
         */
        function move(dx,dy){
            this.hideEl();
            if (designMod) {
                bindingMod = true;
                this.fromNode = true;
                //DEBUGconsole.log("fromNode", this.fromNode);

                fromNode = getName();
                fromNObj = this;
                fromNObj.stepArc.fromNObj = this;

                //DEBUGconsole.log("checking from name", fromNode);
                //DEBUGconsole.log(dx,dy);
                if (this.updateConnection) this.updateConnection(dx,dy);
            }
        }
        /**
         * @method up
         * Up call back function for drag function
         * @member CNode
         */
        function up(){
//            toNodeFound = true;

        }
        /**
         * @method down
         * Down call back function for drag function
         * @member CNode
         */
        function down(){
            //DEBUGconsole.log("down");

            this.fromNode = false;
            bindingMod = false;
            if (!toNodeFound){
                this.highlightOff();
                if (this.updateConnection)  this.updateConnection(0,0);
            }


        }

        //DEBUGconsole.log("size:",group.length);
        /**
         * @property stepArc
         * Arc representing the step between two nodes (models)
         * @member CNode
         */
        group[0].stepArc = r.path().attr({stroke:'#FF4500', 'stroke-width':rad/2, opacity:0.8}); //,'arrow-end': 'block-medium-medium'
        group[0].toX = 0;
        group[0].toY = 0;
        /**
         * @event mousedown
         * Mouse down event for stepArc object
         * @member stepArc
         */
        group[0].stepArc.mousedown(function(e){
            if (e.which==3){
                e.preventDefault();
                //DEBUGconsole.log('right clicked arc');
                //DEBUGconsole.log(getName());
                if (!this.fromNObj.isShown){
                    this.fromNObj.showEl();
                    this.toNObj.showEl();
                    elDesignMod = true;

                } else {
                    this.fromNObj.hideEl();
                    this.toNObj.hideEl();
                    elDesignMod = false;



                }


            }
        });
        /**
         * @method updateConnection
         * Updates the path of stepArc object, and redraws
         * @param dx Change in x axis
         * @param dy Change in y axis
         * @member CNode
         */
        group[0].updateConnection =  function(dx,dy){
            //DEBUGconsole.log("connect to:",dx,dy);
            cx = this.attr('cx');
            cy = this.attr('cy');
            this.toX = cx + dx;
            this.toY = cy + dy;
            //DEBUGconsole.log("toX",this.toX);
            path = ["M",cx,cy,"L",this.toX,this.toY];
            this.stepArc.attr({path:path});
        }

        return group;
    };



    /** node string @member SGNet*/
    var nodeString = '';
    /** set of nodes @member SGNet*/
    var nodeSet;
    /** set of node labels @member SGNet*/
    var textSet;
    /** flag indicating if the info is shown @member SGNet*/
    var infoShown = false;

    var tmpRect;
    var tmpTxt;
    /** flag indicating if process is setting a step @member SGNet*/
    var settingStep = false;

    /**
     * @method drawNodes
     * Draws the nodes given in nodes list
     * @member SGNet
     * @param nodes Nodes list
     * @param model Flag indicating if nodes represent models
     */
    this.drawNodes = function(nodes, model) {
//        n = new CNode(100,100,90);
        //if (nodeList.length < 1)
        this.resetNodes();
        nodeList = generateNodes(nodes);
        nodeSet= r.set();
        textSet= r.set();
        //var rad = Math.min(width, height) / (nodeList.length * 4);

        var cX, cY,  oAttr, tmpNode, nodeLabel;
        var nodeGroup;

        var autoXY = function(x,y, rectW,rectH, w, h) {
            var newX, newY;
            if (x+rectW > w) newX = w-rectW;
            if (y+rectH > h) newY = h-rectH;
            if (newX< 0) newX = 20;
            if (newY< 0) newY = 20;

            return [newX, newY];
        };
        for (var i = 0; i < nodeList.length; i++) {
            nodeString += '  ' + nodeList[i].name;
            oAttr = {fill:nodeList[i].color.toString(), stroke:"#000" };
            cX = nodeList[i].x;
            cY = nodeList[i].y;
//            tmpNode = r.circle(cX, cY,rad).attr(oAttr);
            realNode = new CNode(cX, cY,rad,model,nodeList[i].info);

            nodeLabel = r.text(cX,cY-rad*1.5,nodeList[i].name).attr({opacity:.7, 'font-size': rad/0.8});
//            tmpNode.name = nodeList[i].name;
//            tmpNode.info = nodeList[i].info;
//            tmpNode.x = nodeList[i].x;
//            tmpNode.y = nodeList[i].y;
            realNode.name = nodeList[i].name;
            //DEBUGconsole.log("real node Name", realNode.name);
//            CNode.info = nodeList[i].info;
            realNode.x = nodeList[i].x;
            realNode.y = nodeList[i].y;
//            CNode.main.mouseover(function(){
////                alert(this.name);
////                    alert(this.info.date);
//                if (!(infoShown)){
//
//                    var msg='';
//                    $.each(this.info, function(key, value){
//                        //DEBUGconsole.log("key:", key);
//                        //DEBUGconsole.log("value:", value);
//
//                            msg +=key+":";
//                            if (value instanceof Array){
//                                for (var k =0; k<value.length; k++ ){
//                                    msg += ((k)?"\t- ":"\n\t- ")+ value[k]+"\n";
//                                }
//                            } else {
//                                msg +=value+"\n";
//                            }
//
//
//                    });
//                    tmpSet = r.set();
//                    rX = autoXY(this.x, this.y, 200, 250, width, height)[0];
//                    rY = autoXY(this.x, this.y, 200, 250, width, height)[1];
//
//                    tmpRect = r.rect(rX,rY,200,250).attr({ fill:"#aabbee", stroke:"#000", opacity:0.6});
//                    tmpTxt = r.text(rX + 10,rY + 125, msg).attr({'font-size':12,'text-anchor': 'inherit'});
//                    tmpSet.push(tmpRect);
//                    tmpSet.push(tmpTxt);
//    //                tmpRect.click(function(){ this.hide();});
//
//
//                    //DEBUGconsole.log("x:"+this.x);
//                    //DEBUGconsole.log("y:"+this.y);
//                infoShown = true;
//                }
//            });
//
////            CNode.main.mouseout(function(){
////                //if (tmpRect.mo)
////                tmpRect.hide();
////                tmpTxt.hide();
////                infoShown = false;
////            });

//            //setIcon = r.path("M26.974,16.514l3.765-1.991c-0.074-0.738-0.217-1.454-0.396-2.157l-4.182-0.579c-0.362-0.872-0.84-1.681-1.402-2.423l1.594-3.921c-0.524-0.511-1.09-0.977-1.686-1.406l-3.551,2.229c-0.833-0.438-1.73-0.77-2.672-0.984l-1.283-3.976c-0.364-0.027-0.728-0.056-1.099-0.056s-0.734,0.028-1.099,0.056l-1.271,3.941c-0.967,0.207-1.884,0.543-2.738,0.986L7.458,4.037C6.863,4.466,6.297,4.932,5.773,5.443l1.55,3.812c-0.604,0.775-1.11,1.629-1.49,2.55l-4.05,0.56c-0.178,0.703-0.322,1.418-0.395,2.157l3.635,1.923c0.041,1.013,0.209,1.994,0.506,2.918l-2.742,3.032c0.319,0.661,0.674,1.303,1.085,1.905l4.037-0.867c0.662,0.72,1.416,1.351,2.248,1.873l-0.153,4.131c0.663,0.299,1.352,0.549,2.062,0.749l2.554-3.283C15.073,26.961,15.532,27,16,27c0.507,0,1.003-0.046,1.491-0.113l2.567,3.301c0.711-0.2,1.399-0.45,2.062-0.749l-0.156-4.205c0.793-0.513,1.512-1.127,2.146-1.821l4.142,0.889c0.411-0.602,0.766-1.243,1.085-1.905l-2.831-3.131C26.778,18.391,26.93,17.467,26.974,16.514zM20.717,21.297l-1.785,1.162l-1.098-1.687c-0.571,0.22-1.186,0.353-1.834,0.353c-2.831,0-5.125-2.295-5.125-5.125c0-2.831,2.294-5.125,5.125-5.125c2.83,0,5.125,2.294,5.125,5.125c0,1.414-0.573,2.693-1.499,3.621L20.717,21.297z");
//            path = "M26.974,16.514l3.765-1.991c-0.074-0.738-0.217-1.454-0.396-2.157l-4.182-0.579c-0.362-0.872-0.84-1.681-1.402-2.423l1.594-3.921c-0.524-0.511-1.09-0.977-1.686-1.406l-3.551,2.229c-0.833-0.438-1.73-0.77-2.672-0.984l-1.283-3.976c-0.364-0.027-0.728-0.056-1.099-0.056s-0.734,0.028-1.099,0.056l-1.271,3.941c-0.967,0.207-1.884,0.543-2.738,0.986L7.458,4.037C6.863,4.466,6.297,4.932,5.773,5.443l1.55,3.812c-0.604,0.775-1.11,1.629-1.49,2.55l-4.05,0.56c-0.178,0.703-0.322,1.418-0.395,2.157l3.635,1.923c0.041,1.013,0.209,1.994,0.506,2.918l-2.742,3.032c0.319,0.661,0.674,1.303,1.085,1.905l4.037-0.867c0.662,0.72,1.416,1.351,2.248,1.873l-0.153,4.131c0.663,0.299,1.352,0.549,2.062,0.749l2.554-3.283C15.073,26.961,15.532,27,16,27c0.507,0,1.003-0.046,1.491-0.113l2.567,3.301c0.711-0.2,1.399-0.45,2.062-0.749l-0.156-4.205c0.793-0.513,1.512-1.127,2.146-1.821l4.142,0.889c0.411-0.602,0.766-1.243,1.085-1.905l-2.831-3.131C26.778,18.391,26.93,17.467,26.974,16.514zM20.717,21.297l-1.785,1.162l-1.098-1.687c-0.571,0.22-1.186,0.353-1.834,0.353c-2.831,0-5.125-2.295-5.125-5.125c0-2.831,2.294-5.125,5.125-5.125c2.83,0,5.125,2.294,5.125,5.125c0,1.414-0.573,2.693-1.499,3.621L20.717,21.297z";
////            path="M25.545,23.328,17.918,15.623,25.534,8.007,27.391,9.864,29.649,1.436,21.222,3.694,23.058,5.53,15.455,13.134,7.942,5.543,9.809,3.696,1.393,1.394,3.608,9.833,5.456,8.005,12.98,15.608,5.465,23.123,3.609,21.268,1.351,29.695,9.779,27.438,7.941,25.6,15.443,18.098,23.057,25.791,21.19,27.638,29.606,29.939,27.393,21.5z"
//            newX = cX-15;
//            newPath = Raphael.transformPath(path,"T"+newX+","+cY);
//            setIcon = r.path(newPath).attr({fill:"#aabbff", stroke:"#000"});
////            iconW = setIcon.getBBox().width;
////            newX = cX -iconW/2;
//
////            newPath = Raphael.transformPath(newPath,"T"+newX+","+cY)
////            setIcon.animate({path:newPath},100);
////            scale = 'S0,0,0,0.5';
////            setIcon.transform(scale);
////            setIcon.x = cX;
////            setIcon.y = cY;
//            scale = rad*.8/30
//            setIcon.scale(scale,scale,cX,cY);
//            setIcon.mouseover(function(){
//                this.animate({fill:"#f00",'transform':"s1 "+scale*1.3+" s2 "+scale*1.3},250);
//            });
//            setIcon.mouseout(function(){
//                this.animate({fill:"#aabbff",'transform':"s1 "+scale/1.3+" s2 "+scale/1.3},250);
//            });
//            setIcon.mousedown(function() {
//                    settingStep = true;
//                    tmpNode.attr({stroke:"#ffaabb"});
//                    alert(settingStep.toString());
//                }
//
//            );


            nodeSet.push(
                realNode
//                setIcon
//                r.circle(cX, cY,rad).attr(oAttr).click(function(){
//                    alert("Node :");
//                })
            );
            textSet.push(
                nodeLabel
            );


        }
        $('#info').html(nodeString);
        nodeSet.animate({'stroke-width': 2, opacity:1},200);


    };
    /**
     * @method getAngle
     * helper function to get angle (rad) of a line
     * @member SGNet
     * @param xF source X
     * @param yF source Y
     * @param xT destination X
     * @param yT destination Y
     * @return {Number} Angle
     */
    //
    var getAngle = function (xF, yF, xT, yT ) {
        var dx = xT - xF;
        var dy = yT - yF;
        var sign;
        if (dx < 0 && dy < 0) sign = Math.PI;
        else if (dx < 0 && dy > 0) sign = Math.PI;
        else sign = 0;
        return Math.atan(dy/dx) - sign;
    };
    /**
     * @method getDistance
     * helper function to get distance
     * @member SGNet
     * @param xF source X
     * @param yF source Y
     * @param xT destination X
     * @param yT destination Y
     * @return {Number} Distance
     */
    //
    var getDistance = function (xF, yF, xT, yT) {
        var dx = xT - xF;
        var dy = yT - yF;

        return Math.sqrt(dx * dx + dy * dy);
    };

    //drawNodes(nodesJS);

    // testing arcs
    /** set containing arc objects @member SGNet*/
    var arcSet;
    /** arc string @member SGNet*/
    var arcString = '';
    /** list containing arcs info @member SGNet*/
    var arcList=[];
    /**
     * @method drawArcs
     * Draws arcs on div
     * @member SGNet
     * @param nodes Node list
     * @param arcs Arcs List
     */
    this.drawArcs = function(nodes, arcs) {
        this.resetArcs();
        arcList = generateArcs(arcs);
        //var rad = Math.min(width, height)/(nodeList.length *4);
        var angle = 0;
        var devAng = 0;
        var midDist = 0;
        var sign = 1;
        var cXFrom, cYFrom,cXTo, cYTo;
        arcSet = r.set();
        var compAng, tAng;
        for (var i = 0; i < arcList.length; i++) {
            sign = 1;
            arcString += '<br>' + arcList[i].from + '->' + arcList[i].to;
            cXFrom = getNodeXY(arcList[i].from, nodeList)[0];
            cYFrom = getNodeXY(arcList[i].from, nodeList)[1];
            cXTo = getNodeXY(arcList[i].to, nodeList)[0];
            cYTo = getNodeXY(arcList[i].to, nodeList)[1];
            angle = getAngle(cXFrom, cYFrom, cXTo, cYTo);
            compAng = Math.PI/2 - angle;

            midDist = getDistance(cXFrom, cYFrom, cXTo, cYTo)/2;
            devAng = Math.atan(rad/midDist);


            tAng = 180 * angle/ Math.PI;
            //alert("Angle :" +tAng);

            xM = (cXFrom + cXTo) / 2;
            yM = (cYFrom + cYTo) / 2;
            if ((angle == 0) && (cXFrom < cXTo))  {
                sign = -1;
            }
            xMRef = xM - sign* rad * Math.cos(compAng);
            yMRef = yM - sign* rad * Math.sin(compAng);
            revAng = getAngle(cXTo, cYTo, xMRef, yMRef);
            contactX = cXTo + rad * Math.cos(revAng - devAng/8 );
            contactY = cYTo + rad * Math.sin(revAng - devAng/8 );
            tX1 = cXTo +  1.85*rad * Math.cos(revAng + .15);
            tY1 = cYTo +  1.85*rad * Math.sin(revAng + .15);
            tX2 = cXTo +  1.85*rad * Math.cos(revAng - .15);
            tY2 = cYTo +  1.85*rad * Math.sin(revAng - .15);

            //alert("xM" + xM);
            //alert("xMRef" + xMRef);
            //alert("yM"+yM);

            //alert("yMRef"+yMRef);



            oAttr = {stroke:"#3b4449" };
            //r.path([["M",0, 0],["L",200, 200]]).attr(oAttr);
            arcSet.push(
//                r.path(["M",cXFrom, cYFrom,"R",xMRef, yMRef,cXTo, cYTo,"R",contactX, contactY, tX1, tY1,"M",cXTo, cYTo, "R",contactX, contactY, tX2, tY2].join(',')).attr(oAttr).toBack()
                r.path(["M",cXFrom, cYFrom,"R",xMRef, yMRef,contactX, contactY].join(',')).attr(oAttr).toBack()
            );

        }
        arcSet.attr({opacity:.5, 'stroke-width': 3, 'arrow-end': 'block-medium-medium',
            'arrow-start': 'oval-narrow-short'}).toBack();
        $('#info2').html("nodes: " + nodeString +'<br>'+ "arcs:"+arcString);

    };

    //drawArcs(nodesJS, arcsJS);

    // putting roadblocks
    // must be used after drawing arcs, needs global variable arcSet populated before.
    /**
     * @method drawBlocks
     * Draws blocked arcs
     * @member SGNet
     * @param arcs Arcs list
     * @param blocks Blocks list
     */
    this.drawBlocks = function (arcs, blocks) {
        var arcList = generateArcs(arcs);
        for (i = 0; i < blocks.length;i++  ) {
            for (j = 0; j<arcList.length;j++  ) {
                if (blocks[i][0].trim() == arcList[j].from && blocks[i][1].trim() == arcList[j].to) {
                    arcSet[j].attr({stroke:"#f00", 'stroke-width': 2});
                    arcSet[j].animate({stroke:"#f00", 'stroke-width': 4, opacity:1}, 300, 'bounce'); //gradient: '90-#526c7a-#64a0c1',
                }
            }
        }
    };
    /**
     * @method drawFlow
     * Draws arcs with flow
     * @member SGNet
     * @param arcs Arcs list
     * @param flow Flow list
     */
    this.drawFlow = function (arcs, flow) {
        var arcList = generateArcs(arcs);
        for (i = 0; i < flow.length;i++  ) {
            for (j = 0; j<arcList.length;j++  ) {
                if (flow[i][0].trim() == arcList[j].from && flow[i][1].trim() == arcList[j].to) {
                    arcSet[j].attr({stroke:"#2db413", 'stroke-width': 2});
                    arcSet[j].animate({stroke:"#2db413", 'stroke-width': 4, opacity:1}, 300, 'bounce'); //gradient: '90-#526c7a-#64a0c1',
                }
            }
        }
    };
    //drawBlocks(arcsJS, roadBlkJS);







};
