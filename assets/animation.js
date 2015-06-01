(function () {
    'use strict';

    NodeList.prototype.forEach = Array.prototype.forEach;

    var numOfJellyBalls = 15;
    var animationTimeScale = 2;
    var lettersAnimationDuration = 0.3;
    var movementAnimationDuration = 0.8;
    var frame =  document.getElementById("frame");
    var frameTop = document.getElementById("frameTop");
    var topLetters = document.getElementById("topLogo").querySelectorAll("path");
    var hiddenLetters = document.getElementById("hiddenLetters").querySelectorAll("path");
    hiddenLetters = document.getElementById("hiddenLetters").querySelectorAll("path");
    var hiddenLettersTop = document.getElementById("hiddenLettersTop").querySelectorAll("path");
    var boxPath = document.getElementById("boxLine1");
    var boxPath2 = document.getElementById("boxLine2");
    var boxPath3 = document.getElementById("boxLine3");
    var boxPath4 = document.getElementById("boxLine4");
    var pauseAnimBtn = document.getElementById("pauseAnim");
    var playAnimBtn = document.getElementById("playAnim");
    document.getElementById("innerLogo").setAttribute("class","hideElements");

    var jelliesLettersOrder = [
        [
            ['-135','-119',1,0],
            ['68','60',18,0],
            ['-93','2',10,0],
            ['-9','-59',7,1],
            ['-135','60',13,0],
            ['-135','-58',4,0],
            ['144','61',20,0],
            ['-135','2',9,0],
            ['-9','60',16,0],
            ['-93','61',14,0],
            ['-51','-118',3,0],
            ['-51','-59',6,0],
            ['68','60',18,0],
            ['-51','1',11,0],
            ['33','-55',8,0]
        ],
        [
            ['-51','61',15,0],
            ['-93','-116',2,0],
            ['33','61',17,0],
            ['-8','2',12,0],
            ['-51','-118',3,0],
            ['33','-55',8,0],
            ['-93','-57',5,1],
            ['107','61',19,0],
            ['-93','61',14,0],
            ['-93','2',10,0],
            ['-135','-119',1,0],
            ['33','-55',8,0]
        ],
        [
            ['-51','-118',3,0],
            ['68','60',18,0],
            ['-93','61',14,0],
            ['-93','2',10,0],
            ['-93','2',10,1]

        ],
        [
            ['-135','-119',1,0],
            ['33','-55',8,0]
        ]
    ];

    var jelliesEnterColors = [
        '#ffffff',
        '#ffffff',
        '#ffffff',
        '#ffffff'
    ];

    var jelliesEnterPositions = [
        {x:0,y:-60,scaleX:0.6,scaleY:0.6}  ,
        {x:30,y:-30,scaleX:0.6,scaleY:0.6} ,
        {x:0,y:0,scaleX:0.6,scaleY:0.6}    ,
        {x:-30,y:-30,scaleX:0.6,scaleY:0.6}
    ];

    var jelliesEnterAnimationPositions = [
        [{x:-34, y:4},{x:68, y:-30},{x:-155,y:-152}],
        [{x:-34, y:-64},{x:0, y:38},{x:-155,y:99}],
        [{x:34, y:-64},{x:-68, y:-30},{x:165,y:99}],
        [{x:34, y:4},{x:0, y:-98},{x:165,y:-152}]
    ];

    var ballsStartSizes = [18,23,18,14];
    var jellies = [
    ];

    var startJellyBalls = document.getElementById('startAnimation');
    for (var i = 0; i < jelliesLettersOrder.length ; i++){
        var jellyCircels = [];
        for (var j = 0; j < 4; j++) {
            var jellyBall = makeSVG('circle',{cx:250,cy:250,r:ballsStartSizes[j],fill:'#ffffff'});
            startJellyBalls.insertBefore(jellyBall,startJellyBalls.firstChild);
            jellyCircels.push(jellyBall);
        }

        var newJelly = {
            balls : jellyCircels,
            travelLetterIndex : 0,
            enterAnimationIndex : 0,
            travelJellyLetters : jelliesLettersOrder[i],
            enterColor : jelliesEnterColors[i],
            enterPosition : jelliesEnterPositions[i],
            enterAnimationPosition : jelliesEnterAnimationPositions[i]

        };
        TweenMax.set(jellyCircels,{scale:0});
        jellies.push(newJelly);

    }

    TweenMax.set(frame,{scale:0});
    TweenMax.set("#boxLines",{scale:0});

    topLetters.forEach(function(element){
        element.setAttribute("class","hidden");
    });
    document.getElementById("topLogo").setAttribute("class","");

    jelliesEnterAnimation();

    function jelliesEnterAnimation(){
        setTimeout(function(){
            var jelliesFinish = 0;
            for (var i = 0; i < 4 ; i++) {
                var currentJelly = jellies[i];
                TweenMax.set(currentJelly.balls, {x: 0, y: -30, transformOrigin: "50% 50%"});
                TweenMax.to(
                    currentJelly.balls,
                    movementAnimationDuration,
                    {
                        transformOrigin: "50% 50%",
                        fill: currentJelly.enterColor,
                        bezier: [{x: 0, y: -30, scaleX: 0.5, scaleY: 0.5}, currentJelly.enterPosition],
                        ease:  Power1.easeInOut,
                        onComplete:function () {
                            jelliesFinish++;
                            if (jelliesFinish == 4) {
                                setTimeout(function(){
                                    frameAnimation(1);
                                },100);

                            }
                        }
                    }
                );
            }

            TweenMax.to(
                "#boxLines",
                movementAnimationDuration,{scale:1,transformOrigin:"50% 50%", ease : Back.easeOut.config(1.7) , delay:0.3})

        },500);
    }

    function frameAnimation(stage){
		var jellyFirstEasing =  Power1.easeOut;
        var jellyEasing =  Back.easeOut.config(1.3);
        var jelliesFinish = 0;
        for (var i = 0; i < 4 ; i++){
            var currentJelly = jellies[i];
            var movToObj = {scaleX:0.6+stage/20,scaleY:0.6+stage/20,transformOrigin:"50% 50%" };
            movToObj.x = currentJelly.enterAnimationPosition[stage-1].x;
            movToObj.y = currentJelly.enterAnimationPosition[stage-1].y;

            TweenMax.staggerTo(
                currentJelly.balls,
                movementAnimationDuration,
                { bezier:{curviness : 0 , values:[{x:0, y:-30,scaleX:0.5,scaleY:0.5,transformOrigin:"50% 50%"},movToObj]},ease: (stage < 2 ? jellyFirstEasing : jellyEasing)},
                movementAnimationDuration/animationTimeScale/14,
                function(){
                    jelliesFinish++;
                    if (jelliesFinish == 4 && stage < 2){
                        frameAnimation(stage+1);
                    }
                }
            );
        }

        frameAnimations['stage'+stage]();

    }

    var frameAnimations = {
        stage1 : function(){
            var animObj = {
                rad : 40,
				pos : 0
            };
            TweenMax.to(animObj, movementAnimationDuration/2, { rad: 20 , pos : 15, onUpdate: stage1UpdateHandler, onUpdateParams: [animObj] , delay:0.45 , ease : Back.easeOut.config(2.2)});
        },
        stage2 : function(){
            var animObj = {
                rad : 20,
                pos : 0
            };
            TweenMax.to(animObj, movementAnimationDuration/2, { rad: 95, pos : 40 , onUpdate: stage2UpdateHandler, onUpdateParams: [animObj] , delay:0.25 , ease : Back.easeOut.config(2.2) , onComplete:function(){
                TweenMax.set(frame,{scale:0.67,transformOrigin:"50% 50%",attr:{'stroke-width':2}});
                var boxLinesWrapper = document.getElementById("boxLines");
                boxLinesWrapper.parentNode.removeChild(boxLinesWrapper);
				TweenMax.to(frame,movementAnimationDuration/2,{scale:1,transformOrigin:"50% 50%",attr:{'stroke-width':5.6481,rx:0,ry:0,width:353.4,height:284.7,x:78.3,y:81.6},delay:0.55});
                var jelliesFinish = 0;
                for (var i = 0; i < 4 ; i++) {
                    var currentJelly = jellies[i];
                    TweenMax.staggerTo(
                        currentJelly.balls,
                        movementAnimationDuration,
                        {
                            fill:'#ffffff',
                            bezier:{curviness : 0 , values:[{x:0, y:-30},currentJelly.enterAnimationPosition[2]]},ease:Power1.easeIn},
                        movementAnimationDuration/animationTimeScale/25,function(){
                            if (jelliesFinish==3){
                                for (var j = 0; j < 4 ; j++) {
                                    var currentJelly = jellies[j];
                                    TweenMax.to(currentJelly.balls,movementAnimationDuration,{x:0,y:-30,scale:0.8,delay:0.3,ease:Power2.easeInOut});
                                }
                                setTimeout(function(){
                                    for (var j = 0; j < 4 ; j++) {
                                        var currentJelly = jellies[j];
                                        if (j==0){
                                            jellyGo(0);
                                        }else{
                                            TweenMax.to(currentJelly.balls,movementAnimationDuration/animationTimeScale,{scale:0,ease:Power2.easeInOut});
                                        }
                                    }
                                },movementAnimationDuration*1.5*1000);
                            }
                            jelliesFinish++;
                        }
                    );

                }
            } });
        }
    };

    function stage1UpdateHandler(val) {
        boxPath.setAttribute("d", "M"+(210-val.pos)+",220 A"+val.rad+","+val.rad+" 0 0,0 250,"+(260+val.pos));
        boxPath2.setAttribute("d", "M250,"+(260+val.pos)+" A"+val.rad+","+val.rad+" 0 0,0 "+(290+val.pos)+",220");
        boxPath3.setAttribute("d", "M"+(290+val.pos)+",220 A"+val.rad+","+val.rad+" 0 0,0 250,"+(180-val.pos));
        boxPath4.setAttribute("d", "M250,"+(180-val.pos)+" A"+val.rad+","+val.rad+" 0 0,0 "+(210-val.pos)+",220");
    }

    function stage2UpdateHandler(val) {
        boxPath.setAttribute("d", "M"+(195-val.pos)+",220 A"+val.rad+","+val.rad+" 0 0,0 250,"+(275+val.pos));
        boxPath2.setAttribute("d", "M250,"+(275+val.pos)+" A"+val.rad+","+val.rad+" 0 0,0 "+(305+val.pos)+",220");
        boxPath3.setAttribute("d", "M"+(305+val.pos)+",220 A"+val.rad+","+val.rad+" 0 0,0 250,"+(165-val.pos));
        boxPath4.setAttribute("d", "M250,"+(165-val.pos)+" A"+val.rad+","+val.rad+" 0 0,0 "+(195-val.pos)+",220");
    }

    function jellyGo(jellyIndex){
        var currentJelly = jellies[jellyIndex];
        var jellyCurrentXPos = currentJelly.balls[2]._gsTransform.x;
        var jellyCurrentYPos = currentJelly.balls[2]._gsTransform.y;
        var jellyXpos = currentJelly.travelJellyLetters[currentJelly.travelLetterIndex][0];
        var jellyYpos = currentJelly.travelJellyLetters[currentJelly.travelLetterIndex][1];
        var jellyEasing =  Power2.easeInOut;

        prepareLetter(jellyIndex);

        TweenMax.staggerTo(
            currentJelly.balls,
            movementAnimationDuration/animationTimeScale,
            { bezier:{curviness : 0 , values:[{x:(jellyXpos-jellyCurrentXPos)/2+jellyCurrentXPos, y:(jellyYpos-jellyCurrentYPos)/2+jellyCurrentYPos,scaleX:0.8,scaleY:0.8,transformOrigin:"50% 50%"},{x:jellyXpos, y:jellyYpos,scaleX:1,scaleY:1,transformOrigin:"50% 50%"}]},ease:jellyEasing},
            movementAnimationDuration/animationTimeScale/14,
            jellyStaggerEnd.bind(this,jellyIndex,jellyXpos,jellyYpos)
        );
    }

    function jellyStaggerEnd(jellyIndex,jellyXpos,jellyYpos){
            var currentJelly = jellies[jellyIndex];
                showLetter(jellyIndex);
                if (currentJelly.travelLetterIndex < currentJelly.travelJellyLetters.length){

                    if ( currentJelly.travelJellyLetters[currentJelly.travelLetterIndex][3] == 1){
                        var nextJelly = jellies[jellyIndex+1];
                        TweenMax.set(nextJelly.balls,{x:jellyXpos,y:jellyYpos,scale:0.5
                            , fill:(jellyIndex<1?'#ffffff':'#000000')
                        });
                        setTimeout(function(){jellyGo(jellyIndex+1)}, lettersAnimationDuration*2/animationTimeScale*1000);
                        setTimeout(function(){jellyGo(jellyIndex)} , (lettersAnimationDuration+movementAnimationDuration)*2/animationTimeScale * 1000);
                    }else{
                        setTimeout(function(){ jellyGo(jellyIndex)}, lettersAnimationDuration*2/animationTimeScale*1000);
                    }
                }else{
                    if (jellyIndex==1){
                        setTimeout(startFinishAnimation, lettersAnimationDuration*4/animationTimeScale*1000);
                    }
                    if (jellyIndex==3){
                        setTimeout(blackBallsFinishAnimation, lettersAnimationDuration*2/animationTimeScale*1000);
                    }
                }

                if(jellyIndex==2 && currentJelly.travelLetterIndex+1 == currentJelly.travelJellyLetters.length){
                    setTimeout(function(){
                        currentJelly.balls.forEach(function(element){
                            element.setAttribute("class","hidden");
                        });
                    }, (lettersAnimationDuration+movementAnimationDuration)*2/animationTimeScale * 1000);
                }
    }

    function showLetter(jellyIndex){
        var currentJelly = jellies[jellyIndex];
        var currentTopLetter = topLetters[currentJelly.travelJellyLetters[currentJelly.travelLetterIndex][2]-1];
        var currentHiddenLetter = hiddenLetters[currentJelly.travelJellyLetters[currentJelly.travelLetterIndex][2]-1];
        var isStuck = currentJelly.travelLetterIndex == 0 ? false : currentJelly.travelJellyLetters[currentJelly.travelLetterIndex][2] == currentJelly.travelJellyLetters[currentJelly.travelLetterIndex-1][2];

        if (currentJelly.travelLetterIndex!=0 && !isStuck){
            hiddenLetters[currentJelly.travelJellyLetters[currentJelly.travelLetterIndex-1][2]-1].setAttribute("class","hidden");
        }

        if (jellyIndex<2 && !isStuck){
            TweenMax.set(currentHiddenLetter ,{scale:0,transformOrigin:"50% 50%"});
            currentHiddenLetter.setAttribute("class","");
            TweenMax.to(currentHiddenLetter,lettersAnimationDuration,{scale:1,transformOrigin:"50% 50%",onComplete:function(){
                currentTopLetter.setAttribute("class","");

            }});
        }else if (!isStuck){
            TweenMax.to(currentHiddenLetter,lettersAnimationDuration,{scale:0,transformOrigin:"50% 50%",onComplete:function(){
                currentTopLetter.setAttribute("class","hidden");
            }});
        }

        currentJelly.travelLetterIndex++;
    }

    function prepareLetter(jellyIndex){
        var currentJelly = jellies[jellyIndex];
        var currentHiddenLetter = hiddenLetters[currentJelly.travelJellyLetters[currentJelly.travelLetterIndex][2]-1];
        var isStuck = currentJelly.travelLetterIndex == 0 ? false : currentJelly.travelJellyLetters[currentJelly.travelLetterIndex][2] == currentJelly.travelJellyLetters[currentJelly.travelLetterIndex-1][2];
        currentHiddenLetter.setAttribute("class", (jellyIndex<2 && !isStuck)  ? "hidden" : "");
    }

    function blackBallsFinishAnimation(){
        var blackJelly1 = jellies[2];
        var blackJelly2 = jellies[3];
        blackJelly1.balls.forEach(function(element){
            element.setAttribute("class","");
        });
        TweenMax.set(blackJelly1.balls,{x:'33',y:'-55'});

        TweenMax.staggerTo(
            blackJelly2.balls,
            movementAnimationDuration/animationTimeScale,
            {x:'-51',y:'1',scale:0,transformOrigin:"50% 50%",ease:Power1.easeInOut},
            movementAnimationDuration/animationTimeScale/14);
    }

    var jellyBalls = [];
    function startFinishAnimation(){
        for (var i = 0; i < jellies.length ; i++){
            var currentJelly = jellies[i];
            TweenMax.to(currentJelly.balls,movementAnimationDuration/2,{scale:0,transformOrigin:"50% 50%"});
        }

        setTimeout(animateBackgorund,10000);
        setTimeout(function(){
            document.getElementById("jellyBalls").setAttribute("class","");
            hiddenLetters.forEach(function(element){
                element.setAttribute("class","");
            });
            TweenMax.set(hiddenLettersTop,{opacity:0});
            document.getElementById("hiddenLettersTop").setAttribute("class","");
            var startAnimationWrapper = document.getElementById("startAnimation");
            startAnimationWrapper.parentNode.removeChild(startAnimationWrapper);

            TweenMax.set(pauseAnimBtn,{scale:0,transformOrigin:"50% 50%"});
            TweenMax.set(playAnimBtn,{scale:0,transformOrigin:"50% 50%"});

            pauseAnimBtn.setAttribute("class","");
            playAnimBtn.setAttribute("class","");
            TweenMax.to(pauseAnimBtn,movementAnimationDuration/2,{scale:1,transformOrigin:"50% 50%",delay:movementAnimationDuration});

            var jellyBallsWrapper = document.getElementById("jellyBalls");
            for (var i = 0; i < numOfJellyBalls ; i++){
                var jellyBall = makeSVG('circle',{cx:'100',cy:'100',r:'24',fill : '#ffffff'});
                jellyBallsWrapper.appendChild(jellyBall);
                jellyBalls.push(jellyBall);
                TweenMax.set(jellyBall,{scale:0,x:'182',y:'93'});
                TweenMax.to(jellyBall,movementAnimationDuration/2,{scale:0.8,transformOrigin:"50% 50%",onComplete:animateBall.bind(this,jellyBall)});
            }
        },movementAnimationDuration/2/animationTimeScale*1000);
    }

    var isAnimationPaused = false;

    function animateBall(ball){

        if (!isAnimationPaused){
            ball.isMoved = true;
            var partdur = Math.floor((Math.random() * 5)) + 2+Math.random();
            var delay = Math.floor((Math.random() * 2500));
            var scale = Math.random()*1.5;
            var xPos = Math.floor((Math.random() * 280)+10);
            var yPos = Math.floor((Math.random() * 220)+20);
            TweenMax.to(ball, partdur, {scale:scale,x:xPos,y:yPos,ease:Cubic.easeInOut});

            setTimeout(function() {
                ball.isMoved = false;
                animateBall(ball);
            },(partdur * 1000)+delay);
        }
    }

    var blackBGHidden = true;
    function animateBackgorund(){
        if (!isAnimationPaused){
            TweenMax.to(hiddenLettersTop,5,{opacity:blackBGHidden?1:0});
            TweenMax.to(frameTop,5,{opacity:blackBGHidden?1:0});
            blackBGHidden = !blackBGHidden;
            setTimeout(function() {
                    animateBackgorund();
            },15000);
        }
    }

    document.getElementById('pauseAnim').addEventListener('click', function() {
        isAnimationPaused = true;
        TweenMax.to(jellyBalls,movementAnimationDuration/2,{scale:0.8,x:'182',y:'93'});
        TweenMax.to(jellyBalls,movementAnimationDuration,{scale:0,delay:movementAnimationDuration/1.5});

        TweenMax.to(hiddenLettersTop,movementAnimationDuration/2,{opacity:0});
        TweenMax.to(frameTop,movementAnimationDuration/2,{opacity:0});
        if (blackBGHidden){
            TweenMax.to(hiddenLettersTop,movementAnimationDuration/5,{opacity:0});
            TweenMax.to(frameTop,movementAnimationDuration/5,{opacity:0});
        }

        TweenMax.to(pauseAnimBtn,movementAnimationDuration/2,{scale:0,transformOrigin:"50% 50%"});
        TweenMax.to(playAnimBtn,movementAnimationDuration/2,{scale:1,transformOrigin:"50% 50%",delay:movementAnimationDuration/2});


    });

    document.getElementById('playAnim').addEventListener('click', function() {
        isAnimationPaused = false;
        for (var i = 0; i < jellyBalls.length ; i++){
            var jellyBall = jellyBalls[i];
            if (!jellyBall.isMoved){
                TweenMax.to(jellyBall,movementAnimationDuration/2,{scale:0.8,onComplete:animateBall.bind(this,jellyBall)});
            }
        }
        setTimeout(animateBackgorund,8000);
        TweenMax.to(playAnimBtn,movementAnimationDuration/2,{scale:0,transformOrigin:"50% 50%"});
        TweenMax.to(pauseAnimBtn,movementAnimationDuration/2,{scale:1,transformOrigin:"50% 50%",delay:movementAnimationDuration/2});
    });

    function makeSVG(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    }


})();
