export class openai {
    constructor(params) {
        var me = this;
        this.modal;
        this.key = params.key ? params.key : false;
        this.orga = params.orga ? params.orga : false;
        this.sizeIma = params.sizeIma ? params.sizeIma : "1024x1024";
        this.models = false;
        this.urls = {
            'image':{'u':'https://api.openai.com/v1/images/generations','m':'POST'},
            'models':{'u':'https://api.openai.com/v1/models','m':'GET'}
        };
                
        this.init = function () {
        }

        this.getModels = function (cb){
            postData(me.urls.models, {}).then((data) => {
                me.models = data;
                if(cb)cb(data);
            });

        }

        this.getImage=function (p, n=1, cb=false) {

            postData(me.urls.image, {"prompt":p, "n":n, "size":me.sizeIma}).then((data) => {
                console.log(data); 
                if(cb)cb(data);
            });
    
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
