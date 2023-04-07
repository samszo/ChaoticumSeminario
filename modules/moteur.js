export class moteur {
    constructor(params) {
        var me = this;
        this.apiUrl = params.apiUrl ? params.apiUrl : false;
		this.choix = params.choix ? params.choix : false;
        this.id_oeu = params.id_oeu ? params.id_oeu : false;
        this.dicos = params.dicos ? params.dicos : false;
        this.id_dico = params.id_dico ? params.id_dico : false;
		this.showErr = params.showErr ? params.showErr : true;
        this.niv = params.niv ? params.niv : 0;
        this.strct = []; 
        this.posis = [];
        this.caracts = []; 
        this.ordre = 0; 
        this.potentiel = 0;
        this.tables = {
            c:{type:'concepts',t:'gen_concepts',pk:'id_concept',k:['lib','type'],'content':true,mAdd:true,mImp:true},
            d:{type:'déterminants',t:'gen_determinants',k:'num','content':false},
            p:{type:'pronoms',t:'gen_pronoms',k:['num','type'],'content':false},
            t:{type:'terminaisons',t:'gen_terminaisons',k:['id_conj','num'],'content':false},
			s:{type:'syntagmes',t:'gen_syntagmes',pk:'id_syn',k:'num','content':false,mAdd:true},
			v:{type:'verbes',t:'gen_verbes',k:'id_verbe',dataLink:true},
			a:{type:'adjectifs',t:'gen_adjectifs',k:'id_adj',dataLink:true},
			m:{type:'substantifs',t:'gen_substantifs',k:'id_sub',dataLink:true},
			g:{type:'generateurs',t:'gen_generateurs',k:'id_gen',dataLink:true},
			n:{type:'négations',t:'gen_negations',pk:'id_negation',k:'num','content':false},
			u:{type:'uris',t:'gen_uris',k:'id_uri',dataLink:true},
			conj:{type:'conjugaisons',t:'gen_conjugaisons',pk:'id_conj',k:'id_conj','content':true},
        }; 

		this.segments = [];
		this.coupures = [];
		this.texte="";
		this.finLigne="<br/>";
		this.elisions = ["a", "e", "é", "ê", "i","o","u","y","h"];
		this.start;

        this.init = function () {
            me.start = Date.now();
			if(!me.dicos && me.id_oeu){
				getDicos();				
			}
        }

		function getDicos(){
			//récupère les dicos de l'oeuvre
			let result = syncList('gen_oeuvres_dicos_utis',{filter:'id_oeu,eq,'+me.id_oeu}),
				ids=[]; 
			result.records.forEach(d => {
				if(!ids.includes(d.id_dico))ids.push(d.id_dico);
			});                    
			if(ids.length==0)return;
			result = syncRead('gen_dicos',ids);
			me.dicos=result.filter(d=>d);
		}

		this.genereAsync = function (g,t,o) {
			return new Promise(
				function(resolve, reject) {
				  window.setTimeout(
					function() {
					  resolve(me.genere(g,t,o));
					}, 1);
				});
		}		

        this.searchClass = function(t,q,o){
            let rs=[], r, f, 
            //création des requêtes pour chaque dictionnaire général du même type
            dicosFiltre = me.dicos.filter(d=>(d.type==t.type && d.general) || (d.id_dico ==  me.id_dico));            
            dicosFiltre.forEach(d=>{
                f = {filter:['id_dico,eq,'+d.id_dico]};
                if(o)f.order=o;
                q.forEach(i=>f.filter.push(i));
                r = syncList(t.t,f);
                r.records.forEach(d=>rs.push(d));
            }); 
            return rs;           
        }
		//merci à JavaScript client library for the API of [PHP-CRUD-API](https://github.com/mevdschee/php-crud-api)
		const castArray=a=>Array.isArray(a)?a:[a];
		const join=(d=',')=>a=>castArray(a).join(d);
		const url=(parts)=>[me.apiUrl,...parts].join('/');
		const getQuery=([part1,conditions])=>url(['records', ...part1].concat(conditions ? [query(conditions)] : []));	
		const pca_join=(key,a)=>mapN(castArray(a))(join(),prefix(key+'='));
		const push=(a,...v)=>{a.push(...v);return a;};
		const query=(conditions) => '?'+Object.keys(conditions)
			.reduce((acc,key)=>
				push(acc,...dispatch(key,castArray(conditions[key])))
			,[]).join('&');
		const nonMultipleConditions=['include','exclude','page','size'];
		const dispatch=(key, a)=>key==='join'
			? pca_join(key,a)
			: nonMultipleConditions.indexOf(key)!==-1
				? [key+"="+a.join(',')]
				: a.map(v=>{ // todo : should list the cases (first need to implement error system)
					return key+'='+(Array.isArray(v)?v.join(','):v)
				});
		
        function syncList(table,conditions={}){
			return apiRequest(getQuery([[table],conditions]));	
		}
        function syncRead(table,ids,conditions={}){
			return apiRequest(getQuery((ids?[[table,join()(ids)],conditions]:[[table]])));	
		}
		function apiRequest(q){
			const request = new XMLHttpRequest();
			request.open('GET', q, false);  // `false` makes the request synchronous
			request.send(null);        
			if (request.status === 200) {
			  return JSON.parse(request.response);
			}        
		};



        this.genere = function(g, getTexte=true, getObject=false){
			let c;
            //décompose le générateur
            me.ordre = 0
            for (var i = 0; i < g.length; i++) {
				//initialisation de la structure
				me.strct[me.ordre]={'deb':Date.now(),'dur':'','niv':me.niv};
                c = g.charAt(i);
                if(c == "["){					
                    //c'est le début d'une classe on initialise
                    me.strct[me.ordre].vecteur={};
                    //on récupère la valeur de la classe et la position des caractères dans la chaine
					i = setClass(g,i);
                }else if(c == "F"){
                    if(g.charAt(i+1)=="F"){
                        /*c'est la fin du segment
                        $this->arrSegment[$this->segment]["ordreFin"]= $this->ordre;
                        $this->segment ++;
                        */
                        i++;
                    }else{
                        //on ajoute le caractère
                        me.strct[me.ordre].texte = c;
                    }
                }else{
                    //on ajoute le caractère
                    me.strct[me.ordre].texte = c;
                }
				me.strct[me.ordre].dur = Date.now() - me.strct[me.ordre].deb;
                me.ordre ++;            
			}			 
			if(getTexte){
				me.genereTexte();
				return getObject ? me : me.texte;
			}else return true;
        }

	this.genereTexte = function (){

		me.texte = "";
		let c, texte, strct, txtCondi = true, imbCondi= {}, alea, ordreDeb, ordreFin;
		
		//vérifie la présence de segments
		if(me.segments.length>0){
			//choix aleatoire d'un segment
			alea = getRandomInt(me.segments.length-1);        	        
			ordreDeb = me.segments[alea].ordreDeb;
			ordreFin = me.segments[alea].ordreFin;
		}else{
			ordreDeb = 0;
			ordreFin = me.strct.length-1;
		}
		for (let i = ordreDeb; i <= ordreFin; i++) {
			me.ordre = i;
			texte = "";
			if(me.strct[i]){
				strct = me.strct[i];
				if(strct.texte){
					//vérifie le texte conditionnel
					if(strct.texte=="<"){
						//choisi s'il faut afficher
						me.potentiel ++;
						alea = getRandomInt(1000);        	        
						if(alea>500){
							txtCondi = false;
							//vérifie si le texte conditionnel est imbriqué
							//pour sauter à la fin de la condition
							if(me.strct[i+2].texte && me.strct[i+2].texte=="|"){
								for (let j = me.ordre; j < ordreFin; j++) {
									if(me.strct[j].texte=="|"
										&& me.strct[j+1].texte==me.strct[i+1].texte
										&& me.strct[j+2].texte==">"){
											i=j+2;
											j=ordreFin;		
									}
								}
							}
						}else{
							//vérifie si le texte conditionnel est imbriqué
							//attention pas plus de 10 imbrications
							if(me.strct[i+2].texte && me.strct[me.ordre+2].texte=="|"){
								imbCondi[me.strct[me.ordre+1].texte] = true;
								i+=2;
							}
						}
					}else if(strct.texte==">"){
						//vérifie les conditionnels imbriqué
						if(imbCondi){
							if(imbCondi[me.strct[me.ordre-1].texte]){
								txtCondi = true;
								c = me.texte.substring(me.texte.length-2, me.texte.length-2); 
								if(c=="|"){
									me.texte = me.texte.substring(0, me.texte.length-2); 
								}
								//supprime la condition imbriquée
								delete imbCondi[me.strct[me.ordre-1].texte];
							}else{
								//cas des conditions dans condition imbriquée
								txtCondi = true;					        	
							}
						}else{
							txtCondi = true;
						}
					}else if(strct.texte=="{"){
						//on saute les crochets de test
						for (j = me.ordre; j <= ordreFin; j++) {
							if(me.strct[j].texte=="}"){
								i = j+1;	
							}
						}
					}else if(txtCondi){
						if(strct.texte=="%"){
							texte += me.finLigne;	
						}else{
							texte += strct.texte;
						}
					}
				}else if(strct.error && me.showErr){
					me.texte += '<ul><font color="#de1f1f" >ERREUR:'+JSON.stringify(strct)+'</font></ul>';	
				}else{
					if(txtCondi){
						let det = "", sub = "", adjs = "", verbe = "";

						if(strct.uri){
							texte += " "+strct.uri.lib;
						}

						
						if(strct.determinant){
							det = genereDeterminant(strct);					
							texte += det;
						}

						//les adjectifs avant pour mieux gérer adj@sub
						if(strct.adjectifs){
							//$k=0;
							strct.adjectifs.forEach(a=>{
								adjs += " ";
								adjs += genereAdjectif(a);
							})
							texte += " "+adjs;
						}
						if(strct.substantif){					
							sub = strct.substantif.id_adj ? 
								genereAdjectif(strct.substantif):
								genereSubstantif(strct);
							texte += " "+sub;													
						}					
								
						if(strct.verbe){					
							verbe = genereVerbe(strct);
							texte += " "+verbe;													
						}					
						
						if(strct.syntagme){					
							texte += strct.syntagme.lib;
						}					
											
						//texte += det+sub+" "+adjs+verbe;
					}					
				}
				if(texte!=""){
					me.strct[i].texte = texte;
					me.texte += texte;
				}
			}
			me.strct[i].durTxt = Date.now() - me.start;
		}
		
		//gestion des espace en trop
		//$this->texte = preg_replace('/\s\s+/', ' ', $this->texte); //problème avec à qui devient illisible ???
		me.texte = me.texte.replace("  "," ");
		me.texte = me.texte.replace("  "," ");
		me.texte = me.texte.replace("  "," ");
		me.texte = me.texte.replace("  "," ");
		me.texte = me.texte.replace("  "," ");
		me.texte = me.texte.replace("  "," ");
		me.texte = me.texte.replace("’ ","’");
		me.texte = me.texte.replace("' ","'");
		me.texte = me.texte.replace(" , ",", ");
		me.texte = me.texte.replace(" .",".");
		me.texte = me.texte.replace(" 's","'s");
		me.texte = me.texte.replace(" -","-");
		me.texte = me.texte.replace("- ","-");
		me.texte = me.texte.replace("( ","(");
		me.texte = me.texte.replace(" )",")");
		
		//gestion des majuscules sauf pour twitter
		genereMajuscules();

		//mise en forme du texte
		coupures();

		return me.texte;
				
	}

	function coupures(){
		//mise en forme du texte
		/*coupure de phrase*/
		if(me.coupures.length==2){
			me.texte += " ";
			let nbCaractCoupure = getRandomInt(me.coupures[0], me.coupures[1]),
				i = nbCaractCoupure;
			while((i+me.coupures[1]) < me.texte.length) {
				//trouve la coupure
				let c  = me.texte.substring(i, 1), go = true, j = i;
				while (go) {
					if(c == "" || c == " " || c == "," || c == "." || c == ";"){
						go=false;
						i = j;
					}else if (j==0){
						//coupe jusqu'au prochain espace
						i = me.texte.indexOf(' ', i);
						go=false;
					}else{
						j --;
						c = me.texte.substring(j, 1);
					}
				}
				me.texte = me.texte.substring(0,i).trim()+me.finLigne+me.texte.substring(i).trim();
				nbCaractCoupure = getRandomInt(me.coupures[0], me.coupures[1]);
				i += nbCaractCoupure+me.finLigne.length;
			}
			
		}
	}
		

	function genereMajuscules(){
		let sentences = me.texte.match( /[^\.!\?]+[\.!\?]+/g );
		if(sentences){
			sentences.forEach(s=>s=s.charAt(0).toUpperCase()+s.substring(1));		
			me.texte=sentences.join(" ");	
		}
	}

	function genereAdjectif(adj){

		let	txt = "", v = getVecteur("pluriel",-1), 
		//calcule le nombre
		n = v.pluriel ? "_p" : "_s",				
		//calcul le genre
		g = "m";
		v ? v : getVecteur("genre",-1);
		if(v.genre==2)g='f'; 		
		
		return adj.prefix+adj[g+n]+" ";		
	}

	function genereVerbe(strct){

		/*
		Position 1 : type de négation
		Position 2 : temps verbal
		Position 3 : pronoms sujets définis
		Positions 4 ET 5 : pronoms compléments
		Position 6 : ordre des pronoms sujets
		Position 7 : pronoms indéfinis
		Position 8 : Place du sujet dans la chaîne grammaticale
		*/

		//dans le cas d'un verbe théorique on ne fait rien
		if(strct.class[1]=="v_théorique") return "";
		
		//vérifie s'il faut récupérer le déterminant
		getDerterminantVerbe(strct);    	
		
		//génère le pronom
		generePronom(strct);    	
		
		//récupère la terminaison
		genereTerminaison(strct);
		
		//construction du centre
		let centre = strct.verbe.prefix+strct.verbe.term,
		//construction de l'élision
		eli = strct.verbe.elision == 0 ? isEli(centre) : strct.verbe.elision,
		verbe="";
		strct.debneg="";
		strct.finneg="";

		if(strct.determinant_verbe){
			//génère la négation
			if(strct.determinant_verbe[0]!=0){
				strct.finneg = getNegation(strct.determinant_verbe[0]);
				strct.debneg = eli==0 ?
					strct.debneg = "ne " :	
					strct.prodem && !isEli(strct.prodem.lib) ?
						"ne ": "n'";						
			}
			
			//construction de la forme verbale
			/*gestion de l'infinitif 
			 * 
			 */
			if(strct.determinant_verbe[1]==9 || strct.determinant_verbe[1]==7){
				verbe = centre;
				if(strct.prodem){
					if(strct.prodem.num!=39 && strct.prodem.num!=40 && strct.prodem.num!=41){
						if(!isEli(verbe) || strct.prodem.lib == strct.prodem.lib_eli){
							verbe = strct.prodem.lib+" "+verbe; 
						}else{
							verbe = strct.prodem.lib_eli+verbe; 
							eli=0;
						}
					}
				}
				//les deux parties de la négation se placent avant le verbe pour les valeurs 1,2, 3, 4, 7 et 8
				//uniquement pour l'infinitif 
				if(strct.determinant_verbe[1]==9 && (
					   strct.determinant_verbe[0]==1 
					|| strct.determinant_verbe[0]==2 
					|| strct.determinant_verbe[0]==3 
					|| strct.determinant_verbe[0]==4 
					|| strct.determinant_verbe[0]==7 
					|| strct.determinant_verbe[0]==8)){
					verbe = "ne ".strct.finneg+" "+verbe;
				}else{
					if(isEli(verbe) && strct.finneg!=""){
						verbe = "n'"+verbe+" "+strct.finneg;
					}else{
						verbe = strct.debneg+verbe+" "+strct.finneg;
					}
				}
				if(strct.prodem){
					//le pronom complément se place en tête lorsqu’il a les valeurs 39, 40, 41
	                if(strct.prodem.num==39 || strct.prodem.num==40 || strct.prodemnum==41){
						if(!isEli(verbe) || strct.prodem.lib == strct.prodem.lib_eli){
							verbe = strct.prodem.lib+" "+verbe; 
						}else{
							verbe = strct.prodem.lib_eli+verbe; 
							eli=0;
						}
					}
				}								
			}		
			//gestion de l'ordre inverse
			if(strct.determinant_verbe[5]==1){
				verbe = centre+"-";
				if(strct.prodem!=""){
					if(!isEli(verbe)){
						verbe = strct.prodem.lib+" "+verbe; 
					}else{
						verbe = strct.prodem.lib_eli+verbe; 
					}
				}	
				let c = centre.substring(centre.length-1);
				if((c == "e" || c == "a") && strct.terminaison==3){
					verbe += "t-"; 
				}else if(c == "e" && strct.terminaison==1){
					verbe = verbe+substring(0,centre.length-2)+"é-"; 
				}
				if(isEli(verbe) && strct.debneg!=""){
					verbe = "n'"+verbe+strct.prosuj.lib+" "+strct.finneg; 
				}else{
					verbe = strct.debneg+" "+verbe+strct.prosuj.lib+" "+strct.finneg;
				}
			}
		}
		//gestion de l'ordre normal
		if(verbe==""){
			verbe = centre+" "+strct.finneg;
			if(strct.prodem){
				//si le pronom eli = le pronom normal on met un espace
				if(!isEli(verbe) || strct.prodem.lib == strct.prodem.lib_eli){
					verbe = strct.prodem.lib+" "+verbe; 
				}else{
					verbe = strct.prodem.lib_eli+verbe; 
					eli=0;
				}
			}	
			if(strct.debneg){
				verbe = isEli(verbe) ? "n'"+verbe : strct.debneg+verbe; 
			}	
			if(strct.prosuj){
				if(isEli(verbe)){
					//vérification de l'apostrophe
					if (strct.prosuj.lib_eli.indexOf("'") === false) { 
						verbe = strct.prosuj.lib_eli+" "+verbe; 
					}else
						verbe = strct.prosuj.lib_eli+verbe; 
				}else{
					verbe = strct.prosuj.lib+" "+verbe; 
				}
			}	
		}
		
		return verbe;
	}

	function genereTerminaison(strct){
		
		//par défaut la terminaison est 3eme personne du présent
		let num = 2, temps, txt;
		
		if(strct.determinant_verbe){
			temps= strct.determinant_verbe[1]-1;
			
			if(strct.determinant_verbe[1]==1){
				temps= 0;
			}
			if(strct.determinant_verbe[1]==7){
				temps= 0;
			}
			//formule de calcul de la terminaison temps + persones
			num = (temps*6)+parseInt(strct.terminaison)-1;
			 		
			if(strct.determinant_verbe[1]==8){
				num= 36;
			}
			if(strct.determinant_verbe[1]==9){
				num= 37;
			}
		}	
		//correction terminaison négative
		if(num == -1)num = 2;
					
		txt = getTerminaison(strct,num);

		//gestion des terminaisons ---
		if(txt=="---")txt="";
		
		strct.verbe.term = txt;
	}

	function getTerminaison(strct, n){

        //TODO:gestion du cache
        //récupère les concepts correspondant à la class
        let f = {filter:[me.tables.t.k[0]+',eq,'+strct.verbe.id_conj,me.tables.t.k[1]+',eq,'+n]},
			r = syncList(me.tables.t.t,f).records;
		if(r && r.length){
			strct.terminaison = r;
			return r[0].lib;
		}else me.strct[me.ordre].error = "Terminaison introuvable :"+strct.verbe.id_conj+' '+n+"<br/>";
		return "";

	}


	function generePronom(strct){
		
		//par défaut la terminaison = 3
		strct.terminaison = 3;
		strct.pluriel = false;
		
		//vérifie la présence d'un d&terminant
		if(strct.determinant_verbe){
			if(strct.determinant_verbe[6]!=0){
				//pronom indéfinie
				strct.prosuj = getPronom(strct.determinant_verbe[6],"sujet_indefini");
				//$arr["terminaison"] = 3;
			}else if(strct.determinant_verbe[2]==0){
				//pas de pronom
				strct.prosuj = "";
				//$arr["terminaison"] = 3;				
			}
			
			//pronom définie
			let numP = strct.determinant_verbe[2],
				pr = "";
			//définition des terminaisons et du pluriel
			if(numP==6){
				//il/elle singulier
				pr = "[a_il]";
				strct.pluriel = false;
				strct.terminaison = 3;				
			}	
			if(numP==7){
				//il/elle pluriel
				pr = "[a_il]";
				strct.pluriel = true;
				strct.terminaison = 6;				
			}	
			if(numP==8){
				//pas de pronom singulier
				pr = "[a_zéro]";
				strct.pluriel = false;
				strct.terminaison = 3;				
			}	
			if(numP==9){
				//pas de pronom pluriel
				pr = "[a_zéro]";
				strct.pluriel = true;
				strct.terminaison = 6;				
			}
			if(numP==1 || numP==2){
				strct.pluriel = false;
				strct.terminaison = numP;				
			}
			if(numP==4 || numP==5){
				strct.pluriel = true;
				strct.terminaison = numP;				
			}
			
			if(strct.prosuj==undefined){
				if(numP>=6){	
					//récupère le vecteur
					let v = getVecteur("genre",-1,strct.determinant_verbe[7]),     	
					//génère le pronom
					m = new moteur({'apiUrl':me.apiUrl,'dicos':me.dicos,'id_dico':me.id_dico,'niv':me.niv+1});
					m.genere(pr,false);
					m.strct[0].vecteur.genre=v.genre;
					m.strct[0].vecteur.pluriel=strct.pluriel;						
					me.potentiel += m.potentiel;
					m.genereTexte();
					strct.prosuj = {lib:m.texte.toLowerCase(),lib_eli:m.texte.toLowerCase()};
				}else{
					strct.prosuj = getPronom(numP,"sujet");
				}
			}

			//pronom complément
			if(strct.determinant_verbe[3]!=0 || strct.determinant_verbe[4]!=0){
				strct.prodem = getPronom(strct.determinant_verbe[3]+strct.determinant_verbe[4],"complément");
		        if(strct.prodem.lib.substring(0,1) == "["){
					//récupère le vecteur
					let v = getVecteur("genre",-1,strct.determinant_verbe[7],"substantif"),
						genre = v.genre;
					//vérifie s'il y a un blocage du genre et du nombre
					if(strct.prodem.lib.substring(0,3)=="[=x"){
						genre = 1;
						strct.pluriel = "";
					}else if(strct.prodem.lib.substring(0,2)=="[="){
						//récupère le renvoie du genre et du nombre	
						v = getVecteur("genre",-1,strct.prodem.lib.substring(2,3),"substantif");
						genre = v.genre;     	
					}
					//génère le pronom
					let m = new moteur({'apiUrl':me.apiUrl,'dicos':me.dicos,'id_dico':me.id_dico,'niv':me.niv+1});
					m.genere(strct.prodem.lib,false);
					m.strct[0].vecteur.genre=genre;
					m.strct[0].vecteur.pluriel=strct.pluriel;						
					me.potentiel += m.potentiel;
					m.genereTexte();						
					strct.prodem.lib = m.texte.toLowerCase();
		        }
			}			
		}		
	}


	function getPronom(c, t){


        //TODO:gestion du cache
        //récupère les concepts correspondant à la class
        let q = [me.tables.p.k[0]+',eq,'+c,me.tables.p.k[1]+',eq,'+t],
			r = me.searchClass(me.tables.p,q);
		if(r && r.length)return r[0];
		else me.strct[me.ordre].error = "Pronom introuvable :"+c+' '+t+"<br/>";
		return "";

	}


	function getDerterminantVerbe(strct){

		//si le déterminant est défini on ne fait rien
		if(strct.determinant_verbe)return strct;
		
		//vérifie la présence d'un verbe théorique avant la fin de la séquence générative
		let verbeTheo = false, deterPrec = false;
		for (let i = 0; i >= me.ordre; i--) {
			if(me.strct[i] && me.strct[i].class[1]){
				if(me.strct[i].class[1]=="v_théorique"){
					strct.determinant_verbe = me.strct[i].determinant_verbe;
					verbeTheo = true;
					i=-1;						
				}
			}
			//vérifie la fin de la séquence générative
			if(me.strct[i].generation)i=-1;
		}
		if(!verbeTheo){
			//vérifie si le déterminant n'est pas défini avant une génération de verbe en verbe
			for (let i = 0; i >= me.ordre; i--) {
				if(me.strct[i] && me.strct[i].determinant_verbe){
					strct.determinant_verbe = me.strct[i].determinant_verbe;
					i=-1;
					deterPrec = true;
				}
				//vérifie la fin de la séquence générative
				if(me.strct[i].generation)i=-1;
			}
		}
		if(!deterPrec && !strct.determinant_verbe){
			//3eme personne sans pronom
			strct.prosuj = "";
			strct.terminaison = 3;
		}
	}	

	function isEli(s){
		//ATTENTION aux caractères bizare cf. generateur ancien $this->arrEliCode
		return me.elisions.includes(s.substring(0,1)) ? true : false;
	}


	function genereDeterminant(strct){

		let det = "", v = getVecteur("elision", 1);
		//calcul le déterminant
		if(v.elision==0 && (v.genre==1 || v.genre==undefined)){
			det = strct.determinant[v.pluriel ? 4 : 0].lib+" ";
		}
		if(v.elision==0 && v.genre==2){
			det = strct.determinant[v.pluriel ? 5 : 1].lib+" ";
		}
		if(v.elision==1 && (v.genre==1 || v.genre==undefined)){
			det = strct.determinant[v.pluriel ? 6 : 2].lib;
		}
		if(v.elision==1 && v.genre==2){
			det = strct.determinant[v.pluriel ? 7 : 3].lib;
		}
		
		return det;
	}


	function genereSubstantif(strct){

		let txt = strct.substantif.s,
			v = getVecteur("pluriel",-1);
		if(v.pluriel){												
			txt = strct.substantif.p;
		}		
		txt = strct.substantif.prefix+txt;
				
		return txt;
	}



	function setClass(gen, i=0){
		let r = getClassVals(gen,i), p=[];
        r.cls.forEach(c=>getClass(c));	        	
		return r.fin;
	}

    function getClassVals(gen,i){

		if(!gen){
	        return "";
		}
		
		let cls=[],acc,g,deb = gen.indexOf("[",i), fin = gen.indexOf("]",deb+1);
		
		//dans le cas de ado par exemple = pas de crochet
		if(deb===false){
	        g = gen;
		}else if(!fin){
			me.strct[me.ordre].error = "Item mal formaté.<br/>il manque un ] : "+gen+"<br/>";			
        	return {"deb":deb,"fin":strlen(gen),"g":gen,"cls":[]};
		}else{
			//on récupère la valeur de la classe
	        g = gen.substring(deb+1, fin);
		}        
        
        //on récupère la définition de l'accord 
        acc = g.split("||");
	    g = acc[0];        	 	
        if(acc.length>1){
	        me.strct[me.ordre].accord = acc[1];
        }
        //on récupère le tableau des class
        g.split("|").forEach(c=>{
			//gestion du changement de position de la classe
			let posis=c.split("@");
			if(posis.length>1){
				cls.push(posis[0]);
				cls.push(posis[1]);
				/*
				//$this->trace("récupère le vecteur du déterminant ".$this->ordre);
				let vAdj, vSub, vDet = me.strct[me.ordre].vecteur, ordreDet = me.ordre;
				//calcul l'adjectif
				getClass(posis[0]);
				vAdj = me.strct[me.ordre].vecteur;        	
				//change l'ordre pour que la class substantif soit placée après
				me.ordre ++;
				if(!me.strct[me.ordre])me.strct[me.ordre]={'deb':Date.now(),'dur':''};
				me.strct[me.ordre].vecteur = vDet; 
				//calcul le substantifs
				getClass(posis[1]);
				vSub = me.strct[me.ordre].vecteur;
				//avec le vecteur du substantif
				me.strct[me.ordre].vecteur = vSub; 
				//rédifini l'élision et le genre du déterminant avec celui de l'adjectif
				me.strct[ordreDet].vecteur.elision=vAdj.elision;
				me.strct[ordreDet].vecteur.genre=vSub.genre;
				*/
			}else{
				cls.push(c);
			}
		})

        
        return {"deb":deb,"fin":fin,"g":g,"cls":cls};

    }

    function getClass(c){

		if(c=="")return;
        
		//vérifie si la class est un déterminant
		if(!isNaN(c)){
			getDeterminant(c);
		}
		
		//vérifie si la class possède un déterminant de class
		let cSpe, dtm, p;
		if(c.indexOf("_")>0){
			dtm = c.split("_");			
			switch (dtm[0]) {
				case "a":
					getAdjectifs(c);
					break;
				case "m":
					getSubstantif(c);
					break;
				case "v":
					getVerbe(c);
					break;
				case "s":
					getSyntagme(c,false);
					break;
				default:
					getClassSpe(c);
					break;	
			}
		}else if(c.indexOf("-")>0){
			cSpe = c.replace("-", "_");
			getClassSpe(cSpe);
		}else if(c.substring(0,5)=="carac"){
			//la class est un caractère
			cSpe = c.replace("carac", "carac_");
			getClassSpe(cSpe);
		}else{
			//vérifie si la class possède un blocage d'information
			p = c.indexOf("#");
			if(p>0){
				cSpe = c.replace("#",""); 
				getSyntagme(cSpe);	
			}	
			//vérifie si la class possède un blocage d'information
			if(c.substring(0,1)=="=" && !isNaN(c.substring(1,2))){
				getBlocage(c);	
			}        
			if(c.substring(0,1)=="=" && c.substring(1,2)=="x"){
				getBlocage(c);	
			}        			
		}
    }

	function getBlocage(c){

        //récupère le numéro du blocage
        let t, v, num=c.substring(1,2);
        if(!me.strct[me.ordre].vecteur) me.strct[me.ordre].vecteur ={};
	    if(num=="x"){
        	//on applique le masculin singulier
	        me.strct[me.ordre].vecteur.blocage = true; 
	    	me.strct[me.ordre].vecteur.pluriel = false; 
	        me.strct[me.ordre].vecteur.genre = 1;
        }else{
        	//vérifie si on doit prendre le substantif de l'adjectif
        	//selon jpb la vérification n'est pas nécessaire
        	t="substantif";
        	
	        //Récupère les informations de genre : on force le masculin
        	v = getVecteur("genre",-1,num,t);
			me.strct[me.ordre].vecteur.genre = v && v.genre ? v.genre : 1;
        	//récupère le vecteur de pluriel
			v = v.pluriel ? v : getVecteur("pluriel",-1,num,t);
		    me.strct[me.ordre].vecteur.pluriel = v.pluriel;        		
        }
                
	}	


	function getVecteur(t,dir,num=1,ct=false){
		
		//pour les verbes
		if(num==0)num=1;
		
		let v = false, j = 1;
		if(dir>0){
			for (let i = me.ordre; i < me.strct.length; i++) {
				if(me.strct[i].vecteur && me.strct[i].vecteur[t] !== undefined){
					if(!ct){
						if(num == j){
							return me.strct[i].vecteur;
						}else{
							j ++;							
						}
					}else{
						//pour éviter de récupérer le vecteur d'un adjectif
						if(me.strct[i][ct]){
							if(num == j){
								return me.strct[i].vecteur;
							}else{
								j ++;							
							}
						}
					}
				}
			}
		}
		if(dir<0){
			for (let i = me.ordre; i >= 0; i--) {
				//on récupère le vecteur 
				if(me.strct[i].vecteur && me.strct[i].vecteur[t] !== undefined){
					if(!ct){
						if(num == j){
							return me.strct[i].vecteur;
						}else{
							j ++;							
						}
					}else{
						//pour éviter de récupérer le vecteur d'un adjectif
						if(me.strct[i][ct]){
							if(num == j){
								return me.strct[i].vecteur;
							}else{
								j ++;							
							}
						}
					}
				}
			}
		}
		return v;
	}

	function getVerbe(c, cls=false){

        //récupération du verbe
        if(!cls) cls = getAleaClass(c);
        
		if(cls){
	        //ajoute le verbe
	        me.strct[me.ordre].verbe = cls;	                
	        me.strct[me.ordre].elision = cls.elision;
		}
		        
        return cls;
	}

	function getAdjectifs(c){

        let adjs =c.split("∏");        
		//récupère la définition des adjectifs
		me.strct[me.ordre].adjectifs = [];
		adjs.forEach(a=>me.strct[me.ordre].adjectifs.push(getAleaClass(a)));

	    //met à jour l'élision dans le cas d'un changement de position
		if(me.posis.length>1){
        	me.strct[me.ordre].vecteur.elision = me.strct[me.ordre].adjectifs[0].elision;       	
        	//redéfini l'ordre pour la suite de la génération
        	me.ordre ++;
        }
        
	}


	function getClassSpe(c){

		if(typeof c == "Gen_Moteur"){
			getClassMoteur(c);
		}else if(typeof c === 'object'){
			return c;
		}else{		
			let cls = getAleaClass(c);
			if(typeof cls == "string"){
				me.strct[me.ordre]["texte"] = cls;			
			}else if(typeof cls == "Gen_Moteur"){
				getClassMoteur(cls);
			}else{
				getClassType(cls);
			}		
		}
	}
	
	function getClassType(cls){

		if(cls.id_adj){
		    me.strct[me.ordre].adjectifs = [cls];
		}
		if(cls.id_sub){
		    getSubstantif("",cls);
		}
		if(cls.id_verbe){
		    getVerbe("",cls);
		}
		if(cls.id_uri){
		    me.strct[me.ordre].uri = cls;
		}

	}
	
	function getSubstantif(c, strct=false){

        //récupération du substantif
        if(!strct) strct = getAleaClass(c);
        	
		//ajoute le vecteur si la class n'est pas un générateur cf. getClassMoteur
		if(strct){
			if(!me.strct[me.ordre].vecteur)me.strct[me.ordre].vecteur={};
			me.strct[me.ordre].vecteur.genre = strct.genre;
			me.strct[me.ordre].vecteur.elision = strct.elision;			
			//ajoute le substantif
			me.strct[me.ordre].substantif = strct;	
		}
	}


	function getSyntagme(cls, direct=true){
		
		//vérifie si le syntagme direct #
		if(direct){
			//TODO:gestion du cache
			let q = [me.tables.s.k+',eq,'+cls],
			strct = me.searchClass(me.tables.s,q)[0];	        	        
	        if(strct.lib.substring(0,1)== "["){
	        	setClass(strct.lib);
	        }else{
				me.strct[me.ordre].syntagme = strct;	
	        }
		}else{
			//récupération du substantif
			let strct = getAleaClass(cls);				
	        if(strct.lib){
				me.strct[me.ordre].syntagme = strct;	
	        }
		}
	}


	function getAleaClass(c){
		
        //cherche la définition de la class
        let alea, aCpt, cpt = getClassDef(c);
		me.strct[me.ordre].class=c;
        
        //cas des class caract
        if(c.substring(0,7)=="carac_t" || c.substring(0,5)=="carac"){
			me.strct[me.ordre].isCaract = true;
        	//on vérifie que le caractère n'est pas déjà calculé
        	if(me.caracts[c]){
        		//on retourne le carac déjà choisi
        		return getClassSpe(me.caracts[c]);
        	}else{
        		//on récupère les possibilité de caracX
        		let cCarac = c.replace("carac_t","carac_"),
		            cptCarac = getClassDef(cCarac);
        		//on ajoute à la liste de choix les possibilité de caractX
                cptCarac.dst.forEach(t=>{
                   	cpt.dst.push(t);
                });
        	}
        	
        }
        
        //cas des classes théoriques et des erreurs
        if(cpt.dst.length<1) return false;

		me.strct[me.ordre].concepts = cpt.src;
		
        //enregistre le potentiel
        me.potentiel+=cpt.dst.length;
        
        if(me.choix=="tout" && me.niv < 1){
        	verifClass(cpt);
        	aCpt = false;
        }else{
			//pas de choix : erreur
			if(cpt.dst.length==0){
				me.strct[me.ordre].error="Aucun choix";
				return false;
			} 
	        //choisi une valeur aléatoirement
            alea = getRandomInt(cpt.dst.length-1);        	        
	        aCpt = getClassGen(cpt.dst[alea],c);        

			//vérifie s'il faut conserver un caractx
	        if(c.substring(0,7)=="carac_t"){
	        	me.caracts[c] = aCpt;
	        }
			/*Plus nécessaire car déterminant dans le même ordre de la structure
			//vérifie s'il faut transférer le déterminant de verbe
			if(aCpt.concept.type=="v" && me.strct[me.ordre].determinant_verbe && !me.strct[me.ordre-1].verbe){       	
				me.strct[me.ordre].determinant_verbe=me.strct[me.ordre-1].determinant_verbe;
			}
			//vérifie s'il faut transférer le déterminant dus substantif
			if((aCpt.concept.type=="m" || aCpt.concept.type=="carac") && me.strct[me.ordre-1].vecteur.pluriel){       	
				me.strct[me.ordre].vecteur.pluriel=me.strct[me.ordre-1].vecteur.pluriel;
			}
			*/
		}
        
		return aCpt; 			
		
	}

	function getRandomInt(max, min=false) {
		return min ? Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min) : Math.floor(Math.random() * max);
	}

	function getClassGen(cpt,cls){
		
        //Vérifie si le concept est un générateur
        if(cpt.id_gen){
        	//générer l'expression
			let m = new moteur({'apiUrl':me.apiUrl,'dicos':me.dicos,'id_dico':me.id_dico,'niv':me.niv+1});   						
			//génére la classe
			m.genere(cpt.valeur,false);				
			/*
			if($this->verif){
				//vérifie si un déterminant est définie
				if(isset($this->arrClass[0]["determinant"])){
					$m->arrClass[(count($m->arrClass)-1)]["determinant"]=$this->arrClass[0]["determinant"];
					foreach ($this->arrClass[0]["vecteur"] as $k => $v) {
			        	$m->arrClass[(count($m->arrClass)-1)]["vecteur"][$k]=$v;
        			}
				}
				if(isset($this->arrClass[0]["determinant_verbe"]))$m->arrClass[(count($m->arrClass)-1)]["determinant_verbe"]=$this->arrClass[0]["determinant_verbe"];
				//genere le texte
				$m->genereTexte();
				$this->arrClass[$this->ordre]["texte"] = $m->texte;
				return false;					
			}
			*/
						
	        //vérifie s'il faut conserver un caractx
	        if(cls.substring(0,7)=="carac_t"){
				me.caracts[cls] = m;
	        }
						
			//récupère les classes générées
			getClassMoteur(m);
			me.potentiel += m.potentiel;
			cpt = false;
		}
		
		return cpt; 			
		
	}


	function getClassMoteur(m){
		//ajoute les classes générées
		m.strct.forEach((c,i)=>{
			//dans le cas d'un changement de position
			if(me.posis.length>1){
	        	//change l'ordre pour que la class soit placée après
	        	me.ordre ++;
				me.strct[me.ordre]=me.strct[me.ordre-1];
	        	//redéfini l'ordre pour que la class soit placée avant sans écraser la class précédente
	        	me.ordre --;
			}
			//ajoute les propriétés générées
			let j = me.ordre+i;
			if(me.strct[j]){
				for (const p in c) {
					if(p=='concepts')
						me.strct[j].concepts = me.strct[j].concepts.concat(c.concepts);
					else if(p=='vecteur'){
						for (const v in c.vecteur) {
							me.strct[j].vecteur[v]=c.vecteur[v];
						}
					}else me.strct[j][p]=c[p];
				}			
				
				if(me.strct[j].isCaract){
					//ajoute le pluriel le cas échéant
					if(me.strct[j].vecteur.pluriel){       	
						c.vecteur.pluriel=me.strct[j].vecteur.pluriel;
					}
				}			
			}else{
				me.ordre ++;								
				me.strct[me.ordre]=c;
			} 
		});
		//ajoute les caractères générées
		m.caracts.forEach((c,i)=>me.caracts[i]=c);		

	}


    function getClassDef(c){

        //TODO:gestion du cache
        //récupère les concepts correspondant à la class
        let q, d, cpt, dst, def = c.split("_");
		if(def.length==3){
			//traitement des class avec identifiant
			d = syncRead(me.tables.c.t,def[1]);
			dst = syncRead(me.tables[def[0]].t,def[2]);
			return {"src":d,"dst":[dst]};
		}else{
			//traitement des class avec libellé
			q = [me.tables.c.k[1]+',eq,'+def[0],me.tables.c.k[0]+',eq,'+encodeURIComponent(def[1])];
			d = me.searchClass(me.tables.c,q);
			return {"src":d,"dst":getSyncLinkData(d)};
		}
	}
	//récupère les données liées pour chaque concept
	function getSyncLinkData(d){
		//ATTENTION il peut y avoir le même concept dans plusieurs dictionnaires
		let linkData=[],rs;		
		d.forEach(cpt=>{
			for (const t in me.tables) {
				if(me.tables[t].dataLink){
					rs = syncList(me.tables[t].t,{filter:'id_concept,eq,'+cpt.id_concept}).records;
					if(rs.length)linkData=linkData.concat(rs);	
				}
			}
		});  
		return linkData;
	  }

    function getDeterminant(c){
        let cls = false, pluriel=false;
        if(!me.strct[me.ordre])me.strct[me.ordre] = {};
		if(!me.strct[me.ordre].vecteur)me.strct[me.ordre].vecteur = {};
        if(!me.strct[me.ordre].determinant)me.strct[me.ordre].determinant = false;
        if(!me.strct[me.ordre].determinant_verbe)me.strct[me.ordre].determinant_verbe = false;

        //vérifie si le déterminant est pour un verbe
        if(c.length > 6){
        	cls = c;
			if(me.ordre > 0){
        		//vérifie si le determinant n'est pas transmis
                for (let i = me.ordre-1; i >= 0; i--){
                    if(me.strct[i].determinant_verbe){
                        cls = me.strct[i].determinant_verbe;
                        i=-1;
                    }
                }
        	}
			me.strct[me.ordre].determinant_verbe = cls;
	        return cls;
        }       	
        
        //vérifie s'il faut chercher le pluriel
        if(c >= 50){
        	pluriel = true;
        	c = c-50;
        }       			
        //ajoute le vecteur
        me.strct[me.ordre].vecteur.pluriel = pluriel; 
        //vérifie s'il faut chercher le déterminant
        if(c!=99 && c!=0){
            cls = me.searchClass(me.tables.d,[me.tables.d.k+',eq,'+c]);
			//cls = me.syncSearchClass(me.tables.d,[me.tables.d.k+',eq,'+c]);

            //ajoute le déterminant
            me.strct[me.ordre].determinant = cls;                                    
            return cls;
        }
        
        /*vérifie si le determinant n'est pas transmis
        if(c==0){
        	//la transmission se fait par [=x...]
        	for($i = $this->ordre-1; $i > 0; $i--){
        		if(isset($this->arrClass[$i]["vecteur"])){
	        		if(intval($this->arrClass[$i]["determinant"])!=0){
						$arrClass = $this->arrClass[$i]["determinant"];
						$pluriel = $this->arrClass[$i]["vecteur"]["pluriel"];
						$i=-1;        				
	        		}
        		}
        	}
        }
        */

    }

    function getNegation(n){
		let neg = me.searchClass(me.tables.n,[me.tables.n.k+',eq,'+n]);
		return neg[0].lib;
	}


    this.init();
    
    }
}
