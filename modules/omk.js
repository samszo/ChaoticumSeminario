import {loader} from './loader.js';
export class omk {
    constructor(params) {
        var me = this;
        this.modal;
        this.key = params.key ? params.key : false;
        this.ident = params.ident ? params.ident : false;
        this.mail = params.mail ? params.mail : false;
        this.api = params.api ? params.api : false;
        this.vocabs = params.vocabs ? params.vocabs : ['dcterms','genstory'];
        this.loader = new loader();
        this.user = false;
        this.props = [];
        this.class = [];
        this.rts
        let perPage = 1000, types={'items':'o:item','media':'o:media'};
                
        this.init = function () {
            //récupères les propriétés
            me.vocabs.forEach(v=>{
                me.getProps(v);
                me.getClass(v);
            })
            me.getRT();
            me.loader.hide(true);
        }
        this.getRT = function (cb=false){
            me.rts = syncRequest(me.api+'resource_templates?per_page=1000');
            if(cb)cb(me.rts);
        }
        this.getRtId = function (label){
            return me.rts.filter(rt=>rt['o:label']==label)[0]['o:id'];                        
        }
        this.getProps = function (prefix, cb=false){
            let url = me.api+'properties?per_page=1000&vocabulary_prefix='+prefix,                
                data = syncRequest(url);
            data.forEach(p=>me.props.push(p));
            if(cb)cb(me.props);
        }
        this.getPropId = function (t){
            return me.props.filter(prp=>prp['o:term']==t)[0]['o:id'];                        
        }
        this.getPropByTerm = function (t){
            return me.props.filter(prp=>prp['o:term']==t)[0];                        
        }
        this.getClass = function (prefix, cb=false){
            let url = me.api+'resource_classes?per_page=1000&vocabulary_prefix='+prefix,                
                data = syncRequest(url);
            data.forEach(c=>me.class.push(c));
            if(cb)cb(data);
        }

        this.getClassByName = function (cl){
            let c = me.class.filter(c=>c['o:label'].toLowerCase()==cl.toLowerCase());
            return c[0];
        }

        this.getClassByTerm = function (cl){
            let c = me.class.filter(c=>c['o:term'].toLowerCase()==cl.toLowerCase());
            return c[0];
        }

        this.getRandomItemByClass = function (cl, cb=false){
            let url;
            try {
                url = me.api+'items?resource_class_id='
                    +me.getClassByName(cl)['o:id'];
            } catch (error) {
                console.error(error);
            }              
            let rs = syncRequest(url),
            r = rs[Math.floor(Math.random()*rs.length)];
            if(cb)cb(r);                    
            return r;
        }

        this.getMedias= async function(p,linkMedia=''){
            p.medias = [];
            p['o:media'].forEach(m=>{
                p.medias.push(syncRequest(m['@id']))
            })
            if(linkMedia && p[linkMedia])me.getLinkMedias(p,linkMedia);
        }
        this.getLinkMedias=function(p,linkMedia){
            p.medias = p.medias ? p.medias : [];
            p[linkMedia].forEach(i=>{
                let item = syncRequest(i['@id']);
                me.getMedias(item);
                item.medias.forEach(m=>{
                    p.medias.push(m);
                })
            })
        }

        this.getItem = function (id, cb=false){
            let url = me.api+'items/'+id,
                rs = syncRequest(url);
            if(cb)cb(rs);                    
            return rs;
        }

        this.getMedia = function (id, cb=false){
            let url = me.api+'media/'+id,
                rs = syncRequest(url);
            if(cb)cb(rs);                    
            return rs;
        }        

        this.getItemAdminLink = function(item){
            return me.api.replace("/api/","/admin/item/")+item['o:id'];
        }

        //merci à https://stackoverflow.com/questions/33780271/export-a-json-object-to-a-text-file/52297652#52297652
        this.saveJson=function(data){
            const filename = 'data.json';
            const jsonStr = JSON.stringify(data);
            
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
            element.setAttribute('download', filename);
            
            element.style.display = 'none';
            document.body.appendChild(element);            
            element.click();
            document.body.removeChild(element);            
        }

        this.getAllItems = function (query, cb=false){
            let url = me.api+'items?per_page='+perPage+'&'+query+'&page=', fin=false, rs=[], data, page=1;
            while (!fin) {
                data = syncRequest(url+page);
                //console.log(url+page,data);
                fin = data.length ? false : true;
                rs = rs.concat(data);
                page++;
            }                
            if(cb)cb(rs);                    
            return rs;
        }

        this.getAllMedias = function (query, cb=false){
            let url = me.api+'media?per_page='+perPage+'&'+query+'&page=', fin=false, rs=[], data, page=1;
            while (!fin) {
                data = syncRequest(url+page);
                //console.log(url+page,data);
                fin = data.length ? false : true;
                rs = rs.concat(data);
                page++;
            }                
            if(cb)cb(rs);                    
            return rs;
        }

        this.searchItems = function (query, cb=false, sync=true){
            let url = me.api+'items?'+query,rs; 
            if(sync){
                rs = syncRequest(url);
                if(cb)cb(rs);                    
            }
            else
                request(url,cb);
            return rs;
            //console.log(url+page,data);                
        }

        this.getUser = function (cb=false){
            let url = me.api+'users?email='+me.mail+'&key_identity='+me.ident+'&key_credential='+me.key;                
            d3.json(url).then((data) => {
                me.user = data.length ? data[0] : false;
                if(cb)cb(me.user);
            });

        }

        this.createItem = function (data, cb=false){
            let url = me.api+'items?key_identity='+me.ident+'&key_credential='+me.key;
            postData({'u':url,'m':'POST'}, formatData(data)).then((rs) => {
                if(cb)cb(rs);
            });
        }

        this.addMedia = function (data, cb=false){
            let url = me.api+'media?key_identity='+me.ident+'&key_credential='+me.key;
            postData({'u':url,'m':'POST'}, formatData(data)).then((rs) => {
                if(cb)cb(rs);
            });
        }


        function formatData(data, type="o:Item"){
            let fd = {"@type" : type},p;
            for (const [k, v] of Object.entries(data)) {
                switch (k) {
                    case 'o:item':
                    case 'o:ingester':
                    case 'ingest_url':
                            fd[k]=v;            
                        break;
                    case 'o:resource_class':
                        p = me.class.filter(prp=>prp['o:term']==v)[0];                        
                        fd[k]={'o:id':p['o:id']};            
                        break;
                    case 'o:media':
                        if(!fd[k])fd[k]=[];
                        fd[k].push({"o:ingester": "url", "ingest_url":v});                                
                        break;
                    case 'labels':
                        v.forEach(d=>{
                            p = me.props.filter(prp=>prp['o:label']==d.p)[0];                        
                            if(!fd[p.term])fd[p.term]=[];
                            fd[p.term].push(formatValue(p,d));                                    
                        })
                        break;                    
                    default:
                        if(!fd[k])fd[k]=[];
                        p = me.props.filter(prp=>prp['o:term']==k)[0];                        
                        if(Array.isArray(v)){
                            v.forEach(val=>{
                                fd[k].push(formatValue(p,val));    
                            })
                        }else            
                            fd[k].push(formatValue(p,v));    
                        break;
                }
            }                         
            return fd;
        }
        function formatValue(p,v){
            if(typeof v === 'object' && v.rid)
                return {"property_id": p['o:id'], "value_resource_id" : v.rid, "type" : "resource" };    
            else if(typeof v === 'object' && v.u)
                return {"property_id": p['o:id'], "@id" : v.u, "o:label":v.l, "type" : "uri" };    
            else
                return {"property_id": p['o:id'], "@value" : v, "type" : "literal" };    
        }

        async function postData(url, data = {}) {
            // Default options are marked with *
            let h = new Headers({
                'Content-Type': 'application/json',
                //"Content-Type":"text/plain",
                //"Content-Type":"multipart/form-data",
                "OpenAI-Organization":me.orga,
                "Authorization":"Bearer "+me.key
              }), v = h.get("Content-Type");           
            const response = await fetch(url.u, {
              method: url.m, // *GET, POST, PUT, DELETE, etc.
              mode: "same-origin", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              //credentials: "include",//"same-origin", // include, *same-origin, omit
              headers: h,
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: url.m=='POST'?JSON.stringify(data):null, // body data type must match "Content-Type" header
            });
            
            return response.json(); // parses JSON response into native JavaScript objects
        }

        function syncRequest(q){
            me.loader.show();
            const request = new XMLHttpRequest();
            request.open('GET', q, false);  
            request.send(null);        
            if (request.status === 200) {
                me.loader.hide();
                return JSON.parse(request.response);
            }        
        };       

        function request(url, cb){
            me.loader.show();
            d3.json(url).then(json=>{
                cb(json);
                me.loader.hide();
            });
        };       

        this.init();
    }
}
