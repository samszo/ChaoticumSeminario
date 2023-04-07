export class omk {
    constructor(params) {
        var me = this;
        this.modal;
        this.key = params.key ? params.key : false;
        this.ident = params.ident ? params.ident : false;
        this.mail = params.mail ? params.mail : false;
        this.api = params.api ? params.api : false;
        this.vocabs = params.vocabs ? params.vocabs : ['dcterms','genstory'];
        this.user = false;
        this.props = [];
        this.class = [];
                
        this.init = function () {
            //récupères les propriétés
            me.vocabs.forEach(v=>{
                me.getProps(v);
                me.getClass(v);
            })
        }

        this.getProps = function (prefix, cb=false){
            let url = me.api+'properties?per_page=1000&vocabulary_prefix='+prefix;                
            postData({'u':url,'m':'GET'}, {}).then((data) => {
                data.forEach(p=>me.props.push(p));
                if(cb)cb(data);
            });
        }
        this.getClass = function (prefix, cb=false){
            let url = me.api+'resource_classes?per_page=1000&vocabulary_prefix='+prefix;                
            postData({'u':url,'m':'GET'}, {}).then((data) => {
                data.forEach(c=>me.class.push(c));
                if(cb)cb(data);
            });
        }

        this.getUser = function (cb=false){
            let url = me.api+'users?email='+me.mail+'&key_identity='+me.ident+'&key_credential='+me.key;                
            postData({'u':url,'m':'GET'}, {}).then((data) => {
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

        function formatData(data){
            let fd = {"@type" : "o:Item"},p;
            for (const [k, v] of Object.entries(data)) {
                switch (k) {
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

        this.addImageToItem = function (data,cb){
            /*
            let params = {
                'key_identity': key_identity,
                'key_credential': key_credential
            },            
            data = {
                "o:ingester": "upload", 
                "file_index": "0", 
                "o:item": {"o:id": "13"}
            },            
            files = [
                 ('data', (None, json.dumps(data), 'application/json')),
                 ('file[0]', ('7288020-p15.jpg', open('7288020-p15.jpg', 'rb'), 'image/jpg'))
            ]            
            */
        }

        async function postData(url, data = {}) {
            // Default options are marked with *
            const response = await fetch(url.u, {
              method: url.m, // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type":"application/json",
                "OpenAI-Organization":me.orga,
                "Authorization":"Bearer "+me.key
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: url.m=='POST'?JSON.stringify(data):null, // body data type must match "Content-Type" header
            });
            return response.json(); // parses JSON response into native JavaScript objects
        }
          
        this.init();
    }
}
