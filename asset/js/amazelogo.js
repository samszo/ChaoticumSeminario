class amazelogo {
    constructor(params) {
        var me = this;
        this.idCont = params.idCont;
        this.cont = d3.select("#"+params.idCont);
        this.textes = params.textes ? params.textes : [
            "ARCANES"
        ];
        //ATTENTION le nombre de colonne est lié au nombre de caractère du texte à afficher et à la police
        this.nbCol = 41;
        this.nbColCaract = 5;
        //ATTENTION le nombre de lignes est lié à la police de caractère cf. me.lettreCases + marge en haut           
        this.nbRow = 10;        
        this.width = params.width ? params.width : this.cont.node().offsetWidth;
        this.height = params.height ? params.height : this.cont.node().offsetHeight;
        this.colorPoint = params.colorPoint ? params.colorPoint : 'white';
        this.colorMur = params.colorMur ? params.colorMur : 'white';
        this.colorMurLettre = params.colorMurLettre ? params.colorMurLettre : 'red';
        this.colorLettre = params.colorLettre ? params.colorLettre : 'white';
        this.colorFond = params.colorFond ? params.colorFond : false;
        this.fctEndTexte = params.fctEndTexte ? params.fctEndTexte : false;
        this.responsive = params.responsive ? params.responsive : false;
        this.margin = params.margin ? params.margin : 4;
        

            //basé sur https://www.dafont.com/fr/poxel.font
        this.lettreCases = [
                {'l':' ','cases':[
                ]}
                ,{'l':'-','cases':[
                    {'c':1,'r':3},{'c':2,'r':3},{'c':3,'r':3}
                ]}
                ,{'l':'_','cases':[
                    {'c':1,'r':6},{'c':2,'r':6},{'c':3,'r':6}
                ]}
                ,{'l':'A','cases':[
                    {'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':0},{'c':1,'r':4}
                    ,{'c':2,'r':0},{'c':2,'r':4}
                    ,{'c':3,'r':0},{'c':3,'r':4}
                    ,{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5},{'c':4,'r':6}
                ]}
                ,{'l':'C','cases':[
                    {'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5}
                    ,{'c':1,'r':0},{'c':1,'r':6}
                    ,{'c':2,'r':0},{'c':2,'r':6}
                    ,{'c':3,'r':0},{'c':3,'r':6}
                    ,{'c':4,'r':0},{'c':4,'r':6}
                ]}
                ,{'l':'D','cases':[
                    {'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':0},{'c':1,'r':6}
                    ,{'c':2,'r':0},{'c':2,'r':6}
                    ,{'c':3,'r':0},{'c':3,'r':6}
                    ,{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5}
                ]}
                ,{'l':'E','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':0},{'c':1,'r':3},{'c':1,'r':6}
                    ,{'c':2,'r':0},{'c':2,'r':3},{'c':2,'r':6}
                    ,{'c':3,'r':0},{'c':3,'r':3},{'c':3,'r':6}
                    ,{'c':4,'r':0},{'c':4,'r':6}
                ]}
                ,{'l':'F','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':0},{'c':1,'r':3}
                    ,{'c':2,'r':0},{'c':2,'r':3}
                    ,{'c':3,'r':0},{'c':3,'r':3}
                    ,{'c':4,'r':0}
                ]}
                ,{'l':'G','cases':[
                    {'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5}
                    ,{'c':1,'r':0},{'c':1,'r':6}
                    ,{'c':2,'r':0},{'c':2,'r':3},{'c':2,'r':6}
                    ,{'c':3,'r':0},{'c':3,'r':3},{'c':3,'r':6}
                    ,{'c':4,'r':0},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5}
                ]}
                ,{'l':'H','cases':[
                    {'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':3}
                    ,{'c':2,'r':3}
                    ,{'c':3,'r':3}
                    ,{'c':4,'r':0},{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5},{'c':4,'r':6}
                ]}
                ,{'l':'I','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                ]}
                ,{'l':'J','cases':[
                    {'c':0,'r':4},{'c':0,'r':5}
                    ,{'c':1,'r':6}
                    ,{'c':2,'r':6}
                    ,{'c':3,'r':6}
                    ,{'c':4,'r':0},{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5}
                ]}
                ,{'l':'K','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':3}
                    ,{'c':2,'r':2},{'c':2,'r':4}
                    ,{'c':3,'r':1},{'c':3,'r':5}
                    ,{'c':4,'r':0},{'c':4,'r':6}
                ]}
                ,{'l':'L','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':6}
                    ,{'c':2,'r':6}
                    ,{'c':3,'r':6}
                    ,{'c':4,'r':6}
                ]}
                ,{'l':'M','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':1}
                    ,{'c':2,'r':2},{'c':2,'r':3}
                    ,{'c':3,'r':1}
                    ,{'c':4,'r':0},{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5},{'c':4,'r':6}
                ]}
                ,{'l':'N','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':2}
                    ,{'c':2,'r':3}
                    ,{'c':3,'r':4}
                    ,{'c':4,'r':0},{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5},{'c':4,'r':6}
                ]}
                ,{'l':'O','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':0},{'c':1,'r':6}
                    ,{'c':2,'r':0},{'c':2,'r':6}
                    ,{'c':3,'r':0},{'c':3,'r':6}
                    ,{'c':4,'r':0},{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5},{'c':4,'r':6}
                ]}
                ,{'l':'P','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':0},{'c':1,'r':3}
                    ,{'c':2,'r':0},{'c':2,'r':3}
                    ,{'c':3,'r':0},{'c':3,'r':3}
                    ,{'c':4,'r':1},{'c':4,'r':2}
                ]}
                ,{'l':'Q','cases':[
                    {'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5}
                    ,{'c':1,'r':0},{'c':1,'r':5},{'c':1,'r':6}
                    ,{'c':2,'r':0},{'c':2,'r':4},{'c':2,'r':6}
                    ,{'c':3,'r':0},{'c':3,'r':5},{'c':3,'r':6}
                    ,{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5},{'c':4,'r':7}
                ]}
                ,{'l':'R','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':0},{'c':1,'r':3}
                    ,{'c':2,'r':0},{'c':2,'r':3},{'c':2,'r':4}
                    ,{'c':3,'r':0},{'c':3,'r':3},{'c':3,'r':5}
                    ,{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':6}
                ]}
                ,{'l':'S','cases':[
                    {'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':6}
                    ,{'c':1,'r':0},{'c':1,'r':3},{'c':1,'r':6}
                    ,{'c':2,'r':0},{'c':2,'r':3},{'c':2,'r':6}
                    ,{'c':3,'r':0},{'c':3,'r':3},{'c':3,'r':6}
                    ,{'c':4,'r':0},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5}
                ]}
                ,{'l':'T','cases':[
                    {'c':0,'r':0}
                    ,{'c':1,'r':0}
                    ,{'c':2,'r':0},{'c':2,'r':1},{'c':2,'r':2},{'c':2,'r':3},{'c':2,'r':4},{'c':2,'r':5},{'c':2,'r':6}
                    ,{'c':3,'r':0}
                    ,{'c':4,'r':0}
                ]}
                ,{'l':'U','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5}
                    ,{'c':1,'r':6}
                    ,{'c':2,'r':6}
                    ,{'c':3,'r':6}
                    ,{'c':4,'r':0},{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5},{'c':4,'r':6}
                ]}
                ,{'l':'V','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4}
                    ,{'c':1,'r':5}
                    ,{'c':2,'r':6}
                    ,{'c':3,'r':5}
                    ,{'c':4,'r':0},{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4}
                ]}
                ,{'l':'W','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':5}
                    ,{'c':2,'r':3},{'c':2,'r':4}
                    ,{'c':3,'r':5}
                    ,{'c':4,'r':0},{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5},{'c':4,'r':6}
                ]}
                ,{'l':'X','cases':[
                    {'c':0,'r':0},{'c':0,'r':1},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':2},{'c':1,'r':4}
                    ,{'c':2,'r':3}
                    ,{'c':3,'r':2},{'c':3,'r':4}
                    ,{'c':4,'r':0},{'c':4,'r':1},{'c':4,'r':5},{'c':4,'r':6}
                ]}
                ,{'l':'Y','cases':[
                    {'c':0,'r':0},{'c':0,'r':1}
                    ,{'c':1,'r':2}
                    ,{'c':2,'r':3},{'c':2,'r':4},{'c':2,'r':5},{'c':2,'r':6}
                    ,{'c':3,'r':2}
                    ,{'c':4,'r':0},{'c':4,'r':1}
                ]}
                ,{'l':'0','cases':[
                    {'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':3},{'c':0,'r':4},{'c':0,'r':5}
                    ,{'c':1,'r':0},{'c':1,'r':6}                    
                    ,{'c':2,'r':0},{'c':2,'r':6}                    
                    ,{'c':3,'r':0},{'c':3,'r':6}                    
                    ,{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3},{'c':4,'r':4},{'c':4,'r':5}
                ]}
                ,{'l':'1','cases':[
                    {'c':1,'r':1}
                    ,{'c':2,'r':0},{'c':2,'r':1},{'c':2,'r':2},{'c':2,'r':3},{'c':2,'r':4},{'c':2,'r':5},{'c':2,'r':6}                    
                ]}
                ,{'l':'2','cases':[
                    {'c':0,'r':1},{'c':0,'r':4},{'c':0,'r':5},{'c':0,'r':6}
                    ,{'c':1,'r':0},{'c':1,'r':4},{'c':1,'r':6}
                    ,{'c':2,'r':0},{'c':2,'r':3},{'c':2,'r':6}
                    ,{'c':3,'r':0},{'c':3,'r':3},{'c':3,'r':6}
                    ,{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':6}
                ]}
                ,{'l':'8','cases':[
                    {'c':0,'r':1},{'c':0,'r':2},{'c':0,'r':4},{'c':0,'r':5}
                    ,{'c':1,'r':0},{'c':1,'r':3},{'c':1,'r':6}
                    ,{'c':2,'r':0},{'c':2,'r':3},{'c':2,'r':6}
                    ,{'c':3,'r':0},{'c':3,'r':3},{'c':3,'r':6}
                    ,{'c':4,'r':1},{'c':4,'r':2},{'c':4,'r':3}
                ]}

            ];
            this.duree = params.duree ? params.duree : 1;//en seconde
            this.interpolateColor = params.interpolateColor ? params.interpolateColor : d3.interpolateTurbo;
            this.arrAngle = [90, -90, 180, -180, 270, -270, 360, -360, 450, -450];
            this.aleaAngle = function(){return me.arrAngle[d3.randomInt(0, me.arrAngle.length)()]};
            this.delayBalanceChange = params.delayBalanceChange ? params.delayBalanceChange : 500
            this.dureeBalance = params.dureeBalance ? params.dureeBalance : 500;
            this.repeatBalance = params.repeatBalance ? params.repeatBalance : 4;
            var svg, global, contPre, arrMaze=[], pp, pMurs
                , scaleH, scaleW, wRect, hRect
                , aleaRow, aleaCol
                , color = d3.scaleSequential().domain([1,100])
                    .interpolator(me.interpolateColor)//d3.interpolateWarm
                , aleaColor = d3.randomUniform(0, 100)
                , curBalance = 0, delayBalanceStart = 0
                , curTexte = 0, nbCaractMax = 0, margeCaract = 1
                , idLogo = me.idCont+'svgMazeLogo';

        this.init = function () {
            
            svg = this.cont.append("svg")
                .attr("id", idLogo);//.style("margin",me.margin+"px");
            //ATTENTION La taille en % ne marche pas pour prendre la photo
            if(me.responsive){
                svg.attr("width",'100%').attr("height", '100%')
                .attr("viewBox","0 0 "+me.width+" "+me.height)
                .attr("preserveAspectRatio","xMinYMin meet");
            }else{
                svg.attr("width",me.width+'px').attr("height", me.height+'px');
            }            
            if(me.colorFond)
                svg.append('rect').attr('class','fond').attr('x',0).attr('y',0).attr('width',me.width).attr('height',me.height)
                    .attr('fill',me.colorFond);
            global = svg.append("g").attr("id",idLogo+'Global');
            contPre = this.cont.append("pre").attr("id",idLogo+'Pre');

            me.textes.forEach((t,i)=>{
                me.textes[i]=t.toUpperCase();
                if(nbCaractMax < t.length)nbCaractMax=t.length;
            });

            initGrille(me.textes[curTexte]);
            
        }

        function initGrille(texte){
            /*ATTENTION le nombre de colonne est lié 
            au nombre de caractère max du texte à afficher 
            et à l'espace entre les caractères
            */            
            me.nbCol = (nbCaractMax*(me.nbColCaract+1))+1;

            //équilibre avec le nombre de i
            let nbI = (texte.match(/I/g) || []).length;
            me.nbCol = me.nbCol - (nbI*(me.nbColCaract-1));

            //ATTENTION les proproportions doivent générer des carrés
            //calcul les échelles pour centrer le labyrinthe dans les dimension initiale
            let w = me.width, h= me.height;
            if(me.width/me.nbCol < me.height/me.nbRow){
                scaleW = d3.scaleLinear().domain([0, me.nbCol]).range([(me.margin*2+me.width-w), w-me.margin])
                wRect = scaleW(1)-scaleW(0)//-me.margin*2
                h = wRect*(me.nbRow);
                scaleH = d3.scaleLinear().domain([0, me.nbRow]).range([0, h])
                hRect = scaleH(1)-scaleH(0)//-me.margin*2
            }else{
                scaleH = d3.scaleLinear().domain([0, me.nbRow]).range([(me.margin*2+me.height-h), h-me.margin])
                hRect = scaleH(1)-scaleH(0)//-me.margin*2
                w = hRect*me.nbCol;
                scaleW = d3.scaleLinear().domain([0, me.nbCol]).range([0, w-me.margin])
                wRect = scaleW(1)-scaleW(0)//-me.margin*2
            }

            aleaRow = d3.randomInt(0, me.nbRow)
            aleaCol = d3.randomInt(0, me.nbCol)

            //construction du labyrinthe aléatoire suivant les dimensions
            arrMaze = maze(me.nbRow,me.nbCol);
            //dessine le labyrinte en texte
            //contPre.html(displayText(arrMaze));
            //calcule les paths du labyrinthe en svg 
            pp = displayMurs(arrMaze);
            //suprime les conteneurs
            global.select("#"+idLogo+"points").remove();
            global.select("#"+idLogo+"murs").remove();
            global.select("#"+idLogo+"lettres").remove();            

            //dessine les points du labyrinte en svg
            global.append('g').attr('id',idLogo+'points').selectAll('.'+idLogo+'point').data(pp.points).enter().append('path')
                .attr("class", idLogo+"point")
                .attr("id", (d,i)=>"point"+i)
                .style("fill", me.colorPoint == 'alea' ? color(aleaColor()) : me.colorPoint)
                .attr("d", d=>d)
            //dessine les murs du labyrinte en svg
            //ajoute les murs du texte au murs du labyrinthe
            let arrMurs = pp.murs.concat(getMursLettre(texte));
            pMurs = global.append('g').attr('id',idLogo+'murs').selectAll('.'+idLogo+'mur').data(arrMurs).enter().append('path')
                .attr("class", idLogo+"mur")
                .attr("id", (d,i)=>idLogo+"mur"+i)
                .style("stroke", d=>{
                    let c;
                    if(d.l)
                        c = me.colorMurLettre == 'alea' ? color(aleaColor()) : me.colorMurLettre
                    else
                        c = me.colorMur == 'alea' ? color(aleaColor()) : me.colorMur
                    return c;
                })
                .style("stroke-width",me.margin/3)
                .style("transform-origin", "0 0")
                .style("transform-box", "fill-box")    
                .style("opacity",0)
                .attr("d", d=>d.d)
            //changeMurColor();
            curBalance = 0;
            balanceMur();  

        }

        function ecrireTexte(mot){
            //ajoute les rectangles pour composer les lettres
            let lettres = global.append('g').attr('id',idLogo+'lettres').selectAll('.'+idLogo+'lettre').data(getCaseLettre(mot)).enter().append('g');
            lettres.append('g').attr('id',idLogo+'cases').selectAll('.'+idLogo+'case').data(d=>d.cases).enter().append('rect')
                .attr("class", idLogo+"case")
                .attr("id", (d,i)=>idLogo+"case_"+d.l+"_"+i)
                .attr("height", hRect)
                .attr("width", wRect)
                .attr("x", (d,i)=>scaleW((d.c)))//scaleW((d.c)*wMur)+me.margin)
                .attr("y", (d,i)=>scaleH((d.r)))//scaleH((d.r)*hMur)+me.margin)
                .style("stroke", me.colorLettre == 'alea' ? color(aleaColor()) : me.colorLettre)
                .style("opacity",0)
                .style("stroke-width",1)
                .style("fill", me.colorLettre == 'alea' ? color(aleaColor()) : me.colorLettre)
                ;

            anime({
                targets: '.'+idLogo+'case',
                loop: false,
                duration: me.dureeBalance*4,
                easing: 'easeInOutSine',
                //direction: 'alternate',
                opacity:1,
                complete: function(anim) {
                    if(me.fctEndTexte && curTexte == me.textes.length-1) 
                        me.fctEndTexte(); 
                    else 
                        changeTexte();
                }                
            }) 
        }    

        function changeTexte(){
            anime({
                targets: ['.'+idLogo+'case','.'+idLogo+'mur','.'+idLogo+'point'],
                loop: false,
                duration: me.dureeBalance*4,
                easing: 'easeInOutSine',
                //direction: 'alternate',
                opacity:0,
                complete: function(anim) {
                    curTexte = curTexte == me.textes.length-1 ? 0 : curTexte+1; 
                    initGrille(me.textes[curTexte]);
                }    
            }) 

        }

        function balanceMur(){    
            let t = '.'+idLogo+'mur';
            curBalance ++;
            anime({
                targets: t,
                loop: false,
                delay: function(el, i) { return i * 2},//curBalance ? delayBalanceChange : delayBalanceStart,
                duration: me.dureeBalance,
                easing: 'easeInOutSine',
                //direction: 'alternate',
                opacity:1,
                transform:
                    function (d,i) {
                        //récupère les propriété du mur
                        let mur = d3.select("#"+d.id).data()[0], r="rotate(0)";
                        if(!mur.ext) r = "rotate("+me.aleaAngle()+")";
                        else r = "rotate("+me.aleaAngle()+")";//on ne bouge pas les murs extérieurs
                        if(curBalance>=me.repeatBalance){
                            r="rotate(0)";
                        }
                        return r;
                    },
                complete: function(anim) {
                    if(curBalance<me.repeatBalance)balanceMur()
                    else{
                        //ouvreMurEntreeSortie();
                        ecrireTexte(me.textes[curTexte]);
                    };
                }    
              })
        }

        function ouvreMurEntreeSortie(){
            //ouverture en haut à gauche
            anime({
                targets: '#'+idLogo+'mur0',
                loop: false,
                delay: me.delayBalanceChange,
                duration: me.dureeBalance*4,
                easing: 'easeInOutSine',
                transform:"rotate(810)"
            });
            //ouverture en bas à droite
            anime({
                targets: '#'+idLogo+'mur'+(pp.murs.length-1),
                loop: false,
                delay: me.delayBalanceChange,
                duration: me.dureeBalance*4,
                easing: 'easeInOutSine',
                transform:"rotate(900)",
                complete: function(a){
                    ecrireTexte(me.textes[0]);
                }
            });
        }

        function changeMurColor(){    
            let t = '#'+idLogo+'.mur';
            let a = anime({
                targets: t,
                loop: true,
                duration: me.duree*1000,//durée par texte,*arrTextes.length
                easing: 'easeInOutSine',
                stroke: {
                    value: function () {
                        let c1 = color(aleaColor());
                        let c2 = color(aleaColor());
                        return [c1, c2];
                    },
                },
                //opacity: [0, 1],
                direction: 'alternate'
            });
        }
        function getCases(c){
            let l = me.lettreCases.filter(d=>d.l==c)[0];
            if(!l){
                console.log(c+" : n'est pas défini");
                l = me.lettreCases.filter(d=>d.l=='-')[0];
            }
            return l;
        }
        function getCaseLettre(mot){
            let rs = [], nbCase, posiDeb = margeCaract;
            for (let p = 0; p < mot.length; p++) {
                let c = mot.charAt(p);
                let l = getCases(c);
                //recalcule les positions
                let ol = {'l':l,'cases':[]};
                l.cases.forEach(d=>{
                    ol.cases.push({'c':d.c+posiDeb,'r':d.r+margeCaract,'l':c,'p':p})
                })
                nbCase= c=="I" ? 2 : 6;
                posiDeb = posiDeb+nbCase;
                rs.push(ol);
            }
            return rs;
        }

        function getMursLettre(mot){
            let murs = [], nbCase, posiDeb = margeCaract;
            for (let p = 0; p < mot.length; p++) {
                let c = mot.charAt(p);
                let l = getCases(c);
                //recalcule les positions
                l.cases.forEach(d=>{
                    //construction des quatre murs de la case
                    murs.push(setDataMur(d.c+posiDeb,d.r+margeCaract,'v',c));
                    murs.push(setDataMur(d.c+posiDeb,d.r+margeCaract,'h',c));
                    murs.push(setDataMur(d.c+posiDeb+1,d.r+margeCaract,'v',c));
                    murs.push(setDataMur(d.c+posiDeb,d.r+1+margeCaract,'h',c));
                })
                nbCase= c=="I" ? 2 : 6;
                posiDeb = posiDeb+nbCase;
            }
            return murs;
        }

        function maze(x,y) {
            var n=x*y-1;
            if (n<0) {alert("illegal maze dimensions");return;}
            let horiz =[],verti =[],next; 
            for (var j= 0; j<x+1; j++) horiz[j]= [];
            for (var j= 0; j<x+1; j++) verti[j]= [];
            let here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
                path = [here],
                unvisited = [];
            for (var j = 0; j<x+2; j++) {
                unvisited[j] = [];
                for (var k= 0; k<y+1; k++)
                    unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
            }
            while (0<n) {
                var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
                    [here[0]-1, here[1]], [here[0],here[1]-1]];
                var neighbors = [];
                for (var j = 0; j < 4; j++)
                    if (unvisited[potential[j][0]+1][potential[j][1]+1])
                        neighbors.push(potential[j]);
                if (neighbors.length) {
                    n = n-1;
                    next= neighbors[Math.floor(Math.random()*neighbors.length)];
                    unvisited[next[0]+1][next[1]+1]= false;
                    if (next[0] == here[0])
                        horiz[next[0]][(next[1]+here[1]-1)/2]= true;
                    else 
                        verti[(next[0]+here[0]-1)/2][next[1]]= true;
                    path.push(here = next);
                } else 
                    here = path.pop();
            }
            return {x: x, y: y, horiz: horiz, verti: verti};
        }

        function displayText(m) {
            var text= [];
            for (var j= 0; j<m.x*2+1; j++) {
                var line= [];
                if (0 == j%2)
                    for (var k=0; k<m.y*4+1; k++)
                        if (0 == k%4) 
                            line[k]= '+';
                        else
                            if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
                                line[k]= ' ';
                            else
                                line[k]= '-';
                else
                    for (var k=0; k<m.y*4+1; k++)
                        if (0 == k%4)
                            if (k>0 && m.horiz[(j-1)/2][k/4-1])
                                line[k]= ' ';
                            else
                                line[k]= '|';
                        else
                            line[k]= ' ';
                if (0 == j) line[1]= line[2]= line[3]= ' ';
                if (m.x*2-1 == j) line[4*m.y]= ' ';
                text.push(line.join('')+'\r\n');
            }
            return text.join('');
        }


        function displayMurs(m) {
            var points = [], murs=[], riens=[], mursFait=[];
            for (var r= 0; r<m.x*2+1; r++) {
                if (0 == r%2){
                    for (var c=0; c<m.y+1; c++){
                        //ajoute le cercle pilier
                        points.push(getCirclePath(c,r/2,me.margin/3));
                        //vérifie s'il faut générer le mur horizontal
                        if (r>0 && m.verti[r/2-1][c])
                            riens.push({c,r});
                        else
                            if(c!=m.y)murs.push(setDataMur(c,r/2,'h'));
                    }
                }else{
                    for (var c=0; c<m.y+1; c++){
                        if (c>0 && m.horiz[(r-1)/2][c-1])
                            riens.push({c,r});
                        else
                            murs.push(setDataMur(c,(r-1)/2,'v'));
                    }
                }
            }
            return {'points':points,'murs':murs};
        }

        function setDataMur(c,r,o,l=""){
            let line = d3.path(), x0, y0, x1, y1, ext=false;
            x0=scaleW(c);
            y0=scaleH(r);
            if(o=='v'){
                x1=scaleW(c);
                y1=scaleH(r+1);
                if(c==0 || c==me.nbCol)ext=true;
            }else{
                x1=scaleW(c+1);
                y1=scaleH(r);
                if(r==0 || r==me.nbRow)ext=true;
            }
            line.moveTo(x0, y0);
            line.lineTo(x1, y1);    
            return {'l':l,'c':c,'r':r,'x0':x0,'y0':y0,'x1':x1,'y1':y1,'ext':ext,'o':o,'d':line.toString()};

        }

        function getCirclePath(x, y, radius){
            var context = d3.path();
            context.arc(scaleW(x), scaleH(y), radius, 0, 2 * Math.PI);
            return context.toString();
        }
  
        this.hide = function(){
          svg.attr('visibility',"hidden");
        }
        this.show = function(){
          svg.attr('visibility',"visible");
        }

         me.init();

    }

}
