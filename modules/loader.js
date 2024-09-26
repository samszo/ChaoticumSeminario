export class loader {
    constructor(params={}) {
        var me = this;
        var main, loading, curwait;
        this.init = function () {
            //ajoute le loader à la page
            let html = `
            <div class="loadingio-spinner-double-ring-4dols36ufwg" id="ws-loading">
                <div class="ldio-6pd26u1x99x">
                    <div></div>
                    <div></div>
                    <div>
                        <div></div>
                    </div>
                    <div>
                        <div></div>
                    </div>
                </div>
            </div>
            `;
            d3.select('#loading-container').remove();
            main = d3.select('body').append('div')
                .attr('id','loading-container').attr('tabindex',-1);
            main.html(html);
            loading = main.select("#ws-loading");
            me.hide(true);
        }
                
        this.show = function(){
            loading.style("display", "inline-block");
            setTimeout(function(){
                curwait ++;
            }, 1000);
        }
        this.hide = function(all=false){
            if(all)curwait=0;
            curwait --;
            if(curwait<1){
                loading.style("display", "none");
                curwait=0;
            }       
        }

        this.init();
    }
}
